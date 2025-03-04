const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../prisma/prismaClient");
const sendEmail = require("../utils/mailer");

const JWT_SECRET = "subbu7hari27usha01gowthu01hema29"; // Move this to .env in production

// Register User
const registerUser = async ({ name, email, password, role }) => {
  // Check if email is already in use
  email = email.toLowerCase();
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) throw new Error("Email already exists!");

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: { name, email, password: hashedPassword, role, emailVerified: false },
  });

  const emailVerificationToken = jwt.sign({ userId: newUser.id }, JWT_SECRET, {
    expiresIn: "1d",
  });

  // to Send verification email
  const verificationLink = `http://localhost:5173/api/auth/verify-email?token=${emailVerificationToken}`;
  const emailContent = `
    <h2>Verify Your Email</h2>
    <p>Click the link below to verify your email:</p>
    <a href="${verificationLink}">Verify Email</a>
  `;
  await sendEmail(newUser.email, "Email Verification", emailContent);

  return {
    message: "Registration successful! Check your email for verification.",
  };
};

// Verify Email
const verifyEmail = async (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // Update user as verified
    await prisma.user.update({
      where: { id: decoded.userId },
      data: { emailVerified: true },
    });
    const message=`<h2>Email Verified Successfully!</h2>
    <p>Thank you for verifying your email. You can now log in to your account.</p> 
    <a href="http://localhost:5173/login">Click here to log in</a>`

    return { message };
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};

// ------------------------------------------------------------

// Login User
const loginUser = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Invalid email or password");

  // Check password
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) throw new Error("Invalid email or password");

  // Generate JWT
  const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
    expiresIn: "7d",
  });

  return { message: "Login successful", token, user };
};

// -------------------------------------------------------------

// Create Review
const createReview = async ({ userId, productId, rating, comment }) => {
  // Create a review for a product
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("User not found");
  const review = await prisma.review.create({
    data: {
      userId,
      productId,
      rating,
      comment,
      reviewerName: user.name, // Should fetch from user info
      reviewerEmail: user.email, // Should fetch from user info
    },
  });
  return review;
};

// -------------------------------------------------------------

// Create Order
const createOrder = async ({ userId, productId, quantity }) => {
  return await prisma.$transaction(async (prisma) => {
    // Fetch product details
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) throw new Error("Product not found");

    // Check if enough stock is available
    if (product.stock < quantity) {
      throw new Error("Not enough stock available");
    }

    const totalAmount = product.price * quantity;

    // Create the order
    const order = await prisma.order.create({
      data: {
        userId,
        productId,
        quantity,
        totalAmount,
        status: "PENDING", // Ensure enum value is correct in your schema
      },
    });

    // Reduce stock quantity
    await prisma.product.update({
      where: { id: productId },
      data: { stock: product.stock - quantity },
    });

    return order;
  });
};

// get all products
const getAllProducts = async ({
  limit = 10,
  skip = 0,
  search = "",
  categoryId = null,
}) => {
  const filters = {};

  if (search) {
    filters.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  if (categoryId && categoryId !== "all") {
    filters.categoryId = parseInt(categoryId);
  }

  const products = await prisma.product.findMany({
    where: filters,
    take: parseInt(limit),
    skip: parseInt(skip),
  });

  const total = await prisma.product.count({ where: filters });

  return { products, total };
};

// ------------------------------------------------------------

const getHomePageProducts = async (limit = 10) => {
  console.log("Fetching home page products...");

  try {
    const [bestSellers, newestArrivals] = await Promise.all([
      // Fetch best-selling products (most ordered)
      prisma.product.findMany({
        take: limit,
        orderBy: {
          orders: { _count: "desc" }, // Corrected syntax for ordering by number of orders
        },
        include: {
          category: true,
          reviews: true,
          orders: true, // Include orders to count them
        },
      }),

      // Fetch newest arrivals (sorted by createdAt)
      prisma.product.findMany({
        take: limit,
        orderBy: {
          createdAt: "desc", // Sort by newest first
        },
        include: {
          category: true,
          reviews: true,
        },
      }),
    ]);

    return { bestSellers, newestArrivals };
  } catch (error) {
    console.error("Error fetching home page products:", error);
    throw new Error("Failed to fetch home page products");
  }
};

const filterProducts = async ({
  categoryId,
  minPrice,
  maxPrice,
  search,
  sortBy,
  order,
  page,
  pageSize,
}) => {
  try {
    const skip = (page - 1) * pageSize; // Pagination logic

    // Build the whereConditions for dynamic filters
    const whereConditions = {
      ...(categoryId && { categoryId }),
      ...(minPrice && { price: { gte: minPrice } }),
      ...(maxPrice && { price: { lte: maxPrice } }),
      ...(search && { title: { contains: search, mode: "insensitive" } }),
    };

    // Handle sorting order
    const orderBy = {};
    if (sortBy) {
      const validSortFields = ["price", "title", "createdAt"]; // Define the valid fields for sorting
      if (validSortFields.includes(sortBy)) {
        orderBy[sortBy] = order.toLowerCase() === "desc" ? "desc" : "asc";
      }
    }

    // Prisma query for filtered products
    const products = await prisma.product.findMany({
      where: whereConditions,
      orderBy,
      skip,
      take: pageSize,
      include: {
        category: true, // Optional, add logic to include only when requested
        reviews: true, // Optional, add logic to include only when requested
      },
    });

    // Total count for pagination (optional: optimize later with cursor-based pagination)
    const totalProducts = await prisma.product.count({
      where: whereConditions,
    });

    return {
      data: products,
      totalPages: Math.ceil(totalProducts / pageSize),
      currentPage: page,
    };
  } catch (error) {
    console.error("Error filtering products:", error);
    throw new Error("Failed to filter products");
  }
};

// ------------------------------------------------------------

module.exports = {
  registerUser,
  verifyEmail,
  loginUser,
  createReview,
  createOrder,
  getAllProducts,
  getHomePageProducts,
  filterProducts,
};

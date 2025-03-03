const prisma = require("../prisma/prismaClient");

// Service to add a new product
const addProduct = async ({
  sellerId,
  title,
  description,
  categoryId,
  price,
  stock,
  image,
}) => {
  console.log("Adding product...");

  const category = await prisma.category.findUnique({
    where: { id: categoryId },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  const newProduct = await prisma.product.create({
    data: {
      sellerId,
      title,
      description,
      categoryId,
      price,
      stock,
      image,
    },
  });

  return newProduct;
};

// ----------------------------------------------------------------------------------------

const updateProduct = async ({
  productId,
  title,
  description,
  price,
  stock,
  image,
}) => {
  console.log("Updating product...");

  const existingProduct = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!existingProduct) {
    throw new Error("Product not found");
  }

  const updatedProduct = await prisma.product.update({
    where: { id: productId },
    data: {
      title,
      description,
      price,
      stock,
      image,
    },
  });

  return updatedProduct;
};

// ----------------------------------------------------------------------------------------

const deleteProduct = async (productId) => {
  console.log("Deleting product...");
  // Check if the product exists
  const existingProduct = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!existingProduct) {
    throw new Error("Product not found");
  }

  // Delete the product
  await prisma.product.delete({
    where: { id: productId },
  });
};

// ----------------------------------------------------------------------------------------

const listProductsBySeller = async (sellerId) => {
  console.log("Listing products by seller...");
  const products = await prisma.product.findMany({
    where: { sellerId },
  });

  return products;
};

// ----------------------------------------------------------------------------------------

const addCategory = async (categoryName) => {
  console.log("Adding category...");

  const newCategory = await prisma.category.create({
    data: {
      name: categoryName,
    },
  });

  return newCategory;
};

// ----------------------------------------------------------------------------------------

const getAllCategories = async () => {
  console.log("Fetching all categories...");
  const categories = await prisma.category.findMany();
  return categories;
};

//  return fetch(`https://e-commerce-project-l7gm.onrender.com/api/products/${productId}`)

const productById = async (productId) => {
  console.log("Fetching product by ID...");
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      category: true,
      reviews: true,
    },
  });

  return product;
};

// ----------------------------------------------------------------------------------------

const getAllProducts = async (page, pageSize = 10) => {
  console.log("Fetching all products...");

  try {
    const products = await prisma.product.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        category: true,
        reviews: true,
      },
    });

    const totalProducts = await prisma.product.count();

    return {
      data: products,
      totalPages: Math.ceil(totalProducts / pageSize),
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Failed to fetch products");
  }
};

// ----------------------------------------------------------------------------------------

const getHomePageProducts = async (limit = 10) => {
  console.log("Fetching home page products...");

  try {
    const [bestSellers, newestArrivals] = await Promise.all([
      prisma.product.findMany({
        take: limit,
        orderBy: {
          orders: { _count: "desc" }, // Sort by most ordered
        },
        include: {
          category: true,
          reviews: true,
        },
      }),
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

// ----------------------------------------------------------------------------------------

module.exports = {
  addProduct,
  updateProduct,
  deleteProduct,
  listProductsBySeller,
  addCategory,
  getAllCategories,
  productById,
  getAllProducts,
  getHomePageProducts,
};

const prisma  = require("../prisma/prismaClient"); 


// to add/sell product
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



// to update product
const updateProduct = async ({
  productId,
  sellerId,
  title,
  description,
  categoryId,
  price,
  stock,
  image,
}) => {
  console.log("Updating product...");

 
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  if (product.sellerId !== sellerId) {
    throw new Error("You do not have permission to update this product");
  }

  
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
  });

  if (!category) {
    throw new Error("Category not found");
  }


  const updatedProduct = await prisma.product.update({
    where: { id: productId },
    data: {
      title,
      description,
      categoryId,
      price,
      stock,
      image,
    },
  });

  return updatedProduct;
};


// to delete product
const deleteProduct = async ({ productId, sellerId }) => {
  console.log("Deleting product...");

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      cartItems: true,
      wishlistItems: true,
      orders: true,
      reviews: true,
    },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  if (product.sellerId !== sellerId) {
    throw new Error("You do not have permission to delete this product");
  }

  await prisma.cart.deleteMany({
    where: { productId: productId },
  });

  await prisma.wishlist.deleteMany({
    where: { productId: productId },
  });

  await prisma.order.deleteMany({
    where: { productId: productId },
  });

  await prisma.review.deleteMany({
    where: { productId: productId },
  });

  // Now, safely delete the product
  const deletedProduct = await prisma.product.delete({
    where: { id: productId },
  });

  return deletedProduct;
};



// to get products

const listProducts = async (sellerId) => {
  console.log("Listing products...");

  const products = await prisma.product.findMany({
    where: {
      sellerId,
    },
  });

  return products;
};

const getProductDetails = async (productId) => {
  console.log("Fetching product details...");

  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
    include: {
      reviews: true, 
    },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  return product;
};

module.exports = {
  addProduct,
  updateProduct,
  deleteProduct,
  listProducts,
  getProductDetails,
};

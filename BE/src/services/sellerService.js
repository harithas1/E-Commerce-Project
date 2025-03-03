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

const deleteProduct = async (params) => {
  const { productId, sellerId } = params; // Extract values properly

  if (!productId || isNaN(productId)) {
    throw new Error("Invalid productId");
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  if (product.sellerId !== sellerId) {
    throw new Error("You do not have permission to delete this product");
  }

  return await prisma.product.delete({
    where: { id: productId },
  });
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

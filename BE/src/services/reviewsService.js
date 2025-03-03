const prisma = require("../prisma/prismaClient");

// add review
const createReview = async ({ userId, productId, rating, comment }) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("User not found");

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) throw new Error("Product not found");

  const review = await prisma.review.create({
    data: {
      userId,
      productId,
      rating,
      comment,
      reviewerName: user.name, 
      reviewerEmail: user.email, 
    },
  });

  return review;
};



const getReviewsByUser = async (userId) => {
  return await prisma.review.findMany({
    where: { userId: parseInt(userId) },
    include: { product: true },
  });
};

module.exports = {
  createReview,
  getReviewsByUser
};


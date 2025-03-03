import axios from 'axios'

// 1. add review -- method: POST -- endpoint: https://e-commerce-ecuo.onrender.com/api/reviews/add -- body: {userId, productId, rating, comment}


// 2. get reviews by product -- method: GET -- endpoint: https://e-commerce-ecuo.onrender.com/api/reviews/product/:productId -- params: {productId}
// example: https://e-commerce-ecuo.onrender.com/api/reviews/product/123

// 3. get reviews by user -- method: GET -- endpoint: https://e-commerce-ecuo.onrender.com/api/reviews/user/:userId -- params: {userId}


export const addingReview = async (userId, productId, rating, comment) => {
    try {
        const response = await axios.post(
            "https://e-commerce-ecuo.onrender.com/api/reviews/add",
            {
                userId,
                productId,
                rating,
                comment,
            }
        );
        console.log("Review added:", response.data);
        
        return response.data;
    } catch (error) {
        console.error("Error adding review:", error);
        throw error;
    }
};
    
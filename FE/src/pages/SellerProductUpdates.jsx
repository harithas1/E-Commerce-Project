export const getSellerProducts = async () => {
  try {
    const response = await fetch(
      "https://e-commerce-project-l7gm.onrender.com/api/products/seller"
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

export const addProduct = async (product) => {
  try {
    const response = await fetch(
      "https://e-commerce-project-l7gm.onrender.com/api/products",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error adding product:", error);
    return { success: false };
  }
};

export const removeProduct = async (productId) => {
  try {
    const response = await fetch(
      `https://e-commerce-project-l7gm.onrender.com/api/products/${productId}`,
      {
        method: "DELETE",
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error removing product:", error);
    return { success: false };
  }
};

export const updateProduct = async (product) => {
  try {
    const response = await fetch(
      `https://e-commerce-project-l7gm.onrender.com/api/products/${product.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating product:", error);
    return { success: false };
  }
};

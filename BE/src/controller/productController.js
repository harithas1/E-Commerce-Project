const {
  addProduct,
  updateProduct,
  deleteProduct,
  listProductsBySeller,
  addCategory,
  getAllCategories,
  productById,
  getAllProducts,
  getHomePageProducts,
} = require("../services/productService");


// Controller for adding a product
const add_product = async (req, res) => {
  try {
    const { sellerId } = req.params;
    const { title, description, categoryId, price, stock, image } =
      req.body;

    // Call productService to handle the database logic
    const newProduct = await addProduct({
      sellerId,
      title,
      description,
      categoryId,
      price,
      stock,
      image,
    });

    return res.status(201).json(newProduct); // Return the newly created product
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong!" });
  }
};



// Controller for updating a product
const update_product = async (req, res) => {
  try {
    const { productId, title, description, price, stock, image } = req.body;

    const updatedProduct = await updateProduct({
      productId,
      title,
      description,
      price,
      stock,
      image,
    });

    return res.status(200).json(updatedProduct); 
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong!" });
  }
};


// Controller for deleting a product
const delete_product = async (req, res) => {
  try {
    const { productId } = req.body;

    await deleteProduct(productId);

    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong!" });
  }
};



// Controller for listing products by sellerId
const list_products = async (req, res) => {
  try {
    const { sellerId } = req.query;

    const products = await listProductsBySeller(sellerId);

    return res.status(200).json(products);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong!" });
  }
};


// Controller for adding a category
const add_category = async (req, res) => {
  try {
    const { name } = req.body;

    const newCategory = await addCategory(name);

    return res.status(201).json(newCategory); 
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong!" });
  }
};



// Controller for getting all categories
const get_all_categories = async (req, res) => {
  try {
    const categories = await getAllCategories();
    return res.status(200).json(categories);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong!" });
  }
};



const product_by_id = async (req, res) => {
  try {
    const { productId } = req.params;
    if (!productId) {
      return res.status(400).json({ error: "Product ID is required" });
    }
    const product = await productById(parseInt(productId));
    return res.status(200).json(product);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong!" });
  }
};

const get_all_products = async (req, res) => {
  const { page = 1, pageSize = 10 } = req.query; 

  try {
    const products = await getAllProducts(
      parseInt(page),
      parseInt(pageSize)
    );
    res.json(products);
  } catch (error) {
    console.error("Error in getAllProductsController:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

const get_Home_Page_Products = async (req, res) => {
  console.log("Fetching home page products...");
  try {
    const limit = parseInt(req.query.limit) || 10; 
    const products = await getHomePageProducts(limit);

    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching home page products:", error);
    res.status(500).json({ error: "Failed to fetch home page products" });
  }
};





module.exports = {
  add_product,
  update_product,
  delete_product,
  list_products,
  add_category,
  get_all_categories,
  product_by_id,
  get_all_products,
  get_Home_Page_Products,
  
};

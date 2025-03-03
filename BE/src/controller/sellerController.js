const {
  addProduct,
  updateProduct,
  deleteProduct,
  listProducts,
  getProductDetails,
} = require("../services/sellerService");

const add_product = async (req, res) => {
  try {
    const { sellerId, title, description, categoryId, price, stock, image } =
      req.body;

    const newProduct = await addProduct({
      sellerId,
      title,
      description,
      categoryId,
      price,
      stock,
      image,
    });

    return res.status(201).json(newProduct); 
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong!" });
  }
};

const update_product = async (req, res) => {
  try {
    const {
      productId,
      sellerId,
      title,
      description,
      categoryId,
      price,
      stock,
      image,
    } = req.body;

    const updatedProduct = await updateProduct({
      productId: parseInt(productId),
      sellerId,
      title,
      description,
      categoryId,
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

const delete_product = async (req, res) => {
  try {
    const { productId, sellerId } = req.body;

    const deletedProduct = await deleteProduct(
      parseInt(productId),
      parseInt(sellerId)
    );

    return res.status(200).json(deletedProduct); 
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong!" });
  }
};

const list_products = async (req, res) => {
  try {
    const { sellerId } = req.query;

    const products = await listProducts(parseInt(sellerId));

    return res.status(200).json(products); 
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong!" });
  }
};

const get_product_details = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await getProductDetails(parseInt(productId));

    return res.status(200).json(product); 
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong!" });
  }
};

module.exports = {
  add_product,
  update_product,
  delete_product,
  list_products,
  get_product_details,
};

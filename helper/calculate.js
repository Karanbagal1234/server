import ProductsModel from "../models/Products.model.js";

const calculateCartTotal = async (items) => {
    if (items.length === 0) return 0;
  
    // Get all product IDs in the cart
    const productIds = items.map(item => item.productId);
    
    // Fetch all products in a single query
    const products = await ProductsModel.find({ _id: { $in: productIds } });
    
    // Create price map for quick lookup
    const priceMap = new Map();
    products.forEach(product => {
      priceMap.set(product._id.toString(), product.Price);
    });
  
    // Calculate total synchronously
    return items.reduce((total, item) => {
      const price = priceMap.get(item.productId.toString()) || 0;
      return total + (price * item.quantity);
    }, 0);
  };

  export default calculateCartTotal;
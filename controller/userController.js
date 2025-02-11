import bcrypt from 'bcryptjs'
import UserModel from '../models/User.Model.js';
import StoreModel from '../models/Store.model.js';
import Retailer from '../models/Retailer.Model.js'
import ProductsModel from '../models/Products.model.js';


import QRCode from 'qrcode'

// Register new user
export const userRegister = async (req, res) => {
  const { Name, Email, Password, PhoneNumber, Address } = req.body;
console.log('req.body', req.body);

  // Check if user already exists in the database
  const existingUser = await UserModel.findOne({ Email });
  if (existingUser) {
    return res.status(400).json({ error: 'User already exists' });
  }

  // Hash the password for secure storage
  const hashedPassword = await bcrypt.hash(Password, 10);

  // Create and save the new user
  const user = new UserModel({
    Name,
    Email,
    Password: hashedPassword,
    PhoneNumber,
    Address,
  });
  await user.save();

  // Respond with the created user's details (excluding password)
  res.status(201).json({
    success: true,
    user: {
      _id: user._id,
      Name: user.Name,
      Email: user.Email,
      PhoneNumber: user.PhoneNumber,
      Address: user.Address,
    },
  });
}

// Register new retailer and their store
export const retailRegister = async (req, res) => {
  const { Name, Email, Password, StoreName, StoreAddress, PhoneNumber, BusinessRegistrationNumber, TaxIdentificationNumber, OperatingHours, PaymentMethods } = req.body;

  // Check if retailer already exists in the database
  const existingRetailer = await Retailer.findOne({ Email });
  if (existingRetailer) {
    return res.status(400).json({ error: 'Retailer already exists' });
  }

  // Create and save the new store
  const store = new StoreModel({
    StoreName,
    StoreAddress,
    PhoneNumber,
    BusinessRegistrationNumber,
    TaxIdentificationNumber,
    OperatingHours,
    PaymentMethods,
  });
  await store.save();

  // Create and associate a new retailer with the store
  const retailer = new Retailer({
    Name,
    Email,
    Password: await bcrypt.hash(Password, 10),
    Store: store._id,  // Link retailer to the store
  });
  await retailer.save();

  // Respond with the retailer and store details
  res.status(201).json({
    success: true,
    retailer,
    store,
  });
}

// User login functionality
export const userLogin = async (req, res) => {
  const { Email, Password } = req.body;

  // Find the user by email
  const user = await UserModel.findOne({ Email });
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Compare password with the hashed one in the database
  const isPasswordValid = await bcrypt.compare(Password, user.Password);
  if (!isPasswordValid) {
    return res.status(401).json({ error: 'Invalid password' });
  }

  // Set a session cookie for the user
  res.cookie('userId', user._id.toString(), { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 }); // 1 day

  // Return user details (excluding password)
  res.json({
    success: true,
    user: {
      _id: user._id,
      Name: user.Name,
      Email: user.Email,
      PhoneNumber: user.PhoneNumber,
      Address: user.Address,
    },
  });
};

// Retailer login functionality
export const retailLogin = async (req, res) => {
  const { Email, Password } = req.body;
await bcrypt.hash(Password,10)
// Find the retailer by email and populate store details
  const retailer = await Retailer.findOne({ Email }).populate('Store');
  if (!retailer) {
    return res.status(404).json({ error: 'Retailer not found' });
  }

  // Compare password with the hashed one in the database
  const isPasswordValid = await bcrypt.compare(Password, retailer.Password);
  if (!isPasswordValid) {
    return res.status(401).json({ error: 'Invalid password' });
  }

  // Set a session cookie for the retailer
  res.cookie('retailerId', retailer._id, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 }); // 1 day

  // Return retailer details (excluding password)
  res.json({
    success: true,
    retailer: {
      _id: retailer._id,
      Name: retailer.Name,
      Email: retailer.Email,
      Store: retailer.Store, // Include store details
    },
  });
};

export const updateProfile = async (req, res) => {
  const userId  = req.user._id;
  const updates = req.body;

  // Prevent updating restricted fields like Email and Password directly
  if (updates.Email || updates.Password) {
    return res.status(400).json({ message: "Email and Password cannot be updated directly." });
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: updates },
    { new: true, runValidators: true }
  );

  if (!updatedUser) {
    return res.status(404).json({ message: "User not found." });
  }

  res.status(200).json({ message: "User details updated successfully", user: updatedUser });
}

// Logout user by clearing the session cookie
export const userLogout = (req, res) => {
  res.clearCookie('userId');
  res.json({ success: true, message: 'User logged out successfully' });
};

// Logout retailer by clearing the session cookie
export const retailLogout = (req, res) => {
  res.clearCookie('retailerId');
  res.json({ success: true, message: 'Retailer logged out successfully' });
};

// Get user profile information
export const userProfile = (req, res) => {
  res.json({
    success: true,
    user: {
      _id: req.user._id,
      Name: req.user.Name,
      Email: req.user.Email,
      PhoneNumber: req.user.PhoneNumber,
      Address: req.user.Address,
    },
  });
}

// Get retailer profile information
export const retailerProfile = (req, res) => {
  res.json({
    success: true,
    retailer: {
      _id: req.retailer._id,
      Name: req.retailer.Name,
      Email: req.retailer.Email,
      Store: req.retailer.Store,
    },
  });
}


// Controller to get all products for the retailer
export const getProductsForRetailer = async (req, res) => {
  const products = await ProductsModel.find({ Retailer: req.retailer });

  // Map over products and generate QR codes
  const productDetails = await Promise.all(
    products.map(async (product) => {
      // Create a JSON object for the QR code
      const qrData = {
        type: "product",
        Name: product.Name,
        Price: product.Price,
        ID: product._id,
        Quantity: product.Quantity,
      };

      // Convert JSON object to string
      const qrJsonString = JSON.stringify(qrData);

      // Generate the QR code (This returns a promise with the URL or base64 string)
      const qrCode = await QRCode.toDataURL(qrJsonString);

      // Return product details with the generated QR code
      return {
        Name: product.Name,
        Price: product.Price,
        ProductID: product._id,
        QRCode: qrCode, // Base64 QR image
        Quantity: product.Quantity,
      };
    })
  );

  // Respond with the list of products and their QR codes
  return res.status(200).json(productDetails);
};

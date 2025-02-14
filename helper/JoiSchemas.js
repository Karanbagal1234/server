import Joi from "joi";

// Joi schema for user registration with custom error messages
const userRegisterSchema = Joi.object({
  Name: Joi.string().min(3).max(255).required().messages({
    "string.base": "Name should be a string.",
    "string.empty": "Name is required.",
    "string.min": "Name should be at least 3 characters long.",
    "string.max": "Name cannot exceed 255 characters.",
    "any.required": "Name is required.",
  }),
  Email: Joi.string().email().required().messages({
    "string.base": "Email should be a valid string.",
    "string.empty": "Email is required.",
    "string.email": "Please enter a valid email address.",
    "any.required": "Email is required.",
  }),
  Password: Joi.string().min(8).required().messages({
    "string.base": "Password should be a string.",
    "string.empty": "Password is required.",
    "string.min": "Password should be at least 8 characters long.",
    "any.required": "Password is required.",
  }),
  PhoneNumber: Joi.string().min(10).max(15).required().messages({
    "string.base": "Phone Number should be a valid string.",
    "string.empty": "Phone Number is required.",
    "string.min": "Phone Number should be at least 10 characters long.",
    "string.max": "Phone Number should not exceed 15 characters.",
    "any.required": "Phone Number is required.",
  }),
  Address: Joi.string().min(10).required().messages({
    "string.base": "Address should be a string.",
    "string.empty": "Address is required.",
    "string.min": "Address should be at least 10 characters long.",
    "any.required": "Address is required.",
  }),
});

// Joi schema for retailer registration with custom error messages
const retailerRegisterSchema = Joi.object({
  Name: Joi.string().min(3).max(255).required().messages({
    "string.base": "Retailer name should be a string.",
    "string.empty": "Retailer name is required.",
    "string.min": "Retailer name should be at least 3 characters long.",
    "string.max": "Retailer name cannot exceed 255 characters.",
    "any.required": "Retailer name is required.",
  }),
  Email: Joi.string().email().required().messages({
    "string.base": "Email should be a valid string.",
    "string.empty": "Email is required.",
    "string.email": "Please enter a valid email address.",
    "any.required": "Email is required.",
  }),
  Password: Joi.string().min(8).required().messages({
    "string.base": "Password should be a string.",
    "string.empty": "Password is required.",
    "string.min": "Password should be at least 8 characters long.",
    "any.required": "Password is required.",
  }),
  StoreName: Joi.string().min(3).max(255).required().messages({
    "string.base": "Store Name should be a string.",
    "string.empty": "Store Name is required.",
    "string.min": "Store Name should be at least 3 characters long.",
    "string.max": "Store Name cannot exceed 255 characters.",
    "any.required": "Store Name is required.",
  }),
  StoreAddress: Joi.string().min(10).required().messages({
    "string.base": "Store Address should be a string.",
    "string.empty": "Store Address is required.",
    "string.min": "Store Address should be at least 10 characters long.",
    "any.required": "Store Address is required.",
  }),
  PhoneNumber: Joi.string().min(10).max(15).required().messages({
    "string.base": "Phone Number should be a valid string.",
    "string.empty": "Phone Number is required.",
    "string.min": "Phone Number should be at least 10 characters long.",
    "string.max": "Phone Number should not exceed 15 characters.",
    "any.required": "Phone Number is required.",
  }),

});

const updateProfileSchema = Joi.object({
  Name: Joi.string().optional(),
  PhoneNumber: Joi.string().optional(),
  Address: Joi.string().optional(),
});

// Joi schema for user login
const userLoginSchema = Joi.object({
  Email: Joi.string().email().required(),
  Password: Joi.string().min(8).required(),
});

// Joi schema for retailer login
const retailerLoginSchema = Joi.object({
  Email: Joi.string().email().required(),
  Password: Joi.string().min(8).required(),
});

export {
  userRegisterSchema,
  retailerRegisterSchema,
  userLoginSchema,
  retailerLoginSchema,
  updateProfileSchema,
};

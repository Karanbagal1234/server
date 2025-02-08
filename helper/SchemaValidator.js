import Joi from 'joi';

// Define a generic validation middleware function
const validateSchema = (schema, data) => {
  const { error } = schema.validate(data);
  if (error) {
    throw new Error(error.details[0].message);  // Throw error with custom message
  }
};

// Middleware function to handle validation
export const validateInput = (schema) => {
  return (req, res, next) => {
    try {
      validateInput(schema, req.body);  // Call the validation function
      next();  // Continue to next middleware or route handler if validation passes
    } catch (err) {
      next(err);  // Pass the error to the next middleware (error handler)
    }
  };
};

export default validateSchema;



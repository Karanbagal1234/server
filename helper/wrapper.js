export default (fn) => {
  // Return a function that wraps the async route handler
  return (req, res, next) => {
    // Resolve the async function and catch any potential errors, forwarding them to the error handler
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

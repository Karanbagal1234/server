import mongoose from "mongoose";
import shortid from "shortid";
const StoreSchema = new mongoose.Schema({
    StoreId: {
      type: String,
      default: shortid.generate,
    },
    StoreName: {
      type: String,
      required: true,
    },
    StoreAddress: {
      type: String,
      required: true,
    },
    PhoneNumber: {
      type: String,
      required: true,
    },
    BusinessRegistrationNumber: {
      type: String,
      required: true,
    },
    TaxIdentificationNumber: {
      type: String,
      required: true,
    },
    OperatingHours: {
      type: String,
      required: true,
    },
    PaymentMethods: {
      type: [String], // Array of payment methods like ["Credit Card", "Cash", etc.]
      required: true,
    },
  });
  
  export default mongoose.model("Store", StoreSchema);
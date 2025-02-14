import mongoose from "mongoose";
import shortid from "shortid";
const StoreSchema = new mongoose.Schema({
  
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
    },
    TaxIdentificationNumber: {
      type: String,
    },
    OperatingHours: {
      type: String,
    },
    PaymentMethods: {
      type: [String], 
    },
  });
  
  export default mongoose.model("Store", StoreSchema);
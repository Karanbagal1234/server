import Store from "../models/Store.model.js";
import User from "../models/User.Model.js";
import StoreSession from "../models/Store.Session.js";
import Cart from "../models/Cart.js";

export const storeScan = async (req, res) => {
  
    const userId = req.user;
    const storeId = req.body.storeId;

    // Validate user and store
    const user = userId;
    const store = await Store.findById(storeId);



    if (!user || !store) {
      return res.status(404).json({ error: "User or store not found" });
    }

    // End any existing session for the user
    await StoreSession.updateMany(
      { userId, endedAt: null },
      { endedAt: Date.now() }
    );

    // Start a new session
    const session = new StoreSession({ userId, storeId });
    console.log(session);
    await session.save();

    // Create a new cart and link it to the session
    const cart = new Cart({ userId, sessionId: session._id, items: [], total: 0 });
    await cart.save();

    // Update the session with the cart ID
    session.cartId = cart._id;
    await session.save();

    res.json({
      success: true,
      session: {
        _id: session._id,
        userId: session.userId,
        storeId: session.storeId,
        cartId: session.cartId,
        startedAt: session.startedAt,
      },
    });
 
}

export const endSession = async (req, res) => {
  
    const { sessionId } = req.body;

    // Find the session
    const session = await StoreSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    // Mark the session as ended
    session.endedAt = Date.now();
    await session.save();

    // Add the cart to the user's cart history
    const user = await User.findById(session.userId);
    user.cartHistory.push({
      cartId: session.cartId,
      sessionId: session._id,
      storeId: session.storeId,
      endedAt: session.endedAt,
    });
    await user.save();

    res.json({
      success: true,
      message: "Session ended successfully",
      session,
    });
 
}
export const storeDetails = async (req, res) => {
    
      const storeId = req.body.storeId;
  
      // Find the store
      const store = await Store.findById(storeId);
      if (!store) {
        return res.status(404).json({ error: "Store not found" });
      }
  
      res.json({
        success: true,
        store,
      });
};
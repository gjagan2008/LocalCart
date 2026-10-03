const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/localcart';
  
  try {
    // Set short selection timeout to quickly fallback if local MongoDB server is not running
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000
    });
    console.log(`[Database] Connected to MongoDB at: ${uri}`);
  } catch (err) {
    console.warn(`[Database] Could not connect to primary MONGODB_URI (${uri}): ${err.message}`);
    console.log('[Database] Initializing In-Memory MongoDB Server for instant out-of-the-box execution...');
    
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const memUri = mongod.getUri();
      await mongoose.connect(memUri);
      console.log(`[Database] Connected to In-Memory MongoDB at: ${memUri}`);
    } catch (memErr) {
      console.error('[Database] Failed to initialize in-memory MongoDB fallback:', memErr);
      process.exit(1);
    }
  }
};

module.exports = connectDB;

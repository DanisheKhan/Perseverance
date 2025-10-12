import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const testConnection = async () => {
  console.log("🧪 Testing MongoDB Connection...\n");

  try {
    console.log(`📡 Connecting to: ${process.env.MONGODB_URI}`);

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    console.log(`🔌 Port: ${conn.connection.port}`);

    // List collections
    const collections = await conn.connection.db.listCollections().toArray();
    console.log(`\n📚 Collections (${collections.length}):`);
    collections.forEach((col) => {
      console.log(`   - ${col.name}`);
    });

    // Test creating a document
    console.log("\n🧪 Testing document creation...");
    const testSchema = new mongoose.Schema({
      name: String,
      timestamp: Date,
    });
    const TestModel = mongoose.model("Test", testSchema);

    const testDoc = await TestModel.create({
      name: "Connection Test",
      timestamp: new Date(),
    });

    console.log("✅ Document created:", testDoc._id);

    // Clean up
    await TestModel.deleteOne({ _id: testDoc._id });
    console.log("🧹 Test document cleaned up");

    console.log("\n✨ All tests passed! MongoDB is ready to use.\n");

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Connection Error:", error.message);
    console.error("\n💡 Troubleshooting:");
    console.error("   1. Make sure MongoDB is running");
    console.error("   2. Check MONGODB_URI in .env file");
    console.error("   3. Verify network access (for Atlas)");
    console.error("   4. Check username/password (for Atlas)\n");
    process.exit(1);
  }
};

testConnection();

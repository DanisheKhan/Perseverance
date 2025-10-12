import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";
import Habit from "../models/Habit.js";
import Completion from "../models/Completion.js";

// Load environment variables
dotenv.config();

const initializeDatabase = async () => {
  try {
    console.log("🔄 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB successfully!");

    const db = mongoose.connection.db;
    const dbName = db.databaseName;

    console.log(`\n📦 Database Name: ${dbName}`);
    console.log("=".repeat(50));

    // Get all collections
    const collections = await db.listCollections().toArray();
    console.log(`\n📚 Existing Collections: ${collections.length}`);
    collections.forEach((col) => {
      console.log(`   - ${col.name}`);
    });

    // Create indexes for Users collection
    console.log("\n🔨 Creating indexes for Users collection...");
    await User.createIndexes();
    console.log("✅ Users indexes created");

    // Create indexes for Habits collection
    console.log("🔨 Creating indexes for Habits collection...");
    await Habit.createIndexes();
    console.log("✅ Habits indexes created");

    // Create indexes for Completions collection
    console.log("🔨 Creating indexes for Completions collection...");
    await Completion.createIndexes();
    console.log("✅ Completions indexes created");

    // Get database stats
    const stats = await db.stats();
    console.log("\n📊 Database Statistics:");
    console.log("=".repeat(50));
    console.log(`Database: ${stats.db}`);
    console.log(`Collections: ${stats.collections}`);
    console.log(`Data Size: ${(stats.dataSize / 1024).toFixed(2)} KB`);
    console.log(`Storage Size: ${(stats.storageSize / 1024).toFixed(2)} KB`);
    console.log(`Indexes: ${stats.indexes}`);
    console.log(`Index Size: ${(stats.indexSize / 1024).toFixed(2)} KB`);

    // Get collection counts
    console.log("\n📈 Collection Counts:");
    console.log("=".repeat(50));
    const userCount = await User.countDocuments();
    const habitCount = await Habit.countDocuments();
    const completionCount = await Completion.countDocuments();

    console.log(`Users: ${userCount}`);
    console.log(`Habits: ${habitCount}`);
    console.log(`Completions: ${completionCount}`);

    // List all indexes
    console.log("\n🔍 Collection Indexes:");
    console.log("=".repeat(50));

    const userIndexes = await User.collection.getIndexes();
    console.log("\nUsers Collection Indexes:");
    Object.keys(userIndexes).forEach((indexName) => {
      console.log(`   - ${indexName}`);
    });

    const habitIndexes = await Habit.collection.getIndexes();
    console.log("\nHabits Collection Indexes:");
    Object.keys(habitIndexes).forEach((indexName) => {
      console.log(`   - ${indexName}`);
    });

    const completionIndexes = await Completion.collection.getIndexes();
    console.log("\nCompletions Collection Indexes:");
    Object.keys(completionIndexes).forEach((indexName) => {
      console.log(`   - ${indexName}`);
    });

    console.log("\n" + "=".repeat(50));
    console.log("🎉 Database initialization completed successfully!");
    console.log("=".repeat(50));
    console.log("\n✨ Your 'perseverance' database is ready to use!");
    console.log("\nDatabase Structure:");
    console.log("├── users (User accounts and settings)");
    console.log("├── habits (Habit definitions)");
    console.log("└── completions (Completion records)");
    console.log("\n💡 Tip: You can now start the server with 'npm run server'");
  } catch (error) {
    console.error("❌ Error initializing database:", error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log("\n👋 Database connection closed");
  }
};

// Run the initialization
initializeDatabase();

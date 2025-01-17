require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);
app.use(cookieParser());

// MongoDB Connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.otdu5.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    console.log("Connected to MongoDB successfully!");

    const db = client.db("TechElevate");
    const usersCollection = db.collection("users");
    const productsCollection = db.collection("products");

    // Root Route
    app.get("/", (req, res) => {
      res.send("TechElevate Server is Running!");
    });

    // Fetch user by email
    app.get("/users", async (req, res) => {
      const email = req.query.email;

      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      try {
        const user = await usersCollection.findOne({ email });

        if (user) {
          res.status(200).json(user);
        } else {
          res.status(404).json({ message: "User not found" });
        }
      } catch (error) {
        console.error("Error fetching user:", error.message);
        res.status(500).json({ message: "Internal server error" });
      }
    });

    // Get products for a specific user
    app.get("/products", async (req, res) => {
      const ownerEmail = req.query.ownerEmail;
      if (!ownerEmail) {
        return res.status(400).json({ error: "Owner email is required." });
      }
      const products = await productsCollection.find({ ownerEmail }).toArray();
      res.json(products);
    });

    app.post("/users", async (req, res) => {
      console.log("Hit post API");
      try {
        console.log("Received request to create or update user:", req.body);

        const {
          name,
          email,
          photoURL,
          role = "user",
          isSubscribed = false,
          subscriptionDate = null,
        } = req.body;

        // Validation: Check for required fields
        if (!name || !email) {
          return res
            .status(400)
            .json({ message: "Name and Email are required." });
        }

        // Check if user already exists
        const existingUser = await usersCollection.findOne({ email });

        if (existingUser) {
          // If the user exists, update their data
          console.log("User already exists, updating user data:", existingUser);

          // Update the user details if necessary (photoURL, name)
          const updatedUser = {
            name: name || existingUser.name,
            photoURL: photoURL || existingUser.photoURL,
            role: existingUser.role,
            isSubscribed: existingUser.isSubscribed,
            subscriptionDate: existingUser.subscriptionDate,
          };

          // Perform the update
          const updateResult = await usersCollection.updateOne(
            { email },
            { $set: updatedUser }
          );

          if (updateResult.modifiedCount > 0) {
            console.log("User data updated successfully:", updateResult);
            return res.status(200).json({
              message: "User data updated successfully.",
              userId: existingUser._id,
            });
          } else {
            console.log("No changes made to the user data.");
            return res.status(200).json({
              message: "No changes made to the user data.",
              userId: existingUser._id,
            });
          }
        }

        // If user doesn't exist, create a new user
        console.log("User does not exist, creating a new user:", {
          name,
          email,
        });

        const newUser = {
          name,
          email,
          photoURL,
          role,
          isSubscribed,
          subscriptionDate,
        };

        console.log("Inserting new user into database:", newUser);

        // Insert the new user into the database
        const result = await userCollection.insertOne(newUser);

        if (result.acknowledged) {
          console.log("User registered successfully:", result.insertedId);
          return res.status(201).json({
            message: "User registered successfully.",
            userId: result.insertedId,
          });
        } else {
          console.error("Failed to insert user into database.");
          return res.status(500).json({ message: "Failed to register user." });
        }
      } catch (error) {
        console.error("Error saving user:", error.message);
        return res.status(500).json({ message: "Internal server error." });
      }
    });

    // API to Add Product
    app.post("/add-products", async (req, res) => {
      const {
        productName,
        productImage,
        description,
        ownerName,
        ownerEmail,
        ownerImage,
        tags,
        externalLink,
      } = req.body;

      // Prepare Product Object
      const newProduct = {
        productName,
        productImage,
        description,
        ownerName,
        ownerEmail,
        ownerImage,
        tags: tags || [],
        externalLink,
        timestamp: new Date(),
      };

      try {
        // Insert Product into MongoDB
        const result = await productsCollection.insertOne(newProduct);

        res.status(201).json({
          success: true,
          message: "Product added successfully.",
          productId: result.insertedId,
        });
      } catch (error) {
        console.error("Error inserting product:", error.message);
        res.status(500).json({
          success: false,
          message: "Failed to add product.",
        });
      }
    });

    // Update an existing product
    app.put("/products/:id", async (req, res) => {
      const id = req.params.id;
      const updatedProduct = req.body;

      // Remove the _id field from the update data, if present
      delete updatedProduct._id;

      const result = await productsCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedProduct }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ error: "Product not found." });
      }

      res.json({ message: "Product updated successfully." });
    });

    // Delete a product
    app.delete("/products/:id", async (req, res) => {
      const id = req.params.id;
      const result = await productsCollection.deleteOne({
        _id: new ObjectId(id),
      });
      if (result.deletedCount === 0) {
        return res.status(404).json({ error: "Product not found." });
      }
      res.json({ message: "Product deleted successfully." });
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error.message);
  }
}

run().catch(console.dir);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

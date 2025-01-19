require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
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
    // await client.connect();
    // console.log("Connected to MongoDB successfully!");

    const db = client.db("TechElevate");
    const usersCollection = db.collection("users");
    const productsCollection = db.collection("products");
    const reviewsCollection = db.collection("reviews");

    // JWT-related API to generate token
    app.post("/jwt", async (req, res) => {
      const { email } = req.body;
      console.log(email);
      console.log(req.body);

      if (!email) {
        return res.status(400).send({ message: "Email is required" });
      }

      try {
        // Generate a token for the user using their email or any user info
        const token = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET, {
          expiresIn: "1h",
        });
        res.send({ token });
      } catch (error) {
        console.error("Error generating JWT token:", error);
        res.status(500).send({ message: "Error generating token" });
      }
    });

    // Middleware to verify token
    const authenticateToken = (req, res, next) => {
      const token = req.headers.authorization?.split(" ")[1];

      if (!token) {
        return res.status(401).send({ message: "Unauthorized access" });
      }

      // Verify the token
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
          return res.status(401).send({ message: "Unauthorized access" });
        }

        req.user = user;
        next();
      });
    };

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

    // Get products for a specific user (user dashboard)
    app.get("/products", async (req, res) => {
      const ownerEmail = req.query.ownerEmail;
      if (!ownerEmail) {
        return res.status(400).json({ error: "Owner email is required." });
      }
      const products = await productsCollection.find({ ownerEmail }).toArray();
      res.json(products);
    });

    // Fetch product by ID (moderator dashboard)
    app.get("/products/:id", async (req, res) => {
      const { id } = req.params;

      try {
        const product = await productsCollection.findOne({
          _id: new ObjectId(id),
        });

        if (!product) {
          return res
            .status(404)
            .json({ success: false, message: "Product not found." });
        }

        res.status(200).json(product);
      } catch (error) {
        console.error("Error fetching product:", error.message);
        res
          .status(500)
          .json({ success: false, message: "Failed to fetch product." });
      }
    });

    // API to get products with search and pagination(products page )
    app.get("/accepted-products", async (req, res) => {
      const { search = "", page = 1 } = req.query;
      const limit = 6;
      const skip = (page - 1) * limit;

      try {
        const query = {
          status: "Accepted",
          tags: { $regex: search, $options: "i" },
        };
        const total = await productsCollection.countDocuments(query);
        const products = await productsCollection
          .find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .toArray();

        res.json({ products, totalPages: Math.ceil(total / limit) });
      } catch (err) {
        res
          .status(500)
          .json({ message: "Error fetching products", error: err });
      }
    });

    app.get("/products/:id/reviews", async (req, res) => {
      const { id } = req.params;
      try {
        const reviews = await reviewsCollection
          .find({ productId: id })
          .toArray();
        res.send(reviews);
      } catch (error) {
        res.status(500).send({ message: "Error fetching reviews", error });
      }
    });

    // Fetch all products (moderator dashboard)
    app.get("/all-products", async (req, res) => {
      try {
        const products = await productsCollection.find({}).toArray();
        res.status(200).json(products);
      } catch (error) {
        console.error("Error fetching products:", error.message);
        res
          .status(500)
          .json({ success: false, message: "Failed to fetch products." });
      }
    });

    app.get("/products/:id/reviews", async (req, res) => {
      const { id } = req.params;
      try {
        const reviews = await reviewsCollection

          .find({ productId: id })
          .toArray();
        res.send(reviews);
      } catch (error) {
        res.status(500).send({ message: "Error fetching reviews", error });
      }
    });

    app.post("/products/:id/upvote", authenticateToken, async (req, res) => {
      const { id } = req.params;
      console.log(" product id", id);

      try {
        const product = await productsCollection.findOne({
          _id: new ObjectId(id),
        });
        console.log(product);
        if (!product) {
          return res.status(404).json({ message: "Product not found" });
        }
        console.log(product.ownerEmail);
        console.log(req.user.email);

        if (product.ownerEmail === req.user.email) {
          return res
            .status(403)
            .json({ message: "You cannot vote on your own product" });
        }

        if (product.voters?.includes(req.user.email)) {
          return res.status(400).json({ message: "You can only vote once" });
        }

        await productsCollection.updateOne(
          { _id: new ObjectId(id) },
          { $inc: { upvotes: 1 }, $push: { voters: req.user.email } }
        );

        res.json({ message: "Vote recorded" });
      } catch (err) {
        res
          .status(500)
          .json({ message: "Error voting on product", error: err });
      }
    });

    app.post("/products/:id/report", authenticateToken, async (req, res) => {
      const { id } = req.params;

      try {
        const product = await productsCollection.findOne({
          _id: new ObjectId(id),
        });

        if (!product)
          return res.status(404).send({ message: "Product not found" });

        // Prevent owner from reporting their own product
        if (product.ownerEmail === req.user.email) {
          return res
            .status(403)
            .send({ message: "You cannot report your own product" });
        }

        // Check if the user has already reported the product
        if (product.reportedBy?.includes(req.user.email)) {
          return res
            .status(400)
            .send({ message: "You have already reported this product" });
        }

        // Increment the report count and add the user to the reportedBy list
        const result = await productsCollection.updateOne(
          { _id: new ObjectId(id) },
          {
            $inc: { reports: 1 },
            $push: { reportedBy: req.user.email },
          }
        );

        res.send({ message: "Product reported successfully" });
      } catch (error) {
        res.status(500).send({ message: "Error reporting product", error });
      }
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

      // Prepare Product Object with default values
      const newProduct = {
        productName,
        productImage,
        description,
        ownerName,
        ownerEmail,
        ownerImage,
        tags: tags || [],
        externalLink,

        upvotes: 0,
        downvotes: 0,
        reports: 0,
        status: "Pending",
        isFeatured: false,
        createdAt: new Date(),
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

    app.post("/reviews", async (req, res) => {
      const review = req.body;

      try {
        const result = await reviewsCollection.insertOne(review);
        console.log("Insert result:", result);
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Error submitting review", error });
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

    // Update product status or make it featured
    app.patch("/update-products/:id", async (req, res) => {
      const { id } = req.params;
      const { action, isFeatured } = req.body;

      const updateFields = {};
      if (action === "Accept") updateFields.status = "Accepted";
      if (action === "Reject") updateFields.status = "Rejected";
      if (isFeatured === true) updateFields.isFeatured = true;

      try {
        const result = await productsCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: updateFields }
        );
        console.log(result);

        if (result.matchedCount === 0) {
          return res
            .status(404)
            .json({ success: false, message: "Product not found." });
        }

        res
          .status(200)
          .json({ success: true, message: "Product updated successfully." });
      } catch (error) {
        console.error("Error updating product:", error.message);
        res
          .status(500)
          .json({ success: false, message: "Failed to update product." });
      }
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

const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

const corsOptions = {
  origin: ["http://localhost:5173"],
};

// Middleware
app.use(express.json());
app.use(cors(corsOptions));

app.get("/", (req, res) => {
  res.send("Welcome to the Evershop server");
});

const uri = process.env.DB_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const run = async () => {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    // Collections from the database here
    const productCollection = client.db("everShop").collection("products");

    //  Product related APIs
    // app.get("/products", async (req, res) => {
    //   const result = await productCollection.find().toArray();
    //   res.send(result);
    // });

    app.get("/products", async (req, res) => {
      try {
        const {
          page = 1,
          limit = 12,
        } = req.query;

        const filter = {};

        // Convert page and limit to integers
        const pageInt = parseInt(page);
        const limitInt = parseInt(limit);

        // Fetch the products with filtering, sorting, and pagination
        const productsCursor = productCollection
          .find(filter)
          .skip((pageInt - 1) * limitInt)
          .limit(limitInt);

        const products = await productsCursor.toArray(); // Convert cursor to array
        const totalProducts = await productCollection.countDocuments(filter);

        res.send({
          total: totalProducts,
          pages: Math.ceil(totalProducts / limitInt),
          products,
        });
      } catch (err) {
        console.error("Failed to fetch products", err);
        res.status(500).send("Server error");
      }
    });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
};
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Evershop server is running on port ${port}`);
});

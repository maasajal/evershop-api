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
    const userCollection = client.db("everShop").collection("users");

    // User ralated APIs
    app.post("/users", async (req, res) => {
      const user = req.body;
      const query = { email: user.email };
      const existingUser = await userCollection.findOne(query);
      if (existingUser) {
        return res.send({ message: "User already exists", insertedId: null });
      }
      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    //  Product related APIs
    // app.get("/products", async (req, res) => {
    //   const result = await productCollection.find().toArray();
    //   res.send(result);
    // });

    app.get("/products", async (req, res) => {
      try {
        const {
          page = 1,
          limit = 9,
          search = "",
          brand,
          category,
          priceRange,
          type = "date", // Default type to 'date'
          order = "newest", // Default order to 'newest'
        } = req.query;

        const filter = {};
        if (search) filter.name = { $regex: search, $options: "i" };
        if (brand) filter.brand_name = brand;
        if (category) filter.category = category;

        // Handle the priceRange filter
        if (priceRange) {
          const [minPrice, maxPrice] = priceRange.split("-").map(Number);
          filter.price = { $gte: minPrice, $lte: maxPrice };
        }

        // Convert page and limit to integers
        const pageInt = parseInt(page);
        const limitInt = parseInt(limit);

        // Determine the sorting options
        const sort = {};
        if (type === "price") {
          sort.price = order === "asc" ? 1 : -1;
        } else if (type === "date") {
          sort.createdAt = order === "newest" ? -1 : 1;
        }

        // Fetch the products with filtering, sorting, and pagination
        const productsCursor = productCollection
          .find(filter)
          .sort(sort)
          .skip((pageInt - 1) * limitInt)
          .limit(limitInt);

        const products = await productsCursor.toArray(); // Convert cursor to array
        const totalProducts = await productCollection.countDocuments(filter);

        // Fetch distinct brand names using aggregation
        const brandsAggregation = await productCollection
          .aggregate([
            { $group: { _id: "$brand_name" } }, // Group by brand_name
            { $sort: { _id: 1 } }, // Optional: sort alphabetically
          ])
          .toArray();

        // Fetch distinct category using aggregation
        const categoryAggregation = await productCollection
          .aggregate([
            { $group: { _id: "$category" } }, // Group by category
            { $sort: { _id: 1 } }, // Optional: sort alphabetically
          ])
          .toArray();

        const maxPriceProduct = await productCollection
          .find({}, { projection: { price: 1 } }) // Only select the price field
          .sort({ price: -1 }) // Sort by price in descending order
          .limit(1) // Limit the result to one document
          .toArray();

        // Extract brand names, category from the aggregation result
        const brands = brandsAggregation.map((brand) => brand._id);
        const categories = categoryAggregation.map((category) => category._id);
        const maxPrice =
          maxPriceProduct.length > 0 ? maxPriceProduct[0].price : 0;

        res.send({
          total: totalProducts,
          pages: Math.ceil(totalProducts / limitInt),
          products,
          brands,
          categories,
          maxPrice,
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

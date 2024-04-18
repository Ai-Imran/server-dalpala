const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// dalpala
// NYB9JdJXxXCpv8UF

app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://dalpala:NYB9JdJXxXCpv8UF@cluster0.mbzvmhe.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const productsCollection = client.db("Dalpala").collection("products");

    app.post("/products", async (req, res) => {
      const products = req.body;
      res.send(products);
    });

    app.get("/products", async (req, res) => {
      const result = await productsCollection.find().toArray();
      res.send(result);
    });

    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      try {
        const product = await productsCollection.findOne({
          _id: new ObjectId(id),
        }); // Correct way to find by ID
        if (!product) {
          return res.status(404).json({ error: "Product not found" });
        }
        res.json(product);
      } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    app.get("/home", async (req, res) => {
      try {
        // Assuming you want to fetch all products for the home page
        const products = await productsCollection.find().toArray();
        res.json(products);
      } catch (error) {
        console.error("Error fetching products for home page:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Dalpala is running");
});

app.listen(port, () => {
  console.log(`Dalpala is running by ${port}`);
});

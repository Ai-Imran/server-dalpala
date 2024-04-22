const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://dalpala:NYB9JdJXxXCpv8UF@cluster0.mbzvmhe.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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
        });
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
        const products = await productsCollection.find().toArray();
        res.json(products);
      } catch (error) {
        console.error("Error fetching products for home page:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    // Search products by name
    app.get("/search", async (req, res) => {
      const productName = req.query.name;
      try {
        const products = await productsCollection
          .find({ name: { $regex: productName, $options: "i" } })
          .toArray();
        res.json(products);
      } catch (error) {
        console.error("Error searching products:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // If needed, close the client when finished
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

const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

//artsAndCrafts
//eT8cj67aUU18Ufod

const uri = "mongodb+srv://artsAndCrafts:eT8cj67aUU18Ufod@cluster0.7uejvxv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    const productCollection = client.db("artsStore").collection("Crafts");
    app.post("/addArts", async (req, res) => {
      console.log(req.body);
      const result = await productCollection.insertOne(req.body);
      console.log(result);
      res.send(result)
    })

    app.get("/myArts/:email", async (req, res) => {
      console.log(req.params.email);
      const result = await productCollection.find({ email: req.params.email }).toArray();
      res.send(result)
    })

    app.get("/singleProduct/:id", async(req, res) => {
      const result = await productCollection.findOne({_id: new ObjectId(req.params.id),});
      res.send(result)
    })

    app.put("/updateProduct/:id", async (req, res) => {
      const query = {_id: new ObjectId(req.params.id)};
      const data = {
        $set: {
          name:req.body.name,
          price:req.body.price,
          image:req.body.image,
          subcategory_Name:req.body.subcategory_Name,
          customization:req.body.customization,
          shortDescription:req.body.shortDescription,
          processing_time:req.body.processing_time,
          stockStatus:req.body.stockStatus,
          item_name:req.body.item_name,
          rating:req.body.rating,
        }
      }
      const result = await productCollection.updateOne(query, data);
      res.send(result)
    })

    app.delete("/delete/:id", async(req, res) => {
      const result = await productCollection.deleteOne({_id: new ObjectId(req.params.id)});
      res.send(result)
    })


    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Arts and crafts server is running.')
})

app.listen(port, () => {
  console.log(`Arts and craft server is running on port: ${port}`);
})
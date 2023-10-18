const cors = require('cors');
const express = require('express');
const app = express();
require('dotenv').config()
const port = process.env.PORT || 5000;

// middlewares
app.use(cors())
app.use(express.json())

const user = process.env.DB_USER;
const pass = process.env.DB_PASS;

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${user}:${pass}@cluster0.iuscecj.mongodb.net/?retryWrites=true&w=majority`;

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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
const database = client.db("electronicsDB");
const brandCollections = database.collection("brands");
const carCollections = database.collection("cars");
const cartCollections = database.collection("cart");

// get all brands form DB
app.get('/brands',async(req,res)=>{
  const cursor = brandCollections.find()
  const result =await cursor.toArray()
  res.send(result)
})
// get single brand
app.get('/brands/:name',async (req, res)=>{
  const brandName = req.params.name;
  const filter = {_id: new ObjectId(brandName)}
  const result = await brandCollections.findOne(filter)
  res.send(result)
})
// insert brands name
    app.post("/brands",async (req,res)=>{
        const brands = req.body;
        // console.log(brands);
        const result = await brandCollections.insertOne(brands)
        res.send(result)

    })

    // ======= CAR CRUD  =======
    // get all car from DB
    app.get('/cars',async(req,res)=>{
      const cursor = carCollections.find();
      const result = await cursor.toArray()
      res.send(result);
    })
    // get car by brand name from DB
    app.get('/cars/:bybrand',async (req,res)=>{
      const brand = req.params.bybrand;
      const filter = {brandName:brand}
      const cars = carCollections.find(filter)
      const result = await cars.toArray()
      res.send(result)
    })
    // get car by ID from DB
    app.get('/car/:id',async (req,res)=>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const result =await carCollections.findOne(filter)
      res.send(result)
    })
    // insert CAR to DB
    app.post("/cars", async(req,res)=>{
      const cars = req.body;
      const result = await carCollections.insertOne(cars)
      res.send(result)
      
    }) 
// ========== cart CRUD =======
app.post("/cart",async(req,res)=>{
const cart = req.body;
const result = await cartCollections.insertOne(cart);
res.send(result)
})
// get all carts from DB
app.get("/carts", async(req,res)=>{
const cursor = cartCollections.find();
const result =await cursor.toArray()
res.send(result)

})
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/",(req,res)=>{
    res.send("Electronics Server is running")
})
app.listen(port, (req, res)=>{
    console.log("server is running on port: ", port);
})
const express = require('express')
const bodyParser=require('body-parser')
const { MongoClient } = require('mongodb');
const cors=require('cors')
const app = express()
const ObjectId=require('mongodb').ObjectId;
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.skhdz.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

app.use(bodyParser.json())
app.use(cors());

const port = 5000

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const collection = client.db("developersPoint").collection("services");
    const orderCollection = client.db("developersPoint").collection("orderDetails");
    const reviewCollection = client.db("developersPoint").collection("reviews");
    console.log("DATABASE 100% CONNECTED");


     app.post("/addServices",(req,res) => {
        const services = req.body;
        collection.insertOne(services)
        .then(result=>{
            console.log(result.insertedCount);
        })
    })

    app.get('/services',(req, res)=>{
        collection.find({})
        .toArray((err,documents)=>{
          res.send(documents);
        })
      })



      app.get('/services/:id',(req, res)=>{
        const id=req.params.id;
        console.log(id);
        collection.find({_id: ObjectId(id)})
        .toArray((err,documents)=>{
          res.send(documents[0]);
        })
      })


      app.post("/addOrder",(req,res) => {
        const services = req.body;
        orderCollection.insertOne(services)
        .then(result=>{
            console.log(result.insertedCount);
        })
    })

    app.get('/allOrders',(req, res)=>{
      orderCollection.find({})
      .toArray((err,documents)=>{
        res.send(documents);
      })
    })

    app.get('/bookings', (req, res) => {
      const queryEmail = req.query.email;
                  
      orderCollection.find({ email: queryEmail})
     .toArray((err, documents) => {
         res.status(200).send(documents);
        })
    })


    app.post("/addReviews",(req,res) => {
      const services = req.body;
      reviewCollection.insertOne(services)
      .then(result=>{
          console.log(result.insertedCount);
      })
  })


  app.get('/allReviews',(req, res)=>{
    reviewCollection.find({})
    .toArray((err,documents)=>{
      res.send(documents);
    })
  })

  app.patch('/update/:id', (req, res) => {
    orderCollection.updateOne({_id: ObjectId(req.params.id)},
    {
      $set: {status: req.body.value}
    })
    .then (result => {
      res.send(result.modifiedCount > 0)
    })
  })


  app.delete('/delete/:id',(req, res)=>{
    const id=req.params.id;
    orderCollection.deleteOne({_id: ObjectId(id)})
    .then(result=>{
      console.log(result);
    })
  })



  });


app.get('/', (req, res) => {
    res.send('Welcome to server !')
  })
  
  app.listen(process.env.PORT || port)
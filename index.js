const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const app = express()
const ObjectID = require('mongodb').ObjectID;
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const port = process.env.PORT || 5055;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hhkzw.mongodb.net/${process.env.Name}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const foodCollection = client.db("Tasty-Food").collection("food");
    
    app.get('/foods', (req, res)=>{
        foodCollection.find()
        .toArray((err, items) => {
        console.log(items);
        res.send(items);
        })
    })

    app.post('/addFood', (req, res) => {
        const newFood = req.body;
        console.log('adding new food : ', newFood);
        foodCollection.insertOne(newFood)
        .then(res => {
        console.log('inserted Count',res.insertedCount);
        res.send(res.insertedCount > 0)
        })
    })
    
  console.log("connect successfully");
});


app.listen(port)
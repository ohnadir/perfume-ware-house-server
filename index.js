const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const res = require('express/lib/response');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.pkfo6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const perfumeCollection = client.db("perfumeWareHouse").collection('perfume');
        app.get('/perfume', async (req, res) => {
            const query = {}
            const cursor = perfumeCollection.find(query);
            const perfume = await cursor.toArray();
            res.send(perfume);
        });



        app.post('/login', async (req, res) => {
            const email = req.body;
            const token = jwt.sign(email, process.env.ACCESS_TOKEN_SECRET);
            res.send({token});
        })

        // get single item by id 
        app.get('/perfume/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await perfumeCollection.findOne(query);
            res.send(result);
        });
        
        // update single item
        app.put('/perfume/:id', async (req, res) => {
            const id = req.params.id;
            const updateUser = req.body;
            const filter = { _id: ObjectId(id) };
            const option = { upsert: true}
            const updatedDoc = {
                $set: {
                    stock: updateUser.stock
                }
            }
            const result = await perfumeCollection.updateOne(filter, updatedDoc, option);
            res.send(result);
        });

        // delete one item
        app.delete('/perfume/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await perfumeCollection.deleteOne(query);
            res.send(result);
        });

        // insert item 
        app.post('/perfume', async (req, res) => {
            const newItem = req.body;
            const result = await perfumeCollection.insertOne(newItem);
            res.send(result);
        })
    }
    finally {
        
    }
}
run().catch(console.dir)



app.get('/', (req, res) => {
    res.send('Running Genius Server');
})

app.listen(port, () => {
    console.log("Listening To port", port);
})
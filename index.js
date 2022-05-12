const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send('Welcome to Gerez Server');
})

// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@database.1n8y8.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const uri = "mongodb+srv://CarRepairing:carrepairing1234@cluster0.bohmz.mongodb.net/car-repair?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const serviceCollection = client.db(`${process.env.DB_NAME}`).collection("services");
    const packageCollection = client.db(`${process.env.DB_NAME}`).collection("packages");
    const reviewCollection = client.db(`${process.env.DB_NAME}`).collection("reviews");
    const adminsCollection = client.db(`${process.env.DB_NAME}`).collection("admins");
    const orderCollection = client.db(`${process.env.DB_NAME}`).collection("orders");
    const paymentCollection = client.db(`${process.env.DB_NAME}`).collection("payments");
    console.log('mongodb connected');

    app.get('/services', (req, res) => {
        serviceCollection.find({})
            .toArray((err, docs) => res.send(docs))
    })

    app.get('/package', (req, res) => {
      packageCollection.find({})
          .toArray((err, docs) => res.send(docs))
  })

  //   app.get('/payment', (req, res) => {
  //    paymentCollection.find({})
  //         .toArray((err, docs) => res.send(docs))
  // })

    app.get('/reviews', (req, res) => {
        if (req.query.email) {
            return reviewCollection.find({ email: req.query.email })
                .toArray((err, docs) => res.send(docs[0]))
        }
        reviewCollection.find({})
            .toArray((err, docs) => res.send(docs))
    })

    app.get('/orders', (req, res) => {
        adminsCollection.find({ email: req.query.email })
            .toArray((err, docs) => {
                if (docs.length) {
                    orderCollection.find({})
                        .toArray((err, docs) => res.send(docs))
                } else {
                    orderCollection.find({ email: req.query.email })
                        .toArray((err, docs) => res.send(docs))
                }
            })
    })

    app.get('/payments', (req, res) => {
      adminsCollection.find({ email: req.query.email })
          .toArray((err, docs) => {
              if (docs.length) {
                paymentCollection.find({})
                      .toArray((err, docs) => res.send(docs))
              } else {
                paymentCollection.find({ email: req.query.email })
                      .toArray((err, docs) => res.send(docs))
              }
          })
  })

    app.get('/isAdmin', (req, res) => {
        adminsCollection.find({ email: req.query.email })
            .toArray((err, docs) => res.send(!!docs.length))
    })

    app.post('/addService', (req, res) => {
        serviceCollection.insertOne(req.body)
            .then(result => res.send(!!result.insertedCount))
    })

    app.post('/addPackage', (req, res) => {
      packageCollection.insertOne(req.body)
          .then(result => res.send(!!result.insertedCount))
  })
  
    app.post('/addPayment', (req, res) => {
      paymentCollection.insertOne(req.body)
          .then(result => res.send(!!result.insertedCount))
  })

    app.post('/addReview', (req, res) => {
        reviewCollection.insertOne(req.body)
            .then(result => res.send(!!result.insertedCount))
    })

    app.post('/addAdmin', (req, res) => {
        adminsCollection.insertOne(req.body)
            .then(result => res.send(!!result.insertedCount))
    })

    app.post('/addOrder', (req, res) => {
        orderCollection.insertOne(req.body)
            .then(result => res.send(!!result.insertedCount))
    })

    app.patch('/updateOrderStatus', (req, res) => {
        const { id, status } = req.body;
        console.log(req.body);
        orderCollection.findOneAndUpdate(
            { _id: ObjectId(id) },
            {
                $set: { status },
            }
        ).then(result => res.send(result.lastErrorObject.updatedExisting))
    })

    app.patch('/update/:id', (req, res) => {
        serviceCollection.updateOne(
            { _id: ObjectId(req.params.id) },
            {
                $set: req.body
            }
        ).then(result => res.send(!!result.modifiedCount))
    })

    app.patch('/update/package/:id', (req, res) => {
      packageCollection.updateOne(
          { _id: ObjectId(req.params.id) },
          {
              $set: req.body
          }
      ).then(result => res.send(!!result.modifiedCount))
  })

    app.delete('/delete/:id', (req, res) => {
        serviceCollection.deleteOne({ _id: ObjectId(req.params.id) })
            .then(result => res.send(!!result.deletedCount))
    })

    app.delete('/delete/package/:id', (req, res) => {
      packageCollection.deleteOne({ _id: ObjectId(req.params.id) })
          .then(result => res.send(!!result.deletedCount))
  })

    app.patch('/updateReview/:id', (req, res) => {
        reviewCollection.updateOne(
            { _id: ObjectId(req.params.id) },
            {
                $set: req.body
            }
        ).then(result => res.send(!!result.modifiedCount))
    })

    app.delete('/deleteReview/:id', (req, res) => {
        reviewCollection.deleteOne({ _id: ObjectId(req.params.id) })
            .then(result => res.send(!!result.deletedCount))
    })
});

app.listen(port);
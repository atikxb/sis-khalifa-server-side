const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const ObjectId = require('mongodb').ObjectId;

//middleware
app.use(cors());
app.use(express.json());

//DB access
const uri = `mongodb+srv://sisdbuser:n8ttANj0h2SrgEZA@cluster0.74f46.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

//api function
async function run() {
    try {
        await client.connect();
        const database = client.db("sis");
        const usersCollection = database.collection("users");
        const courseCollection = database.collection("courses");
        //Find all users
        app.post('/users', async (req, res) => {
            const users = await usersCollection.find({}).toArray();
            res.send(users);
        });
        //find single user
        app.post('/user', async (req, res) => {
            const query = req.body;
            if (query.id || query.email) {
                const user = await usersCollection.findOne(query);
                res.json(user);
                console.log(user);
            }

        });
        //Find all courses
        app.post('/courses', async (req, res) => {
            const courses = await courseCollection.find({}).toArray();
            res.send(courses);
        });
        //find single course
        app.post('/course', async (req, res) => {
            const query = req.body;
            if (query.id) {
                const user = await courseCollection.findOne(query);
                res.json(user);
            }
        });
        //Inserting single user ( student or teacher) on users collection
        app.post('/insertUser', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.json(result);
        });
        //Inserting single course on courses collection ( similar to user insert)
        app.post('/insertCourse', async (req, res) => {
            const course = req.body;
            const result = await courseCollection.insertOne(course);
            console.log('adding a new course', result);
            res.json(result);
        });
        //find users depending on specific user role
        app.post('/roleBasedUsers', async (req, res) => {
            const role = req.body;
            const options = { sort: { _id: -1 } };//sort from latest to oldest
            const teachers = await usersCollection.find(role, options).toArray();
            res.json(teachers);
        });




        // //get single service api
        // app.get('/services/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const query = {_id: ObjectId(id)};
        //     const service = await servicesCollection.findOne(query);
        //     console.log('getting service', service);
        //     res.json(service);
        // })
        // //delete api
        // app.delete('/services/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const query = {_id: ObjectId(id)};
        //     const result = await servicesCollection.deleteOne(query);
        //     console.log('deleting service', result);
        //     res.json(result);
        // })

    }
    finally {
        // await client.close();
    }

}
run().catch(console.dir);

//default route
app.get('/', (req, res) => {
    res.send('Running SIS server');
});
app.listen(port, () => {
    console.log('running on SIS server', port);
});
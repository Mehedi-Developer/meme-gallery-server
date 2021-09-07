"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import express from 'express';
require('dotenv').config();
const cors = require("cors");
const bodyParser = require("body-parser");
const app = (0, express_1.default)();
app.use(cors());
app.use(bodyParser.json());
const DB_NAME = process.env.DB_NAME;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_USER = process.env.DB_USER;
const ObjectId = require('mongodb').ObjectId;
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.eynmv.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;
// console.log({DB_USER});
const port = process.env.PORT || 3001;
app.get('/', (req, res) => {
    res.send("Hello world");
});
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect((err) => {
    // perform actions on the collection object
    console.log("Mongo Connected");
    // Memo Collections
    const memoCollection = client.db(DB_NAME).collection("memo_gallery");
    // Finding all memos
    app.get('/get-all-memes', (req, res) => {
        // const search = req.query.search;
        // console.log("all memes => ");
        memoCollection.find({})
            .toArray((err, documents) => {
            console.log(documents);
            res.send(documents);
        });
    });
    // Add memo
    app.post('/add-memo', (req, res) => {
        //   console.log(req.body);
        const memoData = req.body;
        memoCollection.insertOne(memoData)
            .then((data) => {
            // console.log(data);
            res.send(data);
        })
            .catch((err) => console.log(err));
    });
    // Delete memo
    app.get('/delete/:id', (deleteReq, deleteRes) => {
        const id = deleteReq.params.id;
        memoCollection.deleteOne({ _id: ObjectId(id) })
            .then((document) => {
            // console.log(document.deletedCount);
            deleteRes.send(document);
        });
    });
});
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
//# sourceMappingURL=app.js.map
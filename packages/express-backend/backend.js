// backend.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import userService from "./services/user-service.js";
const { addUser, getUsers, findUserById, findUserByName, findUserByJob, deleteUser } = userService;

dotenv.config();

const { MONGO_CONNECTION_STRING } = process.env;

mongoose.set("debug", true);
mongoose
    .connect(MONGO_CONNECTION_STRING)
    .catch((error) => console.log(error));

const app = express();
const port = 8000;


app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.get("/users", (req, res) => { // Optional query search
    const name = req.query.name;
    const job = req.query.job;
    console.log(name);
    console.log(job);

    getUsers(name, job)
        .then((result) => {
            res.send(result);
        })
        .catch((error) => {
            res.status(500).send(error.name);
        })


});

app.post("/users", (req, res) => {
    const userToAdd = req.body;
    addUser(userToAdd)
        .then((result) => res.status(201).send(result));
});


app.get("/users/:id", (req, res) => { //Specific link
    const id = req.params["id"];
    findUserById(id)
        .then((result) => {
            if (result) {
                res.send(result);
            } else {
                res.status(404).send(`Not Found: ${id}`);
            }
        })
        .catch((error) => {
            res.status(500).send(error.name);
        });
});


app.delete("/users/:id", (req, res) => {
    const id = req.params["id"];
    deleteUser(id).then((result) => res.send());
})


app.listen(port, () => {
    console.log(
        `Example app listening at http://localhost:${port}`
    );
});
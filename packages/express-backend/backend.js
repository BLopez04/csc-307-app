// backend.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import userService from "./services/user-service.js";
const { addUser, getUsers, findUserById, findUserByName, findUserByJob } = userService;

dotenv.config();

const { MONGO_CONNECTION_STRING } = process.env;

mongoose.set("debug", true);
mongoose
    .connect(MONGO_CONNECTION_STRING)
    .catch((error) => console.log(error));

const app = express();
const port = 8000;
const users = {
    users_list: [
        {
            id: "xyz789",
            name: "Charlie",
            job: "Janitor"
        },
        {
            id: "abc123",
            name: "Mac",
            job: "Bouncer"
        },
        {
            id: "ppp222",
            name: "Mac",
            job: "Professor"
        },
        {
            id: "yat999",
            name: "Dee",
            job: "Aspring actress"
        },
        {
            id: "zap555",
            name: "Dennis",
            job: "Bartender"
        }
    ]
};

const removeUser = (id) =>{
    const idx = users["users_list"].indexOf(findUserById(id))
    if (idx !== -1) {
        users["users_list"].splice(idx, 1)
    }
}

const generateId = () => {
    return String(Math.floor(Math.random()*1000000)) ;
}

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
    let userToAdd;
    let promise;

    if (req.body.id) {
        userToAdd = req.body
        promise = addUser(userToAdd);
    }

    else {
        userToAdd = {
            "id": generateId(),
            "name": req.body.name,
            "job": req.body.job
        }
        promise = addUser(userToAdd)
    }

    res.status(201).send(promise.then((res) => res.json())
        .then(((json) => json)));
});


app.get("/users/:id", (req, res) => { //Specific link
    const id = req.params["id"]; //or req.params.id
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
    removeUser(id);
    res.send();
})


app.listen(port, () => {
    console.log(
        `Example app listening at http://localhost:${port}`
    );
});
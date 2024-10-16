// backend.js
import express from "express";
import cors from "cors";

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

const findUserByName = (name) => {
    return users["users_list"].filter(      // filter since this is for a query
        (user) => user["name"] === name
    );
};

const findUserByJob = (job) => {
    return users["users_list"].filter(      // filter since this is for a query
        (user) => user["job"] === job
    );
};

const findUserById = (id) =>           // find since this is for a specific one
    users["users_list"].find((user) => user["id"] === id);

const addUser = (user) => {
    users["users_list"].push(user);
    return user;
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

    let result = users["users_list"];

    if (name !== undefined) {
        let result1 = findUserByName(name);
        result = result && result1;
    }
    if (job !== undefined) {
        let result2 = findUserByJob(job);
        result = result && result2;
    }
    res.send({users_list: result});
});

app.post("/users", (req, res) => {
    let userToAdd;

    if (req.body.id) {
        userToAdd = req.body
        addUser(userToAdd);
    }

    else {
        userToAdd = {
            "id": generateId(),
            "name": req.body.name,
            "job": req.body.job
        }
        addUser(userToAdd)
    }

    res.status(201).send(userToAdd);
});


app.get("/users/:id", (req, res) => { //Specific link
    const id = req.params["id"]; //or req.params.id
    let result = findUserById(id);
    if (result === undefined) {
        res.status(404).send("Resource not found.");
    } else {
        res.send(result);
    }
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
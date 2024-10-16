// src/MyApp.jsx
import React, { useState, useEffect } from "react";
import Table from "./Table";
import Form from "./Form.jsx";

function MyApp() {
    const [characters, setCharacters] = useState([]);

    function removeOneCharacter(index) {
        const char = characters[index];

        const updated = characters.filter((character, i) => {
            return i !== index;
        });

        setCharacters(updated);

        const promise = fetch(`Http://localhost:8000/users/${char.id}`, {
            method: "DELETE",
        }).then();


    }

    function updateList(person) {
        postUser(person)
            .then((res) => {
                if (res.status != 201)
                    throw new Error("Failed to create person.");

                return res.json();
            })
            .then((json) => {
                setCharacters([...characters, json])
            })
            .catch((error) => {
                console.log(error);
            });
    }

    function fetchUsers() {
        const promise = fetch("http://localhost:8000/users");
        return promise;
    }

    function postUser(person) {
        const promise = fetch("Http://localhost:8000/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(person)
        });

        return promise;
    }

    useEffect(() => {
        fetchUsers()
            .then((res) => res.json())
            .then((json) => setCharacters(json["users_list"]))
            .catch((error) => {
                console.log(error);
            });
    }, []);


    return (
        <div className="container">
            <Table
                characterData={characters}
                removeCharacter={removeOneCharacter}
            />
            <Form
                handleSubmit={updateList}
            />
        </div>
    );
}

export default MyApp;
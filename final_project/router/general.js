const express = require('express');
const axios = require('axios');

let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

// Register New User
public_users.post("/register", (req, res) => {

    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).json({
            message: "Username and password are required"
        });
    }

    if (isValid(username)) {
        return res.status(404).json({
            message: "User already exists!"
        });
    }

    users.push({
        username: username,
        password: password
    });

    return res.status(200).json({
        message: "User successfully registered. Now you can login."
    });
});

// Get all books
public_users.get('/', function (req, res) {
    return res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book by ISBN
public_users.get('/isbn/:isbn', function (req, res) {

    const isbn = req.params.isbn;

    return res.status(200).json(books[isbn]);

});

// Get books by Author
public_users.get('/author/:author', function (req, res) {

    const author = req.params.author;

    const filteredBooks = Object.keys(books)
        .filter(key => books[key].author === author)
        .map(key => books[key]);

    return res.status(200).json(filteredBooks);

});

// Get books by Title
public_users.get('/title/:title', function (req, res) {

    const title = req.params.title;

    const filteredBooks = Object.keys(books)
        .filter(key => books[key].title === title)
        .map(key => books[key]);

    return res.status(200).json(filteredBooks);

});

// Get Book Review
public_users.get('/review/:isbn', function (req, res) {

    const isbn = req.params.isbn;

    return res.status(200).json(books[isbn].reviews);

});

// Async Get All Books
public_users.get("/async/books", async (req, res) => {

    try {

        const response = await axios.get("http://localhost:5000/");

        return res.status(200).json(response.data);

    } catch (err) {

        return res.status(500).json(err.message);

    }

});

// Async Get ISBN
public_users.get("/async/isbn/:isbn", async (req, res) => {

    try {

        const response = await axios.get(
            `http://localhost:5000/isbn/${req.params.isbn}`
        );

        return res.status(200).json(response.data);

    } catch (err) {

        return res.status(500).json(err.message);

    }

});

// Async Get Author
public_users.get("/async/author/:author", async (req, res) => {

    try {

        const response = await axios.get(
            `http://localhost:5000/author/${req.params.author}`
        );

        return res.status(200).json(response.data);

    } catch (err) {

        return res.status(500).json(err.message);

    }

});

// Async Get Title
public_users.get("/async/title/:title", async (req, res) => {

    try {

        const response = await axios.get(
            `http://localhost:5000/title/${req.params.title}`
        );

        return res.status(200).json(response.data);

    } catch (err) {

        return res.status(500).json(err.message);

    }

});

module.exports.general = public_users;
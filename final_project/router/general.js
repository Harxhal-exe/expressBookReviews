const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const doesExist = (username) => {
        let usersWithSameName = users.filter((user) => {
            return user.username === username;
        });

        if (usersWithSameName.length > 0) {
            return true;
        } else {
            return false;
        }
    }

    if (username && password) {
        if (!doesExist(username)) {
            users.push({ "username": username, "password": password });
            res.status(200).json({ message: "User successfully registered. Now you can login" });
        } else { res.status(404).json({ message: "User already exists!" }); }
    }
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (isbn < 1 || isbn > 10) {
        return res.status(300).json({ message: "No book found" });
    } else {
        res.send(books[isbn]);
    }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author.toLowerCase();
    const filteredBooks = Object.values(books).filter(book => book.author.toLowerCase() === author);

    if (filteredBooks.length === 0) {
        return res.status(404).json({ message: "Author not found" });
    } else {
        return res.status(200).json(filteredBooks);
    }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title.toLowerCase();
    const filteredBooks = Object.values(books).filter(book => book.title === title);

    if (filteredBooks.length === 0) {
        return res.status(404).json({ message: "Title not found" });
    } else {
        return res.status(200).json(filteredBooks);
    }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    const reviews = books[isbn].reviews;

    if (Object.values(reviews).length === 0) {
        return res.status(300).json({ message: "No reviews available for this book" });
    } else {
        return res.status(200).json(reviews);
    }
});

module.exports.general = public_users;

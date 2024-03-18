const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { 
    return users.find(user => user.username === username) ? true : false;
}

const authenticatedUser = (username, password) => { 
    return users.find(user => (user.username === username && user.password === password)) ? true : false;
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if(username && password) {
        if(authenticatedUser(username, password)) {
            const accessToken = jwt.sign({
                data: password
            }, 'access', { expiresIn: 60 * 60 });
          
            req.session.authorization = {
                accessToken,username
            }

            return res.status(200).send(`User ${username} successfully logged in`);
        } else {
            return res.status(208).json({message: "Invalid Login. Check username and password"});
        }
    } else {
        return res.status(404).json({message: "Error logging in"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const book = books[isbn];
    const user = req.session.authorization.username;

    if(!book) {
        return res.status(204).json({message: `Book with ${isbn} wasn't found`});  
    } else {
        books[isbn]["reviews"][user] = req.query.review;
        return res.status(200).json({message: "Review was submitted"});
    }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const book = books[isbn];
    const user = req.session.authorization.username;

    if(!book) {
        return res.status(204).json({message: `Book with ${isbn} wasn't found`});  
    } else {
        delete books[isbn]["reviews"][user];
        return res.status(200).json({message: "Review was deleted"});
    }
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

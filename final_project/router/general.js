const express = require('express');

let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const getBooks = () => {
    return new Promise(resolve => {
        setTimeout(() => resolve(books), 1000);
    });
}

const getBookByIsbn = (isbn) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const book = books[isbn];
            if(!book) {
                reject(new Error(`Book with ISBN ${isbn} wasn't found`));
            } else {
                resolve(book)
            }
        }, 1000);
    });
}

const getBookByAuthor = (author) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const author_books = Object.values(books).filter(book => book.author.toLowerCase() === author);
            if(!author_books.length) {
                reject(new Error(`Books written by ${author} weren't found`));
            } else {
                resolve(author_books)
            }
        }, 1000);
    });
}

const getBookByTitle = (title) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const books_title = Object.values(books).filter(book => book.title.toLowerCase() === title);
            if(!books_title.length) {
                reject(new Error(`Books with title ${title} weren't found`));
            } else {
                resolve(books_title)
            }
        }, 1000);
    });
}

public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if(username && password) {
        if(!isValid(username)) { 
            users.push({"username":username,"password":password});
            return res.status(200).json({message: `User ${username} successfully registred. Now you can login`});
        } else {
            return res.status(404).json({message: `User ${username} already exists!`});    
        }
    } else {
        return res.status(204).json({message: "No username or password"});    
    }
});

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
    try {
        const result = await getBooks();
        return res.status(200).json({message: JSON.stringify(result)});
    } catch{e} {
        res.status(400).json({message: e.message});  
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
    const isbn = req.params.isbn;
    try {
        const book = await getBookByIsbn(isbn);
        return res.status(200).json({message: JSON.stringify(book)});
    } catch(e) {
        return res.status(400).json({message: e.message});  
    }
 });
  
// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
    const author = req.params.author.toLowerCase();
    try {
        const result = await getBookByAuthor(author);
        return res.status(200).json({message: JSON.stringify(result)});
    } catch(e) {
        return res.status(400).json({message: e.message});  
    }
});

// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
    const title = req.params.title.toLowerCase();
    try {
        const result = await getBookByTitle(title);
        return res.status(200).json({message: JSON.stringify(result)});
    } catch(e) {
        return res.status(400).json({message: e.message});  
    }
});

//  Get book review
public_users.get('/review/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if(!book) {
        return res.status(204).json({message: `Book with ${isbn} wasn't found`});  
    } else {
        return res.status(200).json({message: JSON.stringify(book["reviews"])});
    }
});

module.exports.general = public_users;

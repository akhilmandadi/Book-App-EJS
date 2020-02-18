//import express module 
var express = require('express');
//create  an express app
var app = express();
//require express middleware body-parser
var bodyParser = require('body-parser');
//require express session
var session = require('express-session');
var cookieParser = require('cookie-parser');

//set the view engine to ejs
app.set('view engine', 'ejs');
//set the directory of views
app.set('views', './views');
//specify the path of static directory
// eslint-disable-next-line no-undef
app.use(express.static(__dirname + '/public'));

//use body parser to parse JSON and urlencoded request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//use cookie parser to parse request headers
app.use(cookieParser());
//use session to store user data between HTTP requests
app.use(session({
    secret: 'cmpe_273_secure_string',
    resave: false,
    saveUninitialized: true
}));

//Only user allowed is admin
var Users = [
    { "username": "admin", "password": "admin" },
    { "username": "q", "password": "q" },
    { "username": "akhil", "password": "akhil" }
];
//By Default we have 3 books
var books = [
    { "BookID": "1", "Title": "Book 1", "Author": "Author 1" },
    { "BookID": "2", "Title": "Book 2", "Author": "Author 2" },
    { "BookID": "3", "Title": "Book 3", "Author": "Author 3" }
]
//route to root
app.get('/', function (req, res) {
    //check if user session exits
    if (req.session.user) {
        res.render('home', {
            books: books,
            error: ""
        });
    } else
        res.render('login', { "error": "" });
});

app.get('/login', function (req, res) {
    //check if user session exits
    if (req.session.user) {
        res.render('home', {
            books: books,
            error: ""
        });
    } else
        res.render('login', { "error": "" });
});

app.post('/login', function (req, res) {
    console.log("Inside Login Post Request");
    console.log("Req Body : ", req.body);
    let authenticate = () => {
        let isValidUser = false;
        Users.filter(user => {
            if (user.username === req.body.username && user.password === req.body.password) {
                req.session.user = user;
                isValidUser = true;
            }
        });
        return isValidUser;
    }
    if (authenticate()) {
        res.render('home', {
            books: books,
            error: ""
        });
    } else {
        res.render('login', { "error": "Invalid Username or Password" });
    }
});

app.get('/home', function (req, res) {
    if (!req.session.user) {
        res.redirect('/');
    } else {
        console.log("Session data : ", req.session);
        res.render('home', {
            books: books,
            error: ""
        });
    }
});

app.get('/create', function (req, res) {
    if (!req.session.user) {
        res.redirect('/');
    } else {
        res.render('create', {
            error: ""
        });
    }
});

app.post('/create', function (req, res) {
    console.log("Inside Create Post Request");
    console.log("Req Body : ", req.body);
    let createBook = () => {
        let isBookIdPresent = false;
        books.filter(book => {
            if (book.BookID === req.body.bookId) {
                isBookIdPresent = true;
            }
        });
        if (isBookIdPresent) {
            return false;
        } else {
            let newBook = {
                "BookID": req.body.bookId,
                "Title": req.body.title,
                "Author": req.body.author
            };
            books.push(newBook);
            return true;
        }
    }
    if (createBook()) {
        res.render('home', {
            books: books,
            error: "Book Created Successfully...!"
        });
    } else {
        res.render('create', { "error": "Book with Id " + req.body.bookId + " already Exists" });
    }
});

app.get('/delete', function (req, res) {
    console.log("Session Data : ", req.session.user);
    if (!req.session.user) {
        res.redirect('/');
    } else {
        res.render('delete', {
            error: ""
        });
    }
});

app.post('/delete', function (req, res) {
    console.log("Inside Delete Post Request");
    console.log("Req Body : ", req.body);
    let deleteBook = () => {
        let isBookDeleted = false;
        let newBooks = [];
        books.filter(book => {
            if (book.BookID !== req.body.bookId) {
                newBooks.push(book);
            } else {
                isBookDeleted = true;
            }
        });
        books = [...newBooks];
        return isBookDeleted;
    }
    if (deleteBook()) {
        res.render('home', {
            books: books,
            error: "Book Deleted Successfully...!"
        });
    } else {
        res.render('delete', { "error": "Book with Id: " + req.body.bookId + " doesn't exist" });
    }
})

app.get('*', function (req, res) {
    //check if user session exits
    if (req.session.user) {
        res.render('home', {
            books: books,
            error: ""
        });
    } else
        res.render('login', { "error": "" });
});

var server = app.listen(3000, function () {
    console.log("Server listening on port 3000");
});
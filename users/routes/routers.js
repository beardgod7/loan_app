const express = require('express');
const multer = require('multer');
const bcrypt = require('bcrypt')
const validator = require('validator')
const pool =require('../drive');
const bodyParser = require('body-parser');
const app = express()
const session = require('express-session');
const Producer = require("../producer");
const config = require("../amqpconfig");
const amqp = require("amqplib");
const producer = new Producer();

app.use(bodyParser.json("application/json"));

// Set up session middleware
app.use(session({
  secret: 'francis1122', // secret used to sign the session ID cookie
  resave: false, // save the session even if it wasn't modified during the request
  saveUninitialized: false // don't save a session that hasn't been initialized
}));

const storage = multer.memoryStorage();

//Create the multer upload instance with the updated storage
const upload = multer({ storage });

// Add middleware to handle file uploads
app.use(upload.single('file'));


app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.urlencoded({extended: false}))

//middleware for parsing
app.use(bodyParser.json())

app.post('/login', async (req, res) => {
  const User3 = await pool.query("SELECT email,user_name FROM customers WHERE email = $1", [req.body.email]);
  const user = await pool.query("SELECT email,user_name FROM customers WHERE email = $1", [req.body.email]);
  const user1 = await pool.query("SELECT email,user_name FROM customers WHERE email = $1", [req.body.email]);
  const User = await pool.query("SELECT email, password FROM customers WHERE email = $1", [req.body.email]);
  const user2 = await pool.query("SELECT surname,other_name,user_name,email,address,phone_number FROM customers WHERE email = $1", [req.body.email]);
  // check if user exists
  if (!User.rows[0]) {
    res.render('login', { error: 'user does not exist' });
  }

  const valid = await bcrypt.compare(req.body.password, User.rows[0].password)
  if (!valid) { 
    res.render('login', { error: 'wrong password' });
  }
  
  req.session.User3 = {
    email: User3.rows[0].email,
    password: User3.rows[0].password
  };

  req.session.User = {
    email: User.rows[0].email,
    password: User.rows[0].password
  };
  req.session.user = {
    email: user.rows[0].email,
    user_name: user.rows[0].user_name
  };

  req.session.user1 = {
    email: user1.rows[0].email,
    user_name: user1.rows[0].user_name
  };
  
  req.session.user2 = {
    surname: user2.rows[0].surname,
    other_name: user2.rows[0].other_name,
    user_name: user2.rows[0].user_name,
    email: user2.rows[0].email,
    address: user2.rows[0].address,
    phone_number: user2.rows[0].phone_number
  };

  res.redirect('/dashboard')
})


//showing the login page on the browser
app.get('/login', (req, res)=>{
    res.render('login.ejs')
  })

  app.get('/home', (req, res)=>{
    res.render('landin.ejs')
  })

  //showing the registration page on browser
  app.get('/register', (req, res)=>{
    res.render('register.ejs')
  })

async function verifyPassword(req,res,next) {
  const user = req.session.User;

  // Check if user is logged in
  if (!user) {
    // User is not logged in, redirect to the login page
    res.redirect('/login');
    return;
  }

  // User is logged in, proceed to the next middleware or route handler
  next();
}

async function add (newUser){   
    try {
      await pool.query("INSERT INTO customers (surname,other_name,user_name,email,address,phone_number, password, confirm_password ) VALUES ($1, $2, $3, $4, $5, $6, $7,$8)", [newUser.surname,newUser.other_name, newUser.user_name, newUser.email, newUser.address, newUser.phone_number,newUser.password,newUser.confirm_password]);
      console.log('user added sucessfully')
    } catch (error) {  
      throw  new Error('user_name or email already exist');
    }
  }
  app.post('/register', async(req, res) => {
    try {
       //validate if email is in correct format
    if (!validator.isEmail(req.body.email)) {
        res.render('register', { error: 'Invalid email format' });
        //compare passwords
      } else if (req.body.password !== req.body.confirm_password) {
        res.render('register', { error: 'Passwords do not match' });
        // validating username
      } else {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const hashedConfirmPassword = await bcrypt.hash(req.body.confirm_password, 10);
        const newUser = {
          surname: req.body.surname,
          other_name: req.body.other_name,  
          user_name: req.body.user_name,
          email: req.body.email,
          address: req.body.address,
          phone_number: req.body.phone_number,
          password: hashedPassword,
          confirm_password: hashedConfirmPassword 
        };
        // func to collect the details and send to database 
        await add(newUser);
      }
    } catch (error) {
      res.render('register', { error: error.message });
      //res.status(500).send(error.message);
      //res.render('register', { error: res.status(500).send(error.message) });
    return;
    // Handle the error here, for example by sending a response back to the client
    }
    // to redirect back to login page after user submit registration page
    res.redirect('/login');
  })
  
  app.get('/dashboard',verifyPassword,async (req, res, next) => {
    // Retrieve user information from session
    const user111 = req.session.user;
  
    // Check if user is logged in
    if (!user111) {
      res.redirect('/login');
      return;
    }
  
    res.render('dashboard', { user111 })
    //res.render('dashboard.ejs'); 
  });

  


  app.get('/account', verifyPassword ,async (req, res, next)=>{
    const user22 = req.session.user2;
    res.render('account.ejs', { user22 })
  })


app.post('/upload', async(req, res) => {
  // Check if a file was uploaded
  if (!req.file) {
    res.status(400).json({ error: 'No file uploaded' });
    return;
  }

  // Get the file information from the request
  const file_name = req.file.originalname;
  const file_type = req.file.mimetype;
  const file_content = req.file.buffer;
  //const upload_date = req.file.date()

  

  // Get the username from the session or request payload
  const user_name = req.session.user1.user_name; // Adjust the property name as per your user object structure
  const upload_date = new Date()
  // Save the file content in PostgreSQL
  const query = 'INSERT INTO customers_document (user_name, file_name, file_type, file_content, upload_date) VALUES ($1, $2, $3, $4, $5)';
  const values = [user_name, file_name, file_type, file_content, upload_date];
  await pool.query(query, values)
    .then(() => {
      // Send a success response
      res.status(200).json({ file_name, file_type });
    })
    .catch((error) => {
      // Handle the error
      console.error('Error saving file content:', error);
      res.status(500).json({ error: 'Failed to save file content' });
    });
});
app.get ('/profile', verifyPassword,async(req,res)=>{
  res.render('profile')
})

app.post("/loanRequest", async (req, res, next) => {
   
  const logType   = req.body.loantype;
  const message = req.body.amount;
  const email = req.session.User3.email;
  await producer.publishMessage(logType, message,email);
  res.redirect('/dashboard');
});

module.exports= app;

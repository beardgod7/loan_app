const express = require('express');
const multer = require('multer');
const bcrypt = require('bcrypt')
const validator = require('validator')
const pool =require('../drive');
const bodyParser = require('body-parser');
const app = express()
const session = require('express-session');
const config = require("../amqpconfig");
const amqp = require("amqplib");


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

app.get('/admin', async (req, res)=>{
    res.render('admin.ejs')
  })


//step 1 : Connect to the rabbitmq server
//step 2 : Create a new channel
//step 3 : Create the exchange
//step 4 : Create the queue
//step 5 : Bind the queue to the exchange
//step 6 : Consume messages from the queue

//step 1 : Connect to the rabbitmq server
//step 2 : Create a new channel
//step 3 : Create the exchange
//step 4 : Create the queue
//step 5 : Bind the queue to the exchange
//step 6 : Consume messages from the queue

async function consumeMessages() {
  const connection = await amqp.connect(config.rabbitMQ.url);
  const channel = await connection.createChannel();

  await channel.assertExchange("loanRequest", "direct");

  const q = await channel.assertQueue("grade_one");

  await channel.bindQueue(q.queue, "loanRequest", "one");

  channel.consume(q.queue, (msg) => {
    const data = JSON.parse(msg.content);
    console.log(data);
    channel.ack(msg);
  });
}



async function consumeMessages2() {
  const connection = await amqp.connect(config.rabbitMQ.url);
  const channel = await connection.createChannel();

  await channel.assertExchange("loanRequest", "direct");

  const q = await channel.assertQueue("grade_two");

  await channel.bindQueue(q.queue, "loanRequest", "two");

  channel.consume(q.queue, (msg) => {
    const data = JSON.parse(msg.content);
    console.log(data);
    channel.ack(msg);
  });
}

async function consumeMessages3() {
  const connection = await amqp.connect(config.rabbitMQ.url);
  const channel = await connection.createChannel();
  
  await channel.assertExchange("loanRequest", "direct");

  const q = await channel.assertQueue("grade_three");

  await channel.bindQueue(q.queue, "loanRequest", "three");

  channel.consume(q.queue, async (msg) => {
    const data = JSON.parse(msg.content);
   
    // Extract values from the `data` object
    const { logType, message, dateTime ,email } = data;
    await pool.query('INSERT INTO loans (logType, message, dateTime, email) VALUES ($1, $2, $3, $4)',
      [data.logType, data.message, new Date(data.dateTime),data.email]);
    console.log(JSON.stringify(data));
    channel.ack(msg);
  });
  
}
consumeMessages3();

consumeMessages()
consumeMessages2()
module.exports= app;


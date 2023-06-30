const express = require('express')
const amqp = require("amqplib");
//const {engine} = require('express-handlebars')
//const path = require('path')
const routes = require('./routes/routers')
const bcrypt = require('bcrypt')
const bodyParser = require('body-parser');
const app = express();
//middle ware to accept input as json
app.use(bodyParser.json())
//middle ware to accept input as string or array from form
app.use(express.urlencoded({extended: false}))
// to render doc as html format
//app.engine('handlebars', engine({ defaultLayout: 'main', extname:'.handlebars'}));
app.set('view engine', 'ejs');
//app.use(express.static(path.join(__dirname, 'public')))
//app.set('views', './views');
app.use('/',routes)
app.use('/routers', routes)
app.use('/routers', routes)
app.use('/routers', routes)
app.use('/routers', routes)
app.use('/routers', routes)
app.use('/routers', routes)
app.use('/routers', routes)
app.use('/routers', routes)
app.use('/routers', routes)
app.use('/routers', routes)
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));
app.listen(5000,()=>{
    console.log('connected sucessfully')
})

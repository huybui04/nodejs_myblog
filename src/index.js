const path = require('path');
const express = require('express');
const morgan = require('morgan');
const { engine } = require ('express-handlebars');
const app = express();
const port = 3000;

const route =  require('./routes'); 

app.use(express.static(path.join(__dirname, 'public')));

// HTTP logger
app.use(morgan('combined'));

// Template engine
app.engine('hbs', engine({
  extname: '.hbs',
  defaultLayout: 'main', 
  layoutsDir: path.join(__dirname, 'resources/views/layouts'),
  partialsDir  : [
      //  path to your partials
      path.join(__dirname, 'resources/views/partial'),
  ]
}));
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'resources/views'));

// console.log('path:',__dirname);

// Routes init
route(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
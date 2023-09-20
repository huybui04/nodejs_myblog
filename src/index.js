const path = require('path');
const express = require('express');
const morgan = require('morgan'); 
const methodOverride = require('method-override'); 
const { engine } = require('express-handlebars');
const cookieParser = require('cookie-parser');

const SortMiddleware = require('./app/middlewares/SortMiddleware');

const route =  require('./routes'); 
const db = require('./config/db')

const app = express();
const port = 3000;

// Connect to DB
db.connect();

// USE static folder
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  express.urlencoded({
    extended : true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.use(methodOverride('_method'))

// Custom middlewares
app.use(SortMiddleware);

// HTTP logger
app.use(morgan('combined'));

// Template engine
app.engine('hbs', engine({
  extname: '.hbs',
  helpers: {
    sum: (a,b) => a + b,
    sortable: (field, sort) => {
      const sortType = field === sort.column ? sort.type : 'default';

      const icons = {
        default: '<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 320 512"><path d="M137.4 41.4c12.5-12.5 32.8-12.5 45.3 0l128 128c9.2 9.2 11.9 22.9 6.9 34.9s-16.6 19.8-29.6 19.8H32c-12.9 0-24.6-7.8-29.6-19.8s-2.2-25.7 6.9-34.9l128-128zm0 429.3l-128-128c-9.2-9.2-11.9-22.9-6.9-34.9s16.6-19.8 29.6-19.8H288c12.9 0 24.6 7.8 29.6 19.8s2.2 25.7-6.9 34.9l-128 128c-12.5 12.5-32.8 12.5-45.3 0z"/></svg>',
        asc: '<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512"><path d="M151.6 42.4C145.5 35.8 137 32 128 32s-17.5 3.8-23.6 10.4l-88 96c-11.9 13-11.1 33.3 2 45.2s33.3 11.1 45.2-2L96 146.3V448c0 17.7 14.3 32 32 32s32-14.3 32-32V146.3l32.4 35.4c11.9 13 32.2 13.9 45.2 2s13.9-32.2 2-45.2l-88-96zM320 480h32c17.7 0 32-14.3 32-32s-14.3-32-32-32H320c-17.7 0-32 14.3-32 32s14.3 32 32 32zm0-128h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H320c-17.7 0-32 14.3-32 32s14.3 32 32 32zm0-128H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H320c-17.7 0-32 14.3-32 32s14.3 32 32 32zm0-128H544c17.7 0 32-14.3 32-32s-14.3-32-32-32H320c-17.7 0-32 14.3-32 32s14.3 32 32 32z"/></svg>',
        desc: '<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512"><path d="M151.6 469.6C145.5 476.2 137 480 128 480s-17.5-3.8-23.6-10.4l-88-96c-11.9-13-11.1-33.3 2-45.2s33.3-11.1 45.2 2L96 365.7V64c0-17.7 14.3-32 32-32s32 14.3 32 32V365.7l32.4-35.4c11.9-13 32.2-13.9 45.2-2s13.9 32.2 2 45.2l-88 96zM320 480c-17.7 0-32-14.3-32-32s14.3-32 32-32h32c17.7 0 32 14.3 32 32s-14.3 32-32 32H320zm0-128c-17.7 0-32-14.3-32-32s14.3-32 32-32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H320zm0-128c-17.7 0-32-14.3-32-32s14.3-32 32-32H480c17.7 0 32 14.3 32 32s-14.3 32-32 32H320zm0-128c-17.7 0-32-14.3-32-32s14.3-32 32-32H544c17.7 0 32 14.3 32 32s-14.3 32-32 32H320z"/></svg>'
      }
      
      const types = {
        default: 'desc',
        asc: 'desc',
        desc: 'asc',
      }

      const icon = icons[sortType];
      const type = types[sortType];

      return  `<a href="?_sort&column=${field}&type=${type}">
        ${icon}
      </a>`
    },
    previousCheck: (current) => {
      if (current === 1) {
        return `<li class="page-item disabled"><a class="page-link" href="?page=${current -1 }">Previous</a></li>`
      } else {
        return `<li class="page-item"><a class="page-link" href="?page=${current - 1}">Previous</a></li>`
      }
    },
    nextCheck: (current, pages) => {
      if (current === pages) {
        return `<li class="page-item disabled"><a class="page-link" href="?page=${current + 1}">Next</a></li>`
      } else {
        return `<li class="page-item"><a class="page-link" href="?page=${current + 1}">Next</a></li>`
      }s
    },
    pagination: (currentPage, totalPage, size, options) => {
      var startPage, endPage, context;

      if (arguments.length === 3) {
        options = size;
        size = 5;
      }
    
      startPage = currentPage - Math.floor(size / 2);
      endPage = currentPage + Math.floor(size / 2);
    
      if (startPage <= 0) {
        endPage -= (startPage - 1);
        startPage = 1;
      }
    
      if (endPage > totalPage) {
        endPage = totalPage;
        if (endPage - size + 1 > 0) {
          startPage = endPage - size + 1;
        } else {
          startPage = 1;
        }
      }
    
      context = {
        startFromFirstPage: false,
        pages: [],
        endAtLastPage: false,
      };
      if (startPage === 1) {
        context.startFromFirstPage = true;
      }
      for (var i = startPage; i <= endPage; i++) {
        context.pages.push({
          page: i,
          isCurrent: i === currentPage,
        });
      }
      if (endPage === totalPage) {
        context.endAtLastPage = true;
      }
    
      return options.fn(context);
    },
    searchFoundCheck: searchFound => {
      if (searchFound === false) 
      return `<img class="search-not-found-img" src="https://img.freepik.com/premium-vector/search-result-find-illustration_585024-17.jpg" alt="">`
    }
  },
  defaultLayout: 'main', 
  layoutsDir: path.join(__dirname, 'resources/views/layouts'),
  partialsDir  : [
      //  path to your partials
      path.join(__dirname, 'resources/views/partial'),
  ]
}));
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'resources', 'views'));

// console.log('path:',__dirname);

// Routes init
route(app);

app.listen(port, () => {
  console.log(`App app listening on port ${port}`)
})
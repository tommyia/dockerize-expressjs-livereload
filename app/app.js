var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var livereload = require('livereload')
var connectLivereload = require('connect-livereload')

let session = require('express-session')
var RedisStore = require('connect-redis')(session)
var redis = require('redis')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

if (process.env.NODE_ENV === 'development') {
  var liveReloadServer = livereload.createServer()
  liveReloadServer.watch(path.join(__dirname, 'public'))
  liveReloadServer.server.once('connection', () => {
    console.log('here');
    setTimeout(() => {
      liveReloadServer.refresh('/')
    }, 100)
  })

  // Change src base url to container ip address
  // How to check container ip address https://www.freecodecamp.org/news/how-to-get-a-docker-container-ip-address-explained-with-examples/
  // Hard refresh browser if needed
  app.use(connectLivereload({
    port: '35792',
    src: `http://192.168.240.3:35729/livereload.js?snipver=1`,
  }));
}
var redisClient = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST)
redisClient.on('connect', function () {
  console.log('Connected to Redis')
})

redisClient.on('error', function (err) {
  console.log('Redis error: ' + err)
})

app.use(session({
  store: new RedisStore({
      client: redisClient
  }),
  secret: 'dago'
}))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

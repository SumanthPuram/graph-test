const express = require('express');

const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const apicache = require('apicache');
require('events').EventEmitter.defaultMaxListeners = 50;

const ENVIRONMENT = process.env.NODE_ENV
  ? process.env.NODE_ENV.toLowerCase()
  : 'development';

let cache = apicache.middleware;

const http = require('http').Server(app); // eslint-disable-line new-cap

const ogImageRouter = require('./routers/ogImageRouter');

app.set('port', process.env.PORT || 3002);
app.set('views', path.join(__dirname, '../views'));
// app.set('view engine', 'pug');
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.use(
  express.static(path.join(__dirname, '../public'), {
    maxAge: 31557600000
  })
);

app.use(cache('30 seconds'));
app.use('/ogimage', ogImageRouter);

// Server Start
if (!module.parent) {
  http.listen(app.get('port'), () =>
    console.log(
      'INFO: Server running on port %d in %s mode',
      app.get('port'),
      app.get('env')
    )
  );
}
module.exports = app;

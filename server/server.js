//=======================================================================//
//     Node packages                                                     //
//=======================================================================//

const fs = require('fs');
const path = require('path');
const Koa = require('koa');
const Router = require('koa-router');
const Logger = require('koa-logger');
const Cors = require('@koa/cors');
const BodyParser = require('koa-bodyparser');
const Helmet = require('koa-helmet');
const respond = require('koa-respond');
const koaStatic = require('koa-static');
const config = require('config');
const mongoose = require('mongoose');

const errorHandler = require('@lib/error_handler');

//=======================================================================//
//     Configs                                                           //
//=======================================================================//

// Get config (Config load according to NODE_ENV)
global.__config = config.get('App');

//=======================================================================//
//     MongoDB                                                           //
//=======================================================================//

const dbConfig = __config.db;
mongoose.connect(
  `mongodb://${dbConfig.host}:${dbConfig.port}/${dbConfig.name}`,
  { useNewUrlParser: true }
);

mongoose.connection.on('error', err => {
  console.error('Connection error to mongodb', err);
  process.exit(3);
});
mongoose.connection.once('open', function() {
  console.log(`Mongodb connected (port:${dbConfig.port}) [${__config.env}]`);
});

//=======================================================================//
//     Koa                                                               //
//=======================================================================//

const app = new Koa();
const router = new Router();

app.use(Helmet());

if (process.env.NODE_ENV === 'development') {
  app.use(Logger());
}

// Enable cors
app.use(Cors());

// Static files
app.use(koaStatic('./public'));

app.use(
  BodyParser({
    enableTypes: ['json'],
    jsonLimit: '5mb',
    strict: true,
    onerror: function(err, ctx) {
      ctx.throw('body parse error', 422);
    }
  })
);

// Error handler
app.use(errorHandler);

// Koa respond
app.use(respond());

// Validator
require('koa-validate')(app);

//=======================================================================//
//     Routes          		                                               //
//=======================================================================//

// Set API routes
router.prefix(`/${__config.server.routerPrefix}`);
fs.readdirSync('./routes')
  .filter(file => fs.statSync(path.join('./routes', file)).isDirectory())
  .forEach(routeName => {
    fs.readdirSync(`./routes/${routeName}`)
      .filter(file =>
        fs.statSync(path.join(`./routes/${routeName}`, file)).isFile()
      )
      .forEach(route => {
        const nestedRouter = require(`./routes/${routeName}/${route}`);
        router.use(
          `/${routeName}`,
          nestedRouter.routes(),
          nestedRouter.allowedMethods()
        );
      });
  });
app.use(router.routes());

module.exports = app;

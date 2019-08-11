require('dotenv').config()

const port = 3001;
// Express, require and initialize
const express = require('express')
const app = express()

//Body Parser requirements as a middleware
let bodyParser = require('body-parser');
var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(jsonParser);
app.use(urlencodedParser);


// session store config
var session = require('express-session');
let sessionStore = null;
if (process.env.NODE_ENV === 'development') {
    // use file store
    var FileStore = require('session-file-store')(session);
    sessionStore = new FileStore({
        path: "/home/mayur/Desktop/session_store",
        useAsync: true,
        reapInterval: 5000,
        maxAge: 24 * 60 * 60 * 1000
    })
} else {
    // use redis for session store
    let redis = require('redis')
    let redisStore = require("connect-redis")(session);
    let client = redis.createClient({
        host: process.env.redis_host,
        port: process.env.redis_port,
        password: process.env.redis_password
    })

    client.on('error', error => {
        console.error("Failed to init redis for session storage", error);
    })

    sessionStore = new redisStore({
        host: process.env.redis_host,
        port: process.env.redis_port,
        client: client,
        ttl: 86400
    })

}

// session config
app.use(session({
    secret: 'keyboard cat',
    store: sessionStore,
    resave: false,
    saveUninitialized: true,
    cookie: { 
        secure: true,
        expires: new Date(Date.now() + 3600000),
        maxAge: 3600000
    }
}))


// init mysql 
global.mysql = require('./util/db')();

// init routes
require('./routes')(app);

// init server
app.listen(port, () => console.log('server started on '+`${port}`));
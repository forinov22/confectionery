require('dotenv').config();
const express = require('express');
var cors = require('cors')
const routes = require('./routes');
const { specs, swaggerUi } = require('./config/swagger');
const expressSession = require('express-session');
const pgSession = require('connect-pg-simple')(expressSession);
const passport = require('./config/passport');
const cookieParser = require("cookie-parser");
const pool = require('./config/db');

const app = express();
const port = process.env.PORT || 3000;

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true
}

app.use(cors(corsOptions))
app.use(express.json());
app.use('/static', express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(expressSession({
    store: new pgSession({
        pool: pool,
        tableName: 'user_sessions',
        createTableIfMissing: true
    }),
    secret: 'my cookie secret key',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use('/api', routes);

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Internal server error!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

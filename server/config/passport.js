const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const pool = require('./db')
const bcrypt = require('bcrypt');


let roleFound = false;
let customerRole = null;

const findDefaultRole = async () => {
    const defaultRoleName = 'Customer'
    const defaultRole = await pool.query('SELECT * FROM user_roles WHERE name = $1', [defaultRoleName])

    if (defaultRole.rowCount === 0) {
        throw new Exception('Default role not found')
    }

    roleFound = true;
    customerRole = defaultRole;

    return defaultRole.rows[0];
}

const findUser = async (email) => {
    const userQuery = await pool.query('SELECT * FROM view_user_roles WHERE user_email = $1', [email])

    if (userQuery.rowCount === 0) {
        return null
    }

    let user = {
        id: userQuery.rows[0].user_id,
        email: userQuery.rows[0].user_email,
        password_hash: userQuery.rows[0].user_password_hash
    }

    let user_roles = [];

    userQuery.rows.forEach(row => {
        let role = {
            id: row.role_id,
            name: row.role_name,
            description: row.role_description
        }
        user_roles.push(role)
    });

    user.roles = user_roles;

    return user;
}

const findOrCreateUser = async (email) => {
    let user = await findUser(email)

    if (user) {
        return user;
    }

    const insertQuery = `
            INSERT INTO users (email)
            VALUES ($1)
            RETURNING id, email;
        `;

    const result = await pool.query(insertQuery, [email]);
    console.log('result from postgres ---> ', result)

    user = result.rows[0];

    if (roleFound) {
        user.roles = [defaultRole];
    } else {
        let role = await findDefaultRole();
        user.roles = [role];
    }


    return user;
};

passport.use(
    new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
        const user = await findUser(email);
        console.log('strategy------------------> ', user)

        if (!user) {
            return done(null, false, { message: 'Invalid credentials' })
        }

        bcrypt.compare(password, user.password_hash, (err, result) => {
            if (err) {
                return done(null, false, { message: 'Eternal server error!' })
            }

            if (result) {
                return done(null, { id: user.id, email: user.email, roles: user.roles });
            } else {
                return done(null, false, { message: 'Invalid credentials' })
            }
        });
    })
);

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/api/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails[0].value;
        console.log('email ---> ', email)
        console.log('before find or create')
        const user = await findOrCreateUser(email);

        return done(null, user);
    } catch (err) {
        return done(err, false);
    }
}));

passport.serializeUser((user, cb) => {
    console.log('serialize------------>')
    cb(null, { id: user.id, email: user.email, roles: user.roles });
});

passport.deserializeUser((user, cb) => {
    cb(null, user);
});

module.exports = passport;

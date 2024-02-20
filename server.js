const express = require('express');
const mongodb = require('./data/database');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const GitHubStrategy = require('passport-github2').Strategy;
require('dotenv').config();
const cors = require('cors');
const app = express();

const port = process.env.PORT || 3000;

app
  .use(bodyParser.json())
  .use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
  }))
  .use(passport.initialize())
  .use(passport.session())
  .use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Z-key, Authorization"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "POST, GET, PUT, PATCH, OPTIONS, DELETE"
    );
    next();
  })
  .use(cors({
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']
  }))
  .use('/', require('./routes/index.js'));

// Passport GitHub Strategy
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_SECRET,
  callbackURL: process.env.CALLBACK_URL
},
function(accessToken, refreshToken, profile, done) {
  // This is where you might save user information to your database
  // For example:
  // User.findOrCreate({ githubId: profile.id }, function (err, user) {
  //   return done(err, user);
  // });
  return done(null, profile);
}
));

// Serialize and deserialize user
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

// Example route to check user session
app.get('/', (req, res) => {
  res.send(req.session.user ? `Logged in as ${req.session.user.displayName}` : 'Logged out');
});

// GitHub authentication callback route
app.get('/github/callback', passport.authenticate('github', {
  failureRedirect: '/api-docs', session: false
}), (req, res) => {
  req.session.user = req.user;
  res.redirect('/');
});

// Initialize MongoDB connection
mongodb.initDb((err) => {
  if (err) {
    throw err;
  } else {
    // Start listening on the specified port
    app.listen(port, () => {
      console.log(`Database is listening, and node is running on port ${port}`);
    });
  }
});
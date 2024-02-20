const router = require("express").Router();
const passport = require('passport');

router.use('/', require('./swagger'));

router.get('/login', passport.authenticate('github'));

router.get('/github/callback',
  passport.authenticate('github', { failureRedirect: '/api-docs', session: false }),
  (req, res) => res.redirect('/')
);

router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect('/');
  });
});

router.get("/", (req, res) => {
  res.send("Welcome to Africa");
});
router.use("/", require("./swagger"));
router.use("/site", require("./site"));

module.exports = router;

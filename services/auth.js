const passport = require("passport");

module.exports = {
  login: function(req, res, next) {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(422).json({
        error: "Email and password is required"
      });
    }
    req.body.user = { email, password };
    return passport.authenticate(
      "local",
      { session: true },
      (err, user, info) => {
        if (err) {
          return next(err);
        }
        if (user) {
          req.login(user, function () {
            return res.json({
              status: 'success',
              user: user.email
            });
          });
          return;
        }
        return res.status(400).send(info);
      }
    )(req, res, next);
  },

  isLoggedIn : function (req, res, next) {
    console.log('req usr', req.user)
    if (req.isAuthenticated()) {
      return next();
    } else {
      return res.status(400).send({ status: 'success', message: 'User not logged in' });
    } 
  },

  logout: function(req, res) {
    req.logout();
    res.status(200).send({ message: "User logged out" });
  }
}
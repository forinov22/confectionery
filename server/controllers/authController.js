const passport = require("passport");

const getUserSession = (req, res) => {
  if (req.user) {
    return res.json({
      id: req.user.id,
      email: req.user.email,
    });
  } else {
    return res.sendStatus(401);
  }
};

const loginLocal = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return res.status(500).json({ message: "Internal server error" });
    }
    if (!user) {
      return res.status(401).json({ message: info.message || "Unauthorized" });
    }
    req.login(user, (err) => {
      if (err) {
        return res.status(500).json({ message: "Login failed" });
      }
      return res.status(200).json({ message: "Authenticated", user });
    });
  })(req, res, next);
};

const googleAuth = (req, res) => {
  // get redirected here from frontend
};

const googleAuthCallback = (req, res) => {
  const user = req.user;
  // console.log('google auth callback user ---> ', user)
  // redirect back to frontend
  res.redirect("http://localhost:3000");
};

module.exports = {
  getUserSession,
  loginLocal,
  googleAuth,
  googleAuthCallback,
};

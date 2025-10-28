// middleware/auth.js
exports.isAdmin = (req, res, next) => {
  if (!req.session.user || req.session.user.userType !== "admin") {
    return res.status(403).send("Access denied: Admins only");
  }
  next();
};

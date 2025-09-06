const user = require("../models/user");

exports.getAbout = (req, res, next) => {
    console.log("Session User:", req.session.user);
    const toastMessage = req.session.toastMessage;
    req.session.toastMessage = null; // Clear the toast message after displaying it
    res.render("store/home", {
          pageTitle: "About User",
          currentPage: "AboutUser",
          IsLoggedIn: true,
          user: req.session.user || {},
          toastMessage: toastMessage,
        });
};

exports.getIndex = (req, res, next) => {
    const user = req.session.user;
    if(!user)
    {
        req.session.toastMessage = {type: 'success', text: 'Please Log in first to continue!.'};
        const toastMessage = req.session.toastMessage;
        req.session.toastMessage = null; // Clear the toast message after displaying it
        res.render("store/HomePage", {
          pageTitle: "Home Page",
          currentPage: "HomePage",
          IsLoggedIn: false,
          user: {},
          toastMessage: toastMessage,
        });
    }
    const toastMessage = req.session.toastMessage;
    req.session.toastMessage = null; // Clear the toast message after displaying it
    res.render("store/index", {
          pageTitle: "Index Page",
          currentPage: "IndexPage",
          IsLoggedIn: req.session.IsLoggedIn || false,
          user: req.session.user || {},
          toastMessage: toastMessage,
          userType: user ? user.userType : '',
        });
}

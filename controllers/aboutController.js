
exports.getAbout = (req, res, next) => {
    console.log("Session User:", req.session.user);
    const userType = req.session.user.userType;
    console.log("User Type:", userType);
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


exports.getAbout = (req, res, next) => {
    res.render('auth/teacher', 
    {
        pageTitle: "About Us",
        currentPage: "About",
        IsLoggedIn: req.session.isLoggedIn || false,
        toastMessage: req.session.toastMessage || '',
        activeTab: 'about',
    });
};


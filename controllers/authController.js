const { check, validationResult } = require("express-validator");

const bcrypt = require("bcryptjs");
const User = require("../models/user");
const e = require("express");
const { name } = require("ejs");

exports.getHomePage = async(req,res,next)=>
{
    res.render('store/HomePage',{
      pageTitle: 'HomePage',
      currentPage: 'HomePage',
      IsLoggedIn: req.body.IsLoggedIn
    });
}

exports.getLogIn = (req, res, next) => {

  const { userType } = req.query;
  if (!userType) {
    res.send("User type is required");
    return;
  }
  if (userType && userType === 'teacher') {
  res.render("auth/loginTeacher", {
    pageTitle: "Login Page",
    currentPage: "Login",
    IsLoggedIn: false,
    error: [],
    oldInput: {
      email: '',
      password: ''
    },
    user: {},
    toastMessage: req.session.toastMessage || '',
})
}
else if (userType && userType === 'student') {
  res.render("auth/loginStudent", {
    pageTitle: "Login Page",
    currentPage: "Login",
    IsLoggedIn: false,
    error: [],
    oldInput: {
      email: '',
      password: ''
    },
    user: {},
    toastMessage: req.session.toastMessage || '',
})
}
else if (userType && userType === 'admin') {
  res.render("auth/loginAdmin", {
    pageTitle: "Login Page",
    currentPage: "Login",
    IsLoggedIn: false,
    error: [],
    oldInput: {
      email: '',
      password: ''
    },
    user: {},
    toastMessage: req.session.toastMessage || '',
})
}
}
exports.postLogIn = async (req, res, next) => {

  const { email, password } = req.body;
  const user = await User.findOne({ email: email })
  {
    if (!user) {
      return res.status(401).render("auth/login", {
        pageTitle: "Login Page",
        currentPage: "Login",
        IsLoggedIn: false,
        error: ["Invalid email or password"],
        oldInput: {
          email: email,
          password: password
        },
        user: {},
        loginMessage: req.session.loginMessage || ''
      });
    }
    else{
      const doMatch = await bcrypt.compare(password, user.password)
    if (!doMatch) {
      return res.status(401).render("auth/login", {
        pageTitle: "Login Page",
        currentPage: "Login",
        IsLoggedIn: false,
        error: ["Invalid password"],
        oldInput: {
          email: email,
          password: password,
        },
        user: {},
        loginMessage: ""
      });
    }
    else
    {
      console.log("User logged in successfully");
      req.session.IsLoggedIn = true;
      req.session.user = User; // Store the user in the session
      req.session.loginMessage = "You have logged in successfully!";
      await req.session.save();
      res.render("auth/LoggedInUser",{
        pageTitle: "Logged In User",
        currentPage: "LoggedInUser",
        IsLoggedIn: true,
        user: user,
        loginMessage: true 
      })
    }
  }
}
};
  //res.cookie("IsLoggedIn",true);  // cookies res ke sath jayegi or client ke server
  //req.session.IsLoggedIn = true;          // me store ho jayegi 
  // get method with index page) ki request gayi localhost ko with cookie == "IsLoggedIn",true on browser

exports.postLogOut = (req, res, next) => {
  //res.cookie("IsLoggedIn",false);
  req.session.destroy(() => {
    res.redirect('/login')
  });
};


exports.getSignUp = (req, res, next) => {

  const {userType} = req.query;
  if(!userType)
  {
    res.send("User type is required");
    return;
  }
  if(userType && userType === 'teacher') 
  {
  res.render("auth/signupTeacher", {
    pageTitle: "Sign Page",
    currentPage: "signup",
    IsLoggedIn: false,
    error: [],
    oldInput: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      userType: '',
    },
    toastMessage: req.session.toastMessage || '',
    userType: userType,
})
}
else if(userType && userType === 'student')
{
  res.render("auth/signupStudent", {
    pageTitle: "Sign Page",
    currentPage: "signup",
    IsLoggedIn: false,
    error: [],
    oldInput: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      userType: '',
    },
    toastMessage: req.session.toastMessage || '',
    userType: userType,
})
}
}

exports.postSignUp = [
  // Common validations
 check("name")
  .trim()
  .isLength({ min: 2 })
  .withMessage("Name must be at least 2 characters long")
  .matches(/^[A-Za-z ]+$/)
  .withMessage("Name must contain only alphabetical characters and spaces"),

  check("email")
    .isEmail()
    .withMessage("Please enter a valid email address")
    .normalizeEmail(),

  check("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
    .withMessage("Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character")
    .trim(),

  check("confirmPassword")
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),

  check("userType")
    .notEmpty()
    .withMessage("User type is required")
    .isIn(["teacher", "student"])
    .withMessage("User type must be either 'teacher' or 'student'"),

  check("terms")
  .custom((value, {req}) => {
    if (value !== "on") {
      throw new Error("Please accept the terms and conditions");
    }
    return true;
  }),

  check("enrollmentNo")
    .if((value, { req }) => req.body.userType === "student")    // Conditional field validation for 'student'
    .notEmpty()
    .withMessage("Enrollment number is required for students"),
  async (req, res, next) => {

  const userType = req.body.userType;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {   // if there are validation errors
      if(userType && userType==='teacher')
      {
      return res.status(422).render("auth/signupTeacher", {
      pageTitle: "Sign Up Page",
      currentPage: "signup",
      IsLoggedIn: false,
      error: errors.array().map(err => err.msg),
      oldInput: {
      name: req.body.name,
      email: req.body.email,
      },
      user: {}
    });
  }
}
if(userType && userType==='student')
{
  return res.status(422).render("auth/signupStudent", {
      pageTitle: "Sign Up Page",
      currentPage: "signup",
      IsLoggedIn: false,
      error: errors.array().map(err => err.msg),
      oldInput: {
      name: req.body.name,
      email: req.body.email,
      },
      user: {}
    });
}
  console.log(userType)
    if(!userType)
    { 
      return res.send("User type is required");
    }
    if(userType && userType === 'teacher' )
    {
        const {name,email,password} = req.body;
        const user = new User({
        name: name,
        email: email,
        password: password,
        userType: userType
    })
        if(user)
        {
        bcrypt.hash(password, 12) // Hash the password with a salt rounds of 12
          .then(hashedPassword => {
            user.password = hashedPassword; // Store the hashed password
            console.log("User registered successfully");
            return user.save(); // Save the user with the hashed password
          })
          res.redirect("/login");
        }
        else {
          res.status(400).send("Error creating user");
          return;
        }
    }
    if(userType && userType === 'student')
    {
        const {enrollmentNo,name,email,password} = req.body;
        console.log("Received data:", { name, email, password, enrollmentNo, userType });
        const user = new User({
        name: name,
        email: email,
        password: password,
        userType: userType,
        enrollmentNo: enrollmentNo
    })
        if(user)
        {
        bcrypt.hash(password, 12) // Hash the password with a salt rounds of 12
          .then(hashedPassword => {
            user.password = hashedPassword; // Store the hashed password
            return user.save(); // Save the user with the hashed password
          })
          res.redirect("/login");
        }
        else {
          res.status(400).send("Error creating user");
          return;
        }
    }
}
];



// session - server ke pass store hota h (internal cokkie banake)
// cookie - client ke pass store hota h (not use easily accessable)
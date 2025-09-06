const { check, validationResult } = require("express-validator");

const bcrypt = require("bcryptjs");
const User = require("../models/user");

exports.getHomePage = async(req,res,next)=>
{
  const IsLoggedIn = req.session.IsLoggedIn || false;
  console.log("IsLoggedIn:", IsLoggedIn);
    res.render('store/HomePage',{
      pageTitle: 'HomePage',
      currentPage: 'HomePage',
      IsLoggedIn: IsLoggedIn,
      user: req.session.user || {},
      toastMessage: req.session.toastMessage || '',
    });
}

exports.getLogIn = (req, res, next) => {

  const { userType } = req.query;
  const toastMessage = req.session.toastMessage;
  console.log("Toast Message: ", toastMessage);
  req.session.toastMessage = null; // Clear the toast message before rendering
  if (!userType) {
    res.send("User type is required");
    return;
  }
  if (userType && userType === 'teacher') {
  res.render("auth/loginTeacher", {
    pageTitle: "Login Page",
    currentPage: "Login",
    IsLoggedIn: false,
    user: {},
    toastMessage: toastMessage || '',
    error: [],
    oldInput: {
      email: '',
      password: ''
    },
    user: req.session.user || {},
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
    user: req.session.user || {},
    toastMessage: toastMessage || '',
    userType : userType
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
    user: req.session.user || {},
    toastMessage: toastMessage || '',

})
}
}
exports.postLogIn = async (req, res, next) => {

  const {userType,email,password,enrollmentNo} = req.body;
  console.log('Received data:', { userType, email, password, enrollmentNo });
  if (!userType) {
    res.send("User type is required");
    return;
  }
    if(userType && userType === 'student')
    {
      console.log('Received data:', { enrollmentNo, password });
      if (!enrollmentNo || !password) {
        return res.status(400).render("auth/loginStudent", {  
          pageTitle: "Login Page",
          currentPage: "Login", 
          IsLoggedIn: false,
          error: ["Please provide both enrollment number and password"],
          oldInput: {
            enrollmentNo: enrollmentNo,
            password: password
          },    
          user: req.session.user || {},
          toastMessage: '',
          userType: req.session.user.userType
        });
      }
      const student = await User.findOne({ enrollmentNo ,userType});
      if (!student) {
        return res.status(401).render("auth/loginStudent", {  
          pageTitle: "Login Page",
          currentPage: "Login",
          IsLoggedIn: false,
          error: ["Invalid enrollment number"],   
          oldInput: {
            enrollmentNo: enrollmentNo,
            password: password
          },
          user: req.session.user,
          toastMessage: null, 
        });
      }
      const doMatch = await bcrypt.compare(password, student.password);
      if (!doMatch) {
        return res.status(401).render("auth/loginStudent", {
          pageTitle: "Login Page",
          currentPage: "Login",
          IsLoggedIn: false,
          error: ["Invalid password"],
          oldInput: { 
            email: email,
            enrollmentNo: enrollmentNo,
            password: password
          },
          user: req.session.user || {},
          toastMessage: null,
        });
      } else {
        console.log("Student logged in successfully");
        req.session.user = student; // Store the user in the session
        const toastMessage = {type: 'success', text: 'Student LoggedIn successfully!.'};
        req.session.IsLoggedIn = true;
        await req.session.save();
        res.render("store/index", {
          pageTitle: "Index Page",
          currentPage: "IndexPage",
          IsLoggedIn: req.session.IsLoggedIn || false,
          user: req.session.user || {},
          toastMessage: toastMessage,
          userType: student.userType,
        });
      }
    }
    else
    if(userType && userType === 'teacher')
    {
      const teacher = await User.findOne({ email,userType});
      console.log('Received data:', { teacher });
      if (!teacher) {
        return res.status(401).render("auth/loginTeacher", {
          pageTitle: "Login Page",
          currentPage: "Login",
          IsLoggedIn: false,
          error: ["Invalid email"],
          oldInput: {
            email: email,
            password: password
          },
          user: req.session.user || {},
          toastMessage: null,
        });
      }
      const doMatch = await bcrypt.compare(password, teacher.password);
      if (!doMatch) {
        return res.status(401).render("auth/loginTeacher", {
          pageTitle: "Login Page",
          currentPage: "Login",
          IsLoggedIn: false,
          error: ["Invalid password"],
          oldInput: {
            email: email,
            password: password
          },
          user: req.session.user || {},
          toastMessage: null,
        });
      } else {
        console.log("Teacher logged in successfully");
        req.session.user = teacher; // Store the user in the session
        const toastMessage = {type: 'success', text: 'Teacher LoggedIn successfully!.'};
        req.session.IsLoggedIn = true;
        await req.session.save();
        res.render("store/index", {
          pageTitle: "Index Page",
          currentPage: "IndexPage",
          IsLoggedIn: req.session.IsLoggedIn || false,
          user: req.session.user || {},
          toastMessage: toastMessage,
          userType: teacher.userType,
        });
      }
    }
    else
      if(userType && userType === 'admin')
      {
       const admin = await User.findOne({ email, userType });
       console.log('Received data:', { admin });
        if (!admin) {
          return res.status(401).render("auth/loginAdmin", {
            pageTitle: "Admin Page",  
            currentPage: "Login",
            IsLoggedIn: false,
            error: ["Invalid email"],
            oldInput: {
              email: email,
              password: password
            },
            user: req.session.user || {},
            toastMessage: null,
          });
        }
        const doMatch = await bcrypt.compare(password, admin.password);
        if (!doMatch) {
          return res.status(401).render("auth/loginAdmin", {
            pageTitle: "Admin Page",
            currentPage: "Login",
            IsLoggedIn: false,
            error: ["Invalid password"],
            oldInput: {
              email: email,
              password: password
            },
            user: req.session.user || {},
            toastMessage: null,
          });
        }
        else {
          console.log("Admin logged in successfully");
          req.session.user = admin; // Store the user in the session
        const toastMessage = {type: 'success', text: 'Admin LoggedIn successfully!.'};
        req.session.IsLoggedIn = true;
        await req.session.save();
        res.render("store/index", {
          pageTitle: "Index Page",
          currentPage: "IndexPage",
          IsLoggedIn: req.session.IsLoggedIn || false,
          user: req.session.user || {},
          toastMessage: toastMessage,
          userType: admin.userType,
        });
      }
    }
  }

    //req.session.IsLoggedIn = true;          // me store ho jayegi 
  // get method with index page) ki request gayi localhost ko with cookie == "IsLoggedIn",true on browser

exports.postLogOut = (req, res, next) => {
  //res.cookie("IsLoggedIn",false);
  req.session.destroy(() => {
    res.redirect('/')
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
    user: req.session.user || {},
    toastMessage: req.session.toastMessage || '',
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
    user: req.session.user || {},
})
}
}

exports.postSignUp = [
  // Validations
  check("name")
    .trim()
    .isLength({ min: 2 }).withMessage("Name must be at least 2 characters long")
    .matches(/^[A-Za-z ]+$/).withMessage("Name must contain only alphabetical characters and spaces"),

  check("email")
    .isEmail().withMessage("Please enter a valid email address")
    .normalizeEmail(),

  check("password")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters long")
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
    .notEmpty().withMessage("User type is required")
    .isIn(["teacher", "student"]).withMessage("User type must be either 'teacher' or 'student'"),

  check("terms")
    .custom((value) => {
      if (value !== "on") {
        throw new Error("Please accept the terms and conditions");
      }
      return true;
        }),
      check("enrollmentNo")
        .if((value, { req }) => req.body.userType === "student")
        .notEmpty().withMessage("Enrollment number is required for students")
        .isLength({ min: 12, max: 12 }).withMessage("Enrollment number must be exactly 12 characters long"),

  // Controller logic
  async (req, res, next) => {
    const { name, email, password, userType, enrollmentNo } = req.body;
    const errors = validationResult(req);

    const errorMessages = errors.array().map(err => err.msg);
    const renderData = {
      pageTitle: "Sign Up Page",
      currentPage: "signup",
      IsLoggedIn: false,
      error: errorMessages,
      oldInput: { name, email, enrollmentNo },
      user: req.session.user || {},
    };

    // Render errors if any
    if (!errors.isEmpty()) {
      if (userType === 'teacher') {
        return res.status(422).render("auth/signupTeacher", renderData);
      } else if (userType === 'student') {
        return res.status(422).render("auth/signupStudent", renderData);
      } else {
        return res.send("User type is required");
      }
    }

      if (userType === 'teacher') {
        const existingUser = await User.findOne({ email});
        if (existingUser) {
          renderData.error = ["Email already exists"];
          return res.status(422).render("auth/signupTeacher", renderData);
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({ name, email, password: hashedPassword, userType });
        await user.save();
        console.log("Teacher registered successfully");
        req.session.user = user;
        req.session.toastMessage = {type: 'success', text: 'Teacher Registered successfully!.'};
        await req.session.save();
        return res.redirect("/login?userType=teacher");

      } else if (userType === 'student') {
        const existingUser = await User.findOne({ email});
        const existingEnroll = await User.findOne({ enrollmentNo, userType });

        if (existingUser || existingEnroll) {
          renderData.error = [
            existingUser ? "Email already exists" : "",
            existingEnroll ? "Enrollment number already exists" : ""
          ].filter(Boolean);
          return res.status(422).render("auth/signupStudent", renderData);
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({ name, email, password: hashedPassword, userType, enrollmentNo });
        await user.save();
        console.log("Student registered successfully");
        req.session.toastMessage = {type: 'success', text: 'Student Registered successfully!.'};
        await req.session.save();
        return res.redirect("/login?userType=student");
      }
    else {
      return res.send("Invalid user type");
    }
  }
];



// session - server ke pass store hota h (internal cokkie banake)
// cookie - client ke pass store hota h (not use easily accessable)
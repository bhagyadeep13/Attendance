// Core Module
const path = require('path');
const Student = require('./models/student');
// External Module
const express = require('express');
const session = require('express-session')
const mongoDBStore = require('connect-mongodb-session')(session)

const DB_PATH = "mongodb+srv://root:root@attend.ejtxhiz.mongodb.net/N?retryWrites=true&w=majority&appName=attend";

//Local Module
const rootDir = require("./utils/pathUtil");
const errorsController = require("./controllers/errors");
const { default: mongoose } = require('mongoose');
const authRouter = require('./routes/authRouter');
const AddRouter = require('./routes/Add_student');
const aboutRouter = require('./routes/aboutRoute');
const markAttendanceRouter = require('./routes/markAttendence');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const store = new mongoDBStore({
  uri: DB_PATH,
  collection: 'sessions'
})

app.use(express.urlencoded());

app.use(session({
  secret : "bhagyadeep",
  resave: false,
  saveUninitialized : false,
  store: store
}))

/*app.use((req,res,next)=>{
 req.session.IsLoggedIn = req.session.IsLoggedIn
 next()
})*/
/*app.use((req,res,next)=>{
  if(req.get('Cookie'))
  {
    req.session.IsLoggedIn = req.get('Cookie')?.split('=')[1];
  }
  else
  {
    req.session.IsLoggedIn = false;
  }
  next();
})*/

const studentRoutes = require('./routes/student');
app.use('/', studentRoutes);

const attendanceRoutes = require('./routes/attendance');
app.use('/', attendanceRoutes);


app.use(express.json()); // important to parse JSON body

app.use(authRouter)
app.use(AddRouter);
app.use(markAttendanceRouter)
app.use(aboutRouter);

// isLoggedIn == true ho tabhi next karo nhi toh "/" redirect ho
app.use('/host',(req,res,next)=>{
  if(req.session.IsLoggedIn)
  {
    next();
  }
  else
  {
    res.redirect('/login')
  }
})  // pehle request me isLoggedIn == true ho tabhi next karo nhi toh "/" redirect ho


app.use(express.static(path.join(rootDir, 'public')))

app.use(errorsController.pageNotFound);

const PORT = 3004;

mongoose.connect(DB_PATH).then(() => {
  console.log('Connected to Mongo');
  app.listen(PORT, () => {
    console.log(`Server running on address http://localhost:${PORT}`);
  });
}).catch(err => {
  console.log('Error while connecting to Mongo: ', err);
});

// hamesha trust but verify
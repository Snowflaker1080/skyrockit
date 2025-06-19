const dotenv = require('dotenv');
dotenv.config();

const applicationsController = require('./controllers/applications.js');
const express = require('express');
const isSignedIn = require('./middleware/is-signed-in.js');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
const passUserToView = require('./middleware/pass-user-to-view.js');
const path = require('path');
const session = require('express-session');

const app = express();
const authController = require('./controllers/auth.js');

const port = process.env.PORT ? process.env.PORT : '3000';

const db_url = process.env.MONGODB_URI;
mongoose
  .connect(db_url, { dbName: "SkyrockitJobApplicationTracker" })
  .then(() => {
    console.log("Connected to MongoDB SkeyrockitJobApplicationTracker Database");
  })
  .catch((err) => {
    console.error("MongoDB connection error", err);
  });

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});


//------------------------------------- Use --------------------------------------------------//
//--------------------------------------------------------------------------------------------//

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(morgan('dev'));

app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passUserToView); // use new passUserToView middleware here

app.get('/', (req, res) => {
  console.log(res.locals.user);
  res.render('index.ejs', {
    user: req.session.user,
  });
});

app.use('/auth', authController);
app.use(isSignedIn); // use new isSignedIn middleware here
app.use('/users/:userId/applications', applicationsController);


app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});

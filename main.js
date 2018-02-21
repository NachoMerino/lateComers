const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const LateComer = require('./app/models/latecomersmodel');
const session = require('express-session');
const cookieParser = require('cookie-parser');

// create express app
const app = express();
const router = express.Router();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

//cookies
app.use(cookieParser());
app.use(session({
  secret: 'mySecretKey',
  resave: true,
  saveUnitialized: true
}));

// parse application/json
app.use(bodyParser.json())
app.use("/", router);



const port = 3000;
app.use('/assets', express.static(path.join(__dirname, 'app/views/assets')));

// Configuring the database connection
const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');
mongoose.connect(dbConfig.url);

mongoose.connection.on('error', () => {
  console.log('Could not connect to the database. Exiting now...');
  process.exit();
});
mongoose.connection.once('open', () => {
  console.log("Successfully connected to the database");
})

// define a simple route
router.get('/api', (req, res) => {
  res.json({ 'message': 'Welcome to Your Project application REST-ful API.' });
});

// Web
router.get("/", (req, res) => {
  res.sendFile('index.html', { root: 'app/views' })
});


function auth(req, res, next) {
  if (req.session && req.session.user === 'nacho' && req.session.admin) {
    return next();
  } else {
    return res.status(401).send('you are not admin');;
  }
}

router.post('/login', (req, res) => {
  if (!req.body.username || !req.body.password) {
    res.json({ error: 'Username and Password required' });
  } else if (req.body.username === 'nacho' && req.body.password === 'qwerty') {
    req.session.user = 'nacho';
    req.session.admin = true;
    res.sendStatus(200);
    console.log(JSON.stringify(req.session));
  } else {
    res.status(403).send('wrong pass/user');;
  }
});

router.get('/logout', (req, res) => {
  console.log('loging out');
  req.session.destroy();
  res.send('logout successful');
});

router.get('/content', auth, (req, res) => {
  res.send('Join the dark side............ we have cookies!!!');
});

router.post('/add', (req, res) => {
if (!req.body) {
    return res.send('You send me empty data');
  }
  
  const newLateComer = new LateComer({
    name: req.body.name,
    minLate: req.body.time,
  });
  newLateComer.save((err) => {
    if (err) {
      throw err;
    }
  });
  console.log(`Student ${newLateComer.name} has been saved successfully`);
  res.send({ message: `Student ${newLateComer.name} has been saved successfully` });
});


router.get('/history', (req, res) => {
  LateComer.find((err, data) => {
    if (err) {
      res.status(500).send({ error: 'some error occurred while retrieving students' });
    } else {
      res.send(data);
    }
  });
});


router.delete('/student/:studentId', (req, res) => {
  if (!req.params) {
    return res.send('Fields can not be empty');
  }
  LateComer.findById(req.params.studentId, (err, lateComer) => {
    lateComer.remove((err) => {
      if (err) {
        throw err;
      }
    });
  });
  res.json({ message: `student has been deleted successfully` });
});

// listen for requests
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const expressSession = require('express-session');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const connection = require('./db');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSession({ secret: 'mySecretKey', resave: false, saveUninitialized: false }));
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(cookieParser('mySecretKey'));
app.use(passport.initialize());
app.use(passport.session());
require('./passportConfig')(passport);

app.post('/register', (req, res) => {
  const TUPCID = req.body.TUPCID;
  const USERNAME = req.body.USERNAME;
  const PASSWORD = req.body.PASSWORD;
  const ROLES = req.body.ROLES;

  const query1 = 'INSERT INTO login_register2 (`TUPCID`, `USERNAME`, `PASSWORD`, `ROLES`) VALUES (?, ?, ?, ?)';
  const query = 'SELECT * FROM login_register2 WHERE TUPCID = ? OR USERNAME = ?';

  connection.query(query, [TUPCID, USERNAME], (err, result) => {
    if (err) {
      throw err;
    }
    if (result.length > 0) {
      res.send({ message: 'Username or TUPCID already exists' });
    } else {
      const hashedPASSWORD = bcrypt.hashSync(PASSWORD, 10);
      connection.query(query1, [TUPCID, USERNAME, hashedPASSWORD, ROLES], (err, result) => {
        if (err) {
          throw err;
        }
        res.send({ message: 'User Created' });
      });
    }
  });
});

app.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      throw err;
    }
    if (!user) {
      res.send('NO USER EXISTING');
    } else {
      req.login(user, (err) => {
        if (err) {
          throw err;
        }
        res.send('USER LOGIN');
        console.log(user);
      });
    }
  })(req, res, next);
});

app.get('/allUserData', (req, res) => {
  const query = 'SELECT * FROM account.login_register2';
  connection.query(query, (err, result) => {
    if (err) {
      console.error('Error executing the SELECT query:', err);
      res.status(500).send({ message: 'Database error' });
      return;
    }
    res.status(200).send(result);
  });
});

app.delete('/userData/:TUPCID', (req, res) => {
  const TUPCID = req.params.TUPCID;
  const query = 'DELETE FROM account.login_register2 WHERE TUPCID = ?';
  connection.query(query, [TUPCID], (err, result) => {
    if (err) {
      console.error('Error executing the DELETE query:', err);
      res.status(500).send({ message: 'Database error' });
      return;
    }
    res.status(200).send({ message: 'User deleted' });
  });
});

app.put('/updateUserData/:TUPCID', (req, res) => {
  const TUPCID = req.params.TUPCID;
  const { USERNAME, PASSWORD } = req.body;
  const query = 'UPDATE account.login_register2 SET USERNAME = ?, PASSWORD = ? WHERE TUPCID = ?';
  connection.query(query, [USERNAME, PASSWORD, TUPCID], (err, result) => {
    if (err) {
      console.error('Error executing the UPDATE query:', err);
      res.status(500).send({ message: 'Database error' });
      return;
    }
    res.status(200).send({ message: 'User updated successfully' });
  });
});

app.get('/userpage', (req, res) => {
  if (req.user && req.user.TUPCID) {
    const TUPCID = req.user.TUPCID;
    const query = 'SELECT * FROM login_register2 WHERE TUPCID = ?';
    connection.query(query, [TUPCID], (err, result) => {
      if (err) {
        console.error('Error executing the SELECT query:', err);
        res.status(500).send({ message: 'Database error' });
        return;
      }
      if (result.length > 0) {
        const userData = result[0];
        res.status(200).send(userData);
      } else {
        res.status(404).send({ message: 'User not found' });
      }
    });
  } else {
    res.status(401).send({ message: 'Unauthorized' });
  }
});

app.get('/studpage', (req, res) => {
  // Check if the user is authenticated and has the role 'STUDENT'
  if (req.user && req.user.ROLES === 'STUDENT') {
    const TUPCID = req.user.TUPCID;
    const query = 'SELECT * FROM login_register2 WHERE TUPCID = ?';
    connection.query(query, [TUPCID], (err, result) => {
      if (err) {
        console.error('Error executing the SELECT query:', err);
        res.status(500).send({ message: 'Database error' });
        return;
      }
      if (result.length > 0) {
        const userData = result[0];
        res.status(200).send(userData);
      } else {
        res.status(404).send({ message: 'User not found' });
      }
    });
  } else {
    res.status(401).send({ message: 'Unauthorized' });
  }
});


app.get('/profpage', (req, res) => {
    if (req.user && req.user.ROLES === 'FACULTY') {
      const TUPCID = req.user.TUPCID;
      const query = 'SELECT * FROM login_register2 WHERE TUPCID = ?';
      connection.query(query, [TUPCID], (err, result) => {
        if (err) {
          console.error('Error executing the SELECT query:', err);
          res.status(500).send({ message: 'Database error' });
          return;
        }
        if (result.length > 0) {
          const userData = result[0];
          res.status(200).send(userData);
        } else {
          res.status(404).send({ message: 'User not found' });
        }
      });
    } else {
      res.status(401).send({ message: 'Unauthorized' });
    }
  });

  
  

app.listen(3001, () => {
  console.log('Server started on port 3001');
});

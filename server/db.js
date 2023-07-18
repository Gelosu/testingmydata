const mysql2 = require('mysql2');

const connection = mysql2.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345',
    database: 'account'

});

connection.connect((err) => {
    if (err) {
      console.error('Error connecting:', err);
      return;
    }
    console.log('Connected to MySQL database.');
  });
  

module.exports = connection;

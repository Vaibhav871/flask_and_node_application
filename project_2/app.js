const express = require('express');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const port = 3000;

// Set up MySQL connection
const db = mysql.createConnection({
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'default_user',
  password: process.env.MYSQL_PASSWORD || 'default_password',
  database: process.env.MYSQL_DB || 'devops',
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
  initDb();  // Initialize DB if not exists
});

// Initialize the database and create table if not exists
function initDb() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS messages (
      id INT AUTO_INCREMENT PRIMARY KEY,
      message TEXT
    );
  `;
  db.query(createTableQuery, (err) => {
    if (err) {
      console.error('Error creating table:', err);
    }
  });
}

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set the view engine to ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files (like CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Route to render the home page with messages
app.get('/', (req, res) => {
  db.query('SELECT message FROM messages', (err, results) => {
    if (err) {
      console.error('Error fetching messages:', err);
      return res.status(500).send('Server Error');
    }
    res.render('index', { messages: results });
  });
});

// Route to handle form submission
app.post('/submit', (req, res) => {
  const newMessage = req.body.new_message;
  if (newMessage) {
    db.query('INSERT INTO messages (message) VALUES (?)', [newMessage], (err) => {
      if (err) {
        console.error('Error inserting message:', err);
        return res.status(500).send('Server Error');
      }
      res.json({ message: newMessage });
    });
  } else {
    res.status(400).send('Message is required');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

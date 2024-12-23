const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// MySQL database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'your_mysql_user',
    password: 'your_mysql_password',
    database: 'todo_app',
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to MySQL database.');
});

// Middleware
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
    const query = 'SELECT * FROM tasks';
    db.query(query, (err, tasks) => {
        if (err) throw err;
        res.render('index', { tasks });
    });
});

app.post('/add', (req, res) => {
    const { title } = req.body;
    const query = 'INSERT INTO tasks (title) VALUES (?)';
    db.query(query, [title], (err) => {
        if (err) throw err;
        res.redirect('/');
    });
});

app.get('/delete/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM tasks WHERE id = ?';
    db.query(query, [id], (err) => {
        if (err) throw err;
        res.redirect('/');
    });
});

app.get('/complete/:id', (req, res) => {
    const { id } = req.params;
    const query = 'UPDATE tasks SET completed = NOT completed WHERE id = ?';
    db.query(query, [id], (err) => {
        if (err) throw err;
        res.redirect('/');
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

console.log(">>> Server starting…");

const http = require('http');
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2');
const url = require('url');

var host = 'localhost';
var port = 3000;

// ===============================
// MySQL CONNECTION
// ===============================
const connection = mysql.createConnection({
  host: 'db.it.pointpark.edu',
  user: 'studentfilm',
  password: 'aVjvl9grMnThUknF',
  database: 'studentfilm'
});

connection.connect(function(err) {
  if (err) {
    console.log("MYSQL CONNECTION ERROR:", err.code, err.sqlMessage);
  } else {
    console.log("Connected to MySQL database");
  }
});

// ===============================
// CONTENT TYPE HELPER
// ===============================
function getContentType(ext) {
  switch (ext.toLowerCase()) {
    case '.css': return 'text/css';
    case '.js': return 'application/javascript';
    case '.html': return 'text/html';
    default: return 'text/plain';
  }
}

// ===============================
// HTTP SERVER
// ===============================
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  var pathname = parsedUrl.pathname;

  // ===============================
  // GET /movies
  // ===============================
  if (req.method === 'GET' && pathname === '/movies') {
    connection.query('SELECT * FROM films LIMIT 200', (err, results) => {
      if (err) {
        res.writeHead(500, {'Content-Type': 'text/plain'});
        res.end('Database error');
      } else {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(results));
      }
    });
    return;
  }

  // ===============================
  // GET /analytics/genres
  // ===============================
  if (req.method === 'GET' && pathname === '/analytics/genres') {
    const sql = `
      SELECT f.genre, COUNT(fc.student_id) AS total_students
      FROM films f
      LEFT JOIN film_crew fc ON f.film_id = fc.film_id
      GROUP BY f.genre
      ORDER BY total_students DESC
    `;

    connection.query(sql, (err, results) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err }));
        return;
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, data: results }));
    });
    return;
  }

  // ===============================
  // POST /addFilm
  // ===============================
  if (req.method === 'POST' && pathname === '/addFilm') {
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      const film = JSON.parse(body);

      const sql = `
        INSERT INTO films (title, genre, year, run_time, description, course, film_url)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

      const params = [
        film.title,
        film.genre,
        film.year,
        film.run_time,
        film.description,
        film.course,
        film.film_url
      ];

      connection.query(sql, params, (err, result) => {
        if (err) {
          console.error("SQL Insert Error:", err);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: err }));
          return;
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, film_id: result.insertId }));
      });
    });

    return;
  }

  // ===============================
  // PUT /updateFilm
  // ===============================
  if (req.method === 'PUT' && pathname === '/updateFilm') {
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      const film = JSON.parse(body);

      const sql = `
        UPDATE films
        SET title = ?, genre = ?, year = ?, run_time = ?, description = ?, course = ?, film_url = ?
        WHERE film_id = ?
      `;

      const params = [
        film.title,
        film.genre,
        film.year,
        film.run_time,
        film.description,
        film.course,
        film.film_url,
        film.film_id
      ];

      connection.query(sql, params, (err, result) => {
        if (err) {
          console.error("SQL Update Error:", err);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: err }));
          return;
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, updated: result.affectedRows }));
      });
    });

    return;
  }

  // ===============================
  // STATIC FILE SERVING
  // ===============================
  if (pathname === '/') pathname = '/index.html';
  const filePath = path.join(__dirname, pathname);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, {'Content-Type': 'text/plain'});
      res.end('Not Found: ' + pathname);
      return;
    }

    const ext = path.extname(filePath);
    res.writeHead(200, {'Content-Type': getContentType(ext)});
    res.end(data);
  });
});

// ===============================
// START SERVER
// ===============================
server.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}`);
});

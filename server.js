
const http = require('http');
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2');
const url = require('url');

var host = 'localhost';
var port = 3000;

// This is our mysql connection
const connection = mysql.createConnection({
  host: 'db.it.pointpark.edu',
  user: 'studentfilm',
  password: 'aVjvl9grMnThUknF',
  database: 'studentfilm'
});

connection.connect(err => {
  if (err) {
    console.error('Database connection failed:', err);
    process.exit(1);
  }
  console.log('Connected to MySQL database');
});

// this is a  function to get content type
function getContentType(ext) {
  switch (ext.toLowerCase()) {
    case '.css': return 'text/css';
    case '.js': return 'application/javascript';
    case '.html': return 'text/html';
    default: return 'text/plain';
  }
}

// This ends up making the node server
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  var pathname = parsedUrl.pathname;

  // This does the API route first
  if (req.method === 'GET' && pathname === '/movies') {
    connection.query('SELECT * FROM movies LIMIT 20', (err, results) => {
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

  //This  Serves static files
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

server.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}`);
});
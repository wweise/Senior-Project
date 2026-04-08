const http = require('http');
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2');
const url = require('url');

// IMPORTANT: Bind to 0.0.0.0 so the jail URL can access it
const host = '0.0.0.0';
const port = 3000;

// MySQL connection
const connection = mysql.createConnection({
    host: 'db.it.pointpark.edu',
    user: 'studentfilm',
    password: 'aVjvl9grMnThUknF',
    database: 'studentfilm',
    port: 3306
});

// Connect to MySQL
connection.connect(err => {
    if (err) {
        console.error("? MySQL Connection Failed:");
        console.error(err);
        return;
    }
    console.log("? Connected to MySQL database");
});

// Determine content type
function getContentType(ext) {
    switch (ext.toLowerCase()) {
        case '.css': return 'text/css';
        case '.js': return 'application/javascript';
        case '.html': return 'text/html';
        case '.json': return 'application/json';
        default: return 'text/plain';
    }
}

// Create HTTP server
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    let pathname = parsedUrl.pathname;

    // -------------------------------
    // API ROUTE: GET MOVIES
    // -------------------------------
    if (req.method === 'GET' && pathname === '/movies') {
        console.log("?? /movies endpoint hit");

        connection.query("SELECT * FROM movies", (err, results) => {
            if (err) {
                console.error("? SQL Error:", err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: "Database error" }));
                return;
            }

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(results));
        });
        return;
    }

    // -------------------------------
    // API ROUTE: GENRE ANALYTICS
    // -------------------------------
    if (req.method === 'GET' && pathname === '/analytics/genres') {
        console.log("?? /analytics/genres endpoint hit");

        const sql = `
            SELECT genre, COUNT(*) AS filmCount
            FROM movies
            GROUP BY genre
        `;

        connection.query(sql, (err, results) => {
            if (err) {
                console.error("? SQL Error:", err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: err }));
                return;
            }

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, data: results }));
        });
        return;
    }

    // -------------------------------
    // STATIC FILE SERVING
    // -------------------------------
    if (pathname === '/') pathname = '/index.html';

    const filePath = path.join(__dirname, pathname);

    fs.readFile(filePath, (err, data) => {
        if (err) {
            console.error("? File Not Found:", pathname);
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end("Not Found: " + pathname);
            return;
        }

        const ext = path.extname(filePath);
        res.writeHead(200, { 'Content-Type': getContentType(ext) });
        res.end(data);
    });
});

// Start server
server.listen(port, host, () => {
    console.log(`?? Server running at http://${host}:${port}`);
});

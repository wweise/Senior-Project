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

// Parse JSON body
function getRequestBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                resolve(JSON.parse(body));
            } catch (err) {
                reject(err);
            }
        });
    });
}

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
const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    let pathname = parsedUrl.pathname;

    // -------------------------------
    // API ROUTE: GET MOVIES
    // -------------------------------
    if (req.method === 'GET' && pathname === '/movies') {
        console.log("/movies endpoint hit");

        connection.query("SELECT * FROM films", (err, results) => {
            if (err) {
                console.error("SQL Error: ", err);
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
    // GET STUDENTS
    // -------------------------------
    if (req.method === 'GET' && pathname === '/students') {
        console.log("/students lookup hit");

        const name = parsedUrl.query.name;

        if (!name) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: "name required" }));
            return;
        }

        const parts = name.trim().split(" ");
        const first_name = parts[0];
        const last_name = parts.slice(1).join(" ");

        const sql = `
            SELECT * FROM students
            WHERE first_name = ? AND last_name = ?
            LIMIT 1
        `;

        connection.query(sql, [first_name, last_name], (err, results) => {
            if (err) {
                console.error("SQL Error:", err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: err }));
                return;
            }

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                success: true,
                data: results[0] || null
            }));
        });
        return;
    }

    // -------------------------------
    // API ROUTE: GENRE ANALYTICS
    // -------------------------------
    if (req.method === 'GET' && pathname === '/analytics/genres') {
        console.log("/analytics/genres endpoint hit");

        const sql = `
          SELECT f.genre, COUNT(fc.student_id) AS total_students
          FROM films f
          LEFT JOIN film_crew fc ON f.film_id = fc.film_id
          GROUP BY f.genre
          ORDER BY total_students DESC
        `;

        connection.query(sql, (err, results) => {
            if (err) {
                console.error("? SQL Error: ", err);
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
    // POST FILMS
    // -------------------------------
    if (req.method === 'POST' && pathname === '/films') {
        console.log("POST /films hit");

        const data = await getRequestBody(req);

        const sql = `
            INSERT INTO films
            (title, year, run_time, description, genre, course, film_url)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        connection.query(sql, [
            data.title,
            data.year,
            data.run_time,
            data.description,
            data.genre,
            data.course,
            data.film_url
        ], (err, result) => {
            if (err) {
                console.error("SQL Error: ", err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: err }));
                return;
            }

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                success: true,
                data: { film_id: result.insertId }
            }));
        });
        return;
    }

    // -------------------------------
    // POST ROLES
    // -------------------------------
    if (req.method === 'POST' && pathname === '/roles') {
        console.log("POST /roles hit");

        const data = await getRequestBody(req);

        const sqlCheck = `SELECT * FROM roles WHERE role_name = ?`;

        connection.query(sqlCheck, [data.role_name], (err, result) => {
            if (err) {
                console.error("SQL Error: ", err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: err }));
                return;
            }
            if (results.length > 0) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, data: results[0] }));
                return;
            }

            const sqlInsert = `INSERT INTO roles (role_name) VALUES (?)`;

            connection.query(sqlInsert, [data.role_name], (err, results) => {
                if (err) {
                    console.error("SQL Error: ", err);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: err }));
                    return;
                }

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: true,
                    data: {
                            role_id: results.insertId,
                            role_name: data.role_name
                    }
                }));
            });
        });
        return;
    }

    // -------------------------------
    // POST STUDENT
    // -------------------------------
    if (req.method === 'POST' && pathname === '/students') {
        console.log("POST /students hit");

        const data = await getRequestBody(req);

        const sql = `
            INSERT INTO students
            (first_name, last_name, major, graduation_year)
            VALUES (?, ?, ?, ?)
        `;

        connection.query(sql, [
            data.first_name,
            data.last_name,
            data.major,
            data.graduation_year
        ], (err, result) => {
            if (err) {
                console.error("SQL Error: ", err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: err }));
                return;
            }

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                success: true,
                data: { student_id: result.insertId }
            }));
        });
        return;
    }

    // -------------------------------
    // POST FILM CREW
    // -------------------------------    
    if (req.method === 'POST' && pathname === '/film-crew') {
        console.log("POST hit /film-crew");

        const data = await getRequestBody(req);

        const sql = `
            INSERT INTO film_crew (film_id, student_id, role_id)
            VALUES (?, ?, ?)
        `;

        connection.query(sql, [
            data.film_id,
            data.student_id,
            data.role_id
        ], (err) => {
            if (err) {
                console.error("Sql Error: ", err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: err }));
                return;
            }

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true }));
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

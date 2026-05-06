var http = require("http");
var fs = require("fs");
var mysql = require("mysql");
var credentials = require("./credentials");
var qs = require("querystring");

// ----------------------
// MAIN SERVER
// ----------------------
http.createServer(function(req, res) {
  try {
    var path = req.url.replace(/\/?(?:\?.*)?$/, "");

    if (path === "/users") {          // Returns FILMS
      films(req, res);
    }
    else if (path === "/analytics/genres") { 
      genreAnalytics(req, res);
    }
    else if (path === "/add_user") {  
      addUser(req, res);
    }
    else {
      serveStaticFile(res, path);
    }
  }
  catch (e) {
    try {
      console.log("ERROR(500): " + e);
      res.writeHead(500, {"Content-Type": "text/plain; charset=utf-8"});
      res.end("500 Internal Server error");
    }
    catch (e) {
      console.log("ERROR(^^^): " + e);
    }
  }
}).listen(3000, "0.0.0.0");   // IMPORTANT: allow external access

console.log("Server started on 0.0.0.0:3000; press Ctrl-C to terminate....");

// ----------------------
// STATIC FILE SERVER
// ----------------------
function serveStaticFile(res, path, contentType, responseCode) {
  if (!path) path = "/index.html";
  if (!responseCode) responseCode = 200;

  if (!contentType) {
    contentType = "application/octet-stream";
    if (path.endsWith(".html")) contentType = "text/html; charset=utf-8";
    else if (path.endsWith(".js")) contentType = "application/javascript; charset=utf-8";
    else if (path.endsWith(".json")) contentType = "application/json; charset=utf-8";
    else if (path.endsWith(".css")) contentType = "text/css; charset=utf-8";
    else if (path.endsWith(".png")) contentType = "image/png";
    else if (path.endsWith(".jpg")) contentType = "image/jpeg";
  }

  fs.readFile(__dirname + "/public" + path, function(err, data) {
    if (err) {
      res.writeHead(404, {"Content-Type": "text/plain; charset=utf-8"});
      res.end("404 Not Found");
    }
    else {
      res.writeHead(200, {"Content-Type": contentType});
      res.end(data);
    }
  });
}

// ----------------------
// JSON RESPONSE HELPER
// ----------------------
function sendResponse(req, res, data) {
  res.writeHead(200, {"Content-Type": "application/json; charset=utf-8"});
  res.end(JSON.stringify(data));
}

// ----------------------
// GET FILMS (formerly /users)
// ----------------------
function films(req, res) {
  var conn = mysql.createConnection(credentials.connection);

  conn.connect(function(err) {
    if (err) {
      console.error("ERROR: cannot connect: " + err);
      return;
    }

    conn.query("SELECT * FROM films", function(err, rows, fields) {
      var outjson = {};

      if (err) {
        outjson.success = false;
        outjson.message = "Query failed: " + err;
      }
      else {
        outjson.success = true;
        outjson.message = "Query successful!";
        outjson.data = rows;
      }

      sendResponse(req, res, outjson);
    });

    conn.end();
  });
}

// ----------------------
// GENRE ANALYTICS
// ----------------------
function genreAnalytics(req, res) {
  var conn = mysql.createConnection(credentials.connection);

  conn.connect(function(err) {
    if (err) {
      console.error("ERROR: cannot connect: " + err);
      return;
    }

    var sql = `
      SELECT genre, COUNT(*) AS filmCount
      FROM films
      GROUP BY genre
    `;

    conn.query(sql, function(err, rows, fields) {
      var outjson = {};

      if (err) {
        outjson.success = false;
        outjson.message = "Query failed: " + err;
      }
      else {
        outjson.success = true;
        outjson.data = rows;
      }

      sendResponse(req, res, outjson);
    });

    conn.end();
  });
}

// ----------------------
// ADD USER (unused)
// ----------------------
function addUser(req, res) {
  var body = "";

  req.on("data", function(data) {
    body += data;
    if (body.length > 1e6) req.connection.destroy();
  });

  req.on("end", function() {
    var injson = JSON.parse(body);
    var conn = mysql.createConnection(credentials.connection);

    conn.connect(function(err) {
      if (err) {
        console.error("ERROR: cannot connect: " + err);
        return;
      }

      conn.query("INSERT INTO USERS (NAME) VALUE (?)", [injson.name], function(err, rows, fields) {
        var outjson = {};

        if (err) {
          outjson.success = false;
          outjson.message = "Query failed: " + err;
        }
        else {
          outjson.success = true;
          outjson.message = "Query successful!";
        }

        sendResponse(req, res, outjson);
      });

      conn.end();
    });
  });
}

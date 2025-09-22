const http = require("http");
const fs = require("fs");

const server = http.createServer((req, res) => {
  fs.readFile(`${__dirname}/public/homepage.html`, (err, file) => {
    if (err) {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Error reading file");
      return;
    }
    res.writeHead(200, {
      "Content-Type": "text/html",
      "Content-Length": file.length,
    });
    res.write("Sending html file");
    res.end(file);
  });
});
const PORT = 3000;
server.listen(PORT, (err) => {
  if (err) {
    console.error("Error starting server:", err);
  } else {
    console.log("Server started successfully on port", PORT);
  }
});

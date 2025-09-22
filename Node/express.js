const express = require("express");
const app = express();

app.use(express.static("public")); // for serving static files
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); //for parsing application/x-www-form-urlencoded
const cors = require("cors");
app.use(cors());

app.get("/", (req, res) => {
  res.status(200).send("Hiii");
});


app.get("/home", (req, res) => {
  res.status(200).sendFile(`${__dirname}/public/homepage.html`, (err) => {
    if (err) {
      console.error("Error sending file:", err);
      res.status(500).send("Error sending file");
    }
  });
});

app.get("/download", (req, res) => {
  const file = `${__dirname}/public/index.html`;
  res.download(file, (err) => {
    if (err) {
      console.error("Error downloading file:", err);
      res.status(500).send("Error downloading file");
    }
  });
});

app.set("view engine", "ejs");
// for views we need to use ejs files
app.set("views", "./views"); // Set the views directory

app.get("/view", (req, res) => {
  res.render(
    "home", // name of the ejs file without .ejs extension
    { message: "This is sent from the server" }, // data to be sent to the view
    // this data can be accessed in the ejs file using <%= message %>
    (err, html) => {
      if (err) {
        console.error("Error rendering view:", err);
        res.status(500).send("Error rendering view");
      } else {
        res.send(html);
      }
    }
  );
});

const router = require("./router");
//all the requests to /user will be handled by the router
app.use("/users", router);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

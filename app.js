const express = require("express");
const app = express();

// To handle HTML forms and JSON payloads
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Setting static folder
app.use(express.static("public"));

// Listen for port 3000
app.listen(3000);

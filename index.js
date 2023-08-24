const express = require("express");
const app = express();
const PORT = 5000;
const path = require("path");

// setup call hbs with sub folder
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "src/views"));

// set serving static file
app.use(express.static("src/assets"));

// parsing data from client
app.use(express.urlencoded({ extended: false }));

// routing
app.get("/", home);
app.get("/contact", contactMe);
app.get("/project-detail/:id", projectDetail);
app.get("/project", formProject);
// app.post("/form-project", addBlog);

// local server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// index
function home(req, res) {
  res.render("index");
}

// blog

// form blog
function formProject(req, res) {
  res.render("project");
}

function contactMe(req, res) {
  res.render("contact");
}

function projectDetail(req, res) {
  const { id } = req.params;

  const data = {
    id,
    title: "Mobile Developer",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sapien ante, dapibus sed massa eu, ultrices bibendum sapien. Morbi eleifend ex non tortor ultrices, vel congue risus fermentum. Vivamus tincidunt molestie eros blandit elementum. Mauris hendrerit venenatis mi, in porttitor odio condimentum nec.",
  };

  res.render("project_detail", { data });
}
module.exports = app;

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

const dataBlog = [
  {
    id: 1,
    title: "Mobile Developer",
    startDate: "2019",
    endDate: "2020",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sapien ante, dapibus sed massa eu, ultrices bibendum sapien. Morbi eleifend ex non tortor ultrices, vel congue risus fermentum.",
    postedAt: new Date(),
  },
  {
    id: 2,
    title: "FrontEnd Developer",
    startDate: "2022",
    endDate: "2023",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sapien ante, dapibus sed massa eu, ultrices bibendum sapien. Morbi eleifend ex non tortor ultrices, vel congue risus fermentum.",
    postedAt: new Date(),
  },
  {
    id: 3,
    title: "BackEnd Developer",
    startDate: "2022",
    endDate: "2023",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sapien ante, dapibus sed massa eu, ultrices bibendum sapien. Morbi eleifend ex non tortor ultrices, vel congue risus fermentum.",
    postedAt: new Date(),
  },
];
// routing
app.get("/", home);
app.get("/contact", contactMe);
app.get("/project-detail/:id", projectDetail);
app.post("/project", addProject);
app.get("/project", formProject);
app.get("/delete-project/:id", deleteProject);

// local server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// index
function home(req, res) {
  res.render("index", { dataBlog });
}

// blog

// form blog
function formProject(req, res) {
  res.render("project");
}

function contactMe(req, res) {
  res.render("contact");
}

function addProject(req, res) {
  const { title, content, startDate, endDate } = req.body;

  const data = {
    title,
    content,
    startDate,
    endDate,
    author: "Mochammad Qemal Firza",
    postedAt: new Date(),
  };
  // console.log(title, content, startDate, endDate);

  dataBlog.push(data);
  console.log(dataBlog.length);
  res.redirect("/");
}

function projectDetail(req, res) {
  const { id } = req.params;

  res.render("project_detail", { data: dataBlog[id] });
}

function deleteProject(req, res) {
  const { id } = req.params;

  dataBlog.splice(id, 1);
  res.redirect("/");
}

module.exports = app;

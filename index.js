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
    title: "Mobile Developer",
    startDate: "2019-06-08",
    endDate: "2020-06-09",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sapien ante, dapibus sed massa eu, ultrices bibendum sapien. Morbi eleifend ex non tortor ultrices, vel congue risus fermentum.",
    postedAt: new Date(),
  },
  {
    title: "FrontEnd Developer",
    startDate: "2022-01-5",
    endDate: "2023-02-03",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sapien ante, dapibus sed massa eu, ultrices bibendum sapien. Morbi eleifend ex non tortor ultrices, vel congue risus fermentum.",
    postedAt: new Date(),
  },
  {
    title: "BackEnd Developer",
    startDate: "2021-01-06",
    endDate: "2023-02-01",
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
app.get("/edit-project/:id", editProject);
app.post("/edit-project/:id", updateProject);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

function home(req, res) {
  res.render("index", { dataBlog });
}

function formProject(req, res) {
  res.render("project");
}

function contactMe(req, res) {
  res.render("contact");
}

function addProject(req, res) {
  const { title, content, startDate, endDate } = req.body;

  const durasi = getDurasi(startDate, endDate);

  const data = {
    title,
    content,
    startDate,
    endDate,
    durasi,
    author: "Mochammad Qemal Firza",
    postedAt: new Date(),
  };
  // console.log(title, content, startDate, endDate);

  dataBlog.push(data);
  console.log(durasi);
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

function editProject(req, res) {
  const { id } = req.params;
  res.render("edit_project", { data: dataBlog[id] });
}

function updateProject(req, res) {
  const id = req.params;
  const projectIndex = dataBlog.findIndex((project) => project.id === id);
  const { title, content, startDate, endDate } = req.body;

  const durasi = getDurasi(startDate, endDate);

  const data = {
    title,
    content,
    startDate,
    endDate,
    durasi,
    author: "Mochammad Qemal Firza",
    postedAt: new Date(),
  };

  dataBlog.splice(projectIndex, 1, data);
  res.redirect("/");
}

function getDurasi(startDate, endDate) {
  let start = new Date(startDate);
  let end = new Date(endDate);
  if (start > end) {
    return alert("End date should be greater than start date");
  }

  let waktu = end.getTime() - start.getTime();

  let hari = waktu / (1000 * 3600 * 24);
  let minggu = Math.floor(hari / 7);
  let bulan = Math.floor(minggu / 4);
  let tahun = Math.floor(bulan / 12);
  let durasi = "";

  if (hari > 0) {
    durasi = hari + " Day";
  }
  if (minggu > 0) {
    durasi = minggu + " Week";
  }
  if (bulan > 0) {
    durasi = bulan + " Month";
  }
  if (tahun > 0) {
    durasi = tahun + " Year";
  }

  return durasi;
}

dataBlog.forEach((blog) => {
  blog.durasi = getDurasi(blog.startDate, blog.endDate);
});

module.exports = app;

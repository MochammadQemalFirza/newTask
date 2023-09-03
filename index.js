const express = require("express");
const app = express();
const PORT = 5000;
const path = require("path");

// sequelize init
const config = require("./src/config/config.json");
const { Sequelize, QueryTypes } = require("sequelize");
const sequelize = new Sequelize(config.development);

// setup call hbs with sub folder
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "src/views"));

// set serving static file
app.use(express.static("src/assets"));

// parsing data from client
app.use(express.urlencoded({ extended: false }));

// const dataBlog = [
//   {
//     title: "Mobile Developer",
//     startDate: "2019-06-08",
//     endDate: "2020-06-09",
//     Java: true,
//     NodeJS: false,
//     Golang: false,
//     ReactJS: false,
//     content:
//       "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sapien ante, dapibus sed massa eu, ultrices bibendum sapien. Morbi eleifend ex non tortor ultrices, vel congue risus fermentum.",
//     postedAt: new Date(),
//   },
//   {
//     title: "FrontEnd Developer",
//     startDate: "2022-01-5",
//     endDate: "2023-02-03",
//     Java: false,
//     NodeJS: false,
//     Golang: false,
//     ReactJS: true,
//     content:
//       "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sapien ante, dapibus sed massa eu, ultrices bibendum sapien. Morbi eleifend ex non tortor ultrices, vel congue risus fermentum.",
//     postedAt: new Date(),
//   },
//   {
//     title: "BackEnd Developer",
//     startDate: "2021-01-06",
//     endDate: "2023-02-01",
//     Java: false,
//     NodeJS: true,
//     Golang: true,
//     ReactJS: false,
//     content:
//       "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sapien ante, dapibus sed massa eu, ultrices bibendum sapien. Morbi eleifend ex non tortor ultrices, vel congue risus fermentum.",
//     postedAt: new Date(),
//   },
// ];
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

async function home(req, res) {
  try {
    const query = `SELECT * FROM "Projects";`;
    let obj = await sequelize.query(query, { type: QueryTypes.SELECT });
    res.render("index", { dataBlog: obj });
  } catch (error) {
    console.log(error);
  }
}

function formProject(req, res) {
  res.render("project");
}

function contactMe(req, res) {
  res.render("contact");
}

async function addProject(req, res) {
  try {
    const { title, content, startDate, endDate } = req.body;
    const image =
      "https://i.pinimg.com/564x/64/60/fc/6460fcd2c440c95b32358ddf2dbb6570.jpg";

    await sequelize.query(
      `INSERT INTO "Projects" (title, content, image, duration, "createdAt", "updatedAt", "startDate", "endDate", "postedAt") VALUES ('${title}', '${content}', '${image}', '${duration(
        startDate,
        endDate
      )}',NOW(), NOW(), '${startDate}', '${endDate}', NOW())`
    );

    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
}

async function projectDetail(req, res) {
  try {
    const { id } = req.params;
    const query = `SELECT * FROM "Projects" WHERE id='${id}';`;
    let obj = await sequelize.query(query, { type: QueryTypes.SELECT });
    const dataBlog = obj.map((res) => ({
      ...res,
      author: "Mochammad Qemal Firza",
    }));
    res.render("project_detail", { data: dataBlog[0] });
  } catch (error) {
    console.log(error);
  }
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
  const { title, content, startDate, endDate, Java, NodeJS, Golang, ReactJS } =
    req.body;

  const durasi = durasi(startDate, endDate);

  const data = {
    title,
    content,
    startDate,
    endDate,
    durasi,
    Java,
    NodeJS,
    Golang,
    ReactJS,
    author: "Mochammad Qemal Firza",
    postedAt: new Date(),
  };

  dataBlog.splice(projectIndex, 1, data);
  res.redirect("/");
}

function duration(startDate, endDate) {
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

// dataBlog.forEach((project) => {
//   project.duration = getDurasi(project.startDate, project.endDate);
// });

module.exports = app;

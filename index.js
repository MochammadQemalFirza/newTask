const express = require("express");
const app = express();
const PORT = 5000;
const path = require("path");
const bcrypt = require("bcrypt");
const session = require("express-session");
const flash = require("express-flash");
const upload = require("./src/middlewares/uploadFiles");

// sequelize init
const config = require("./src/config/config.json");
const { Sequelize, QueryTypes } = require("sequelize");
const sequelize = new Sequelize(config.development);

// setup call hbs with sub folder
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "src/views"));

// set serving static file
app.use(express.static("src/assets"));
app.use(express.static("src/uploads"));

// parsing data from client
app.use(express.urlencoded({ extended: false }));

app.use(flash());

app.use(
  session({
    cookie: {
      maxAge: 1000 * 60 * 60 * 2,
      secure: false,
      httpOnly: true,
    },
    store: new session.MemoryStore(),
    resave: false,
    secret: "secretValue",
    saveUninitialized: true,
  })
);

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
app.post("/project", upload.single("uploadImage"), addProject);
app.get("/project", formProject);
app.get("/delete-project/:id", deleteProject);
app.get("/edit-project/:id", editProject);
app.post("/edit-project/:id", updateProject);
app.get("/register", register);
app.post("/register", addUser);
app.get("/login", login);
app.post("/login", userLogin);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

async function home(req, res) {
  try {
    const query = `SELECT "Projects".id, title, content, image, duration, nodejs, golang, reactjs, java, "Users".name as author  FROM "Projects" left join "Users" on "Projects".author = "Users".id ;`;
    let obj = await sequelize.query(query, { type: QueryTypes.SELECT });
    data = obj.map((datas) => ({
      ...datas,
      isLogin: req.session.isLogin,
      user: req.session.user,
    }));
    res.render("index", {
      dataBlog: data,
      nameUser: req.session.user,
      isLogin: req.session.isLogin,
    });
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
    const author = req.session.idUser;
    const image = req.file.filename;
    console.log(image);
    const query = `INSERT INTO "Projects" (title, content, image, duration, author, "createdAt", "updatedAt", "startDate", "endDate", "postedAt",nodejs,golang,reactjs, java) VALUES ('${title}', '${content}', '${image}', '${duration(
      startDate,
      endDate
    )}', ${author}, NOW(), NOW(), '${startDate}', '${endDate}', NOW()), :nodejs, :golang, :reeactjs,:java`;
    await sequelize.query(query, {
      replacement: {
        node: req.body.nodejs ? true : false,
        golang: req.body.golang ? true : false,
        react: req.body.react ? true : false,
        js: req.body.javascript ? true : false,
      },
      type: QueryTypes.INSERT,
    });

    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
}

async function projectDetail(req, res) {
  try {
    const { id } = req.params;
    const query = `SELECT "Projects".id, title, content, image, duration, "postedAt", "Users".name as author  FROM "Projects" left join "Users" on "Projects".author = "Users".id WHERE "Projects".id='${id}';`;
    let obj = await sequelize.query(query, { type: QueryTypes.SELECT });
    const dataBlog = obj.map((res) => ({
      ...res,
    }));
    res.render("project_detail", { data: dataBlog[0] });
  } catch (error) {
    console.log(error);
  }
}

async function deleteProject(req, res) {
  const { id } = req.params;
  const query = `DELETE FROM "Projects" WHERE id=${id}`;

  await sequelize.query(query);

  res.redirect("/");
}

async function editProject(req, res) {
  const { id } = req.params;
  const query = `SELECT * FROM "Projects" WHERE id=${id}`;
  let obj = await sequelize.query(query, { type: QueryTypes.SELECT });

  const data = obj.map((item) => ({
    ...item,
  }));
  res.render("edit_project", { data: data[0] });
}

async function updateProject(req, res) {
  const { id } = req.params;
  const { title, content, startDate, endDate, Java, NodeJS, Golang, ReactJS } =
    req.body;

  const query = `UPDATE "Projects" SET title='${title}', content='${content}', duration='${duration(
    startDate,
    endDate
  )}', "updatedAt"=NOW(), "startDate"='${startDate}', "endDate"='${endDate}' WHERE id=${id}`;

  await sequelize.query(query);

  res.redirect("/");
}

function register(req, res) {
  res.render("register");
}

async function addUser(req, res) {
  try {
    const { name, email, password } = req.body;
    const salt = 10;
    await bcrypt.hash(password, salt, (err, hashPassword) => {
      const query = `INSERT INTO "Users" (name, email, password, "createdAt", "updatedAt") VALUES ('${name}', '${email}', '${hashPassword}', NOW(), NOW()) `;
      sequelize.query(query);
      res.redirect("/login");
    });
  } catch (error) {
    console.log(error);
  }
}

function login(req, res) {
  res.render("login");
}

async function userLogin(req, res) {
  try {
    const { email, password } = req.body;
    const query = `SELECT * FROM "Users" WHERE email='${email}'`;
    let obj = await sequelize.query(query, { type: QueryTypes.SELECT });

    if (!obj.length) {
      req.flash("danger", "User has not been registered");
      res.redirect("/register");
    }

    await bcrypt.compare(password, obj[0].password, (err, result) => {
      if (!result) {
        req.flash("danger", "Wrong Password");
        res.redirect("/login");
      } else {
        req.session.isLogin = true;
        req.session.idUser = obj[0].id;
        req.session.user = obj[0].name;
        req.flash("success", "Login Success");
        res.redirect("/");
      }
    });
  } catch (error) {
    console.log(error);
  }
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

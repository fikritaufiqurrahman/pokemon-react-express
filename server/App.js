const express = require("express");
const multer = require("multer");
const cors = require("cors");
const mysql = require("mysql");
const fs = require("fs");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "pokemon",
});

const app = express();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("server has been starting at port " + PORT);
});
app.use(cors());
app.use(express.static("public"));

const storage = multer.diskStorage({
  destination: "./public/images",
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage }).single("file");

app.post("/pokemon", (req, res) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(408).json(err);
    } else if (err) {
      return res.status(500).json(err);
    }
    let value = [
      [
        req.body.nama,
        req.body.deskripsi,
        req.file.path.replace("public\\images\\", "/images/"),
      ],
    ];
    pool.query(
      "INSERT INTO images (nama, deskripsi, path) VALUES ? ",
      [value],
      (err, result) => {
        if (err) {
          return res.status(500).json(err);
        }
        pool.query("SELECT * FROM images", (err, result) => {
          if (err) {
            return res.status(500).json(err);
          }
          return res.status(200).json(result);
        });
      }
    );
  });
});
let imgPath = "";
app.post("/pokemon/delete", (req, res) => {
  upload(req, res, (err) => {
    pool.query(
      `DELETE FROM images WHERE path = '${req.body.path}'`,
      (err, result) => {
        if (err) {
          return res.status(500).json(err);
        }
        pool.query("SELECT * FROM images", (err, result) => {
          if (err) {
            return res.status(500).json(err);
          }
          return res.status(200).json(result);
        });
      }
    );
    imgPath = "./public" + req.body.path;
    fs.unlinkSync(imgPath);
  });
});

app.get("/pokemon", (req, res) => {
  pool.query("SELECT * FROM images", (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }
    return res.status(200).json(result);
  });
});
app.get("/", (req, res) => {
  res.json({ message: "WELCOME" });
});

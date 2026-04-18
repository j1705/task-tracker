import express from "express";
import pgPromise from "pg-promise";

const pgp = pgPromise();
const db = pgp("postgres://user:password@localhost:5432/tasktracker");

const app = express();

app.get("/", (req, res) => {
  db.one("SELECT $1 AS value", [123])
  .then((data) => {
    res.status(200).json({message: "Hello World", data: data.value});
  })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

app.listen(3000, () => console.log("Server is running on port 3000"));
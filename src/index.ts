import "dotenv/config";
import express from "express";
import pgPromise from "pg-promise";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL is not set. Copy .env.example to .env and configure DATABASE_URL.",
  );
}

const pgp = pgPromise();
const db = pgp(databaseUrl);

const app = express();

app.use(express.json());

app.get("/tasks", (req, res) => {
  db.query("SELECT * FROM tasktracker.tasks")
    .then((data) => {      
      res.status(200).json(data);
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

app.listen(3000, () => console.log("Server is running on port 3000"));

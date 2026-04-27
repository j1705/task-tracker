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

const validateId = (id: string) => {
  if (!id) {
    throw new Error("Id is required");
  };
  if (isNaN(Number(id))) {
    throw new Error("Id must be a number");
  };
  if (Number(id) <= 0) {    
    throw new Error("Id must be greater than 0");  
  };
  return Number(id);
};

const validateDescription = (description: string) => {
  if (!description) {
    throw new Error("Description is required");
  };
  if (description.length < 3) {
    throw new Error("Description must be at least 3 characters");
  };
  if (description.length > 100) {
    throw new Error("Description must be less than 100 characters");
  };
  return description;
};

app.post("/tasks", async (req, res) => {
  try {
    const { description } = req.body;
    const validDescription = validateDescription(description);
    await db.query("INSERT INTO tasktracker.tasks (description) VALUES ($1)", [validDescription])
    res.status(201).json({ message: "Task created successfully" });
  } catch (error: any) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    };
    res.status(500).json({ message: "Internal server error" });    
  };
});

app.get("/tasks", async (req, res) => {
  try{  
  const tasks = await db.query("SELECT * FROM tasktracker.tasks")
  res.status(200).json(tasks);
} catch (error: any) {
  if (error instanceof Error) {
    res.status(400).json({ message: error.message });
  };
  res.status(500).json({ message: "Internal server error" });
};
});

app.put("/tasks/:id", async (req, res) => {
  try{  
  const { id } = req.params;
  const validId = validateId(id);
  const task = await db.query("SELECT * FROM tasktracker.tasks WHERE id = $1", [validId]);
  if (task.length === 0) {
    return res.status(404).json({ message: "Task not found" });
  };
  const { description } = req.body;
  const validDescription = validateDescription(description);
  await db.query("UPDATE tasktracker.tasks SET description = $1 WHERE id = $2", [validDescription, validId])
  res.status(200).json({ message: "Task updated successfully" });
} catch (error: any) {
  if (error instanceof Error) {
    res.status(400).json({ message: error.message });
  };
  res.status(500).json({ message: "Internal server error" });
};
});

app.delete("/tasks/:id", async (req, res) => {
  try{  
  const { id } = req.params;
  const validId = validateId(id);
  const task = await db.query("SELECT * FROM tasktracker.tasks WHERE id = $1", [validId]);
  if (task.length === 0) {
    return res.status(404).json({ message: "Task not found" });
  };
  await db.query("DELETE FROM tasktracker.tasks WHERE id = $1", [validId])
  res.status(200).json({ message: "Task deleted successfully" });
} catch (error: any) {
  if (error instanceof Error) {
    res.status(400).json({ message: error.message });
  };
  res.status(500).json({ message: "Internal server error" });
};
});

app.listen(3000, () => console.log("Server is running on port 3000"));
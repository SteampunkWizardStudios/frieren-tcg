import express from "express";
import cors from "cors";
import { readFile, writeFile } from "fs/promises";
import path from "path";

const app = express();
const port = 3000;

const jsonPath =
  "../tcg/characters/characterData/characters/characterStats.json";
const statsPath = path.join(__dirname, jsonPath);

const ACCEPTED_CHARACTER_INPUT = new Set(["Sein", "Serie"]);

// Middleware to parse JSON bodies and enable CORS
app.use(express.json());
app.use(cors());

// GET endpoint to read the stats
app.get("/stats", async (_req, res) => {
  try {
    const data = await readFile(statsPath, "utf8");
    res.json(JSON.parse(data));
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to read stats" });
  }
});

// PUT endpoint to update the stats
app.put("/stats/:character", async (req, res) => {
  try {
    const data = await readFile(statsPath, "utf8");
    const stats = JSON.parse(data);

    if (ACCEPTED_CHARACTER_INPUT.has(req.params.character)) {
      stats[req.params.character] = req.body;
      await writeFile(statsPath, JSON.stringify(stats, null, 2));
      res.json({ message: `Stats updated successfully` });
    } else {
      res.status(400).json({
        error: `Invalid character ${req.params.character}. Character can only be "Serie" or "Sein".`,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to update stats" });
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});

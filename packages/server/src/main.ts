import express from "express";
import { Channel, reaper } from "./reaper.js";
import cors from "cors";
import { nanoid } from "nanoid/async";
import { createTempDirectory, exportToXLSX } from "./utils.js";
import { readFile, writeFile } from "fs/promises";
import path from "path";

const PORT = process.env.PORT || 4000;

async function main() {
  const app = express();

  app.use(express.json());
  app.use(cors());

  app.post("/", async (req, res) => {
    const urls: string[] = req.body?.urls;
    console.log("urls to reap", req.body);

    try {
      const id = await nanoid();
      const channels = await reaper(urls);

      // Save results in a JSON file for later use
      writeFile(
        path.join(process.cwd(), `temp/${id}.json`),
        JSON.stringify(channels)
      );

      res.json({ id, channels });
    } catch (error) {
      console.error("reaper error:", error);
      res.status(400).json({ error: "Something went wrong" });
    }
  });

  app.get("/download/:id", async (req, res) => {
    const id = req.params?.id;
    let data: Channel[] = [];

    if (!id) {
      res.status(400).json({ error: "session ID is required" });
    }

    try {
      data = JSON.parse(
        await readFile(path.join(process.cwd(), `temp/${id}.json`), "utf8")
      );
    } catch (error) {
      console.error("Failed to read JSON file:", error);
      res.status(404).json({ error: "failed to get session" });
      return;
    }

    if (data.length > 0) {
      try {
        const sheetBuffer = exportToXLSX(data);
        res.statusCode = 200;
        res.setHeader(
          "Content-Disposition",
          `attachment; filename="${id}.xlsx"`
        );
        res.setHeader("Content-Type", "application/vnd.ms-excel");
        res.end(sheetBuffer);
      } catch (error) {
        console.error("Failed to write sheet buffer:", error);
        res.status(500).json({ error: "failed to generate spreadsheet" });
      }
    } else {
      console.error("Empty data buffer. Skip generating file:");
      res.status(500).json({ error: "failed to generate spreadsheet" });
    }
  });

  createTempDirectory();

  app.listen(PORT, () => console.log(`Server running on PORT: ${PORT}`));
}

main().catch((error) => console.error("Server exception:", error));

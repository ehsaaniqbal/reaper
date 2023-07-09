import express from "express";
import { reaper } from "./reaper.js";
import cors from "cors";

const PORT = process.env.PORT || 4000;

async function main() {
  const app = express();

  app.use(express.json());
  app.use(cors());

  app.post("/", async (req, res) => {
    const urls: string[] = req.body?.urls;

    try {
      console.log("urls to reap", req.body);
      const channels = await reaper(urls);
      res.json(channels);
    } catch (error) {
      console.error("reaper error:", error);
      res.status(400).json({ error: "Invalid url scheme" });
    }
  });

  app.listen(PORT, () => console.log(`server running on PORT: ${PORT}`));
}

main().catch((error) => console.error("server exception:", error));

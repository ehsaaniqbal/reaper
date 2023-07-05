import express from "express";
import { reaper } from "./reaper.ts";

const PORT = process.env.PORT || 4000;

async function main() {
  const app = express();

  app.use(express.json());

  app.post("/", async (req, res) => {
    console.log(req.body);
    const urls: string[] = req.body?.urls;
    const channels = await reaper(urls);

    res.json(channels);
  });

  app.listen(PORT, () => console.log(`server running on PORT: ${PORT}`));
}

main().catch((error) => console.error("server exception:", error));

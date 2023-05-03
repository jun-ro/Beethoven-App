require("@tensorflow/tfjs-node");
const express = require("express");
const use = require("@tensorflow-models/universal-sentence-encoder");
const path = require("node:path");
const Herm = require("./Modules/server/Hermes.js");
const fs = require("node:fs");
const app = express();
const port = 3000;

const maxTokens = 2;
let currentTokens = maxTokens;
const refillRate = 1; // tokens per second
let lastRefillTime = Date.now();

// Middleware function to rate limit requests using token bucket algorithm
function rateLimiter(req, res, next) {
  // Refill the token bucket based on refill rate
  const currentTime = Date.now();
  const timeSinceLastRefill = currentTime - lastRefillTime;
  const tokensToAdd = Math.floor((timeSinceLastRefill * refillRate) / 1000);
  currentTokens = Math.min(currentTokens + tokensToAdd, maxTokens);
  lastRefillTime = currentTime;

  // Check if there are enough tokens to allow the request
  if (currentTokens > 0) {
    currentTokens--;
    next();
  } else {
    res.status(429).send("Too many requests");
  }
}

const Hermes = new Herm("storage", app);

app.use(express.static(path.join(process.cwd(), "src")));

app.get("/", async (req, res) => {
  res.sendFile("index.html");
});

Hermes.ServeFolder("scripts", path.join(process.cwd(), "src/js"));
Hermes.ServeFolder("styles", path.join(process.cwd(), "src/styles"));
Hermes.ServeFolder("images", path.join(process.cwd(), "lol"));
Hermes.ServeFolder("clientmodules", path.join(process.cwd(), "Modules/client"))

app.get("/api/use", rateLimiter, async (req, res) => {
  const input = req.query.input;

  const modelPromise = use.load();

  // Define some example responses
  const responses = JSON.parse(fs.readFileSync(path.join(process.cwd(), "data/large_dataset.json"), "utf-8"))


  const model = await modelPromise;
  const inputEmbedding = await model.embed([input]);

  // Find the closest matching response to the user's input
  let bestMatch = "";
  let bestScore = -Infinity;
  for (const [response, responseTexts] of Object.entries(responses)) {
    const responseEmbedding = await model.embed([response]);
    for (const responseText of responseTexts) {
      const score = await inputEmbedding
        .dot(responseEmbedding.transpose())
        .data();
      if (score > bestScore) {
        bestMatch = responseText;
        bestScore = score;
      }
    }
  }

  // Output the best matching response to the user
  res.send(bestMatch);
});

app.listen(port, async () => {
  console.clear();
  console.log(`\nBeethoven the Kitty is listening on port ${port}\
\n
 ╱|、
(˚ˎ 。7  
 |、˜〵          
 じしˍ,)ノ
    `);
});

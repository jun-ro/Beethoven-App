require("@tensorflow/tfjs-node");
require("dotenv").config();
const express = require("express");
const use = require("@tensorflow-models/universal-sentence-encoder");
const path = require("node:path");
const Herm = require("./Modules/server/Hermes.js");
const fs = require("node:fs");
const fetch = require("node-fetch-commonjs");
const bodyParser = require("body-parser");
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
app.use(bodyParser.json());

app.get("/", async (req, res) => {
  res.sendFile("index.html");
});

Hermes.ServeFolder("scripts", path.join(process.cwd(), "src/js"));
Hermes.ServeFolder("styles", path.join(process.cwd(), "src/styles"));
Hermes.ServeFolder("images", path.join(process.cwd(), "lol"));
Hermes.ServeFolder("clientmodules", path.join(process.cwd(), "Modules/client"));

app.post("/api/use", rateLimiter, async (req, res) => {
  const inputStr = req.query.input;
  const {input, responseHistory} = req.body

  console.log({input, responseHistory})
  async function query(data) {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/jun-ai/BeethovenBot",
      {
        headers: { Authorization: `Bearer ${process.env.TOKEN}` },
        method: "POST",
        body: JSON.stringify(data),
      }
    );
    const result = await response.json();
    return result;
  }

  try {
    query({
      inputs: {
        "past_user_inputs": input,
        "generated_responses": responseHistory,
        "text": inputStr.toString()
      },
    }).then((response) => {
      res.send(response);
    });
  } catch (error) {
    res.send(error);
  }
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

require("dotenv").config(); //read .env files
const {
  getRates,
  getSymbols,
  getHistoricalRate,
} = require("./lib/fixer-service");
const { convertCurrency } = require("./lib/free-currency-service");

const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

// Set `public` folder as root
app.use(express.static("public"));

// Parse POST data as URL encoded
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// Parse POST data as JSON
app.use(bodyParser.json());

//Express Error handler
const errorHandler = (err, req, res) => {
  if (err.response) {
    //the request was made and the server responded with a status code that falls out of the range of 2xx
    res
      .status(402)
      .send({ title: "Server responded with an error", message: err.message });
  } else if (err.request) {
    //the request was made but no response received
    res.status(503).send({
      title: "Unable to communicate with server",
      message: err.message,
    });
  } else {
    //Something happened in setting up the request that triggered an Error
    res
      .status(500)
      .send({ title: "An unexpected error occurred.", message: err.message });
  }
};

//Fetch rates
app.get("/api/rates/", async (req, res) => {
  try {
    const data = await getRates();
    res.setHeader("Content-Type", "application/json");
    res.send(data);
  } catch (error) {
    errorHandler(error, req, res);
  }
});

//Fetch symbols
app.get("/api/symbols", async (req, res) => {
  try {
    const data = await getSymbols();
    res.setHeader("Content-Type", "application/json");
    res.send(data);
  } catch (error) {
    errorHandler(error, req, res);
  }
});

//Convert Currency
app.post("/api/convert", async (req, res) => {
  try {
    const { from, to } = req.body;
    const data = await convertCurrency(from, to);
    res.setHeader("Content-Type", "application/json");
    res.send(data);
  } catch (error) {
    errorHandler(error, res, req);
  }
});

//Fetch Currency Rates by date
app.post("/api/historical", async (req, res) => {
  try {
    const { date } = req.body;
    const data = await getHistoricalRate(date);
    res.setHeader("Content-Type", "application/json");
    res.send(data);
  } catch (error) {
    errorHandler(error, req, res);
  }
});

// Allow front-end access to node_modules folder
app.use("/scripts", express.static(`${__dirname}/node_modules`));

// Redirect all traffic to index.html
app.use((req, res) => res.sendFile(`${__dirname}/public/index.html`));

// listen for HTTP requests on port 3000
app.listen(port, () => {
  console.log("listening on %d", port);
});

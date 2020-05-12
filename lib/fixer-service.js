require("dotenv").config(); //read .env files

const axios = require("axios");

const symbols = process.env.SYMBOLS || "EUR,USD,GBP";

//Axios client declaration
const api = axios.create({
  baseURL: "http://data.fixer.io/api",
});

module.exports = {
  getRates: () =>
    api
      .get(`/latest&symbols=${symbols}&base=EUR`, {
        params: {
          access_key: process.env.API_KEY,
        },
        timeout: 5000,
      })
      .then((res) => {
        return res.data;
      }),
};

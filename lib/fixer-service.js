require("dotenv").config(); //read .env files

const axios = require("axios");

const symbols = process.env.SYMBOLS || "EUR,USD,GBP";

//Axios client declaration
const api = axios.create({
  baseURL: "http://data.fixer.io/api",
  params: {
    access_key: process.env.API_KEY,
  },
  timeout: process.env.TIMEOUT || 5000,
});

//Generic GET method function
const get = async (url) => {
  try {
    const response = await api.get(url);
    const { data } = response;
    if (data.success) {
      return data;
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getRates: () => get(`/latest&symbols=${symbols}&base=EUR`),
};

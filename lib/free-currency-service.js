require("dotenv").config(); //read .env files

const axios = require("axios");

const config = {
  params: {
    apiKey: process.env.CONVERTER_API_KEY,
  },
  timeout: process.env.TIMEOUT || 7000,
};

const api = axios.create({
  baseURL: "https://free.currencyconverterapi.com/api/v5",
});

module.exports = {
  convertCurrency: async (from, to) => {
    try {
      const response = await api.get(
        `/convert?q=${from}_${to}&compact=y`,
        config
      );
      const key = Object.keys(response.data)[0];
      const { val } = response.data[key];
      return { rate: val };
    } catch (error) {
      console.log(error);
    }
  },
};

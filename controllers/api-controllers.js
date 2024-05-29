const fs = require("fs/promises");
const path = require("path");
const endpoints = path.join(__dirname, "..", "endpoints.json");


exports.getEndpoints = (req, res, next) => {
  return fs
    .readFile(endpoints, "utf-8")
    .then((data) => {
      const parsedData = JSON.parse(data);
      res.json(parsedData);
    })
    .catch((err) => {
      console.log(err);
    });
};

const fs = require("fs/promises");
const path = require("path");

const endpoints = path.join(__dirname, "..", "endpoints.json");

exports.selectEndpoints = (req, res, next) => {
  return fs
    .readFile(endpoints, "utf-8")
    .then((data) => {
      const array = [];
      const parsedData = JSON.parse(data);
      for (let obj in parsedData) {
        const object = {};
        object[obj] = parsedData[obj];
        array.push(object);
      }
      return array;
    })
    .catch((err) => {
      console.log(err);
    });
};

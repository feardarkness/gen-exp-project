const bunyan = require("bunyan");
const path = require("path");
const { name } = require("../package.json");

function formatDate(date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("");
}

const streams = [
  {
    type: "rotating-file",
    period: "1d", // period of rotation
    count: 10, // number of files rotated to be kept
    path: path.join(__dirname, `../logs`, `log-${formatDate(new Date())}.log`),
  },
];

if (process.env.NODE_ENV !== "production" && process.env.NODE_ENV !== "test") {
  streams.push({
    level: "info",
    stream: process.stdout,
  });
}

const log = bunyan.createLogger({
  name,
  streams,
});

module.exports = log;

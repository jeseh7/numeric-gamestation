const express = require('express');
const cors = require('cors');
const schedule = require('node-schedule');
const app = express();
const port = 5000;

app.use(cors());

let dailyNumber = generateDailyNumber();

function generateDailyNumber() {
  let number = '';
  for (let i = 0; i < 10; i++) {
    number += Math.floor(Math.random() * 10).toString();
  }
  return number;
}

// Schedule the number to change at 12:00 PM every day
const job = schedule.scheduleJob('0 12 * * *', () => {
  dailyNumber = generateDailyNumber();
});

app.get('/api/daily-number', (req, res) => {
  res.json({ number: dailyNumber });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

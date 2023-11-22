const express = require('express');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(express.json());
app.use(cors());

app.post('/api', (req, res) => {
  const receivedData = req.body.data;

  const time = receivedData.time;
  const data = receivedData.data;

  const windowSize = 3;
  const forecastCount = 60;
  const { mvg, timeWithForecast } = calculateMovingAverage(data, time, windowSize, forecastCount);

  const response = { message: 'Hello, World!', mvg, time: timeWithForecast };
  res.json(response);
});

function calculateMovingAverage(data, time, windowSize, forecastCount) {
  const movingAvgList = [];
  const timeWithForecast = [...time];

  for (let i = 0; i < data.length; i++) {
    const startIndex = Math.max(0, i - windowSize + 1);
    const valuesToAverage = data.slice(startIndex, i + 1);
    const avg = valuesToAverage.reduce((sum, value) => sum + value, 0) / valuesToAverage.length;
    movingAvgList.push(avg);
  }

  let lastMovingAvg = movingAvgList[movingAvgList.length - 1];

  for (let i = 0; i < forecastCount; i++) {
    lastMovingAvg = (lastMovingAvg * (windowSize - 1) + lastMovingAvg) / windowSize;
    movingAvgList.push(lastMovingAvg);

    const lastTime = new Date(timeWithForecast[timeWithForecast.length - 1]);
    const nextTime = new Date(lastTime);
    nextTime.setHours(nextTime.getHours() + 1); 
    timeWithForecast.push(nextTime.toISOString());
  }

  return { mvg: movingAvgList, timeWithForecast };
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

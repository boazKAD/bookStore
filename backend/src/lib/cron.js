import cron from 'cron';
import http from 'http';

// Schedule a task to run every 14 minutes
const job = new cron.CronJob('*/14 * * * *', () => {
  http.get(process.env.SERVER_URL, (res) => {
    if (res.statusCode === 200) console.log('Server is awake');
    else console.log('Failed to wake up the server');
  }).on('error', (e) => {
    console.error(`Error waking up the server: ${e.message}`);
  });
   
});

export default job;
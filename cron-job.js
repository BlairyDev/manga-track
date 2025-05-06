const cron = require('node-cron');
const axios = require('axios');

function startCronJob() {
    cron.schedule('*/10 * * * *', async () => {
        const response = await axios.get("http://localhost:8080/check")
        console.log(response.data)
    });
}

module.exports = startCronJob;
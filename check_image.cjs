const https = require('https');

const options = {
    hostname: 'foodtrack-ghostfinal-production.up.railway.app',
    path: '/uploads/cheeseburger-doble.png',
    method: 'HEAD'
};

const req = https.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
});

req.end();

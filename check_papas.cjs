const https = require('https');

const path = '/uploads/papas-fritas.png';
const options = {
    hostname: 'foodtrack-ghostfinal-production.up.railway.app',
    path: path,
    method: 'HEAD'
};

console.log(`Checking ${path}...`);

const req = https.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
});

req.end();

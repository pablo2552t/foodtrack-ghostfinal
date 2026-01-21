const https = require('https');

const options = {
    hostname: 'foodtrack-ghostfinal-production.up.railway.app',
    path: '/products',
    method: 'GET'
};

const req = https.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        try {
            const products = JSON.parse(data);
            console.log('--- PRODUCTS IN DB ---');
            products.forEach(p => {
                console.log(`Name: ${p.name}`);
                console.log(`Image: ${p.imageUrl}`);
                console.log('---');
            });
        } catch (e) {
            console.error(e.message);
        }
    });
});

req.on('error', (e) => {
    console.error(e);
});

req.end();

const https = require('https');

const url = 'https://ecombackend-vl7q.onrender.com/getAllProducts';

console.log(`Fetching products from: ${url}`);

https.get(url, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const jsonData = JSON.parse(data);
      if (jsonData.success) {
        console.log(`✅ Success! Fetched ${jsonData.data.length} products.`);
        if (jsonData.data.length > 0) {
            const prod = jsonData.data[0];
            console.log(`Product Keys: ${Object.keys(prod).join(', ')}`);
            console.log(`Quantity Value: ${prod.quantity}`);
        }
      } else {
        console.log('❌ Failed: API returned success=false');
      }
    } catch (e) {
      console.error('❌ Error parsing JSON:', e.message);
    }
  });

}).on('error', (err) => {
  console.error('❌ Network Error:', err.message);
});

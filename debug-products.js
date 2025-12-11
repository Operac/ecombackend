const https = require('https');

const url = "https://ecombackend-vl7q.onrender.com/getAllProducts";

console.log(`Fetching products from ${url}...`);

https.get(url, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      if (json.success && json.data) {
        console.log(`✅ Success! Fetched ${json.data.length} products.\n`);
        
        // Analyze first product
        if (json.data.length > 0) {
            console.log("--- First Product Structure ---");
            console.log(JSON.stringify(json.data[0], null, 2));
            console.log("-------------------------------\n");
        }

        // Analyze Categories
        const categories = {};
        json.data.forEach(p => {
            const cat = p.category ? p.category : "(undefined)";
            categories[cat] = (categories[cat] || 0) + 1;
        });

        console.log("--- Unique Categories Found ---");
        console.table(categories);
        
        // Check "Men" Logic
        const menMatches = json.data.filter(item => 
            item.category?.toLowerCase() === "men" || 
            item.category?.toLowerCase() === "male" ||
            item.category?.toLowerCase() === "man"
        );
        console.log(`\nLocal Logic Check: Found ${menMatches.length} items that match 'men', 'male', or 'man'.`);

      } else {
        console.log("❌ API returned success=false or no data:", json);
      }
    } catch (e) {
      console.error("❌ Failed to parse JSON:", e.message);
      console.log("Raw Data Preview:", data.substring(0, 200));
    }
  });

}).on('error', (e) => {
  console.error("❌ Network Error:", e);
});

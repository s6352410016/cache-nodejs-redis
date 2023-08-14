const express = require('express');
const redis = require('redis');
const fetch = require('node-fetch');
const app = express();
const client = redis.createClient();

// connect to redis
(async () => {
    await client.connect();
})();

app.get('/products' , async (req , res) => {
    try{
        // get data from redis
        const cache = await client.get('products');
        if(cache){
            return res.status(200).json(JSON.parse(cache));
        }

        const response = await fetch('https://dummyjson.com/products?limit=10');
        const data = await response.json();

        // set data to redis
        client.setEx('products' , 60 , JSON.stringify(data.products));
        
        return res.status(200).json(data.products);
    }catch(err){
        return res.status(500).json(err);
    }
});

app.listen(5000 , () => {
    console.log('Starting server...');
});
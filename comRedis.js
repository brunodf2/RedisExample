const express = require('express');
const responseTime = require('response-time');
const axios = require('axios');
const redis = require('redis');
const client = redis.createClient()


const app = express()
app.use(responseTime());

const getBook = (req, res) => {
  const isbn = req.query.isbn;
  const url = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`;

  axios.get(url)
    .then(response => {
      const book = response.data.items
      
      // Define a string isbn como a chave do nosso cache. O conteúdo é o título.
      // Expiração do cache para 1h (60min x 60s)
      client.setex(isbn, 3600, JSON.stringify(book))
      res.json(book)
    })
     .catch(err => {
       res.json('Book not found!!')
     }); 
};

const getCache = (req, res) => {
  const isbn = req.query.isbn;

  //Verifica os dados do cache primeiro
  client.get(isbn, (err, result) => {
    if(result) {
      res.json(result)
    } else {
      getBook(req, res)
    }
  })
}


app.get('/book', getCache)

app.listen(3000, () => {
  console.log('Servidor COM REDIS na porta 3000!')
})
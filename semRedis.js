const express = require('express');
const responseTime = require('response-time');
const axios = require('axios')

const app = express()

app.use(responseTime());

const getBook = (req, res) => {
  const isbn = req.query.isbn;
  const url = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`;

  axios.get(url)
    .then(response => {
      let book = response.data.items
      res.json(book)
    })
     .catch(err => {
       res.json('Book not found!!')
     }); 
}

app.get('/book', getBook)

app.listen(3001, () => {
  console.log('Servidor SEM REDIS na porta 3001!')
})
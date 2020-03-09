const Router = require('express').Router();
// const controller = require('./controller.js');

Router
  .route('/')
  .get((req, res) => {
    res.status(200).send('Hello');
  });

// Router
//   .route('/allQuestions')
//   .get(controller.getQuestions)

// Router
//   .route('/enterRoom')
//   .get(socket())

module.exports = Router;
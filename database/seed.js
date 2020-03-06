const mongoose = require('mongoose');
const Question = require('./');

var questions = [
  { prompt: "Say the name of your favorite movie." },
  { prompt: "Give a compliment to the player to your left." },
  { prompt: "Stand up if you're the oldest player." },
  { prompt: "Name a music artist or band that starts with a vowel" },
  { prompt: "Start clapping until the timer ends." },
  { prompt: "Talk like a pirate." },
  { prompt: "Tell the other players what the last thing you've eaten was?" },
  { prompt: "Start singing any Britney Spears song." },
  { prompt: "Say the name of the player to your left." },
  { prompt: "Say this out loud: I'm the Fake player!" },
  { prompt: "Say the name of the player that you think is the best at videogames." },
  { prompt: "Point at the player that has the worst jokes" },
  { prompt: "Say the name of the player who would least likely survive in a deserted island." },
  { prompt: "Start laughing." }
];

function seeder(data) {
  Question.create(data)
  .then(() => mongoose.connection.close())
  .then(() => console.log("data seeded successfully...closing connection to mongoDB"));
};

seeder(questions);
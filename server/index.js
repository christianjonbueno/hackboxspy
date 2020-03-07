const path = require('path');
const Router = require('./routes.js');
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const cors = require('cors');
// const playerData = require('../database/playerData.js');
const questions = require('../database/questions.js');
var playerData = {};
var allClients = [];
var i = 1;
var currentSpy = {
  einstein: '',
  sunshine: '',
  outcomes: '',
  pingpong: ''
};
var count = {
  einstein: 0,
  sunshine: 0,
  outcomes: 0,
  pingpong: 0
};

var clientsInRooms= {
  einstein: 0,
  sunshine: 0,
  outcomes: 0,
  pingpong: 0
};

var roomQuestions = {
  einstein: JSON.parse(JSON.stringify(questions)),
  sunshine: JSON.parse(JSON.stringify(questions)),
  outcomes: JSON.parse(JSON.stringify(questions)),
  pingpong: JSON.parse(JSON.stringify(questions)),
};

var voteCount = {
  einstein: 0,
  sunshine: 0,
  outcomes: 0,
  pingpong: 0
}

app.use('/', express.static(path.join(__dirname, '../client/dist')));
app.use('/', Router);

server.listen((8080), () => console.log('Listening on Port 8080'));

io.on('connection', socket => {
  var numClients = socket.server.engine.clientsCount
  allClients.push(socket)
  io.emit('roomCount', clientsInRooms)
  console.log('numClients is now', numClients)

  socket.on('disconnect', () => {
    console.log('A user has disconnected')
    console.log('numClients is now', numClients)
  })

  socket.on('addPlayer', (player) => {
      socket.join(player.room);
      playerData[i] = {
        id : socket.id,
        name : player.username,
        room : player.room,
        score : 0,
        index: i,
        spy: false
      }
      for (var players in playerData) {
        if (playerData[players].id === socket.id) {
          socket.emit('hello_user', playerData[players])
        }
      }
      console.log(`player ${i}'s name is ${playerData[i].name}`);
      io.to(player.room).emit('playerCount', { playerCount: io.sockets.adapter.rooms[player.room].length, playerData: playerData })
      console.log(io.sockets.adapter.rooms[player.room].length, ` in the ${player.room} room`);
      clientsInRooms[player.room] = io.sockets.adapter.rooms[player.room].length;
      console.log(clientsInRooms);
      io.emit('allRooms', clientsInRooms)
      if (clientsInRooms[player.room] === 4) {
        console.log('game is ready');
        var playersInRoom = [];
        for (var keys in playerData) {
          if (playerData[keys].room === player.room) {
            playersInRoom.push(playerData[keys])
          }
        }
        console.log(playersInRoom)
        var spy = playersInRoom[Math.floor(Math.random() * 4)];
        console.log(spy.name, " is the spy!");
        currentSpy[player.room] = spy;
        io.to(player.room).emit('showFakeButton', {playerData});
      }
      i++;
  })
  socket.on('checkRoom', (room) => {
    socket.emit('checkRoomResults', clientsInRooms[room])
  })
  socket.on('ready', data => {
    count[data.room]++;
    console.log(data.id)
    console.log(currentSpy)
    if (data.id === currentSpy[data.room].id) {
      console.log(currentSpy[data.room].name, ' you are the spy')
      io.to(socket.id).emit('spyMessage', {message:`You are the Spy. Try your best to blend in with the others when the time comes!`, picture:'https://i.imgur.com/LHU7oe9.png'});
      if (count[data.room] === 4) {
        io.to(data.room).emit('startButton', {message: 'The game will start once any player presses Begin.'})
        count[data.room] = 0;
      }
    } else if (data.id !== currentSpy[data.room].id) {
      var icons = ['https://i.imgur.com/ItU72KJ.png','https://i.imgur.com/t9nEpJO.png','https://i.imgur.com/qpl1tIb.png','https://i.imgur.com/woX6k9h.png', 'https://i.imgur.com/B8O1ivF.png', 'https://i.imgur.com/22CHU8Q.png', 'https://i.imgur.com/BbYBWwH.png'];
      var randPic = Math.floor(Math.random() * icons.length)
      io.to(socket.id).emit('realMessage', {message:`Someone amongst you is the Spy. Get ready to complete the prompt!`, picture: icons[randPic]});
      if (count[data.room] === 4) {
        io.to(data.room).emit('startButton', {message: 'The game will start once any player presses Begin.'})
        count[data.room] = 0;
      }
    }
  })
  socket.on('getQuestion', (player) => {
    var selected = roomQuestions[player.room][Math.floor(Math.random() * roomQuestions[player.room].length)]
    console.log(selected);
    console.log(roomQuestions[player.room].indexOf(selected))
    roomQuestions[player.room].splice(roomQuestions[player.room].indexOf(selected), 1);
    console.log(roomQuestions[player.room])
    io.to(player.room).emit('sendPrompt', {spyId: currentSpy[player.room].id, spyMessage: 'Try to blend in with the others!', realMessage: selected.prompt});
  })
  socket.on('castVote', (data) => {
    console.log(data)
    console.log(playerData)
    console.log(playerData[data.player.index])
    if (data.voteId === currentSpy[data.room].id) {
      voteCount[data.player.room] ++;
      playerData[data.player.index]['score'] += 1;

    } else {
      voteCount[data.player.room] ++;
      playerData[currentSpy[data.room].index].score += 1;
    }
    console.log(playerData)
    if (voteCount[data.player.room] === 3) {
      io.to(data.player.room).emit('showAnswer', {playerData: playerData, message: `The Spy was ${currentSpy[data.room].name}!\nGet ready for the next round...`})
      voteCount[data.player.room] = 0;
      currentSpy[data.player.room] = {};
    }
  })
  socket.on('spyCheckCall', data => {
    var playersInRoom = [];
      for (var keys in playerData) {
        if (playerData[keys].room === data.player.room) {
          playersInRoom.push(playerData[keys])
        }
      }
      console.log(playersInRoom)
      var spy = playersInRoom[Math.floor(Math.random() * 4)];
      console.log(spy.name, " is the spy!");
      currentSpy[data.player.room] = spy;
      console.log(data)
      if (data.id === spy.id) {
        io.to(socket.id).emit('spyMessage', {message:`You are the Spy. Try your best to blend in with the others when the time comes!`, picture:'https://i.imgur.com/LHU7oe9.png'});
      }
  })
})
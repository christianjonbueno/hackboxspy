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

module.exports = io.on('connection', socket => {
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
        index: i - 1,
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
        // currentSpy = {[spy['index']+1]: spy};
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
      var icons = ['https://i.imgur.com/ItU72KJ.png','https://i.imgur.com/t9nEpJO.png','https://i.imgur.com/qpl1tIb.png','https://i.imgur.com/woX6k9h.png'];
      var randPic = Math.floor(Math.random() * icons.length)
      io.to(socket.id).emit('realMessage', {message:`Someone amongst you is the Spy. Get ready to complete the prompt!`, picture: icons[randPic]});
      if (count[data.room] === 4) {
        io.to(data.room).emit('startButton', {message: 'The game will start once any player presses Begin.'})
        count[data.room] = 0;
      }
    }
  })
  socket.on('getQuestion', (player) => {
    console.log(questions)
    var selected = questions[Math.floor(Math.random() * questions.length)].prompt
    console.log(selected);
    io.to(player.room).emit('sendPrompt', {spyId: currentSpy[player.room].id, spyMessage: 'Try to blend in with the others!', realMessage: selected});
    // if (socket.id === currentSpy[player.room].id) {
    //   io.to(socket.id).emit('sendPrompt', {message: 'Try to blend in with the others!'})
    // } else if (socket.id !== currentSpy[player.room].id) {
    //   io.to(socket.id).emit('sendPrompt', {message: selected})
    // }
  })
})
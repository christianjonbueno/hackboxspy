import React, { useState, useEffect } from 'react';
import FadeIn from 'react-fade-in';
import Game from './game.jsx';
import GameCard from './gameCard.jsx';
import Score from './score.jsx';
import axios from 'axios';
import socketIOClient from 'socket.io-client';
import UserForm from './userForm.jsx';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
// import Playlist from 'react-mp3-player';
// School ip:
const socket = socketIOClient('http://10.50.67.154:8080/');
// Home ip:
// const socket = socketIOClient('http://192.168.1.198:8080/');

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      gameCard: true,
      inGame: false,
      allQuestions: [],
      username: '',
      room: 'einstein',
      allRooms: {},
      allRoomsCount: {},
      showForm: true,
      player: {},
      message: '',
      picture: '',
      playerCount: '',
      playerData: {},
      playerList: [],
      readyBtn: false,
      nextRound: false,
      showStartButton: false,
      timer: false,
      showPrompts: false,
      spyId: '',
      newGame: false
    }
    this.ready = this.ready.bind(this);
    this.nextRoundCall = this.nextRoundCall.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.enterRoom = this.enterRoom.bind(this);
    this.showStartButton = this.showStartButton.bind(this);
    this.begin = this.begin.bind(this);
    this.vote = this.vote.bind(this);
    this.resetGame = this.resetGame.bind(this);
  }
  
  componentDidMount() {
    axios.get('/allQuestions')
    .then(data => {
      this.setState({
        allQuestions: data.data,
        newGame: false
      })
    })
    socket.on('roomCount', data => {
      this.setState({
        allRoomsCount: data
      }, () => console.log(this.state.allRoomsCount))
    })
    socket.on('hello_user', data => {
      this.setState({
        player: data
      })
    })
    socket.on('currentPlayer', data => {
      this.setState({
        player: data
      })
    })
    socket.on('allRooms', data => {
      var list = [];
      for (var keys in data) {
        list.push({
          [keys]: data[keys]
        })
      }
      this.setState({
        allRooms: list
      })
    })
    socket.on('playerCount', data => {
      var list = [];
      for (var keys in data.playerData) {
        list.push({
            name: data.playerData[keys].name,
            score: data.playerData[keys].score,
            room: data.playerData[keys].room,
            id: data.playerData[keys].id
          })
      }
      this.setState({
        inGame: true,
        playerCount: data.playerCount,
        playerList: list,
        playerData: data.playerData,
        message: `Waiting for 4 players...\nNeed ${4 - data.playerCount} more.`
      })
    })
    socket.on('showFakeButton', data => {
      this.setState({
        playerData: data.playerData,
        message: `The game is about to begin!`,
        readyBtn: !this.state.readyBtn
      })
    })
    socket.on('spyMessage', data => {
      this.setState({
        message: data.message,
        picture: data.picture
      })
    })
    socket.on('realMessage', data => {
      this.setState({
        message: data.message,
        picture: data.picture
      })
    })
    socket.on('startButton', data => {
      this.setState({
        showStartButton: !this.state.showStartButton,
        message: data.message
      })
    })
    socket.on('sendPrompt', data => {
      if (data.spyId === this.state.player.id) {
        this.setState({
          message: data.spyMessage,
          timer: !this.state.timer,
          showStartButton: !this.state.showStartButton,
          spyId: data.spyId
        })
        setTimeout(() => {
          this.setState({
            message: "Convince them you're not the Spy...",
            timer: !this.state.timer,
            showPrompts: false
          })
        }, 8000)
      } else {
        this.setState({
          message: data.realMessage,
          timer: !this.state.timer,
          showStartButton: !this.state.showStartButton,
          spyId: data.spyId
        })
        setTimeout(() => {
          this.setState({
            message: 'Who is the Spy?',
            timer: !this.state.timer,
            showPrompts: true
          })
        }, 8000)
      }
    })
    socket.on('showAnswer', data => {
      var list = [];
      for (var keys in data.playerData) {
        list.push({
            name: data.playerData[keys].name,
            score: data.playerData[keys].score,
            room: data.playerData[keys].room,
            id: data.playerData[keys].id
          })
      }
      if (data.currentSpy === this.state.player.id) {
        this.setState({
          playerList: list,
          message: data.message,
          // readyBtn: true,
          nextRound: true,
        })
      } else {
        this.setState({
          playerList: list,
          message: data.message,
          // readyBtn: true,
          // nextRound: true,
        })
      }
    })
    socket.on('checkIfSpy', data => {
      this.setState({
        readyBtn: true,
        nextRound: false,
        message: data.message
      })
    })
    socket.on('endGame', data => {
      var list = [];
      for (var keys in data.playerData) {
        list.push({
            name: data.playerData[keys].name,
            score: data.playerData[keys].score,
            room: data.playerData[keys].room,
            id: data.playerData[keys].id
          })
      }
      this.setState({
        message: data.message,
        showPrompts: false,
        nextRound: false,
        playerList: list,
        newGame: true,
      })
    })
    socket.on('resetScores', () => {
      this.setState({
        gameCard: true,
        inGame: false,
        allQuestions: [],
        username: '',
        room: 'einstein',
        allRooms: {},
        allRoomsCount: {},
        showForm: true,
        player: {},
        message: '',
        picture: '',
        playerCount: '',
        playerData: {},
        playerList: [],
        readyBtn: false,
        nextRound: false,
        showStartButton: false,
        timer: false,
        showPrompts: false,
        spyId: '',
        newGame: false
      })
    })
  }
  
  onInputChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }
  
  enterRoom(e) {
    e.preventDefault();
    socket.emit('checkRoom', this.state.room)
    socket.on('checkRoomResults', (data) => {
      if (data === 4) {
        alert(`${this.state.room.toUpperCase()} Room is full. Please select another room.`)
        return
      } else {
        var user = {
          username: this.state.username,
          room: this.state.room
        }
        socket.emit('addPlayer', user)
        document.getElementById('form').reset();
        this.setState({
          showForm: false
        })
      }
    })
  }
  ready(id) {
    console.log(id)
    socket.emit('ready', {id: id, room: this.state.room, player: this.state.player})
    this.setState({
      readyBtn: false
    })
  }
  showStartButton(data) {
    this.setState({
      showStartButton: !this.state.showStartButton,
      message: data.message
    })
  }
  begin() {
    socket.emit('getQuestion', this.state.player)
  }
  vote(voteId) {
    console.log(voteId)
    this.setState({
      showPrompts: !this.state.showPrompts,
      message: 'Waiting for the other votes'
    })
    socket.emit('castVote', {voteId: voteId, room: this.state.room, player: this.state.player})
  }
  nextRoundCall(playerId) {
    socket.emit('nextRoundCall', {id: playerId, player: this.state.player})
  }
  resetGame() {
    this.setState({
      gameCard: true,
      inGame: false,
      allQuestions: [],
      username: '',
      room: 'einstein',
      allRooms: {},
      allRoomsCount: {},
      showForm: true,
      player: {},
      message: '',
      picture: '',
      playerCount: '',
      playerData: {},
      playerList: [],
      readyBtn: false,
      nextRound: false,
      showStartButton: false,
      timer: false,
      showPrompts: false,
      spyId: '',
      newGame: false
    })
    socket.emit('resetGame', {player: this.state.player})
  }
  render() {
    // var tracks = [{img: 'null', name:'Spy', desc: 'Spy Theme', src: '../../dist/sms_tone.mp3'}];
    return(
      <div id="background">
        <div className="row d-flex justify-content-center">
          <div className="scoreboard">
            {this.state.player.room ? (
              <Score playerData={this.state.playerData} playerList={this.state.playerList} player={this.state.player} room={this.state.room} /> 
            ):null}
          </div>
        </div>
        <div className="main container d-flex justify-content-center">
          <div className="mainContainer">
              {this.state.showForm ? (
                <UserForm 
                  playerCount={this.state.playerCount}
                  enterRoom={this.enterRoom}
                  onInputChange={this.onInputChange}
                  allRooms={this.state.allRooms}
                  allRoomsCount={this.state.allRoomsCount}
                />
              ):(
                <div>
                  <Game
                    picture={this.state.picture}
                    room={this.state.room}
                    player={this.state.player} 
                    message={this.state.message} 
                    readyBtn={this.state.readyBtn}
                    nextRound={this.state.nextRound}
                    nextRoundCall={this.nextRoundCall}
                    ready={this.ready}
                    begin={this.begin}
                    startButton={this.state.showStartButton}
                    timer={this.state.timer}
                    countdown={CountdownCircleTimer}
                    showPrompts={this.state.showPrompts}
                    playerList={this.state.playerList}
                    spyId={this.state.spyId}
                    vote={this.vote}
                    newGame={this.state.newGame}
                    resetGame={this.resetGame}
                  />
                </div>
              )}
            </div>
        </div>
      </div>
    )
  }
}
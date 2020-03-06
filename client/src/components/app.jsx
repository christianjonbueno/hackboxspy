import React, { useState, useEffect } from 'react';
import FadeIn from 'react-fade-in';
import Game from './game.jsx';
import GameCard from './gameCard.jsx';
import Score from './score.jsx';
import axios from 'axios';
import socketIOClient from 'socket.io-client';
import UserForm from './userForm.jsx';
const socket = socketIOClient('http://10.50.67.154:8080/');

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      gameCard: true,
      inGame: false,
      allQuestions: [],
      username: '',
      room: 'einstein',
      allRooms: [],
      showForm: true,
      player: {},
      message: '',
      picture: '',
      playerCount: '',
      playerData: {},
      playerList: [],
      readyBtn: false,
      showStartButton: false
    }
    this.ready = this.ready.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.enterRoom = this.enterRoom.bind(this);
    this.showStartButton = this.showStartButton.bind(this);
  }
  
  componentDidMount() {
    axios.get('/allQuestions')
    .then(data => {
      this.setState({
        allQuestions: data.data
      })
    })
    socket.on('roomCount', data => {
      this.setState({
        allRooms: data
      })
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
            room: data.playerData[keys].room
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
    socket.on('startButton', (data) => {
      // this.showStartButton()
      console.log(data)
      this.setState({
        showStartButton: !this.state.showStartButton,
        message: data.message
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
    socket.emit('ready', {id: id, room: this.state.room})
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
  render() {
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
                />
              ):(
                <div>
                  <Game
                    picture={this.state.picture}
                    room={this.state.room}
                    player={this.state.player} 
                    message={this.state.message} 
                    readyBtn={this.state.readyBtn}
                    ready={this.ready}
                    startButton={this.state.showStartButton}
                  />
                </div>
              )}
            </div>
        </div>
      </div>
    )
  }
}
import React, { useState, useEffect } from 'react';
import { useSpring, useTrail, animated } from 'react-spring';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import Prompts from './prompts.jsx';

export default function Game(props) {
  const animation = useSpring({opacity: 1, from: {opacity: 0}});

  return (
    <animated.div style={animation} className="container gameContainer">
      <h2 className="d-flex justify-content-center">{props.room.toUpperCase()} ROOM:</h2>
      <div className="className activePrompts">
        <h4 className="gameMessage">{props.message}</h4>
        {props.picture.length > 1 ? <div className="container"><img src={props.picture} className="icon"></img></div>:null}
        {props.timer ? (
        <CountdownCircleTimer 
          isPlaying
          durationSeconds={5}
          colors={[
              ['#004777', .33],
              ['#F7B801', .33],
              ['#A30000']
          ]}
        />):null}
        {props.showPrompts ? <Prompts spyId={props.spyId} player={props.player} playerList={props.playerList} vote={props.vote} />:null}
        {props.readyBtn ? <button type="button" className="btn btn-success" onClick={() => props.ready(props.player.id)}>Spy Check</button> : null}
        {props.spyCheck ? <button type="button" className="btn btn-success" onClick={() => props.spyCheckCall(props.player.id)}>Spy Check</button> : null}
        <p/>
        {props.startButton ? <button type="button" className="btn btn-danger" onClick={() => props.begin()}>Begin</button>: null}
      </div>
    </animated.div>
  )
}
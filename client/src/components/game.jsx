import React, { useState, useEffect } from 'react';
import { useSpring, useTrail, animated } from 'react-spring';

export default function Game(props) {
  const animation = useSpring({opacity: 1, from: {opacity: 0}});

  return (
    <animated.div style={animation} className="container gameContainer">
      <h2 className="d-flex justify-content-center">{props.room.toUpperCase()} ROOM:</h2>
      <div className="className activePrompts">
        <h4>{props.message}</h4>
        {props.readyBtn ? <button type="button" className="btn btn-success" onClick={() => props.ready(props.player.id)}>Spy Check</button> : null}
        {props.picture.length > 1 ? <div className="container"><img src={props.picture} className="icon"></img></div>:null}
        <p/>
        {props.startButton ? <button type="button" className="btn btn-danger">Begin</button>: null}
      </div>
    </animated.div>
  )
}
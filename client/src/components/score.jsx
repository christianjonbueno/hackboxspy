import React, { useState, useEffect } from 'react';
import { useSpring, useTrail, animated } from 'react-spring';
import {Trail} from 'react-spring/renderprops';

export default function Score(props) {

  return (
    <table className="table table-dark">
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Score</th>
        </tr>
      </thead>
      <tbody>
        {/* <tr>
          <th scope="row">{props.playerData[1].name}</th>
          <td>{props.playerData[1].score}</td>
        </tr> */}
        {props.playerList.map((player) => {
          return player.name.length > 1 && player.room === props.room ? (
          <tr>
            <th scope="row">{player.name}</th>
            <td>{player.score}</td>
          </tr>
          ):null
        })}
      </tbody>
    </table>
  )
}
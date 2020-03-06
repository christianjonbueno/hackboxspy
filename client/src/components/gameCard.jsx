import React from 'react';

export default function GameCard(props) {
  return(
    <div className="row gamesContainer">
      <div className="col-4 game">
        <div className="card">
          <img src="https://www.kosu.org/sites/kosu/files/styles/medium/public/201703/spylogo_stacked_0.png" className="gamePic card-img-top" />
          <div className="card-body">
            <h5 className="card-title">Spy | 4 Players</h5>
            <p className="card-text">A game of deceit where you each take turns lying to your friends.</p>
            <a href="#" className="btn btn-warning" onClick={() => props.chooseGame()}>Play Spy</a>
          </div>
        </div>
      </div>
      <div className="col-4 game">
        <div className="card text-white bg-dark">
          <img src="https://cdn2.vectorstock.com/i/1000x1000/89/31/trivia-night-design-vector-24218931.jpg" className="gamePic card-img-top" />
          <div className="card-body">
            <h5 className="card-title">Trivia | 4 Players</h5>
            <p className="card-text">Basic knowledge Trivia.</p>
            <a href="#" className="btn btn-dark">Play Trivia</a>
          </div>
        </div>
      </div>
    </div>
  )
}
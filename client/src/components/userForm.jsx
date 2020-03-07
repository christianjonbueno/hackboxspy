import React from 'react';

export default function UserForm(props) {
  return (
    <div>
      <div className="row justify-content-md-center">
        <div className="col-md-auto gameTitle">
            <img src="https://i.imgur.com/Ml5OQiH.png" className="gamePic card-img-top" />
        </div>
      </div>
      <div className="row justify-content-md-center bottomForm">
        <div className="col-md-auto form-group">
          <form id="form" onSubmit={(e) => props.enterRoom(e)} >
            <input onChange={(e) => props.onInputChange(e)} required name="username" type="text" className="form-control formInput" placeholder="Choose a Username"></input>
            <label>Choose a room:</label><br/>
            <select name="room" onChange={(e) => props.onInputChange(e)} defaultValue="einstein">
              {props.allRoomsCount['einstein'] < 4 ? <option value="einstein">Einstein</option>: <option value="einstein" disabled>Einstein is full</option>}
              {props.allRoomsCount['sunshine'] < 4 ? <option value="sunshine">Sunshine</option>: <option value="sunshine" disabled>Sunshine is full</option>}
              {props.allRoomsCount['outcomes'] < 4 ? <option value="outcomes">Outcomes</option>: <option value="outcomes" disabled>Outcomes is full</option>}
              {props.allRoomsCount['pingpong'] < 4 ? <option value="pingpong">Pingpong</option>: <option value="pingpong" disabled>Pingpong is full</option>}
            </select>
            <p/>
            {/* <input onChange={(e) => props.onInputChange(e)} required name="room" type="text" className="form-control formInput" placeholder="Choose a Room"></input> */}
            {/* <button type="submit" className="form-control btn btn-warning enterBtn progress-bar">Enter Room</button> */}
            <div className="enter d-flex justify-content-center">
              <button type="submit" className="enterBtn btn btn-warning">Enter Room</button>
            </div>
          </form>
        </div>
     </div>
    </div>
  )
};
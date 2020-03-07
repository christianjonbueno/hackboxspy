import React from 'react';
import Fadein from 'react-fade-in';

export default class Prompts extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      list: []
    }
    this.sendVote = this.sendVote.bind(this);
  }
  componentDidMount() {
    console.log(this.props.spyId, "spy id")
    var list = [];
    this.props.playerList.forEach((player) => {
      if (this.props.player.name !== player.name) {
        list.push(player)
      }
    })
    console.log(list)
    this.setState({
      list: list
    }, () => console.log(this.state.list))
  }
  sendVote(voteId) {
    console.log(voteId)
    console.log(this.props.spyId)
    this.props.vote(voteId)
  }

  render() {
    return(
      <Fadein>
        {this.props.spyId !== this.props.player.id ? <div className="container row">
          {/* <form id="voteForm"> */}
            {/* <label>Choose a room:</label><br/> */}
            {/* <select name="vote">
              {this.state.list.map((player) => {
                return <option value={player.id}>{player.name}</option>
              })}
            </select> */}
            {this.state.list.map((player) => {
              return <div className="col-4 btnCont"><button type="button" className="btn btn-success voteButtons" onClick={() => this.sendVote(player.id)}>{player.name}</button></div>
            })}
            <p/>
          {/* </form> */}
        </div> : null}
      </Fadein>
    )
  }
}
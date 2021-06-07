import React, { Component } from 'react';

import Scene from './Scene';
import io from 'socket.io-client';
import MainConfig from '../../mainconfig';

import RangeSlider from './RangeSlider';
import Checkbox from './Checkbox';

const socket = io.connect(MainConfig.IP + ":" + MainConfig.PORT,{
  secure : true,
  rejectUnauthorized : false
});


class MainApp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      socketID : null,
      friends : null,
      controls : {
        timeOffset : 0,
        locationSync : true
      }
      
    }

    
  
    this.ChangeTime = this.ChangeTime.bind(this);
  }
  
  componentDidMount(){
    var scene = new Scene(socket, this);
    socket.on('connect', () => {
      console.log("connect " , socket.id);

      this.setState({
        socketID : socket.id
      });
      scene.AddClient(socket.id);
    });
  }

  ChangeTime (value){
    let stateCopy = Object.assign({}, this.state);
    stateCopy.controls.timeOffset = value;
    this.setState(stateCopy,()=>{
      socket.emit("dev-controls", this.state.controls);
    });

  }

  HandleSync = (value) => {
    console.log(value);
    let stateCopy = Object.assign({}, this.state);
    stateCopy.controls.locationSync = value;
    this.setState(stateCopy,()=>{
      socket.emit("dev-controls", this.state.controls);
    });
  }


  SetFriends = (friends) => {
    this.setState({
      friends : friends
    })
  }

  render() {
    return (
      <div className="main">
        <div className="controls">

          <div className="own-player">
            {this.state.socketIsD}
          </div>



          {this.state.friends != null &&
            <div className="friends">
            {
              Object.keys(this.state.friends).map((friend,index)=>{
                if(this.state.friends[friend].id == this.state.socketID){return null;}
                return <div className="friend" key={index}>
                  {this.state.friends[friend].id}
                </div>
              })
            }
            </div>
          }

          <RangeSlider onChange={this.ChangeTime} value={this.state.controls.timeOffset}/>

          <Checkbox onChange={this.HandleSync} checked={this.state.controls.locationSync} />
        </div>
        <div id="sceneHolder"></div>
      </div>
    );
  }
}

export default MainApp;

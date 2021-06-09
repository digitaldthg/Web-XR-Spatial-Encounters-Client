import React, { Component } from 'react';

import Scene from './Scene';
import io from 'socket.io-client';
import MainConfig from '../../mainconfig';

import RangeSlider from './RangeSlider';
import Checkbox from './Checkbox';
import UserTable from '../Components/Dev/UserTable';

const socketURL = MainConfig.IP + ":" + MainConfig.PORT
const socketOptions = {
  secure : true,
  rejectUnauthorized : false
};

class MainApp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      scene: null,
      socket :  io.connect( socketURL ,socketOptions),
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
    var scene = new Scene(this);
    this.setState({
      scene : scene
    })
  }

  ChangeTime (value){
    let stateCopy = Object.assign({}, this.state);
    stateCopy.controls.timeOffset = value;
    this.setState(stateCopy,()=>{
      this.state.socket.emit("dev-controls", this.state.controls);
    });

  }

  HandleSync = (value) => {
    console.log(value);
    let stateCopy = Object.assign({}, this.state);
    stateCopy.controls.locationSync = value;
    this.setState(stateCopy,()=>{
      this.state.socket.emit("dev-controls", this.state.controls);
    });
  }


  SetFriends = (friends) => {
    this.setState({
      friends : friends
    });
  }

  AddPlayer = () =>{
    var newSocketConnection = io.connect(socketURL, socketOptions);
    newSocketConnection.on("connect", ()=>{
      console.log("new Socket by other User", newSocketConnection.id);

      this.state.scene.AddUserSocket(newSocketConnection);
    });


    console.log("add player with connect", newSocketConnection);
  }

  SelectPlayer = (id) =>{


    console.log("select " , id);

    this.state.scene.SelectPlayer(id);
  }


  ChangeRole = (id, role) => { 

    console.log(id, role);

    this.state.socket.emit("client-change-role", {
      id: id,
      role : role
    })

  }
  
  ChangeFrequency(value){

    console.log(value);
    this.state.socket.emit("client-change-frequency", {
      frequency : parseFloat(value)
    })
  }

  ChangeScale(value){

    console.log("SCale:"+value);
    this.state.socket.emit("client-change-scale", {
      scale : parseFloat(value)
    })
  }

  render() {
    return (
      <div className="main">
        <div className="controls">

        {this.state.scene != null && this.state.scene.users.hasOwnProperty(this.state.socket.id) &&
          <UserTable user={this.state.scene.users[this.state.socket.id]} onSelect={e => this.SelectPlayer(this.state.socket.id)}/>
        }

        <div className="global-controls">
          <h4>Frequenz (Dreiecke/Sek, 0-3)</h4> 
          <input type="range" min="0" max="3" step="0.01" onChange={e => this.ChangeFrequency(e.target.value)}/>
        </div>
        <div className="global-controls"> 
        <h4>Dreiecks Skalierung( 0-1)</h4> 
          <input type="range" min="0" max="1" step="0.01" onChange={e => this.ChangeScale(e.target.value)}/>
        </div>
          <div className="connections">
            
            {this.state.friends != null &&
              <div className="friends">
              {
                Object.keys(this.state.friends).map((friend,index)=>{
                  if(this.state.friends[friend].id == this.state.socket.id){return null;}
                  return <UserTable 
                    user={this.state.friends[friend]} 
                    onSelect={e => this.SelectPlayer(this.state.friends[friend].id)}
                    onChangeRole={this.ChangeRole}
                    key={index} />
                })
              }
              </div>
            }
            <button onClick={this.AddPlayer}>Add player</button>
          </div>

          <Checkbox onChange={this.HandleSync} checked={this.state.controls.locationSync} />
        </div>
        <div id="sceneHolder"></div>
      </div>
    );
  }
}

export default MainApp;

import React, { Component } from 'react';

import Scene from './Scene';
import io from 'socket.io-client';
import MainConfig from '../../mainconfig';

import RangeSlider from './RangeSlider';

const socket = io.connect(MainConfig.IP + ":" + MainConfig.PORT,{
  secure : true,
  rejectUnauthorized : false
});


class MainApp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      controls : {
        timeOffset : 0,

      }
      
    }

    
  
    this.ChangeTime = this.ChangeTime.bind(this);
  }
  
  componentDidMount(){
    var scene = new Scene(socket);
    socket.on('connect', () => {

      scene.AddClient(socket.id);
      console.log(socket.id); // 'G5p5...'
    });
  }

  ChangeTime (value){
    let stateCopy = Object.assign({}, this.state);
    stateCopy.controls.timeOffset = value;
    this.setState(stateCopy,()=>{
      socket.emit("dev-controls", this.state.controls);
    });

  }

  render() {
    return (
      <div className="main">
        <div className="controls">
          <RangeSlider onChange={this.ChangeTime} value={this.state.controls.timeOffset}/>
        </div>
        <div id="sceneHolder"></div>
      </div>
    );
  }
}

export default MainApp;

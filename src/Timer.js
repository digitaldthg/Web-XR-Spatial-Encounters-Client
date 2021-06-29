import {Mesh,BoxGeometry, MeshBasicMaterial, Group} from 'three';


class Timer{
  constructor(props){
    this.store = props.store;
    this.xr = props.xr;
  
   

    console.log(this.xr);
    this.instance = new Group();
    this.timer = new Mesh(new BoxGeometry(1,.2,.01), new MeshBasicMaterial({color: 0xff0000}));
    this.instance.add(this.timer);

    this.timerProgress = new Mesh(new BoxGeometry(1.05,.25,.015), new MeshBasicMaterial({color: 0xffffff}));
    this.timerProgress.position.set(0,0,-.01);
    this.instance.add(this.timerProgress);

    this.instance.position.set(0,0,-1);

    return this;

  }

  SetVisible = (boolean)=>{
    this.instance.visible = boolean;
  }
  Progress = (progress)=>{
    this.timer.scale.setX(progress / 100);
  }

}

export default Timer;
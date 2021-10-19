import {Mesh,BoxGeometry, MeshBasicMaterial, Group} from 'three';


class Timer{
  constructor(props){
    this.store = props.store;
    this.xr = props.xr;

    this.instance = new Group();
    this.timer = new Mesh(new BoxGeometry(1,.2,.01), new MeshBasicMaterial({color: 0xff0000}));
    this.timer.renderOrder = 0;
    //this.timer.visible = false;
    this.instance.add(this.timer);
    
    this.timerProgress = new Mesh(new BoxGeometry(1.05,.25,.015), new MeshBasicMaterial({color: 0xffffff}));
    this.timerProgress.position.set(0,0,-.01);
    this.timerProgress.renderOrder = 1;
    //this.timerProgress.visible = false;
    this.instance.add(this.timerProgress);

    this.instance.position.set(0,0,0);
    
    this.SetVisible(false);
    
    
    this.store.watch(state => state.canCalibrate, (boolean)=>{
      if(!boolean){
        this.SetVisible(false);
        this.Progress(0);
      }
    })

    return this;

  }

  SetVisible = (boolean)=>{
    this.instance.visible = boolean;
  }
  Progress = (progress, max = 100)=>{
    this.timer.scale.setX(progress / max);
  }

}

export default Timer;
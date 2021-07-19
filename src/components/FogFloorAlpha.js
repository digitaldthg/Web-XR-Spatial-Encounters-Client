import Gradient from "./Gradient";

class FogFloorAlpha extends Gradient{

  constructor(props){
    super(props);

    this.SetGradient([
      {
        stop : 0,
        value : [0,0,0]
      },
      {
        stop : 0.5,
        value : [0,100,100]
      },
      {
        stop : 1,
        value : [0,0,0]
      }
    ]);


    console.log(this.SetGradient);
  }



}


export default FogFloorAlpha;
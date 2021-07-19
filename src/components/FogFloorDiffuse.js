import Gradient from "./Gradient";

class FogFloorDiffuse extends Gradient{

  constructor(props){
    super(props);

    this.SetGradient([
      {
        stop : 0,
        value : [0,100,100]
      },
      {
        stop : 0.5,
        value : [0,100,100]
      },
      {
        stop : 1,
        value : [0,100,100]
      }
    ]);

  }



}


export default FogFloorDiffuse;
import TextureBackground from "./TextureLerpBackground";
import Mountains from '../Model/environment/textures/background/Horizon_Mountains01.png';
import {ClampToEdgeWrapping} from 'three';

class BGBackTexture extends TextureBackground{

  constructor(props){
    super(props);

    console.log(this);

    this.Load("Mountains", Mountains).then((texture)=>{
      texture.repeat.set( 5 , 1 );
      texture.offset.set(10,0)
      texture.wrapT = ClampToEdgeWrapping;
    });
  }

  

}

export default BGBackTexture;


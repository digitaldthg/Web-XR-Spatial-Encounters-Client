import TextureBackground from "./TextureLerpBackground";
import Mountains from '../Model/environment/textures/QC_Mountain.png';
import Mountainsfront from '../Model/environment/textures/QC_Mountain_front.png';
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

    this.Load("Mountainsfront", Mountainsfront).then((texture)=>{
      texture.repeat.set( 20 , 1 );
      texture.offset.set(10,0)
      texture.wrapT = ClampToEdgeWrapping;
    });
  }

  

}

export default BGBackTexture;


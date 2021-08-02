import TextureBackground from "./TextureLerpBackground";
import Mountainsfront from '../Model/environment/textures/QC_Mountain_front.png';
import Mountains from '../Model/environment/textures/QC_Mountain.png';
import {ClampToEdgeWrapping} from 'three';

class BGFrontTexture extends TextureBackground{

  constructor(props){
    super(props);

    console.log(this);

    this.Load("Mountainsfront", Mountainsfront).then((texture)=>{
      texture.repeat.set( 10, 1 );
      texture.offset.set(1,0)
      texture.wrapT = ClampToEdgeWrapping;})

    this.Load("Mountains", Mountains).then((texture)=>{
      texture.repeat.set( 5 , 1 );
      texture.offset.set(5,0)
      texture.wrapT = ClampToEdgeWrapping;
    });
  }

  

}

export default BGFrontTexture;


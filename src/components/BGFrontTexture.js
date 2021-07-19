import TextureBackground from "./TextureBackground";
import Mountainsfront from '../Model/environment/texture/QC_Mountain_front.png';
import {ClampToEdgeWrapping} from 'three';

class BGFrontTexture extends TextureBackground{

  constructor(props){
    super(props);

    console.log(this);

    this.Load("Mountainsfront", Mountainsfront).then((texture)=>{
      console.log("SkyboxTexture" , texture);
      texture.wrapT = ClampToEdgeWrapping;

      texture.repeat.set( 5 , 1 );
      texture.offset.set( .7 , 0 );
    });
  }

  

}

export default BGFrontTexture;


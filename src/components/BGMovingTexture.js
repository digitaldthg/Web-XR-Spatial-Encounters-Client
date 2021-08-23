import TextureBackground from "./TextureLerpBackground";
import Camels from '../Model/environment/textures/bg_moving_camels.png'
import {ClampToEdgeWrapping} from 'three';
import Birds from '../Model/environment/textures/bg_moving_ficshadler.png'

class BGMovingTexture extends TextureBackground{

  constructor(props){
    super(props);

    this.Load("Camels", Camels).then((texture)=>{
      texture.repeat.set( 1, 1 );
      texture.wrapT = ClampToEdgeWrapping;})

      this.Load("Birds", Birds).then((texture)=>{
        texture.repeat.set( 1, 1 );
        texture.wrapT = ClampToEdgeWrapping;})
  }

  

}

export default BGMovingTexture;


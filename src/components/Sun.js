import TextureBackground from "./TextureLerpBackground";
import SunMap from '../Model/environment/textures/sun_alpha.png';
import {ClampToEdgeWrapping} from 'three';

class Sun extends TextureBackground{

  constructor(props){
    super(props);
    this.Load("Sun", SunMap).then((texture)=>{
      texture.repeat.set( 1, 1 );})
  }

  

}

export default Sun;


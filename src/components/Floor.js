import TextureLerpBackground from "./TextureLerpBackground";
import grid from '../Model/environment/texture/Grid.png';
import bg from '../Model/environment/texture/bg_texture.png';
import {
  NearestFilter,
  NearestMipMapNearestFilter, 
  NearestMipmapLinearFilter,
  LinearFilter,
  LinearMipmapNearestFilter,
  LinearMipMapLinearFilter, 
} from 'three';
class Floor extends TextureLerpBackground{

  constructor(props){
    super(props);

    this.Load("Grid", grid).then((texture)=>{
      texture.repeat.set( 1000,1000 );
    });
  }



}

export default Floor;
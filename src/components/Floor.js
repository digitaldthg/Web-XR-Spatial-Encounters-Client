import TextureLerpBackground from "./TextureLerpBackground";
import grid from '../Model/environment/textures/floor/Grid.png';
import concrete from '../Model/environment/textures/floor/SeamlessConcrete_normal.png';
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
    this.Load("Concrete", concrete).then((texture)=>{
      texture.repeat.set( 100,100);
    });
  }



}

export default Floor;
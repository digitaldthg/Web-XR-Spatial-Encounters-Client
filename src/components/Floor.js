import TextureLerpBackground from "./TextureLerpBackground";
import grid from '../Model/environment/textures/floor/Grid.png';
import concrete from '../Model/environment/textures/floor/SeamlessConcrete_normal.png';
import raps from '../Model/environment/textures/floor/Raps.png';
import grid_concrete from '../Model/environment/textures/floor/grid_02_concrete-black.png';
import grid_orange from '../Model/environment/textures/floor/grid_02_orange.png';
import grid_pink from '../Model/environment/textures/floor/grid_02_pink.png';
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
    this.Load("Raps", raps).then((texture)=>{
      texture.repeat.set( 100,100);
    });
    this.Load("GridConrete", grid_concrete).then((texture)=>{
      texture.repeat.set( 100,100);
    });
    this.Load("GridOrange", grid_orange).then((texture)=>{
      texture.repeat.set( 100,100);
    });
    this.Load("GridPink", grid_pink).then((texture)=>{
      texture.repeat.set( 100,100);
    });
  }



}

export default Floor;
import TextureLerpBackground from "./TextureLerpBackground";
import grid from '../Model/environment/textures/grid_02_red.png';


import {
  NearestFilter,
  NearestMipMapNearestFilter, 
  NearestMipmapLinearFilter,
  LinearFilter,
  LinearMipmapNearestFilter,
  LinearMipMapLinearFilter, 
} from 'three';
class Guardian extends TextureLerpBackground{

  constructor(props){
    super(props);

    this.Load("Grid", grid).then((texture)=>{
      texture.repeat.set( 20,8 );
    });

  }



}

export default Guardian;
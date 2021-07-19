import TextureBackground from "./TextureBackground";
import grid from '../Model/environment/texture/Grid.png';
import {
  NearestFilter,
  NearestMipMapNearestFilter, 
  NearestMipmapLinearFilter,
  LinearFilter,
  LinearMipmapNearestFilter,
  LinearMipMapLinearFilter, 
} from 'three';
class Floor extends TextureBackground{

  constructor(props){
    super(props);

    console.log(this);

    this.Load("Grid", grid).then((texture)=>{
      console.log("Floor" , texture);
      texture.repeat.set( 2000,2000 );
    });
  }



}

export default Floor;
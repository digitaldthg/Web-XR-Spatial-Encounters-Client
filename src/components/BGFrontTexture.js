import TextureBackground from "./TextureLerpBackground";
import Forrest from '../Model/environment/textures/background/Horizon_Forrest01.png';
import Wolken from '../Model/environment/textures/background/Horizon_Wolken.png';
import Mountains from '../Model/environment/textures/background/Horizon_Mountains01.png';
import Black from '../Model/environment/textures/black.png';
import {ClampToEdgeWrapping} from 'three';

class BGFrontTexture extends TextureBackground{

  constructor(props){
    super(props);

    console.log(this);

    this.Load("Mountains", Mountains).then((texture)=>{
      texture.repeat.set( 4, 1 );
      texture.offset.set(1,0)
      texture.wrapT = ClampToEdgeWrapping;})

    this.Load("Forrest", Forrest).then((texture)=>{
      texture.repeat.set( 4 , 1 );
      texture.offset.set(5,0)
      texture.wrapT = ClampToEdgeWrapping;
    });

    this.Load("Wolken", Wolken).then((texture)=>{
      texture.repeat.set( 5 , 1 );
      texture.offset.set(5,0)
      texture.wrapT = ClampToEdgeWrapping;
    });

    this.Load("Black", Black).then((texture)=>{
      texture.wrapT = ClampToEdgeWrapping;
    });
  }

  

}

export default BGFrontTexture;


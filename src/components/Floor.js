import TextureLerpBackground from "./TextureLerpBackground";
import grid from '../Model/environment/textures/floor/Grid.png';
import concrete from '../Model/environment/textures/floor/SeamlessConcrete_dark.png';
import concretepuddles from '../Model/environment/textures/floor/SeamlessConcrete_dark_puddles.png';
import rapsmorning from '../Model/environment/textures/floor/RapsMorning.png';
import grid_white_grey from '../Model/environment/textures/floor/grid_02_whitegrey.png';
import raps from '../Model/environment/textures/floor/Raps.png';
import grid_concrete from '../Model/environment/textures/floor/grid_02_concrete-black.png';
import grid_orange from '../Model/environment/textures/floor/grid_02_orange.png';
import grid_pink from '../Model/environment/textures/floor/grid_02_pink.png';
import grid_white from '../Model/environment/textures/floor/grid_02.png';
import yellow_desert from '../Model/environment/textures/floor/yellow_desert.png';
import white_desert from '../Model/environment/textures/floor/white_desert.png';
import nude_desert from '../Model/environment/textures/floor/nude_desert.png';
import brown_desert from '../Model/environment/textures/floor/brown_desert.png';
import dark_desert from '../Model/environment/textures/floor/dark_desert.png';
import digital_desert from '../Model/environment/textures/floor/grid-digitzeddesert.png';


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
      texture.repeat.set( 50,50);
    });
    this.Load("ConcretePuddles", concretepuddles).then((texture)=>{
      texture.repeat.set( 50,50);
    });
    this.Load("YellowDesert", yellow_desert).then((texture)=>{
      texture.repeat.set( 100,100);
    });
    this.Load("WhiteDesert", white_desert).then((texture)=>{
      texture.repeat.set(100,100);
    });
    this.Load("NudeDesert", nude_desert).then((texture)=>{
      texture.repeat.set( 100,100);
    });
    this.Load("BrownDesert", brown_desert).then((texture)=>{
      texture.repeat.set( 100,100);
    });
    this.Load("DarkDesert", dark_desert).then((texture)=>{
      texture.repeat.set( 100,100);
    });
    this.Load("DigiDesert", digital_desert).then((texture)=>{
      texture.repeat.set( 100,100);
    });
    this.Load("Raps", raps).then((texture)=>{
      texture.repeat.set( 100,100);
    });
    this.Load("rapsmorning", rapsmorning).then((texture)=>{
      texture.repeat.set( 100,100);
    });
    this.Load("GridConcrete", grid_concrete).then((texture)=>{
      texture.repeat.set( 100,100);
    });
    this.Load("GridOrange", grid_orange).then((texture)=>{
      texture.repeat.set( 100,100);
    });
    this.Load("GridWhite", grid_white).then((texture)=>{
      texture.repeat.set( 100,100);
    });
    this.Load("GridPink", grid_pink).then((texture)=>{
      texture.repeat.set( 100,100);
    });
    this.Load("GridWhiteGrey", grid_white_grey).then((texture)=>{
      texture.repeat.set( 100,100);
    });
  }



}

export default Floor;
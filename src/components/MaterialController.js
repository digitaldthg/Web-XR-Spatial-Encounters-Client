import { MeshBasicMaterial, AdditiveBlending } from "three";

import Skybox from './Skybox';
import FogFloorDiffuse from './FogFloorDiffuse';
import FogFloorAlpha from './FogFloorAlpha';

import Floor from "./Floor";
import SkyboxTexture from "./SkyboxTexture";
import BGFrontTexture from "./BGFrontTexture";
import BGBackTexture from "./BGBackTexture";

class MaterialController{
  constructor(xr){
    this.xr = xr;
    this.skybox_gradient = new Skybox();

    this.fogFloor = new FogFloorDiffuse();
    this.fogFloorAlpha = new FogFloorAlpha();

    this.floor = new Floor(this.xr);

    //this.skyboxTexture = new SkyboxTexture(this.xr);
    this.bg_frontTexture = new BGFrontTexture(this.xr);
    this.bg_backTexture = new BGBackTexture(this.xr);

    this.materials = {
      
      base_floor : new MeshBasicMaterial({
        color : 0x000000,
      }),
      grid_floor : new MeshBasicMaterial({
        color : 0xff0000,
        transparent: true,
      }),
      fog_floor: new MeshBasicMaterial({
        color : 0xffffff,
        transparent : true,
        map : this.fogFloor.GetTexture(),
        alphaMap : this.fogFloorAlpha.GetTexture(),
        
       // depthWrite: false
      }),
      bg_back: new MeshBasicMaterial({
        color : 0xff00ff,
        transparent : true,
        // depthTest: false,
        // depthWrite: false
      }),
      bg_front: new MeshBasicMaterial({
        color : 0xffff00,
        transparent : true,
        // depthTest: false,
        // depthWrite: false
      }),
      
      skybox_gradient:new MeshBasicMaterial({
        map : this.skybox_gradient.GetTexture()
      }),
      skybox_texture: new MeshBasicMaterial({
        color : 0x000000,
        transparent : true,
        opacity: 0
      })          
    }



    
    this.floor.SetTexture("Grid",this.materials.grid_floor, "map");
    this.bg_frontTexture.SetTexture("Mountains",this.materials.bg_front, "alphaMap");
    this.bg_backTexture.SetTexture("Mountains",this.materials.bg_back, "alphaMap");

    this.bg_backTexture.SetOffset("Mountains", {x : .5, y : 0})


  }


  GetMaterial(name){
    return this.materials[name];
  }
}


export default MaterialController;
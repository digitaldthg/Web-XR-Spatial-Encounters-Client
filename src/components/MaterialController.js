import { MeshBasicMaterial, AdditiveBlending, Color, Mesh, DoubleSide, FrontSide } from "three";

import Skybox from './Skybox';
import FogFloorDiffuse from './FogFloorDiffuse';
import FogFloorAlpha from './FogFloorAlpha';

import Floor from "./Floor";
import Guardian from "./Guardian"
import Sun from "./Sun"
import SkyboxTexture from "./SkyboxTexture";
import BGFrontTexture from "./BGFrontTexture";
import BGBackTexture from "./BGBackTexture";
import BGGradientFront from "./BGGradientFront";
import BGGradientBack from "./BGGradientBack";
import ThemeFactory from "./ThemeFactory";

import theme_DunkelConcrete from '../Themes/theme_DunkelConcrete/theme.json';
import theme_DunkelConcrete_Morning from '../Themes/theme_DunkelConcrete_Morning/theme.json';
import theme_ThueringerLandschaft from '../Themes/theme_ThueringerLandschaft/theme.json';
import theme_Turell_gelb from '../Themes/theme_Turell_gelb/theme.json';
import theme_Sun_Orange2 from '../Themes/theme_Sun_Orange2/theme.json';
import theme_Cyberpunk_Sun from '../Themes/theme_Cyberpunk_Sun/theme.json';
import theme_DunkelGrid from '../Themes/theme_DunkelGrid/theme.json';

import LerpMaterial from './LerpMaterial';
import Utils from "../scripts/utils";
import SunGradient from "./SunGradient";

class MaterialController {
  constructor(xr, store) {
    this.xr = xr;
    this.store = store;

    this.store.commit("setAllThemes", [theme_DunkelConcrete, theme_DunkelConcrete_Morning, theme_ThueringerLandschaft, theme_Turell_gelb, theme_Sun_Orange2, theme_Cyberpunk_Sun, theme_DunkelGrid])

    this.store.commit("setMaterialController", this);

    //GRADIENT
    this.gradient_skybox = new Skybox({
      name: "skybox"
    });
    this.gradient_sun = new SunGradient({
      name: "sun"
    });

    this.gradient_fogFloor = new FogFloorDiffuse({
      name: "fogColor"
    });
    this.gradient_fogFloorAlpha = new FogFloorAlpha(
      {
        name: "fogAlpha"
      }
    );

    this.gradient_bg_front = new BGGradientFront({
      name: "bg_front"
    });
    this.gradient_bg_back = new BGGradientBack(
      {
        name: "bg_back"
      }
    );

    //LERP TEXUTRE OBJECTS
    var grid_floor_obj = new LerpMaterial({
      color: 0xff00ff,
      transparent: true,
      depthWrite: false,
      side:FrontSide

    });
    var grid_floor = grid_floor_obj.material;

    var guardian_obj = new LerpMaterial({
      color: 0x0000ff,
      transparent: true,
      depthWrite: false,
      side:DoubleSide
    });
    var guardian = guardian_obj.material;
    //Sun
    var sun_obj = new LerpMaterial({
      color: 0xff0000,
      transparent: true,
      depthWrite: false,
      side:FrontSide
    });
    var sun = sun_obj.material

    //BG Back
    var bg_back_obj = new LerpMaterial({
      color: 0xff0000,
      transparent: true,
      depthWrite: false,
      side:FrontSide
    });
    var bg_back = bg_back_obj.material

    //BG Front
    var bg_front_obj = new LerpMaterial({
      color: 0xffffff,
      transparent: true,
      depthWrite: false,
      side:FrontSide
    });
    var bg_front = bg_front_obj.material

    //Sky Texture
    var skybox_texture_obj = new LerpMaterial({
      color: 0x00ff00,
      transparent: true,
      side:FrontSide
    })
    var skybox_texture = skybox_texture_obj.material;



    this.materials = {
      base_floor: new MeshBasicMaterial({
        color: 0x000000,
      }),
      fog_floor: new MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        map: this.gradient_fogFloor.GetTexture(),
        alphaMap: this.gradient_fogFloorAlpha.GetTexture(),
        //depthWrite: false
      }),
      skybox_gradient: new MeshBasicMaterial({
        map: this.gradient_skybox.GetTexture()
      }),
      grid_floor,
      guardian,
      sun,
      bg_back,
      bg_front,
      skybox_texture

    }
    this.tex_guardian = new Guardian({xr:this.xr,store:this.store})
    this.tex_floor = new Floor(this.xr);
    this.tex_skybox = new SkyboxTexture(this.xr);
    this.tex_bg_front = new BGFrontTexture(this.xr);
    this.tex_bg_back = new BGBackTexture(this.xr);
    this.tex_sun = new Sun(this.xr);

    this.tex_sun.SetMaterial("Sun",sun_obj)
    this.tex_skybox.SetMaterial("Sky", skybox_texture_obj);
    this.tex_floor.SetMaterial("Floor", grid_floor_obj);
    this.tex_guardian.SetMaterial("Guardian", guardian_obj);
    this.tex_bg_front.SetMaterial("BG_Front", bg_front_obj);
    this.tex_bg_back.SetMaterial("BG_Back", bg_back_obj);


    //this.LerpThemes(this.store.state.lastTheme, this.store.state.nextTheme, 0);

    this.store.watch(state => state.themeLerp, (newValue, oldViewMode) => {
      //console.log("Watch Theme Lerp ", this.store.state.lastTheme, this.store.state.nextTheme, newValue);
      this.LerpThemes(this.store.state.lastTheme, this.store.state.nextTheme, newValue)
    });


    this.xr.Events.addEventListener("OnTextureLoad", () => {
      //console.log("texture wurde geladen");

      this.LerpThemes(this.store.state.lastTheme, this.store.state.nextTheme, this.store.state.themeLerp);
    })
  }




  hsv_to_hsl(arr) {
    var h = arr[0] / 360;
    var s = arr[1] / 100;
    var v = arr[2] / 100;

    // both hsv and hsl values are in [0, 1]
    var l = (2 - s) * v / 2;

    if (l != 0) {
      if (l == 1) {
        s = 0
      } else if (l < 0.5) {
        s = s * v / (l * 2)
      } else {
        s = s * v / (2 - l * 2)
      }
    }

    return [h * 360, s * 100, l * 100]
  }

  LerpThemes(themeA, themeB, alpha) {
    var final = ThemeFactory.Get();

     if (themeA == null || themeB == null) {
       if (themeA == null) { themeA = ThemeFactory.Get(); }
       if (themeB == null) { themeB = ThemeFactory.Get(); }
     }
    // console.log("themeA", themeA, "themeB", themeB);

    Object.keys(final).map((keyName) => {

      if (Array.isArray(themeA[keyName])) {
        final[keyName] = Utils.lerpColor(themeA[keyName], themeB[keyName], alpha);
        //console.log(final[keyName])
      }
    })
    this.gradient_skybox.SetGradient(final.gradient_skybox);
    this.gradient_fogFloor.SetGradient(final.gradient_fogFloor);
    this.gradient_fogFloorAlpha.SetGradient(final.gradient_fogFloorAlpha);

    this.materials.base_floor.color = this.GetHSLColor(final.base_floor[0].value);

    this.gradient_bg_front.SetGradient(final.gradient_bg_front);
    this.gradient_bg_back.SetGradient(final.gradient_bg_back);

    this.gradient_sun.SetGradient(final.gradient_sun);

    this.tex_guardian.lerpMaterial(themeA.tex_guardian, themeB.tex_guardian, alpha)
    this.tex_floor.lerpMaterial(themeA.tex_floor, themeB.tex_floor, alpha);
    this.tex_skybox.lerpMaterial(themeA.tex_skybox, themeB.tex_skybox, alpha);

    this.tex_sun.lerpMaterial(this.gradient_sun.GetTexture(), this.gradient_sun.GetTexture(), alpha, themeA.tex_sun, themeB.tex_sun)
    this.tex_bg_front.lerpMaterial(this.gradient_bg_front.GetTexture(), this.gradient_bg_front.GetTexture(), alpha, themeA.tex_bg_front, themeB.tex_bg_front);
    this.tex_bg_back.lerpMaterial(this.gradient_bg_back.GetTexture(), this.gradient_bg_back.GetTexture(), alpha, themeA.tex_bg_back, themeB.tex_bg_back);


    console.log("SCENE ", this.xr.Scene);


    Object.keys(this.materials).map((matName)=>{
      
      if(this.materials[matName].hasOwnProperty("uniforms")){
        
        
        if(this.materials[matName].uniforms.hasOwnProperty("fogColor")){

          console.log( this.xr.Scene.fog )

          console.log(this.materials[matName].uniforms,this.xr.Scene);
          this.materials[matName].uniforms.fogColor.value = this.xr.Scene.fog.color;
          this.materials[matName].uniforms.fogDensity.value = this.xr.Scene.fog.density;
          // this.materials[matName].uniforms.fogFar.value = this.xr.Scene.fog.color;
          // this.materials[matName].uniforms.fogNear.value = this.xr.Scene.fog.color;
        }

      }
    })
    console.log("this " , this.materials);


  }

  GetHSLColor(hslArray) {
    var color = new Color();
    color.setHSL(hslArray[0] / 360, hslArray[1] / 100, hslArray[2] / 100)
    return color;
  }


  GetMaterial(name) {
    if (this.materials.hasOwnProperty(name)) {
      return this.materials[name];
    } else {
      console.warn(`Achtung ${name} existiert nicht in den Materials`);
      return new MeshBasicMaterial({ color: 0xff0000 });

    }
  }
}


export default MaterialController;
import { MeshBasicMaterial, AdditiveBlending, Color } from "three";

import Skybox from './Skybox';
import FogFloorDiffuse from './FogFloorDiffuse';
import FogFloorAlpha from './FogFloorAlpha';

import Floor from "./Floor";
import SkyboxTexture from "./SkyboxTexture";
import BGFrontTexture from "./BGFrontTexture";
import BGBackTexture from "./BGBackTexture";
import BGGradientFront from "./BGGradientFront";
import BGGradientBack from "./BGGradientBack";
import ThemeFactory from "./ThemeFactory";
import theme1 from '../Themes/theme_1/theme.json';
import theme2 from '../Themes/theme_2/theme.json';

import theme_DunkelConcrete from '../Themes/theme_DunkelConcrete/theme.json';
import theme_DunkelConcrete_Morning from '../Themes/theme_DunkelConcrete_Morning/theme.json';
import theme_ThueringerLandschaft from '../Themes/theme_ThueringerLandschaft/theme.json';
import theme_Turell_gelb from '../Themes/theme_Turell_gelb/theme.json';
import theme_Sun_Orange2 from '../Themes/theme_Sun_Orange2/theme.json';
import theme_Cyberpunk_Sun from '../Themes/theme_Cyberpunk_Sun/theme.json';
import theme_DunkelGrid from '../Themes/theme_DunkelGrid/theme.json';

import LerpMaterial from './LerpMaterial';
import Utils  from "../scripts/utils";

class MaterialController {
  constructor(xr, store) {
    this.xr = xr;
    this.store = store;

    this.store.commit("setAllThemes",[theme_DunkelConcrete,theme_DunkelConcrete_Morning,theme_ThueringerLandschaft,theme_Turell_gelb,theme_Sun_Orange2,theme_Cyberpunk_Sun,theme_DunkelGrid])
    
    this.store.commit("setLastTheme",theme_DunkelConcrete)
    this.store.commit("setNextTheme", theme_DunkelConcrete_Morning)
    this.store.commit("setMaterialController", this);

    //GRADIENT
    this.gradient_skybox = new Skybox({
      name: "skybox"
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

    });
    var grid_floor = grid_floor_obj.material;

    //BG Back
    var bg_back_obj = new LerpMaterial({
      color: 0xff0000,
      transparent: true,
      depthWrite: false,
    });
    var bg_back = bg_back_obj.material

    //BG Front
    var bg_front_obj = new LerpMaterial({
      color: 0xffffff,
      transparent: true,
      depthWrite: false,
    });
    var bg_front = bg_front_obj.material

    //Sky Texture
    var skybox_texture_obj = new LerpMaterial({
      color: 0x00ff00,
      transparent: true,
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
        depthWrite: false
      }),
      skybox_gradient: new MeshBasicMaterial({
        map: this.gradient_skybox.GetTexture()
      }),
      grid_floor,
      bg_back,
      bg_front,
      skybox_texture
    }

    this.tex_floor = new Floor(this.xr);
    this.tex_skybox = new SkyboxTexture(this.xr);
    this.tex_bg_front = new BGFrontTexture(this.xr);
    this.tex_bg_back = new BGBackTexture(this.xr);

    this.tex_skybox.SetMaterial("Sky", skybox_texture_obj);
    this.tex_floor.SetMaterial("Floor", grid_floor_obj);
    this.tex_bg_front.SetMaterial("BG_Front", bg_front_obj);
    this.tex_bg_back.SetMaterial("BG_Back", bg_back_obj);

 

    this.LerpThemes(this.store.state.lastTheme, this.store.state.nextTheme, 0);

    this.store.watch(state => state.themeLerp, (newValue, oldViewMode) => {
      console.log("Watch Theme Lerp ", newValue);
      this.LerpThemes(this.store.state.lastTheme, this.store.state.nextTheme, newValue)
    });


    this.xr.Events.addEventListener("OnTextureLoad", ()=>{
      console.log("texture wurde geladen");

      this.LerpThemes(this.store.state.lastTheme, this.store.state.nextTheme, this.store.state.themeLerp);
    })
  }

  lerp(a, b, t) {
    return (1 - t) * a + t * b;
  }

  LerpHSV (arr1, arr2, t)
  {
      var h = null;
      var a = {h:arr1[0]/360,s: arr1[1]/100,v:arr1[2]/100}
      var b = {h:arr2[0]/360,s: arr2[1]/100,v:arr2[2]/100}
      
      var d = b.h - a.h;

      if (a.h > b.h)
      {
          // Swap (a.h, b.h)
          var h3 = b.h;
          b.h = a.h;
          a.h = h3;
          d = -d;
          t = 1 - t;
      }
      if (d > 0.5) // 180deg
      {
          a.h = a.h + 1; // 360deg
          h = ( a.h + t * (b.h - a.h) ) % 1; // 360deg
      }
      if (d <= 0.5) // 180deg
      {
          h = a.h + t * d
      }
      console.log("A ",a, " B ",b, " H ",h, " T ",t)
      // Interpolates the rest
      return [
          h*360,            // H
          (a.s + t * (b.s-a.s))*100,    // S
          (a.v + t * (b.v-a.v))*100,    // V
      ];
  }

  hsv_to_hsl(arr) {
    var h = arr[0]/360;
    var s = arr[1]/100;
    var v = arr[2]/100;

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

    return [h*360, s*100, l*100]
  }


 

  lerpColor(arr1, arr2, alpha) {
    var finalArr = [];

    if (arr1.length != arr2.length) {
      //console.log("lerpColor: themes haben verschiedene color themes ");

      return;
    }

    for (var i = 0; i < arr1.length; i++) {

      var val1 = Utils.hexToHSL(arr1[i].value);
      var val2 = Utils.hexToHSL(arr2[i].value);
      
      console.log("Lerp Color HSL ",val1, val2)
      var hsv = this.LerpHSV(val1, val2, alpha);
      console.log("Lerped ",hsv)
      //console.log("HSV ",hsv)



      finalArr.push({
        stop: this.lerp(arr1[i].stop, arr2[i].stop, alpha),
        value: [
          hsv[0],
          hsv[1],
          hsv[2],
        ]
      })

    }


    //console.log("lerpColor", arr1, arr2, finalArr);
    return finalArr;

  }

  LerpThemes(themeA, themeB, alpha) {
    var final = ThemeFactory.Get();

    if (themeA == null || themeB == null) {
      if (themeA == null) { themeA = ThemeFactory.Get(); }
      if (themeB == null) { themeB = ThemeFactory.Get(); }
    }
    Object.keys(final).map((keyName) => {

      if (Array.isArray(themeA[keyName])) {
        //console.log("KEY NAME lerp Gradient Color ", keyName)
        final[keyName] = this.lerpColor(themeA[keyName], themeB[keyName], alpha);
        //console.log(final[keyName])
      }
    })
    this.gradient_skybox.SetGradient(final.gradient_skybox);
    this.gradient_fogFloor.SetGradient(final.gradient_fogFloor);
    this.gradient_fogFloorAlpha.SetGradient(final.gradient_fogFloorAlpha);
    this.materials.base_floor.color = this.GetHSLColor(final.base_floor[0].value);

    this.tex_floor.lerpMaterial(themeA.tex_floor, themeB.tex_floor, alpha);
    this.tex_skybox.lerpMaterial(themeA.tex_skybox, themeB.tex_skybox, alpha);

    this.gradient_bg_front.SetGradient(final.gradient_bg_front);
    this.gradient_bg_back.SetGradient(final.gradient_bg_back);
    this.tex_bg_front.lerpMaterial(this.gradient_bg_front.GetTexture(), this.gradient_bg_front.GetTexture(), alpha, themeA.tex_bg_front, themeB.tex_bg_front);
    this.tex_bg_back.lerpMaterial(this.gradient_bg_back.GetTexture(), this.gradient_bg_back.GetTexture(), alpha, themeA.tex_bg_back, themeB.tex_bg_back);


    console.log("SCENE ", this.xr.Scene)

  }

  GetHSLColor(hslArray) {
    var color = new Color();
    color.setHSL(hslArray[0] / 360, hslArray[1] / 100, hslArray[2] / 100)
    return color;
  }


  GetMaterial(name) {
    return this.materials[name];
  }
}


export default MaterialController;
import { MeshBasicMaterial, AdditiveBlending, Color } from "three";

import Skybox from './Skybox';
import FogFloorDiffuse from './FogFloorDiffuse';
import FogFloorAlpha from './FogFloorAlpha';

import Floor from "./Floor";
import SkyboxTexture from "./SkyboxTexture";
import BGFrontTexture from "./BGFrontTexture";
import BGBackTexture from "./BGBackTexture";
import ThemeFactory from "./ThemeFactory";
import theme1 from '../Themes/theme_1/theme.json';
import theme2 from '../Themes/theme_2/theme.json';

import LerpMaterial from './LerpMaterial';

class MaterialController {
  constructor(xr, store) {
    this.xr = xr;
    this.store = store;
    this.currentTheme = theme1;
    this.nextTheme = theme2;


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


    //var lerpMaterial = new LerpMaterial();

    //console.log("lerpMaterial", lerpMaterial);

    this.materials = {
      base_floor: new MeshBasicMaterial({
        color: 0x000000,
      }),
      grid_floor: new LerpMaterial({
        color: 0xff0000,
        transparent: true,
        depthWrite: false
      }),
      fog_floor: new MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        map: this.gradient_fogFloor.GetTexture(),
        alphaMap: this.gradient_fogFloorAlpha.GetTexture(),

        depthWrite: false
      }),
      bg_back: new LerpMaterial({
        color: 0xff0000,
        transparent: true,
        depthWrite: false
      }),
      bg_front: new LerpMaterial({
        color: 0xffffff,
        transparent: true,
        depthWrite: false
        //depthTest: false
      }),

      skybox_gradient: new MeshBasicMaterial({
        map: this.gradient_skybox.GetTexture()
      }),
      skybox_texture: new LerpMaterial({
        color: 0x000000,
        transparent: true,

      })
    }
    /*this.tex_floor = new Floor(this.xr);
    this.tex_skybox = new SkyboxTexture(this.xr);
    this.tex_bg_front = new BGFrontTexture(this.xr);
    this.tex_bg_back = new BGBackTexture(this.xr);

    this.tex_skybox.SetTexture("BG", this.materials.skybox_texture, "map");

    this.tex_floor.SetTexture("Grid", this.materials.grid_floor, "map");

    this.tex_bg_front.SetTexture("Mountainsfront", this.materials.bg_front, "alphaMap");

    this.tex_bg_back.SetTexture("Mountains", this.materials.bg_back, "alphaMap");*/


    //gelerpt
    //this.LerpThemes(this.currentTheme, this.nextTheme, .5);
    this.store.commit("setLastTheme", theme1)
    this.store.commit("setNextTheme", theme2)
    this.LerpThemes(this.store.state.lastTheme, this.store.state.nextTheme, 0);

    this.store.watch(state => state.themeLerp, (newValue, oldViewMode) => {
      console.log("Watch Theme Lerp ", newValue);
      this.LerpThemes(this.store.state.lastTheme, this.store.state.nextTheme, newValue)
    });

  }

  lerp(a, b, t) {
    return (1 - t) * a + t * b;
  }

  lerpColor(arr1, arr2, alpha) {
    var finalArr = [];

    if (arr1.length != arr2.length) {
      console.log("lerpColor: themes haben verschiedene color themes ");

      return;
    }

    for (var i = 0; i < arr1.length; i++) {

      finalArr.push({
        stop: this.lerp(arr1[i].stop, arr2[i].stop, alpha),
        value: [
          this.lerp(arr1[i].value[0], arr2[i].value[0], alpha),
          this.lerp(arr1[i].value[1], arr2[i].value[1], alpha),
          this.lerp(arr1[i].value[2], arr2[i].value[2], alpha),
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

      //if(!final.hasOwnProperty(keyName)){
      if (Array.isArray(themeA[keyName])) {
        console.log("KEY NAME ", keyName)
        final[keyName] = this.lerpColor(themeA[keyName], themeB[keyName], alpha);
        console.log(final[keyName])

      }

    })
    this.gradient_skybox.SetGradient(final.gradient_skybox);
    this.gradient_fogFloor.SetGradient(final.gradient_fogFloor);
    this.gradient_fogFloorAlpha.SetGradient(final.gradient_fogFloorAlpha);


    this.materials.base_floor.color = this.GetHSLColor(final.base_floor[0].value);

    // this.tex_floor.LerpMaterial(themeA.tex_floor,themeA.tex_floor, alpha);
    // this.tex_skybox.LerpMaterial(themeA.tex_floor,themeA.tex_floor, alpha);
    // this.tex_bg_front.LerpMaterial(themeA.tex_floor,themeA.tex_floor, alpha);
    // this.tex_bg_back.LerpMaterial(themeA.tex_floor,themeA.tex_floor, alpha);

  }

  GetHSLColor(hslArray) {
    var color = new Color();
    color.setHSL(hslArray[0] / 100, hslArray[1] / 100, hslArray[2] / 100)
    return color;
  }


  GetMaterial(name) {
    return this.materials[name];
  }
}


export default MaterialController;
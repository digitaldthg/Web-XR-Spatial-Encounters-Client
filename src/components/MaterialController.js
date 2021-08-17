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

import DunkelConcrete from '../Themes/theme_DunkelConcrete/theme.json';
import DunkelConcreteMorning from '../Themes/theme_DunkelConcreteMorning/theme.json';
import ThueringerLandschaft from '../Themes/theme_ThueringerLandschaft/theme.json';
import DesertGelb from '../Themes/theme_DesertGelb/theme.json';
import DesertHell from '../Themes/theme_DesertHell/theme.json';
import DesertPistachio from '../Themes/theme_DesertPistachio/theme.json';
import DesertSun from '../Themes/theme_DesertSun/theme.json';
import DesertSunDark from '../Themes/theme_DesertSunDark/theme.json';
import CyberpunkSun from '../Themes/theme_CyberpunkSun/theme.json';
import GridDunkelWolken from '../Themes/theme_GridDunkelWolken/theme.json';
import GridDunkel from '../Themes/theme_GridDunkel/theme.json';
import GridWhite from '../Themes/theme_GridWhite/theme.json';

import LerpMaterial from './LerpMaterial';
import Utils from "../scripts/utils";
import SunGradient from "./SunGradient";
import TWEEN from "@tweenjs/tween.js";

class MaterialController {
  constructor(xr, store) {
    this.xr = xr;
    this.store = store;

    this.store.commit("setAllThemes", [DunkelConcrete, DunkelConcreteMorning, ThueringerLandschaft, DesertGelb,DesertHell,DesertPistachio,DesertSun,DesertSunDark,CyberpunkSun,GridDunkelWolken,GridDunkel,GridWhite])

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
      side: FrontSide

    });
    var grid_floor = grid_floor_obj.material;

    var guardian_obj = new LerpMaterial({
      color: 0x0000ff,
      transparent: true,
      depthWrite: false,
      side: DoubleSide
    });
    var guardian = guardian_obj.material;
    //Sun
    var sun_obj = new LerpMaterial({
      color: 0xff0000,
      transparent: true,
      depthWrite: false,
      side: FrontSide
    });
    var sun = sun_obj.material

    //BG Back
    var bg_back_obj = new LerpMaterial({
      color: 0xff0000,
      transparent: true,
      depthWrite: false,
      side: FrontSide
    });
    var bg_back = bg_back_obj.material

    //BG Front
    var bg_front_obj = new LerpMaterial({
      color: 0xffffff,
      transparent: true,
      depthWrite: false,
      side: FrontSide
    });
    var bg_front = bg_front_obj.material

    //Sky Texture
    var skybox_texture_obj = new LerpMaterial({
      color: 0x00ff00,
      transparent: true,
      side: FrontSide
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
    this.tex_guardian = new Guardian({ xr: this.xr, store: this.store })
    this.tex_floor = new Floor(this.xr);
    this.tex_skybox = new SkyboxTexture(this.xr);
    this.tex_bg_front = new BGFrontTexture(this.xr);
    this.tex_bg_back = new BGBackTexture(this.xr);
    this.tex_sun = new Sun(this.xr);

    this.tex_sun.SetMaterial("Sun", sun_obj)
    this.tex_skybox.SetMaterial("Sky", skybox_texture_obj);
    this.tex_floor.SetMaterial("Floor", grid_floor_obj);
    this.tex_guardian.SetMaterial("Guardian", guardian_obj);
    this.tex_bg_front.SetMaterial("BG_Front", bg_front_obj);
    this.tex_bg_back.SetMaterial("BG_Back", bg_back_obj);

    //this.LerpThemes(this.store.state.lastTheme, this.store.state.nextTheme, this.store.state.themeLerp);

    this.xr.Events.addEventListener("OnTextureLoad", () => {
      //console.log("LERP ON TEXTURE LOAD");
      //this.LerpThemes(this.store.state.lastTheme, this.store.state.nextTheme, this.store.state.themeLerp);
    });

    this.store.watch(state => state.nextTheme, (newValue) => {
      this.StartLerpThemes();
    })


    this.store.watch(state => state.fogDistance, (newValue) => {
      this.ChangeFogDistance(newValue);
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
  StartLerpThemes() {

    var lerpObject = { lerp: 0 };
    const tween = new TWEEN.Tween(lerpObject)
      .to(
        {
          lerp: 1,
        },
        this.store.state.lerpDuration * 1000
      )
      .onUpdate((v) => {
        this.store.commit("setThemeLerp",v.lerp)
        this.LerpThemes(this.store.state.lastTheme, this.store.state.nextTheme, v.lerp)
      })
      .start(); // Start
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


    this.ChangeFogDistance();

  }

  ChangeFogDistance() {
    //Update Fog Uniform Settings
    Object.keys(this.materials).map((matName) => {
      if (this.materials[matName].hasOwnProperty("uniforms")) {
        if (this.materials[matName].uniforms.hasOwnProperty("fogColor")) {
          this.materials[matName].uniforms.fogColor.value = this.xr.Scene.fog.color;
          this.materials[matName].uniforms.fogNear.value = 0; //this.xr.Camera.near;
          this.materials[matName].uniforms.fogFar.value = 20; //this.xr.Camera.far;
          this.materials[matName].uniforms.fogDensity.value = this.store.state.fogDistance;
        }
      }
    });
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
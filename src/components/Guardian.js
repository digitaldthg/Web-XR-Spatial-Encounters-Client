import TextureLerpBackground from "./TextureLerpBackground";
import grid from '../Model/environment/textures/grid_02_red.png';
import TWEEN from "@tweenjs/tween.js";

import {
  NearestFilter,
  NearestMipMapNearestFilter,
  NearestMipmapLinearFilter,
  LinearFilter,
  LinearMipmapNearestFilter,
  LinearMipMapLinearFilter,
} from 'three';
class Guardian extends TextureLerpBackground {

  constructor(props) {
    super(props.xr);
    this.store = props.store
    this.tween = null
    this.isVisible = true;
    this.canFade = true;
    this.boundinBox = {
      x: {
        min: -10,
        max: -4
      },
      z: {
        min: -14,
        max: -2
      }
    }

    this.Load("Grid", grid).then((texture) => {
      texture.repeat.set(10, 10);
    });

    this.store.watch(state => state.playerPosition, (newValue, oldViewMode) => {
      var isOutside = (newValue.x < this.boundinBox.x.min || newValue.x > this.boundinBox.x.max || newValue.z < this.boundinBox.z.min || newValue.z > this.boundinBox.z.max)
      
      if(!this.canFade){return;}
      if (!this.isVisible && isOutside) {
        this.isVisible = true;
        this.Fade(true)
      } else if (this.isVisible && !isOutside) {
        this.isVisible = false;
        this.Fade(false)
      }
    });


    this.store.watch(state => state.presentation, (boolean)=>{

      this.canFade = !boolean;

      if(boolean){
        this.isVisible = false;
        this.Fade(false);
      }
    })


  }

  Fade(fadeIn) {
    if (this.tween != null) { this.tween.stop(); }
    var lerpObject = { lerp: this.material.material.uniforms.opacity.value };
    this.tween = new TWEEN.Tween(lerpObject)
      .to(
        {
          lerp: fadeIn ? 1 : 0,
        },
        1500
      )
      .onUpdate((v) => {
        this.SetOpacity(v.lerp)
      })
      .start(); // Start
  }



}

export default Guardian;
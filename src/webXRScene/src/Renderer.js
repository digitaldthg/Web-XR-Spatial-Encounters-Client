import * as THREE from 'three';
//import TWEEN from '@tweenjs/tween.js';

import {Events} from './Events';
import { Camera } from './Camera.js';
import { DesktopControls } from './DesktopControls.js';
import { Loader } from './Loader.js';
import {webXRScene}from "./index.js";
import { Clock, Vector2, Vector3 } from "three";
import { LoadingManager } from "three";

import { BokehShader, BokehDepthShader } from 'three/examples/jsm/shaders/BokehShader2.js';

//import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass.js';
import { SavePass } from 'three/examples/jsm/postprocessing/SavePass.js';
//import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import motionBlurShader from './MotionBlur';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { CopyShader } from 'three/examples/jsm/shaders/CopyShader.js';
import { BlendShader } from 'three/examples/jsm/shaders/BlendShader';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass.js';
import { DoFShader } from './DoFShader.js';

import EffectComposer from './EffectComposer';
import UnrealBloomPass from './UnrealBloomPass.js';

class Renderer {
  
  constructor(id = "app", context){
    this.context = context;
    this.clock = new THREE.Clock();
    this.postprocessing = {
      enabled : false,
      initialized : false
    };
    this.context.Events.registerEvent('OnAnimationLoop');
    this.context.Events.registerEvent('OnAfterRenderLoop');
    
    this.instance = new THREE.WebGLRenderer({
      alpha : true,
      antialias: true,
      transparent : true,
      //autoClear: false,
      //logarithmicDepthBuffer: false
      //powerPreference: "high-performance",
      // stencil: false,
      //depth: false
    });
    this.instance.physicallyCorrectLights = true;
    this.size = new Vector2(window.innerWidth, window.innerHeight);
    
    this.instance.shadowMap.enabled = true;
    this.instance.shadowMap.autoUpdate = false;
    this.instance.shadowMap.type = THREE.PCFSoftShadowMap;

    //this.instance.toneMapping = THREE.CustomToneMapping;//THREE.ReinhardToneMapping;
    //this.instance.outputEncoding = THREE.sRGBEncoding;
    this.instance.gammaFactor = 1;
    this.instance.colorManagement = true;
    this.instance.setClearColor(0xcccccc,0);

    //http://filmicworlds.com/blog/filmic-tonemapping-operators/
//     THREE.ShaderChunk.tonemapping_pars_fragment = THREE.ShaderChunk.tonemapping_pars_fragment.replace(
//       'vec3 CustomToneMapping( vec3 color ) { return color; }',
//       `
//       float A = 0.25;
//       float B = 0.50;
//       float C = 0.10;
//       float D = 0.20;
//       float E = 0.02;
//       float F = 0.30;
//       float W = 11.2;

// vec3 Uncharted2Helper(vec3 x) { return ((x*(A*x+C*B)+D*E)/(x*(A*x+B)+D*F))-E/F;}			
//       float toneMappingWhitePoint = 1.6;
//       vec3 CustomToneMapping( vec3 color ) {
//         color *= toneMappingExposure;
//         return saturate( Uncharted2Helper( color ) / Uncharted2Helper( vec3( toneMappingWhitePoint ) ) );
//       }`
//     );



    
    this.instance.setSize(this.size.x,this.size.y);
    this.instance.xr.enabled = true;
    this.instance.setAnimationLoop(this.AnimationLoop);

    this.domElement = document.getElementById(id);

    if(typeof(this.domElement) == "undefined"){console.logwarn("couldn't find an element with id:"+id);}

    this.domElement.appendChild( this.instance.domElement );
    
    if(this.postprocessing.enabled){
      this.context.Events.addEventListener("OnMount",()=>this.InitComposer() );
    }

    window.addEventListener("resize", this.Resize);
  }

  InitComposer = () => {
    this.effects = true;


    
    this.postprocessing.composer = new EffectComposer( this.instance  );

    this.instance.setRenderTarget( this.postprocessing.composer.readBuffer );
    
    /** RenderPass*/
   // this.postprocessing.RenderPass = new RenderPass( this.context.Scene, this.context.Camera.instance );
   // this.postprocessing.RenderPass.renderToScreen = true;
   //this.postprocessing.composer.addPass( this.postprocessing.RenderPass );
    
    /** FXAA */
    this.postprocessing.fxaaPass = new ShaderPass( FXAAShader );
    
    this.postprocessing.fxaaPass.material.uniforms[ 'resolution' ].value.x = 1 / ( this.size.x * this.dpr );
    this.postprocessing.fxaaPass.material.uniforms[ 'resolution' ].value.y = 1 / ( this.size.y * this.dpr );
    this.postprocessing.fxaaPass.renderToScreen = true;
    this.postprocessing.composer.addPass( this.postprocessing.fxaaPass );

    // this.context.Scene.onAfterRender = () => {
    //   this.postprocessing.composer.render();
    // };

		//this.postprocessing.composer.addPass( this.postprocessing.lutPass );
    //this.postprocessing.composer.addPass( this.postprocessing.bloomPass );
    
    
    //this.postprocessing.composer.addPass( this.postprocessing.fxaaPass );
    //Bloom
    
    // this.postprocessing.bloomPass = new UnrealBloomPass( new Vector2(512,512), .94,.9,.5 );
    // this.postprocessing.bloomPass.strength = .6
    // this.postprocessing.bloomPass.radius = 0;
    // this.postprocessing.bloomPass.threshold = 0.15;
    //this.postprocessing.bloomPass.renderToScreen = true;

    // this.postprocessing.bloomPass.BlurDirectionX = new THREE.Vector2( 1.0, 0.0 );
    // this.postprocessing.bloomPass.BlurDirectionY = new THREE.Vector2( 0.0, 1.0 );
    
    //this.postprocessing.composer.addPass( this.postprocessing.bloomPass );


    // this.context.Scene.onAfterRender = ( renderer ) => {
// 
     //console.log(renderer);
      // this.postprocessing.composer.render(.1);
      //this.postprocessing.composer.render();
// 
    // };


    this.postprocessing.initialized = true;
  }

  EnablePostProcessing(cb){
    this.postprocessing.enabled = true;
    this.InitComposer();

    if(typeof(cb)!="undefined"){
      cb();
    }
  }

  AnimationLoop = () => {
    this.context.Events.dispatchEvent('OnAnimationLoop', this.clock);

    if(this.size.x == 0 || this.size.y === 0){
      this.Resize();
    }

    this.context.Mixer.update(0.1);
    if(this.postprocessing.enabled){
      if(!this.postprocessing.initialized){
        this.InitComposer();
        return;
      }

      //console.log(this.postprocessing.composer.passes);
      this.postprocessing.composer.passes.map((pass)=>{
        if(pass.hasOwnProperty("scene")){
          pass.scene = this.context.Scene;
        }
        if(pass.hasOwnProperty("camera")){
          pass.scene = this.context.Camera.instance;
        }
      });
      

      this.postprocessing.composer.passes.map((pass)=>{
        if(pass.hasOwnProperty("scene")){
          pass.scene = this.context.Scene;
        }
        
        if(pass.hasOwnProperty("camera")){
          pass.camera = this.context.Camera.instance;
        }
      });

      this.postprocessing.composer.render();
    }else{
      this.instance.render(this.context.Scene, this.context.Camera.instance);
    }

    this.context.Events.dispatchEvent('OnAfterRenderLoop', this.clock);
  }

  Resize = () =>{

    var size = this.domElement.getBoundingClientRect();
    this.size = new Vector2(size.width, size.height);
    this.instance.setSize(this.size.x,this.size.y);

    this.context.Camera.instance.aspect = this.size.x / this.size.y;
    this.context.Camera.instance.updateProjectionMatrix();
    if(this.postprocessing.enabled){
      this.postprocessing.composer.setSize( this.size.x , this.size.y );
      
      this.postprocessing.fxaaPass.material.uniforms[ 'resolution' ].value.x = 1 / ( this.size.x * this.dpr );
      this.postprocessing.fxaaPass.material.uniforms[ 'resolution' ].value.y = 1 / ( this.size.y * this.dpr );
    
    }

  }

}

export {Renderer};
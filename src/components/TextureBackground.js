import {RepeatWrapping} from 'three';


class TextureBackground {
  constructor(xr){
    this.xr = xr;
    this.textures = {};
    this.queue = {};
    this.material = null;
  }

  Load(name, url){
    return this.xr.CustomTextureLoader.load(url).then((texture)=>{
      
      this.textures[name] = texture;
      this.textures[name].wrapS = RepeatWrapping;
      this.textures[name].wrapT = RepeatWrapping;

      if(Object.keys(this.queue).length > 0){
        this.WorkOnQueue(name);
      }

      return texture;
    });
  }
  WorkOnQueue(name){

    if(this.queue.hasOwnProperty(name)){
      this.SetTexture(this.queue[name].name,this.queue[name].material, this.queue[name].mapType );
      delete this.queue[name];
    }

  }

  SetTexture(name, material, mapType){

    this.material = material;
    
    if(this.textures.hasOwnProperty(name)){
      material[mapType] = this.textures[name];
    }else{
      this.queue[name] = {
        name : name,
        material : material,
        mapType : mapType
      }
    }

  }

  LerpMaterial(texName1, texName2, alpha ){
    // this.material.uniforms.texture_1.value = this.textures[texName1];
    // this.material.uniforms.texture_2.value = this.textures[texName2];
    // this.material.uniforms.alpha.value = alpha;
// 
    // this.material.uniformsNeedsUpdate = true;
  }

  GetTexture(name){
    return this.textures[name];
  }
  SetOffset(name, offset){
    if(this.textures.hasOwnProperty(name)){
      this.textures[name].offset.set(offset.x,offset.y);
    }
  }
}

export default TextureBackground;

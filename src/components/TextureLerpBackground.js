import { RepeatWrapping, Vector2 } from 'three';


class TextureLerpBackground {
  constructor(xr) {
    this.xr = xr;
    this.textures = {};
    this.queue = {};
    this.material = null;
  }

  Load(name, url, alphaType) {
    return this.xr.CustomTextureLoader.load(url).then((texture) => {
      this.textures[name] = texture;
      this.textures[name].wrapS = RepeatWrapping;
      this.textures[name].wrapT = RepeatWrapping;

      if (Object.keys(this.queue).length > 0) {
        this.WorkOnQueue(name);
      }
      return texture;
    });
  }
  WorkOnQueue(name) {

    if (this.queue.hasOwnProperty(name)) {
      this.SetTexture(this.queue[name].name, this.queue[name].material, this.queue[name].mapType);
      delete this.queue[name];
    }

  }
  SetMaterial(name, material, gradient) {
    this.material = material
    this.material.name = name
  }

  lerpMaterial(texName1, texName2, alpha, alphaTex1 = null, alphaTex2 = null) {

    var tex_1 = null;
    if (typeof (texName1) == 'string') {
      tex_1 = this.textures[texName1];
    } else {
      tex_1 = texName1;
    }
    this.material.material.uniforms.texture_1.value = tex_1;

    if (tex_1 != null && tex_1 != undefined) {
      if (tex_1.repeat != undefined) {
        this.material.material.uniforms.textureRepeat_1.value = tex_1.repeat;
        this.material.material.uniforms.textureOffset_1.value = tex_1.offset;
      }

    }

    var tex_2 = null;
    if (typeof (texName2) == 'string') {
      tex_2 = this.textures[texName2];
    } else {
      tex_2 = texName2;
    }
    this.material.material.uniforms.texture_1.value = tex_2;
    if (tex_2 != null && tex_2 != undefined) {
      if (tex_2.repeat != undefined) {
        this.material.material.uniforms.textureRepeat_2.value = tex_2.repeat;
        this.material.material.uniforms.textureOffset_2.value = tex_2.offset;
      }
    }


    this.material.material.uniforms.hasAlphaMap_1.value = false;
    this.material.material.uniforms.hasAlphaMap_2.value = false;

    if (alphaTex1 != null) {
      this.material.material.uniforms.hasAlphaMap_1.value = true;
      this.material.material.uniforms.alpha_texture_1.value = this.textures[alphaTex1];
      if (this.textures[alphaTex1] != undefined) {
        this.material.material.uniforms.textureRepeat_1.value = this.textures[alphaTex1].repeat;
        this.material.material.uniforms.textureOffset_1.value = this.textures[alphaTex1].offset
      }
    }


    if (alphaTex2 != null) {
      this.material.material.uniforms.hasAlphaMap_2.value = true;
      this.material.material.uniforms.alpha_texture_2.value = this.textures[alphaTex2];
      if (this.textures[alphaTex2] != undefined) {
        this.material.material.uniforms.textureRepeat_2.value = this.textures[alphaTex2].repeat;
        this.material.material.uniforms.textureOffset_2.value = this.textures[alphaTex2].offset
      }
    }


    this.material.material.uniforms.alpha.value = alpha;
    this.material.uniformsNeedsUpdate = true;
  }

  GetTexture(name) {
    return this.textures[name];
  }
  SetOffset(name, offset) {
    if (this.textures.hasOwnProperty(name)) {
      this.textures[name].offset.set(offset.x, offset.y);
    }
  }
}

export default TextureLerpBackground;

import axios from "axios";
import config from "../../../main.config";
import {RepeatWrapping, Texture} from 'three';

class CustomThemeLoader{
  constructor({xr, materialController}){
    this.themes = ["Simpons", "OwnTheme", "ThemeName"];

    this.xr = xr;
    this.materialController = materialController;

  }
  async LoadThemes(){
    const themePromises = this.themes.map((themeName)=>{
      return this.LoadTheme(themeName);
    });

    return Promise.all(themePromises);
  }

  async LoadTheme(name){

    const themeFolder = config.IP + ":" + config.VUE_PORT + "/Custom_Themes/" + name ;
    const themeJSONResponse = await axios.get(themeFolder + "/theme_" + name + ".json");
    const themeJSON = themeJSONResponse.data;

    if(themeJSON.tex_floor != null){
      await this.LoadTexture("tex_floor", themeJSON, themeFolder, name);
    }

  //   "tex_floor" : "GridPink",
  // "tex_skybox" : null,
  // "tex_bg_front" : "Mountains4",
  // "tex_bg_back" : "Wolken",
  // "tex_bg_moving": "Black",
  // "tex_guardian":"Grid",
  // "tex_sun":"Sun"


    if(themeJSON.tex_skybox != null){
      await this.LoadTexture("tex_skybox", themeJSON, themeFolder, name);
    }
    
    if(themeJSON.tex_bg_front != null){
      await this.LoadTexture("tex_bg_front", themeJSON, themeFolder, name);
    }
    
    if(themeJSON.tex_bg_back != null){
      await this.LoadTexture("tex_bg_back", themeJSON, themeFolder, name);
    }
    
    if(themeJSON.tex_bg_moving != null){
      await this.LoadTexture("tex_bg_moving", themeJSON, themeFolder, name);
    }
    
    if(themeJSON.tex_guardian != null){
      await this.LoadTexture("tex_guardian", themeJSON, themeFolder, name);
    }
    
    if(themeJSON.tex_sun != null){
      await this.LoadTexture("tex_sun", themeJSON, themeFolder, name);
    }


    return themeJSON;
  }

  async LoadTexture(textureNameToLoad, themeJSON, themeFolder, themeName){
    const blobResponse = await axios.get(themeFolder + "/" + themeJSON[textureNameToLoad], {responseType: "blob"});
      
      const loadedTexture = await new Promise((resolve,reject) => {

        var image = new Image();
        var texture = new Texture();
        
        console.log("load image");
        image.onload = ()=> { 
          texture.image = image; 
          texture.needsUpdate = true;
          texture.wrapS = texture.wrapT = RepeatWrapping;

          console.log(themeJSON , themeJSON[textureNameToLoad + "_tile"] , themeJSON[textureNameToLoad + "_offset"])

          texture.repeat.set(themeJSON[textureNameToLoad + "_tile"].x,themeJSON[textureNameToLoad + "_tile"].y)
          texture.offset.set(themeJSON[textureNameToLoad + "_offset"].x,themeJSON[textureNameToLoad + "_offset"].y)

          resolve(texture);
        };
        image.src = URL.createObjectURL( blobResponse.data );
      });

      this.materialController[textureNameToLoad].textures[themeName + "_"+ textureNameToLoad] = loadedTexture;

      themeJSON[textureNameToLoad] = themeName + "_"+ textureNameToLoad;

      return themeJSON;
  }
}

export default CustomThemeLoader;
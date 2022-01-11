import axios from "axios";
import config from "../../../main.config";
import {RepeatWrapping, Texture,ClampToEdgeWrapping,TextureLoader} from 'three';
import CustomThemes from "../../CustomThemes";

class CustomThemeLoader{
  constructor({xr, materialController}){
    this.themes = CustomThemes;

    this.xr = xr;
    this.materialController = materialController;

  }
  LoadThemes(){
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

    if(themeJSON.tex_skybox != null){
      await this.LoadTexture("tex_skybox", themeJSON, themeFolder, name);
    }
    
    if(themeJSON.tex_bg_front != null){
      console.log("Wait for tex_bg_front");
      await this.LoadTexture("tex_bg_front", themeJSON, themeFolder, name);

      console.log("Loaded tex_bg_front", themeJSON);
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


    console.log("themeJSON" , themeJSON);
    return themeJSON;
  }

  async LoadTexture(textureNameToLoad, themeJSON, themeFolder, themeName){

    console.log("LoadTexture" , themeJSON[textureNameToLoad]);

    if(themeJSON[textureNameToLoad] == "Black"){return themeJSON}

    const blobResponse = await axios.get(themeFolder + "/" + themeJSON[textureNameToLoad], {responseType: "blob"});

    
      const loadedTexture = await new Promise((resolve,reject) => {

        const texture = new TextureLoader().load( URL.createObjectURL( blobResponse.data ) );
        texture.premultiplyAlpha = true;

        if(["tex_bg_front", "tex_bg_back", "tex_bg_moving"].includes(textureNameToLoad )){
           texture.wrapT = ClampToEdgeWrapping;
           texture.wrapS = RepeatWrapping;
           
          }else{
              texture.wrapS = texture.wrapT = RepeatWrapping;
          }

        texture.name = themeName + "_"+ textureNameToLoad;
        texture.repeat.set(themeJSON[textureNameToLoad + "_tile"].x,themeJSON[textureNameToLoad + "_tile"].y);
        texture.offset.set(themeJSON[textureNameToLoad + "_offset"].x,themeJSON[textureNameToLoad + "_offset"].y);
        //texture.needsUpdate = true;
        let textureName = themeName + "_"+ textureNameToLoad;
      
        this.materialController[textureNameToLoad].textures[textureName] = texture;

        themeJSON[textureNameToLoad] = textureName;
       
        resolve(texture);
        
      });

      return themeJSON;
  }
}

export default CustomThemeLoader;
import TextureLerpBackground from "./TextureLerpBackground";
import SkyBG from '../Model/environment/texture/bg_texture.png';

class SkyboxTexture extends TextureLerpBackground{

  constructor(props){
    super(props);

    console.log(this);

    this.Load("BG", SkyBG).then((texture)=>{
      console.log("SkyboxTexture" , texture);

      texture.repeat.set(10,10);
      
    });
  }

  

}

export default SkyboxTexture;


import TextureLerpBackground from "./TextureLerpBackground";
import SkyBG from '../Model/environment/textures/bg_texture.png';

class SkyboxTexture extends TextureLerpBackground {

  constructor(props) {
    super(props);

    console.log(this);

    this.Load("BG", SkyBG).then((texture) => {
      texture.repeat.set(10, 10);
    })
  }
}

export default SkyboxTexture;


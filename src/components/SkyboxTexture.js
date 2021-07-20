import TextureLerpBackground from "./TextureLerpBackground";
import SkyBG from '../Model/environment/texture/bg_texture.png';
import Grid from '../Model/environment/texture/Grid.png';

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


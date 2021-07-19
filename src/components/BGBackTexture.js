import TextureBackground from "./TextureBackground";
import Mountains from '../Model/environment/texture/QC_Mountain.png';

class BGBackTexture extends TextureBackground{

  constructor(props){
    super(props);

    console.log(this);

    this.Load("Mountains", Mountains).then((texture)=>{
      texture.repeat.set( 5 , 1 );
    });
  }

  

}

export default BGBackTexture;


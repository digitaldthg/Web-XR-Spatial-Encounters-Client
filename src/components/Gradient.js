import { CanvasTexture, Texture } from "three";
import config from "../../main.config";

class Gradient{
  name = "gradient";
  c = null;
  canvasElement = null;
  texture = null;
  dpr = window.devicePixelRatio ? window.devicePixelRatio : 1;
  size = {
    x : 500,
    y : 500
  }

  gradient = null;

  constructor(opt = null){
    if(opt != null){
      var {name , size} = opt;
    }
    
    this.size = typeof(size) != "undefined" ? size : this.size;
    this.name = typeof(name) != "undefined" ? name : this.name;

    this.CreateCanvas();

    this.canvasElement.name = name;
    this.canvasElement.setAttribute("data-name" , name);
    this.canvasElement.classList.add(name);

    //this.texture = new CanvasTexture(this.canvasElement);
    	
    this.texture = new Texture(this.canvasElement);
    this.texture.needsUpdate = true;

  }

  CreateCanvas(){
    this.canvasElement = document.createElement("canvas");
    //this.canvasElement.style.display = "none";
    this.c = this.canvasElement.getContext("2d"); 

    let container = document.getElementById("canvases");

    container.appendChild(this.canvasElement);

    this.Resize();
  }

  SetGradient(gradientArray){    


    // Create gradient
    this.gradient = this.c.createLinearGradient(0,0,0,this.size.y * this.dpr);

    console.log("name" , this.name)
    if(this.name == "fogAlpha"){
      console.log("gradientArray" , gradientArray);
    }
    
    for(var i=0;i<gradientArray.length;i++){
      let gradientItem = gradientArray[i];
      let g = gradientArray[i].value;

      this.gradient.addColorStop( gradientItem.stop , `hsl(${ g[0] },${g[1]}%,${g[2]}%)`);
    }

    // Fill with gradient
    this.c.fillStyle = this.gradient;
    
    this.Update();


  }

  GetTexture(){
    return this.texture;
  }

  Resize(){
    this.canvasElement.width = (this.size.x * this.dpr);
    this.canvasElement.height = (this.size.y * this.dpr);
    
    this.canvasElement.style.width = (this.size.x) + "px";
    this.canvasElement.style.height = (this.size.y) + "px";

  }

  Update(){
    this.c.fillRect(0,0,this.size.x * this.dpr,this.size.y * this.dpr);

    if(config.showDevTools){
      this.c.fillStyle = "#ffffff";
      this.c.font = "100px Arial";
      this.c.fillText(this.name, 30, 80);
    }
    this.texture.needsUpdate = true;
  }

}

export default Gradient;
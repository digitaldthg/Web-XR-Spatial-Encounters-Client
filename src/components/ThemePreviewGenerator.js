class ThemePreviewGenerator{
  previews = {};
  constructor(store, themes){

    this.store = store;
    this.GeneratePreviews(themes);

  }

  GeneratePreviews(themes){
    themes.map(t => this.GenerateCanvas(t));
    this.store.commit("SetPreviews" , this.previews);
  }

  GenerateCanvas(theme){


    var canvas = document.createElement("canvas");
    canvas.style.width = 64 + "px";
    canvas.style.height = 64 + "px";
    canvas.style.display = "block";

    canvas.width = 64;
    canvas.height = 64;

    canvas.name = theme.name;

    canvas.classList.add("theme-preview");

    var c = canvas.getContext("2d");

    var grd = c.createLinearGradient(0, 0, 0, 64);

    for(var i=0;i<theme.gradient_skybox.length ;i++){
      grd.addColorStop(1 - theme.gradient_skybox[i].stop, theme.gradient_skybox[i].value);
    }
    
    // Fill with gradient
    c.fillStyle = grd;
    c.fillRect(0, 0,64,64);

    this.previews[theme.name] = canvas;

  }

}

export default ThemePreviewGenerator;
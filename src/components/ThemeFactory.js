const ThemeFactory = {
  Get(){
    return {
      gradient_skybox: [{
        stop : 0,
        value : [250,100,50]
      },
      {
        stop : 1,
        value : [0,100,50]
      }],
      gradient_fogFloor : [
        {
          stop : 0,
          value : [0,100,100]
        },
        {
          stop : 0.5,
          value : [0,100,100]
        },
        {
          stop : 1,
          value : [0,100,100]
        }
      ],
      gradient_fogFloorAlpha : [
        {
          stop : 0,
          value : [0,0,0]
        },
        {
          stop : 0.5,
          value : [0,100,100]
        },
        {
          stop : .8,
          value : [0,0,0]
        }
      ],
      tex_floor : "",
      tex_skybox : "",
      tex_bg_front : "",
      tex_bg_back : "",
    }
  }
  
}


export default ThemeFactory;
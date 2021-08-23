const ThemeFactory = {
  Get() {
    return {
      /*base_floor: [{
        stop: 0,
        value: "#000000"
      }],*/
      gradient_sun: [{
        stop: 0,
        value: "#000000"
      },
      {
        stop: 1,
        value: "#000000"
      }],
      gradient_skybox: [{
        stop: 0,
        value: "#000000"
      },
      {
        stop: 1,
        value: "#000000"
      }],
      gradient_fogFloor: [
        {
          stop: 0,
          value: "#000000"
        },
        {
          stop: 0.5,
          value: "#000000"
        },
        {
          stop: 1,
          value: "#000000"
        }
      ],
      gradient_fogFloorAlpha: [
        {
          stop: 0,
          value: "#000000"
        },
        {
          stop: 0.5,
          value: "#000000"
        },
        {
          stop: 0.8,
          value: "#000000"
        }
      ],
      gradient_bg_front: [
        {
          stop: 0,
          value: "#000000"
        },
        {
          stop: 1,
          value: "#000000"
        }
      ],
      gradient_bg_back: [
        {
          stop: 0,
          value: "#000000"
        },
        {
          stop: 1,
          value: "#000000"
        }
      ],
      gradient_bg_moving: [
        {
          stop: 0,
          value: "#000000"
        },
        {
          stop: 1,
          value: "#000000"
        }
      ],
      tex_floor: "Grid",
      tex_skybox: "",
      tex_bg_front: "Black",
      tex_bg_back: "Black",
      tex_bg_moving: "Black",
      tex_guradian: "",
      tex_sun: "",
    }
  }

}


export default ThemeFactory;
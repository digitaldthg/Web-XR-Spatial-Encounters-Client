const ThemeFactory = {
  Get() {
    return {
      base_floor: [{
        stop: 0,
        value: [250, 100, 50]
      }],
      gradient_sun: [{
        stop: 0,
        value: [250, 100, 50]
      },
      {
        stop: 1,
        value: [0, 100, 50]
      }],
      gradient_skybox: [{
        stop: 0,
        value: [250, 100, 50]
      },
      {
        stop: 1,
        value: [0, 100, 50]
      }],
      gradient_fogFloor: [
        {
          stop: 0,
          value: [0, 100, 100]
        },
        {
          stop: 0.5,
          value: [0, 100, 100]
        },
        {
          stop: 1,
          value: [0, 100, 100]
        }
      ],
      gradient_fogFloorAlpha: [
        {
          stop: 0,
          value: [0, 0, 0]
        },
        {
          stop: 0.5,
          value: [0, 100, 100]
        },
        {
          stop: 0.8,
          value: [0, 0, 0]
        }
      ],
      gradient_bg_front: [
        {
          stop: 0,
          value: [0, 0, 0]
        },
        {
          stop: 1,
          value: [50, 100, 100]
        }
      ],
      gradient_bg_back: [
        {
          stop: 0,
          value: [0, 0, 0]
        },
        {
          stop: 1,
          value: [50, 100, 100]
        }
      ],
      tex_floor: "Grid",
      tex_skybox: "",
      tex_bg_front: "",
      tex_bg_back: "",
      tex_guradian: "",
      tex_sun: "",
    }
  }

}


export default ThemeFactory;
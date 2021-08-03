var Utils = {
  hexToHSL(H) {
    // Convert hex to RGB first
    let r = 0, g = 0, b = 0;
    if (H.length == 4) {
      r = "0x" + H[1] + H[1];
      g = "0x" + H[2] + H[2];
      b = "0x" + H[3] + H[3];
    } else if (H.length == 7) {
      r = "0x" + H[1] + H[2];
      g = "0x" + H[3] + H[4];
      b = "0x" + H[5] + H[6];
    }
    // Then to HSL
    r /= 255;
    g /= 255;
    b /= 255;
    let cmin = Math.min(r, g, b),
      cmax = Math.max(r, g, b),
      delta = cmax - cmin,
      h = 0,
      s = 0,
      l = 0;

    if (delta == 0)
      h = 0;
    else if (cmax == r)
      h = ((g - b) / delta) % 6;
    else if (cmax == g)
      h = (b - r) / delta + 2;
    else
      h = (r - g) / delta + 4;

    h = Math.round(h * 60);

    if (h < 0)
      h += 360;

    l = (cmax + cmin) / 2;
    s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);

    return [h, s, l];
  },

  hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16) / 256,
      g: parseInt(result[2], 16) / 256,
      b: parseInt(result[3], 16) / 256
    } : null;
  },

  LerpHSV(arr1, arr2, t) {
    var h = null;
    var a = { h: arr1[0] / 360, s: arr1[1] / 100, v: arr1[2] / 100 }
    var b = { h: arr2[0] / 360, s: arr2[1] / 100, v: arr2[2] / 100 }

    var d = b.h - a.h;

    if (a.h > b.h) {
      // Swap (a.h, b.h)
      var h3 = b.h;
      b.h = a.h;
      a.h = h3;
      d = -d;
      t = 1 - t;
    }
    if (d > 0.5) // 180deg
    {
      a.h = a.h + 1; // 360deg
      h = (a.h + t * (b.h - a.h)) % 1; // 360deg
    }
    if (d <= 0.5) // 180deg
    {
      h = a.h + t * d
    }
    //console.log("A ", a, " B ", b, " H ", h, " T ", t)
    // Interpolates the rest
    return [
      h * 360,            // H
      (a.s + t * (b.s - a.s)) * 100,    // S
      (a.v + t * (b.v - a.v)) * 100,    // V
    ];
  },


  lerpColor(arr1, arr2, alpha) {
    var finalArr = [];

    if (arr1.length != arr2.length) {
      console.log("lerpColor: themes haben verschiedene color themes ");
      return;
    }
    for (var i = 0; i < arr1.length; i++) {
      var val1 = this.hexToHSL(arr1[i].value);
      var val2 = this.hexToHSL(arr2[i].value);
      var hsv = this.LerpHSV(val1, val2, alpha);

      //console.log("HSV ",hsv)

      finalArr.push({
        stop: this.lerp(arr1[i].stop, arr2[i].stop, alpha),
        value: [
          hsv[0],
          hsv[1],
          hsv[2],
        ]
      })

    }
    //console.log("lerpColor", arr1, arr2, finalArr);
    return finalArr;

  },
  lerp(a, b, t) {
    return (1 - t) * a + t * b;
  }
}
export default Utils
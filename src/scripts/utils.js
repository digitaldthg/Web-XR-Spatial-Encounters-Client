// X, Y, Z of a "D65" light source.
// "D65" is a standard 6500K Daylight light source.
// https://en.wikipedia.org/wiki/Illuminant_D65
const D65 = [95.047, 100, 108.883];

import convert from '@csstools/convert-colors';

var Utils = {
  /**
 * Converts RGB color to CIE 1931 XYZ color space.
 * https://www.image-engineering.de/library/technotes/958-how-to-convert-between-srgb-and-ciexyz
 * @param  {string} hex
 * @return {number[]}
 */
rgbToXyz(hex) {
  const [r, g, b] = this.hexToRgb(hex).map(_ => _ / 255).map(sRGBtoLinearRGB)
  const X =  0.4124 * r + 0.3576 * g + 0.1805 * b
  const Y =  0.2126 * r + 0.7152 * g + 0.0722 * b
  const Z =  0.0193 * r + 0.1192 * g + 0.9505 * b
  // For some reason, X, Y and Z are multiplied by 100.
  return [X, Y, Z].map(_ => _ * 100)
},

/**
* Undoes gamma-correction from an RGB-encoded color.
* https://en.wikipedia.org/wiki/SRGB#Specification_of_the_transformation
* https://stackoverflow.com/questions/596216/formula-to-determine-brightness-of-rgb-color
* @param  {number}
* @return {number}
*/
sRGBtoLinearRGB(color) {
  // Send this function a decimal sRGB gamma encoded color value
  // between 0.0 and 1.0, and it returns a linearized value.
  if (color <= 0.04045) {
      return color / 12.92
  } else {
      return Math.pow((color + 0.055) / 1.055, 2.4)
  }
},

/**
* Converts hex color to RGB.
* https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
* @param  {string} hex
* @return {number[]} [rgb]
*/
hexToRgb(hex) {
  const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (match) {
      match.shift()
      return match.map(_ => parseInt(_, 16))
  }
},

/**
* Converts CIE 1931 XYZ colors to CIE L*a*b*.
* The conversion formula comes from <http://www.easyrgb.com/en/math.php>.
* https://github.com/cangoektas/xyz-to-lab/blob/master/src/index.js
* @param   {number[]} color The CIE 1931 XYZ color to convert which refers to
*                           the D65/2° standard illuminant.
* @returns {number[]}       The color in the CIE L*a*b* color space.
*/

xyzToLab([x, y, z]) {
[x, y, z] = [x, y, z].map((v, i) => {
  v = v / D65[i]
  return v > 0.008856 ? Math.pow(v, 1 / 3) : v * 7.787 + 16 / 116
})
const l = 116 * y - 16
const a = 500 * (x - y)
const b = 200 * (y - z)
return [l, a, b]
},

/**
* Converts Lab color space to Luminance-Chroma-Hue color space.
* http://www.brucelindbloom.com/index.html?Eqn_Lab_to_LCH.html
* @param  {number[]}
* @return {number[]}
*/
labToLch([l, a, b]) {
  const c = Math.sqrt(a * a + b * b)
  const h = this.abToHue(a, b)
  return [l, c, h]
},

/**
* Converts a and b of Lab color space to Hue of LCH color space.
* https://stackoverflow.com/questions/53733379/conversion-of-cielab-to-cielchab-not-yielding-correct-result
* @param  {number} a
* @param  {number} b
* @return {number}
*/
abToHue(a, b) {
  if (a >= 0 && b === 0) {
      return 0
  }
  if (a < 0 && b === 0) {
      return 180
  }
  if (a === 0 && b > 0) {
      return 90
  }
  if (a === 0 && b < 0) {
      return 270
  }
  let xBias
  if (a > 0 && b > 0) {
      xBias = 0
  } else if (a < 0) {
      xBias = 180
  } else if (a > 0 && b < 0) {
      xBias = 360
  }
  return this.radiansToDegrees(Math.atan(b / a)) + xBias;
},
radiansToDegrees(radians) {
  return radians * (180 / Math.PI)
},
degreesToRadians(degrees) {
  return degrees * Math.PI / 180
},
setXYZ(x, y, z) {
  var rgb = {
    r: x *  3.2406 + y * -1.5372 + z * -0.4986,
    g: x * -0.9689 + y *  1.8758 + z *  0.0415,
    b: x *  0.0557 + y * -0.2040 + z *  1.0570
  };

  [ "r", "g", "b" ].forEach(function(key) {
    rgb[key] /= 100;

    if (rgb[key] < 0) {
      rgb[key] = 0;
    }

    if (rgb[key] > 0.0031308) {
      rgb[key] = 1.055 * Math.pow(rgb[key], (1 / 2.4)) - 0.055;
    }
    else {
      rgb[key] *= 12.92;
    }
  });

  return {
    r : rgb.r,
    g : rgb.g,
    b : rgb.b,
  };
},
labToRGB(lab){
    var y = (lab.l + 16) / 116;
    var x = lab.a / 500 + y;
    var z = y - lab.b / 200;
  
    var xyz = { x: x, y: y, z: z };
    var pow;
  
    [ "x", "y", "z" ].forEach(function(key) {
      pow = Math.pow(xyz[key], 3);
  
      if (pow > 0.008856) {
        xyz[key] = pow;
      }
      else {
        xyz[key] = (xyz[key] - 16 / 116) / 7.787;
      }
    });
  
    var color = this.fromXYZ(xyz.x, xyz.y, xyz.z);
  
    return color;

},

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
  lerpHexColor(a, b, amount) { 

    var ah = parseInt(a.replace(/#/g, ''), 16),
        ar = ah >> 16, ag = ah >> 8 & 0xff, ab = ah & 0xff,
        bh = parseInt(b.replace(/#/g, ''), 16),
        br = bh >> 16, bg = bh >> 8 & 0xff, bb = bh & 0xff,
        rr = ar + amount * (br - ar),
        rg = ag + amount * (bg - ag),
        rb = ab + amount * (bb - ab);

    return '#' + ((1 << 24) + (rr << 16) + (rg << 8) + rb | 0).toString(16).slice(1);
  },
  lerpColor(arr1, arr2, alpha) {
    var finalArr = [];

    if (arr1.length != arr2.length) {
      console.log("lerpColor: themes haben verschiedene color themes ");
      return;
    }
    for (var i = 0; i < arr1.length; i++) {

      // var val1 = this.hexToHSL(arr1[i].value);
      // var val2 = this.hexToHSL(arr2[i].value);
      // var hsv = this.LerpHSV(val1, val2, alpha);

      //console.log("HSV ",hsv) 

      var lerpHexValue = this.lerpHexColor(arr1[i].value, arr2[i].value, alpha );

      //console.log(lerpHexValue);
      
      var lerpedHSL = this.hexToHSL(lerpHexValue);
      //console.log(lerpedHSL);

      finalArr.push({
        stop: this.lerp(arr1[i].stop, arr2[i].stop, alpha),
        value: [
          lerpedHSL[0],
          lerpedHSL[1],
          lerpedHSL[2],
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
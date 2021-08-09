const { Group, Vector3, MeshBasicMaterial, DoubleSide, Mesh, Color, Object3D, BoxGeometry, CylinderGeometry, SphereGeometry, Quaternion } = require("three");
import Ring from "../Model/player_cylinder.glb";
import Utils from "../scripts/utils";

class SingleFriend {
  constructor(store, data) {
    this.store = store;
    this.xr = store.state.xr;
    this.rings = [];
    this.bottomColor = new Color(0xffffff);

    this.speed = 1000;

    this.headFactor = 2;
    this.Init(data);
  }

  Init(data) {
    this.instance = this.Create(data);


    console.log("created", this.instance);
  }

  Create(data) {
    var group = new Object3D();
    group.name = "Friend";
    this.xr.Scene.add(group);

    this.head = new Group();
    group.add(this.head);

    var target = new Vector3(data.transform.position.x, data.transform.position.y, data.transform.position.z);
    var origin = new Vector3(0, 0, 0);

    for (var i = 0; i <= 25; i++) {
      let scale = .05 * i;
      const geometry = new CylinderGeometry(scale, scale, .06, 64, 2, true);
      const material = new MeshBasicMaterial({ side: DoubleSide, color: 0xffff00 });
      const ring = new Mesh(geometry, material);
      group.add(ring);
      this.rings.push(ring);
    }

    group.userData.headHeight = data.transform.headHeight * this.headFactor;
    group.userData.targetPosition = new Vector3(
      data.transform.position.x,
      data.transform.position.y,
      data.transform.position.z
    );

    group.userData.lastPosition = new Vector3(
      data.transform.position.x,
      data.transform.position.y,
      data.transform.position.z
    );

    group.userData.lastRotation = new Quaternion(
      data.transform.rotation.x,
      data.transform.rotation.y,
      data.transform.rotation.z,
      data.transform.rotation.w,
    );

    group.userData.targetRotation = new Quaternion(
      data.transform.rotation.x,
      data.transform.rotation.y,
      data.transform.rotation.z,
      data.transform.rotation.w,
    );

    group.userData.lerpAlpha = 0;
    group.userData.color = Object.assign({}, data.color);
    //group.userData.targetReached = true;

    return group;
  }

  updateData = (data, idx) => {
    if (typeof (data) == "undefined") { return; }

    this.instance.userData.headHeight = data.transform.headHeight * this.headFactor;
    this.instance.userData.targetPosition = new Vector3(
      data.transform.position.x,
      data.transform.position.y * this.headFactor,
      data.transform.position.z
    );

    this.instance.userData.lastPosition = this.instance.position.clone();
    this.instance.userData.lastPosition.y = this.head.position.y;

    this.instance.userData.lerpAlpha = 0;
    var hexColor = this.store.state.lastTheme.triangle_colors[idx];
    var rgbColor = Utils.hexToRgb(hexColor);

    this.instance.userData.color = rgbColor;
  }
  
  LerpFloat(start, end, alpha) {
    return start * (1 - alpha) + end * alpha;
  }
  LerpVector(start, end, alpha) {

    return new Vector3(
      this.LerpFloat(start.x, end.x, alpha),
      this.LerpFloat(start.y, end.y, alpha),
      this.LerpFloat(start.z, end.z, alpha),
    )
  }
  update = (clock) => {

    //wenn der Spieler seine Target Position erreicht hat 
    //dann wird sie auf null gesetzt => ziel erreicht
    if (this.instance.userData.targetPosition == null) { return; }

  
    var lerpPos = this.LerpVector(
      this.instance.userData.lastPosition,
      this.instance.userData.targetPosition,
      this.instance.userData.lerpAlpha / 100);

    var newQuat = this.instance.userData.lastRotation.slerp(this.instance.userData.targetRotation, this.instance.userData.lerpAlpha / 100);

    this.instance.position.set(lerpPos.x, 0 , lerpPos.z);
    this.head.position.set(0, lerpPos.y, 0);

    this.head.quaternion.set(newQuat.x, newQuat.y, newQuat.z, newQuat.w);

    let color = new Color(this.instance.userData.color.r, this.instance.userData.color.g, this.instance.userData.color.b);

    var target = new Vector3(lerpPos.x, lerpPos.y, lerpPos.z);
    var origin = new Vector3(0, 0, 0);

    this.rings.map((ring, index) => {
      var lerpAlpha = (1 / (this.rings.length - 1)) * index;
      var lerper = (target.clone()).lerp(origin, lerpAlpha);
      ring.position.set(0, lerper.y, 0);

      //Ringfarbe lerpen
      ring.material.color = this.bottomColor.clone().lerp(color, Math.min(1, Math.max(0, target.y / this.instance.userData.headHeight)));
    });

    this.instance.userData.lerpAlpha += .5;
    
    if (this.instance.userData.lerpAlpha >= 100) {
      this.instance.userData.lerpAlpha = 0;
      this.instance.userData.lastPosition = this.instance.position.clone();
    }
  }

  delete() {
    this.xr.Scene.remove(this.instance);
  }

}


export default SingleFriend;
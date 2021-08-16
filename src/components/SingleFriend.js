const { Group, Vector3, MeshBasicMaterial, DoubleSide, Mesh, Color, Object3D, BoxGeometry, CylinderGeometry, SphereGeometry, Quaternion, MeshNormalMaterial } = require("three");
import Ring from "../Model/player_cylinder.glb";
import Utils from "../scripts/utils";
import { Text } from 'troika-three-text'


class SingleFriend {
  constructor(store, data) {
    this.store = store;
    this.xr = store.state.xr;
    this.rings = [];
    this.bottomColor = new Color(0xffffff);
    this.lazyFollower = null;
    this.speed = 1000;

    this.headFactor = 1;
    this.Init(data);
  }

  Init(data) {

    this.instance = this.Create(data);
    this.lazyFollower = new Mesh(new BoxGeometry(.1, .1, .1), new MeshNormalMaterial());
    this.lazyFollower.scale.set(0, 0, 0);
    this.xr.Scene.add(this.lazyFollower);

  }

  Create(data) {

    var group = new Object3D();
    group.name = "Friend";
    this.xr.Scene.add(group);

    this.head = new Mesh(new BoxGeometry(.1, .1, .1), new MeshNormalMaterial());
    this.head.scale.set(0, 0, 0);
    this.xr.Scene.add(this.head);

    //var target = new Vector3(data.transform.headPosition.x, data.transform.headPosition.y, data.transform.headPosition.z);
    //var origin = new Vector3(0, 0, 0);

    for (var i = 0; i <= 15; i++) {
      let scale = 0.005 * i * i;
      const geometry = new CylinderGeometry(scale, scale, .06, 64, 2, true);
      const material = new MeshBasicMaterial({ side: DoubleSide, color: 0xffff00 });
      const ring = new Mesh(geometry, material);
      this.xr.Scene.add(ring);
      this.rings.push(ring);
    }
    console.log("creat", data.transform, data.transform.headPosition);
    group.userData.headHeight = data.transform.headHeight * this.headFactor;
    group.userData.targetPosition = new Vector3(
      data.transform.headPosition.x,
      data.transform.headPosition.y,
      data.transform.headPosition.z
    );

    group.userData.lastPosition = new Vector3(
      data.transform.headPosition.x,
      data.transform.headPosition.y,
      data.transform.headPosition.z
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

    this.myText = new Text()
    group.add(this.myText)

    // Set properties to configure:
    this.myText.text = data.id;
    this.myText.fontSize = 0.1
    this.myText.position.y = .5;
    this.myText.anchorX = "center";
    this.myText.color = new Color(data.color);


    return group;
  }

  updateData = (data, idx) => {
    if (typeof (data) == "undefined") { return; }


    this.instance.userData.headHeight = data.transform.headHeight * this.headFactor;
    this.instance.userData.targetPosition = new Vector3(
      data.transform.headPosition.x,
      data.transform.headPosition.y * this.headFactor,
      data.transform.headPosition.z
    );

    this.instance.userData.lastPosition = this.instance.position.clone();
    this.instance.userData.lastPosition.y = this.head.position.y;

    this.instance.userData.lerpAlpha = 0;
    if (typeof (this.store.state.lastTheme) == "undefined") { return }

    var hexColor = this.store.state.lastTheme.triangle_colors[idx];
    var rgbColor = Utils.hexToRgb(hexColor);

    this.instance.userData.color = rgbColor;

    this.myText.color = new Color(hexColor);
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

    this.instance.position.lerp(this.instance.userData.targetPosition, .1);
    this.head.position.lerp(this.instance.userData.targetPosition, .1);// = this.instance.userData.targetPosition.clone();

    var lazyPos = this.instance.position.clone();
    lazyPos.y = 0;
    this.lazyFollower.position.lerp(lazyPos, .05);

    let color = new Color(this.instance.userData.color.r, this.instance.userData.color.g, this.instance.userData.color.b);

    var target = this.instance.position.clone();
    var origin = this.lazyFollower.position.clone();

    this.rings.map((ring, index) => {
      var lerpAlpha = (1 / (this.rings.length - 1)) * index;
      var lerper = (target.clone()).lerp(origin, lerpAlpha);
      ring.position.x = lerper.x;
      ring.position.y = lerper.y;
      ring.position.z = lerper.z;

      //Ringfarbe lerpen
      ring.material.color = this.bottomColor.clone().lerp(color, Math.min(1, Math.max(0, this.instance.position.y / this.instance.userData.headHeight)));
    });

    this.myText.lookAt(this.xr.Controls.GetCameraPosition());

    this.myText.sync();
  }

  delete = () => {
    this.xr.Scene.remove(this.instance);
    this.rings.map((ring) => {
      this.xr.Scene.remove(ring);
    });
    this.xr.Scene.remove(this.head);
    this.xr.Scene.remove(this.lazyFollower);

    console.log("friend =>  delete myself");
  }

}


export default SingleFriend;
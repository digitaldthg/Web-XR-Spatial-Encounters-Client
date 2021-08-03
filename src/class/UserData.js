const UserData = {
  id : null,
  idx: 0,
  role : 0,
  room : null,
  transform : {
    headHeight : 1.75,
    position : { 
        x : 0,
        y : 0, 
        z : 0
    },
    rotation : { x : 0,y : 0, z: 0, w : 1},
    scale : { x : 1,y : 1, z: 1},
  },
  color : {
      r : Math.random(),// 1,
      g : Math.random(),// 0,
      b : Math.random(),// 0,
      a : 1,
  },
}
export default UserData;
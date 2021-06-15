const UserData = {
  id : null,
  role : 0,
  transform : {
      position : { 
          x : 0,
          y : 0, 
          z : 0
      },
      rotation : { x : 0,y : 0, z: 0, w : 1},
      scale : { x : 1,y : 1, z: 1},
  },
  color : {
      r : Math.random(),
      g : Math.random(),
      b : Math.random(),
      a : Math.random(),
  },
}
export default UserData;
const UserData = (data = {})=>{

    var userObj = {
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
            a : Math.random()
        },
    };

    Object.keys(data).map((keyName)=>{
        if(userObj.hasOwnProperty(keyName)){
            if(typeof(userObj[keyName]) === 'object' && userObj[keyName] != null && data.hasOwnProperty(keyName)){
                userObj[keyName] = Object.assign(userObj[keyName] , data[keyName]); 
            }else{
                if(data.hasOwnProperty(keyName)){
                    userObj[keyName] = data[keyName];
                }
            }
        } 
    });

    return userObj; 
} 

export default UserData;
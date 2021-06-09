import * as THREE from "three";

import { BoxLineGeometry } from "./BoxLineGeometry.js";
import { VRButton } from "./VRButton.js";

import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {DeviceOrientationControls } from 'three/examples/jsm/controls/DeviceOrientationControls';
import User from "./User.js";

import WebXRController from './WebXRController';

import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';

import {MeshLine,MeshLineMaterial, MeshLineRaycast} from 'three.meshline';
import { Vector3 , Color} from "three";

import webXRScene from '../webXRScene/src';

import playAreaURL from '../Model/playarea.glb';
import UserData from "../Factory/Userdata.js";
import EnvironmentController from "../Factory/EnvironmentController.js";


class Scene{

  constructor(context){
    this.friends = [];
    this.context = context;

    this.controlledByGizmo = null;

    this.socket = context.state.socket;
    this.pendingSockets = [];

    this.AddSocket(this.socket);
    
    this.xr = new webXRScene("sceneHolder");
    this.xr.Controls.ChangeToDefault();

    this.xr.Controls.SetPosition(0,2,5);
    this.xr.Events.addEventListener("OnAnimationLoop",this.Animate);

    this.environmentController = new EnvironmentController(this);

    var ambientLight = new THREE.AmbientLight(0xeeeeee,1);
    this.xr.Scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
    directionalLight.position.set(0,10,-5);
    this.xr.Scene.add( directionalLight );


    /** Load Environment */
    this.xr.Loader.load({
      name : "PlayArea", 
      url : playAreaURL,
      progress: ()=>{
        console.log("load");
      }
    }).then((glbScene)=>{
      console.log(glbScene);

      this.xr.Scene.add(glbScene.scene);
    });


    this.users = {};

    

    this.gizmo = new TransformControls( this.xr.Camera.instance, this.xr.Renderer.instance.domElement );
	//	this.gizmo.addEventListener( 'change', this.render );

		this.gizmo.addEventListener( 'dragging-changed', ( event ) => {

      console.log(this.xr.Controls, !event.value);

      this.controlledByGizmo.SetExternalControls(true);

			this.xr.Controls.SetActive(!event.value);

      this.controlledByGizmo.isControlled = event.value;
		});

    this.xr.Scene.add(this.gizmo);

  }

  AddClient = (id , throughConnection = false) => {
    this.users[id] = new User(this.xr,{id:id}, this.socket, throughConnection);
  }

  AddUserSocket(socket){

    console.log("AddUserSocket"  , socket, this.users,this.users.hasOwnProperty(socket.id));


    if(this.users.hasOwnProperty(socket.id)){
      console.log("Add own socket to user");

      this.users[socket.id] = new User(this.xr,{id:socket.id},socket);
    }else{
      this.pendingSockets.push(socket);
    }
  }
  
  AddSocket = (socket) =>{
    this.socket = socket;

    this.socket.on('connect', () => {
      this.AddClient(this.socket.id, true);
    });

    this.socket.on("server-friends-delete", (data)=>{
      this.xr.Scene.remove(this.users[data.id].mesh);
      delete this.users[data.id];
    });


    this.socket.on("server-friends-update", (data)=>{
      this.friends = data;
      this.context.SetFriends(data);
     
      Object.keys(data).map((d)=>{

        
        var userID = data[d].id;
        
        if(userID == this.socket.id){ return }
        
        //console.log(userID);
        if( !this.users.hasOwnProperty(userID)){
          
          this.users[userID] = new User(this.xr, data[d], this.socket);

        }

        this.users[userID].UpdateUser(data[d]);
        
      });
    });
  }

  SelectPlayer(id){
    
    this.gizmo.detach();
    if(this.controlledByGizmo != null){
      this.controlledByGizmo.SetExternalControls(false);
    }

    this.gizmo.attach(this.users[id].instance);
    this.controlledByGizmo = this.users[id];
  }

  Animate = ()=>{
    
    if(this.gizmo.dragging && this.controlledByGizmo != null ){
      this.controlledByGizmo.EmitUser();
    }

    if(this.pendingSockets.length > 0){
      let socketsToRemoves = [];
      this.pendingSockets.map((socket) => {
        if(this.users.hasOwnProperty(socket.id)){
          this.users[socket.id].socket = socket;
          socketsToRemoves.push(socket);
          console.log("add socket to user");
        }
      });

      if(socketsToRemoves.length > 0){
        socketsToRemoves.map(s => {
          this.pendingSockets = this.pendingSockets.filter(pS => pS.id != s.id);
        });
      }
    }

  }
}

export default Scene;

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


class Scene{

  constructor(socket){

    this.AddClient = this.AddClient.bind(this);

    this.traceLines = {};
    this.controlledByGizmo = null;

    this.socket = socket;
    
    this.xr = new webXRScene("sceneHolder");
    this.xr.Controls.ChangeToDefault();

    this.xr.Controls.SetPosition(0,2,5);


    this.xr.Events.addEventListener("OnAnimationLoop",this.Animate);

    var fov = 80;
    var roomSize = 16;
    var sections = 50;

    this.room = new THREE.LineSegments(
      new BoxLineGeometry(roomSize, roomSize, roomSize, sections,sections,sections),
      new THREE.LineBasicMaterial({ color: 0x808080 })
    );

    this.room.geometry.translate(0, roomSize / 2, 0);

    console.log(this.xr);
    this.xr.Scene.add(this.room);


    this.users = {};


    this.gizmo = new TransformControls( this.xr.Camera.instance, this.xr.Renderer.instance.domElement );
	//	this.gizmo.addEventListener( 'change', this.render );

		this.gizmo.addEventListener( 'dragging-changed', ( event ) => {

			this.xr.Controls.enabled = ! event.value;

      this.controlledByGizmo.isControlled = event.value;
      
      console.log(this.controlledByGizmo.instance.position);

		});

    this.xr.Scene.add(this.gizmo);


    this.socket.on("server-friends-delete", (data)=>{
      console.log(this.users,data);

      console.warn("delete user" , data);
      this.xr.Scene.remove(this.users[data.id].mesh);
      this.xr.Scene.remove(this.traceLines[data.id].mesh);
      delete this.users[data.id];

    });


    this.socket.on("server-friends-update", (data)=>{
     //console.log("server-friends-update",data);
     
      Object.keys(data).map((d)=>{

        
        var userID = data[d].id;
        
        if(userID == this.ownSocketID){return}
        
        //console.log(userID);
        if( !this.users.hasOwnProperty(userID)){
          
          this.users[userID] = new User(this.xr, data[d], false);

        }


        this.users[userID].UpdateUser(data[d]);
        
      });
    });

    this.socket.on("server-trace-update", (lines)=>{
      console.log(lines);

      this.UpdateTraceLines(lines);

    });

  }


  UpdateTraceLines(d){

    //if(d.id === this.ownSocketID){return;}
    console.log(d);

    Object.keys(d).map(l => {
      if(!this.traceLines.hasOwnProperty(l)){
        this.traceLines[l] = {};
        this.traceLines[l].line = new MeshLine();
        this.traceLines[l].material = new MeshLineMaterial({
          color : new Color(d[l].color.r,d[l].color.g,d[l].color.b ),
          lineWidth : .1
        });

        this.traceLines[l].mesh = new THREE.Mesh(this.traceLines[l].line, this.traceLines[l].material);
        this.xr.Scene.add(this.traceLines[l].mesh);
      }

      var points = d[l].linePoints.map(p => new Vector3(p.position.x,p.position.y,p.position.z));

      var geometry = new THREE.Geometry().setFromPoints(points);
      this.traceLines[l].line.setGeometry(geometry);
  
      //this.traceLines[l].line.setPoints(points);

      console.log(points);
    });
  }

  AddClient(id){
    this.ownSocketID = id;

    this.users[id] = new User(this.xr,{id:id}, true, this.gizmo);

    this.controlledByGizmo = this.users[id];

  }

  Animate = ()=>{
    
    if(this.gizmo.dragging){
      this.socket.emit("client-player",{
        id : this.controlledByGizmo.id,
        transform : {
          position : this.controlledByGizmo.instance.position
        }
      });
    }

  }
}

export default Scene;

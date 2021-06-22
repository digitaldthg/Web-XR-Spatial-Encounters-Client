import {Handy} from './Handy';

import { XRHandModelFactory } from './XRHandModelFactory.js';

import {Color} from 'three';


class VRHands {

  constructor(context){
    this.visible = true;
    this.context = context;
    this.context.Events.registerEvent("HandPoseChanged");
    
    const	handModelFactory = new XRHandModelFactory();
    // const cycleHandModel = function( event ){

    //     const hand = event.hand
    //     console.log(

    //       'Cycling the hand model for the',
    //       hand.handedness.toUpperCase(),
    //       'hand.'
    //     )
    //     hand.models.forEach( function( model ){

    //       model.visible = false
    //     })
    //     hand.modelIndex = ( hand.modelIndex + 1 ) % hand.models.length
    //     hand.models[ hand.modelIndex ].visible = true
    //   }

    var colors = {

        default: new Color( 0xFFFFFF ),//  White glove.
        left:    new Color( 0x00FF00 ),//  Green glove for left.
        right:   new Color( 0xFF0000 ) //  Red glove for right.
      }


      const [ hand0, hand1 ] = [ {}, {} ].map( ( hand, i ) => {


        //  THREE.Renderer now wraps all of this complexity
        //  so you donâ€™t have to worry about it!
        //  getHand() returns an empty THREE.Group instance
        //  that you can immediately add to your scene.

        hand = this.context.Renderer.instance.xr.getHand( i );

        console.log(this.context.Controls);
        this.context.Scene.add( hand );


        //  So far we have an abstract model of a hand
        //  but we donâ€™t have a VISUAL model of a hand!
        //  Letâ€™s load four different visual models:
        //
        //      1 - A cube for each joint.
        //      2 - A sphere for each joint.
        //      3 - High poly hand model.
        //
        //  Our intent is to display one at a time,
        //  allowing the user to cycle through them
        //  by making a fist.

        hand.models = [

          handModelFactory.createHandModel( hand, 'boxes' ),
          handModelFactory.createHandModel( hand, 'spheres' ),
          handModelFactory.createHandModel( hand, 'mesh' )
        ]
        hand.modelIndex = 2
        hand.isDefaultColor = true

        //  This is what makes detecting hand poses easy!

        Handy.makeHandy( hand );




        //  When hand tracking data becomes available
        //  weâ€™ll receive this connection event.

        hand.addEventListener( 'connected', function( event ){

          //console.log( 'Hand tracking has begun!', event )

          //  As long as the handedness never changes (ha!)
          //  this should do us right.

          hand.handedness = event.data.handedness


          //  When the hand joint data comes online
          //  it will make ALL of the above models visible.
          //  Let's hide them all except for the active one.
          hand.models.forEach( function( model ){

            hand.add( model )
            model.visible = false
          })	
          hand.models[ hand.modelIndex ].visible = true
        })


        //  Speaking of events, hereâ€™s how easy it is
        //  to listen to our custom hand poses.
        //  Make a fist to change hand visual style.

        //hand.addEventListener( 'fist pose began', cycleHandModel )


        //  Letâ€™s trigger a glove color change
        //  when we make a â€œpeaceâ€ pose.
        //  Funny thing about peace -- most folks 
        //  hold this pose like an ASL 2.
        //  But its etymology coincides with ASL V.
        //  So weâ€™ve labeled BOTH 2 and V as â€œpeaceâ€.
        //  One way to account for that is to use
        //  the â€œpose changedâ€ event
        //  and check poseIs and poseWas to confirm
        //  weâ€™ve only just switched to a â€œpeaceâ€ pose.

        //  This is also a useful event listener for debugging.
        //  The event.message property will display the â€œnamesâ€ Array
        //  for both the currently detected pose and the prior one.

        hand.addEventListener( 'pose changed', ( event ) => {

          this.context.Events.dispatchEvent("HandPoseChanged" , event);

        });


        //  Weâ€™re going to make our display frames vsible

        hand.displayFrame.visible = this.visible;


        return hand
      })
  }
}

  export {VRHands};
/*
 #title floorfinder
 #description This is a test of world info (floor finding)
 
Setup a scene with say something like a localanchor with a child sphere. And separately any object, such as a cube, and decorate the cube with this script, and have this script property sheet focus be the name of the localanchor. At runtime, you should see green translucent floor polygons and a reticule on the floor showing the focal intersection with the floor meshes. If you tap the cube it should instruct the local anchor to refresh itself, and the localanchor (and any children of it) should appear and drop to the floor underneath you.

What this does:

1) Tells the system to start worldInfo
   This will both paint the floor visually and also start a floor finding algorithm.
   The floor doesn't actually need to be painted, but I like to see it painted for now

2) Waits for any click or any event.

3) Composes a message to a localanchor object to ask it to renew its webxr anchor.
   The message should be {node:node,object:object,style:"floor"|"ray",x:x,y:y}

4) Now the existing localanchor should move to the new location as specified by the webxr anchor on any click.

There are two styles of local anchors being created here, a local anchor shot by a ray
and a floor anchor. Each is computed slightly differently. A ray anchor is shot from
the screen x,y coordinates (or 0,0 being the center by default) and it can fail because
it just relies on the ARKit ray shooting, which in turn depends on something being there.
The floor finder is a bit more robust. Right now it actually just finds the floor under
the player, but the intent is to also allow ray shooting.

*/
({
  properties: {
    focus: {
      type:'string',
      title: 'name of localanchor to act upon',
      value: ""
    },
    style: {
      type:'string',
      title: 'style of local anchor to build',
      value: "floor"
    },
/*
   focus: {
      type:'enum',
      title: 'object to look at',
      value:null,
      hints: {
        type:'node',
      }
    }
*/
  },
  start: function(e) {
      console.log("Start****************************")
      this.sgp.startWorldInfo()
  },
  click: function(e) {
      // when this target is clicked: find the anchor, show it, freshen anchor
      console.log("Click test****************************")
      const obj = this.getObjectByTitle(this.properties.focus)
      const node = this.getThreeObjectByTitle(this.properties.focus)
      //const obj = this.getObjectById(this.properties.focus)
      //const node = this.getThreeObjectById(this.properties.focus)
      node.visible = true // force localanchor to be visible
      this.sgp.startLocalAnchor({event:e,object:obj,node:node,style:this.properties.style})
  },
  tick: function(e) {
      // animate this thing as well for feedback - remove later
     e.target.rotation.x += Math.PI * 0.01
  },
})

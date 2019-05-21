/*
#title Proximity
#description sends messages on proximity events
*/
({
    properties: {
        focus: {
            type:'string',
            value: null,
        },
        near: {
            type:'number',
            value: 3,
        },
        far: {
            type:'number',
            value: 5,
        },
        message: {
            type:'string',
            value: "trigger",
        },      
    },
    tick: function(event) {
      
        let THREE = this.globals.THREE
        let camera = this.camera
        let target = event.target
        let near = this.properties.near || 1
        let far = this.properties.far || (near+1)
        let focus = this.properties.focus || 0
        let message = this.properties.message || "trigger"

        // far must be EQUAL TO OR farther than near; and to avoid firing a zillion events best to have (far-near)>(some small number)
        if(far<near)far=near+1
        
        // Is there another object to focus on aside from the camera?
        if(focus && focus.length) {
          focus = this.getThreeObjectByTitle(focus)
        } else {
          focus = 0
        }

        // always use the camera if target not found
        if(!focus) {
          focus = camera
        }
      
        // TODO: unsure if these are automatically updated when camera matrix is directly updated
        let focusPosition = new THREE.Vector3()
        let focusQuaternion = new THREE.Quaternion()
        focus.matrixWorld.decompose (focusPosition,focusQuaternion,new THREE.Vector3())

        // distance between parties?
        let distance = target.getWorldPosition(new THREE.Vector3()).distanceTo(focusPosition)
        
        // state latched?
        if(this.isNear) {
          // note - far may be EQUAL TO or farther than near, so test for any infinitesmal value greater than far
          if(distance > far) {
            // clear near state
            this.isNear = 0
            this.logger.log("further than far radius - send an exciting message now")
            this.fireEvent("faraway",{})
          }
        } else {
          // testing on the boundary condition of being EQUAL TO or closer
          if(distance <= near) {
            this.isNear = 1
            this.logger.log("nearer than near radius - send an exciting message now")
            this.fireEvent(message,{})
          }
        }      
    },
})

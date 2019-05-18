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
    },
    tick: function(event) {
      
        let THREE = this.globals.THREE
        let camera = this.camera
        let target = event.target
        let near = this.properties.near || 1
        let far = this.properties.far || (near+1)
        let focus = this.properties.focus || 0

        // far must be EQUAL TO OR farther than near; and to avoid firing a zillion events best to have (far-near)>(some small number)
        if(far<near)far=near+1
        
        // Is there another object to focus on aside from the camera?
        if(focus && focus.length) {
          focus = this.getThreeObjectByTitle(focus)
        } else {
          focus = 0
        }

        if(!focus) {
          focus = camera
        }

        // TODO: unsure if these are automatically updated when camera matrix is directly updated
        let focusPosition = new THREE.Vector3()
        let focusQuaternion = new THREE.Quaternion()
        focus.matrixWorld.decompose (focusPosition,focusQuaternion,new THREE.Vector3())

        let distance = target.getWorldPosition(new THREE.Vector3()).distanceTo(focusPosition)
        
        // I need a lookaside list of who the target is already near
        if(!focus.uuid) {
          this.logger.error("no uuid")
          return
        }

        if(!target.proximityCandidates) {
          target.proximityCandidates = []
        }
        
        // state latched?
        let isNear = target.proximityCandidates[focus.uuid] || 0
        if(isNear) {
          // note - far may be EQUAL TO or farther than near, so test for any infinitesmal value greater than far
          if(distance > far) {
            // clear near state
            target.proximityCandidates[focus.uuid] = 0
            this.logger.log("further than far radius - send an exciting message now")
            this.fireEvent("faraway",{})
          }
        } else {
          // testing on the boundary condition of being EQUAL TO or closer
          if(distance <= near) {
            target.proximityCandidates[focus.uuid] = 1
            this.logger.log("nearer than near radius - send an exciting message now")
            this.fireEvent("trigger",{})
          }
        }      
    },
})

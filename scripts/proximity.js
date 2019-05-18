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
        }
    },
    tick: function(e) {

        const THREE = event.system.globals().THREE

        let camera = event.system.getCamera()
        let target = event.target

        let near = event.props.near || 1
        let far = event.props.far || (near+1)
        let focus = event.props.focus || 0

        // far must be EQUAL TO OR farther than near
        if(far<near)far=near
        
        // Is there another object to focus on aside from the camera?
        if(focus && focus.length) {
          focus = event.system.getObject(focus)
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
          console.error("no uuid")
          return
        }

        if(!target.proximityCandidates) {
          target.proximityCandidates = []
        }
        
        let isNear = target.proximityCandidates[focus.uuid] || 0

        if(isNear) {
          // note - far may be EQUAL TO or farther than near, so test for any infinitesmal value greater than far
          if(distance > far) {
            // send an exciting message
            target.proximityCandidates[focus.uuid] = 0
            console.log("left far radius - send an exciting message now")
          }
        } else {
          // testing on the boundary condition of being EQUAL TO or closer
          if(distance <= near) {
            target.proximityCandidates[focus.uuid] = 1
            console.log("entered near radius - send an exciting message now")
          }
        }
      
    },
})

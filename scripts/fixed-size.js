/*
#title Fixed Size
#description Stay at a constant size regardless of distance or camera fov
*/
({
    properties: {
        near: {
            type:'number',
            value: 0,
            help: "Minimum distance to the camera to use for scaling"
        },
        far: {
            type:'number',
            value: 100,
            help:"Maximum distance from the camera to use for scaling"
        },
        size: {
            type:'number',
            value: 0.1,
            help:"Scaling factor to apply as a function of the distance"
        }
    },
    tick: function(event) {
        let THREE = this.globals.THREE
        
        let camera = this.camera
        let target = event.target

        let props = this.properties
        let near = props.near || 0
        let far = props.far || 0
        let size = pros.size || 0.1

        if(!focus) {
          focus = camera
        }
      
        // TODO: unsure if these are automatically updated when camera matrix is directly updated
        let focusPosition = new THREE.Vector3()
        let focusQuaternion = new THREE.Quaternion()
        focus.matrixWorld.decompose (focusPosition,focusQuaternion,new THREE.Vector3())

        // if no distance is supplied then use the current distance
        if(!distance) {
            distance = target.getWorldPosition(new THREE.Vector3()).distanceTo(focusPosition)
        }
      
        // optional limits
        if(near) {
          if(distance < near) distance = near
        }
        if(far) {
          if(distance > far) distance = far
        }

        // if a size is supplied then adjust the size to remain constant
        // note this option fights with infrontof somewhat and probably should not be used at the same time
        // also fov would need to be added as a property above since this code now has a generic focus
        if(size) {
            // for a 45' aperture camera the apparent size of an object is linear with distance
            let scale = distance * size
            // let scale = distance * size * Math.tan(THREE.Math.degToRad(camera.fov) / 2) * 2;
            target.scale.set(scale,scale,scale)
        }

        // look at the focus if desired
        if(lookat) {
            target.lookAt(focusPosition)
            target.matrixWorldNeedsUpdate = true
        }

        // be in front of the focus if desired
        if(infrontof) {
            target.position.set(0,0,distance)
            target.position.applyQuaternion( focusQuaternion )
            target.matrixWorldNeedsUpdate = true
        }

    },
})
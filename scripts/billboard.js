/*
#title Billboard
#description face you and stay at a constant size regardless of distance or camera fov
*/
({
    properties: {
        near: {
            type:'number',
            value: 0,
            help: "How close can this object get to the target in question (be it the camera or some other focus object)?"
        },
        far: {
            type:'number',
            value: 100,
            help:"How far can this object get from the target in question (see 'focus' below)?"
        },
        size: {
            type:'number',
            value: 0.1,
            help:"What kind of scaling factor would you like to apply as a function of the distance from the focus object?"
        },
        distance: {
            type:'number',
            value: 10,
            help:"How far should this object be from the focus?"
        },
        lookat: {
            type:'number',
            value: 1,
            help:"Should this object look at the focus?"
        },
        infrontof: {
            type:'number',
            value: 1,
            help:"Should this object be in front of the focus?"
        },
        focus: {
          type:'string',
          value:null,
          help:"Is there a named object you would like to use as a focus or should this object focus on the camera?"
        }
    },
    tick: function(event) {

        let THREE = this.globals.THREE
        
        let camera = this.camera
        let target = event.target

        let near = this.properties.near || 0
        let far = this.properties.far || 0
        let size = this.properties.size || 0.1
        let distance = this.properties.distance || 0
        let lookat = this.properties.lookat || 0
        let infrontof = this.properties.infrontof || 0
        let focus = this.properties.focus || 0

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
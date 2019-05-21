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
    start: function (event) {
        let THREE = this.globals.THREE

        this.cameraPos = new THREE.Vector3()
        this.thisPos = new THREE.Vector3()
    },

    tick: function(event) {
        let THREE = this.globals.THREE
        
        let camera = this.camera
        let target = event.target

        let props = this.properties
        let near = props.near || 0
        let far = props.far || 0
        let size = props.size || 1

        camera.getWorldPosition(this.cameraPos);
        target.getWorldPosition(this.thisPos);
        var distance = this.thisPos.distanceTo(this.cameraPos);
      
        // optional limits
        if(near) {
          if(distance < near) distance = near
        } else {
          if (distance < camera.near) distance = camera.near 
        }
      
        if(far) {
          if(distance > far) distance = far
        }

        // for a 45' aperture camera the apparent size of an object is linear with distance
        let scale = distance * size
        // let scale = distance * size * Math.tan(THREE.Math.degToRad(camera.fov) / 2) * 2;
        target.scale.set(scale,scale,scale)
    },
})
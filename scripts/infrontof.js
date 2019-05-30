/*
#title infrontof
#description be front of camera at a certain distance for a while at a speed
*/
({
    properties: {
        distance: {
            type:'number',
            value: 1,
        },
        delay: {
            type:'number',
            value: 2000,
        },    
        // duration: {
        //     type:'number',
        //     value: 0,
        // },    
    },
    start: function (event) {

        let THREE = this.globals.THREE
        this.distance = this.properties.distance
        this.delay = this.properties.delay
//         this.duration = this.properties.duration
        this.idealPos = new THREE.Vector3()
        this.scratch = new THREE.Matrix4()
//         this.latchDone = false
//         if(!this.properties.distance) {
//             let target = event.target
//             let camera = this.camera
//             let targetPos = new THREE.Vector3()
            this.cameraPos = new THREE.Vector3()
//             target.getWorldDirection(targetPos)
//             camera.getWorldDirection(cameraPos)
//             this.distance = targetPos.distanceTo(cameraPos)
//         }
    },
    enter: function(event) {
        this.startTime = -this.delay - 1   // ensure it runs first tick
    },
    tick: function(event) {
        if (this.startTime + this.delay <= event.time)
            this.startTime = event.time

            // distance
            this.camera.getWorldDirection(this.cameraPos)
            this.logger.log("in front of: direction ", this.cameraPos)
            this.cameraPos.normalize()
            this.cameraPos.multiplyScalar(distance)
            this.logger.log("in front of: val ", this.cameraPos)
            this.logger.log("in front of: event position ", event.target.position)
            event.target.position.copy(this.cameraPos)
      this.logger.log("in front of: event position ", event.target.position)
//     	let speed = this.speed
//     	let idealPos = this.idealPos
//     	let target = event.target
//     	let camera = this.camera

//         // ideal
//       	idealPos.set(0,0,-dist)
//         idealPos.applyQuaternion(camera.quaternion)
        //idealPos.add(camera.position)

        // if(speed) {
        //     target.position.set(
        //         target.position.x + (idealPos.x-target.position.x)/2 * speed,
        //         target.position.y + (idealPos.y-target.position.y)/2 * speed,
        //         target.position.z + (idealPos.z-target.position.z)/2 * speed
        //         )
        // } else {
        //     target.position.set(idealPos.x,idealPos.y,idealPos.z)
        // }

    }
  })

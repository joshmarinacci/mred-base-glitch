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
        alpha: {
            type: 'number',
            value: 0.1
        }
        // duration: {
        //     type:'number',
        //     value: 0,
        // },    
    },
    start: function (event) {

        let THREE = this.globals.THREE
        
        this.distance = this.properties.distance
        this.delay = this.properties.delay
        this.alpha = this.properties.alpha
        this.idealPos = new THREE.Vector3()
        this.cameraPos = new THREE.Vector3()
    },
    enter: function(event) {
        this.startTime = 0
        this.logger.log        
        this.camera.getWorldDirection(this.cameraPos)
        this.cameraPos.normalize()
        this.cameraPos.multiplyScalar(this.distance)
        event.target.position.copy(this.cameraPos)
        this.idealPos.copy(this.cameraPos)      
    },
    tick: function(event) {
        //this.logger.log("times: ", this.startTime + this.delay, event.time)
        if (this.delay > 0 && this.startTime + this.delay <= event.time) {
            this.startTime = event.time

            let scene = this.getCurrentScene()
            // distance
            this.camera.getWorldDirection(this.cameraPos)
            this.cameraPos.normalize()
            this.cameraPos.multiplyScalar(this.distance)
            this.idealPos.copy(this.cameraPos)
            //this.logger.log("new target: ", this.idealPos)
        }
        event.target.position.lerp(this.idealPos, this.alpha)
       // this.logger.log("     lerp to : ", event.target.position)

    }
  })

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
        this.cameraDir = new THREE.Vector3()
        this.scratchMat = new THREE.Matrix4()
    },
    enter: function(event) {
        this.startTime = 0

        this.camera.getWorldDirection(this.cameraDir)
        this.camera.getWorldPosition(this.cameraPos)
        this.cameraDir.multiplyScalar(this.distance)
        this.cameraPos.add(this.cameraDir)

        let sceneId = this.getCurrentScene().id
        this.sceneNode = this.getThreeObjectById(sceneId)

        this.sceneNode.updateMatrixWorld()
        this.scratchMat.getInverse( this.sceneNode.matrixWorld );

        this.cameraPos.applyMatrix4(this.scratchMat)

        event.target.position.copy(this.cameraPos)
        this.idealPos.copy(this.cameraPos)      
    },
    tick: function(event) {
        //this.logger.log("times: ", this.startTime + this.delay, event.time)
        if (this.delay > 0 && this.startTime + this.delay <= event.time) {
            this.startTime = event.time

            this.sceneNode.updateMatrixWorld()
            this.scratchMat.getInverse( this.sceneNode.matrixWorld );
          
            // distance
            this.camera.getWorldDirection(this.cameraDir)
            this.camera.getWorldPosition(this.cameraPos)
            this.cameraDir.multiplyScalar(this.distance)
            this.cameraPos.add(this.cameraDir)
            this.cameraPos.applyMatrix4(this.scratchMat)

            this.idealPos.copy(this.cameraPos)
            //this.logger.log("new target: ", this.idealPos)
        }
        event.target.position.lerp(this.idealPos, this.alpha)
       // this.logger.log("     lerp to : ", event.target.position)

    }
  })

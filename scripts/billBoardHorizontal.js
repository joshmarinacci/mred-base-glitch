/*
#title Billboard Horizontal
#description Cause an object to face you, but keep Y vertical 
*/
({
    properties: {
    },
    start: function (event) {
        let THREE = this.globals.THREE

        this.cameraPos = new THREE.Vector3()
        this.x = new THREE.Vector3()
        this.y = new THREE.Vector3()
        this.z = new THREE.Vector3()
    },
    tick: function(event) {
        let THREE = this.globals.THREE
        
        let camera = this.camera
        let target = event.target

        camera.getWorldPosition(this.cameraPos);
        target.lookAt(this.cameraPos);
        
        target.matrix.extractBasis(this.x,this.y,this.z)
        this.y.x = 0
        this.y.y = 1
        this.y.z = 0
        this.x.crossVectors(this.y,this.z)
        this.x.normalize()
        this.z.crossVectors(this.x,this.y)
        target.matrix.makeBasis(this.x,this.y, this.z)
        
        target.matrixWorldNeedsUpdate = true
    },
})
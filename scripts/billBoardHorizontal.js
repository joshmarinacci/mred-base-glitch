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
        
        this.cameraPos.extractBasis(this.x,this.y,this.z)
        this.y.x = 0
        this.y.y = 1
        this.y.z = 0
        this.x.crossVectors(y,z)
        this.z.crossVectors(x,y)
        this.
        
        target.matrixWorldNeedsUpdate = true
    },
})
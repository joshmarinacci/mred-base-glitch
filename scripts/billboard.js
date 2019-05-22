/*
#title Billboard
#description Cause an object to face you 
*/
({
    properties: {
    },
    start: function (event) {
        let THREE = this.globals.THREE

        this.cameraPos = new THREE.Vector3()
    },
    tick: function(event) {
        let THREE = this.globals.THREE
        
        let camera = this.camera
        let target = event.target

        camera.getWorldPosition(this.cameraPos);
        target.lookAt(this.cameraPos);
        target.matrixWorldNeedsUpdate = true
    },
})
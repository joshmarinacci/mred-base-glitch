/*
#title Billboard Horizontal
#description Cause an object to face you, but keep Y vertical 
*/
({
    properties: {},
    start: function (event) {
        let THREE = this.globals.THREE
        this.targetPos = new THREE.Vector3()
        this.cameraPos = new THREE.Vector3()
    },
    tick: function(event) {
        event.target.getWorldPosition(this.targetPos)
        this.camera.getWorldPosition(this.cameraPos)
        this.cameraPos.y = this.targetPos.y
        //event.target.rotation.set(0,0,0)
        event.target.lookAt(this.cameraPos)
    },
})

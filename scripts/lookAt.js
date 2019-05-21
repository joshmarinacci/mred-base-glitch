/*
#title lookAt
#description cause an object to face another object 
*/
({
    properties: {
        target: {
            type:'enum',
                title: 'object to look at',
                value:null,
                hints: {
                  type:'node',
                }
        }
    },
    start: function (event) {
        let THREE = this.globals.THREE

        this.cameraPos = new THREE.Vector3()
    },
    tick: function(event) {
        let THREE = this.globals.THREE

        const node = this.getObjectById(this.properties.sound)
        
        let camera = this.camera
        let target = event.target

        camera.getWorldPosition(this.cameraPos);
        target.lookAt(this.cameraPos);
        target.matrixWorldNeedsUpdate = true
    },
})
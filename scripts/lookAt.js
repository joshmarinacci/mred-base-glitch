/*
#title lookAt
#description cause an object to face another object 
*/
({
    properties: {
        focus: {
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

        this.nodePos = new THREE.Vector3()
    },
    tick: function(event) {
        let THREE = this.globals.THREE

        const node = this.getThreeObjectById(this.properties.focus)
        let target = event.target

        node.getWorldPosition(this.targetPos);
        target.lookAt(this.targetPos);
        target.matrixWorldNeedsUpdate = true
    },
})
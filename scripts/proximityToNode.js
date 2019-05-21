/*
#title Proximity to Node
#description sends messages when user close to some other node
*/
({
    properties: {
        focus: {
            type:'string',
                title: 'name of object to compare location to',
                value: ""
        },
        near: {
            type:'number',
            value: 3,
        },
        far: {
            type:'number',
            value: 5,
        },
        enterMessage: {
            type:'string',
            value: "trigger",
        },      
        exitMessage: {
            type:'string',
            value: "faraway",
        } 
    },
    start: function (event) {
        let THREE = this.globals.THREE

        this.isNear = false
        this.thisPos = new THREE.Vector3()
        this.cameraPos = new THREE.Vector3()
    },
    tick: function(event) {
        let THREE = this.globals.THREE
        let camera = this.camera
        let target = event.target
        let near = this.properties.near || 1
        let far = this.properties.far || (near+1)
        let focus = this.properties.focus || null
        let message = this.properties.enteryessage || "trigger"
        let faraway = this.properties.exitMessage || "faraway"

        // far must be EQUAL TO OR farther than near; and to avoid firing a zillion events best to have (far-near)>(some small number)
        if(far<near)far=near+1
        
        // Is there another object to focus on aside from the camera?
        if(focus) {
        focus = this.getThreeObjectByTitle(focus)

        // always use the camera if target not found
        if(!focus) {
          focus = camera
        }
      
        camera.getWorldPosition(this.cameraPos);
        target.getWorldPosition(this.thisPos);
        var distance = this.thisPos.distanceTo(this.cameraPos);
              
        // state latched?
        if(this.isNear) {
          // note - far may be EQUAL TO or farther than near, so test for any infinitesmal value greater than far
          if(distance > far) {
            // clear near state
            this.isNear = false
            this.logger.log("further than far radius - send an exit message now")
            this.fireEvent(faraway,{})
          }
        } else {
          // testing on the boundary condition of being EQUAL TO or closer
          if(distance <= near) {
            this.isNear = true
            this.logger.log("nearer than near radius - send an enter message now")
            this.fireEvent(message,{})
          }
        }      
    },
})

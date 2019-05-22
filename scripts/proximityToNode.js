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
      
        if (!this.getThreeObjectByTitle(focus)) {
           this.logger.warn("proximityToNode: focus object ''" + focus + "' doesn't exist")      
        }
    },
    tick: function(event) {
        let props = this.properties
        let THREE = this.globals.THREE

        let camera = this.camera
        let near = props.near || 1
        let far = props.far || (near+1)
        let focus = props.focus
        let message = props.enteryessage || "trigger"
        let faraway = props.exitMessage || "faraway"

        // far must be EQUAL TO OR farther than near; and to avoid firing a zillion events best to have (far-near)>(some small number)
        if(far<near)far=near+0.1
        
        focus = this.getThreeObjectByTitle(focus)

        if (!focus) {
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
        } 
    },
})

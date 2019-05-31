/*
#title Proximity To Image
#description sends messages on proximity events to an active image
*/
({
    properties: {
        near: {
            type:'number',
            value: 3,
        },
        far: {
            type:'number',
            value: 5,
        }
    },
    start: function (event) {
        let THREE = this.globals.THREE

        this.isNear = false
        this.thisPos = new THREE.Vector3()
        this.cameraPos = new THREE.Vector3()
        this.active = false
    },
    enter: function(event) {
        this.logger.log("** prox start scene: ", this.isNear)
    },
  
    recognized: function (event) {
        this.active = true;
    },
    tick: function(event) {      
        if (!this.active) return
      
        let THREE = this.globals.THREE
        let camera = this.camera
        let target = event.target
        let near = this.properties.near || 1
        let far = this.properties.far || (near+1)

        // far must be EQUAL TO OR farther than near; and to avoid firing a zillion events best to have (far-near)>(some small number)
        if(far<near)far=near+0.1
        
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
            this.fireEvent("proximity",{in: true})
          }
        } else {
          // testing on the boundary condition of being EQUAL TO or closer
          if(distance <= near) {
            this.isNear = true
            this.logger.log("nearer than near radius - send an enter message now")
            this.fireEvent("proximity",{in: false})
          }
        }      
    },
})
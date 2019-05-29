/*
#title showAfterDelay
#description after a certain delay, make the node is visible
*/
({
    properties: {
        delay: {
            type:'number',
            value: 1,
        }
    },

    enter: function (e) {
      this.startTime = e.time
      e.target.visible = false    
    },
  
    tick: function(e) {
      var props = this.properties  
      
      if ((e.time - this.startTime) > props.delay) {
         e.target.visible = true 
      }
    }
})

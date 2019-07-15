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
      this.shown = false
    },
  
    tick: function(e) {
      var props = this.properties  
      
      if (!this.shown && (e.time - this.startTime) > props.delay) {
         this.shown = true
         e.target.visible = true 
      }
    }
})

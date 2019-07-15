/*
#title showAfterDelayAfterClick
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
      var props = this.properties  

      props.waiting = true
      e.target.visible = false    
    },
  
    click: function (e) {
      var props = this.properties
      props.waiting = false
      props.startTime = e.time
    },
  
    tick: function(e) {
      var props = this.properties  
      
      if (!props.waiting && ((e.time - this.startTime) > props.delay)) {
         props.wating = true
         e.target.visible = true 
      }
    }
})

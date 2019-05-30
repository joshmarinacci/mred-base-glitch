/*
#title showOnTrigger
#description after a trigger, make the node is visible
*/
({
    properties: {
    },

    enter: function (e) {
      e.target.visible = false    
    },
  
    trigger: function(e) {
       e.target.visible = true
    }
})

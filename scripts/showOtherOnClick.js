/*
#title showOtherOnClick
#description after click, make another node visible
*/
({
    properties: {
        focus: {
            type:'enum',
                title: 'object to show',
                value:null,
                hints: {
                  type:'node',
                }
        }
    },

    enter: function (e) {
      var props = this.properties  

      props.otherTarget = this.getThreeObjectById(props.focus)
    
      props.otherTarget.visible = false    
    },
  
    click: function (e) {
      var props = this.properties
      props.otherTarget.visible = true
    }
})

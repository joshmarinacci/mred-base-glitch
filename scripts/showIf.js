/*
#title showIf
#description if the provide test evauates to true, the node is visible
*/
({
    properties: {
        conditional: {
            type:'string',
            title: "test to decide if the node is shown",
            value: "",
            hints: {
                multiline:true,
            }
        }
    },

    start: function (e) {      
      let props = this.properties
      
      let code = "function(e) { if (" + props.conditional + ") { e.target.parent.visible = true } else { e.target.parent.visible = false } }"
      this.tickFunction = Function('"use strict";return (' + code + ')')()
      
    },
  
    tick: function(e) {
      this.tickFunction.call(this, e)      
    }
})

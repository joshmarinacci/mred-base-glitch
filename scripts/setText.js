/*
#title setText
#description the provided code should return a text string, which will be set to the text object
*/
({
    properties: {
        code: {
            type:'string',
            title: "the text to display",
            value: "",
            hints: {
                multiline:true,
            }
        }
    },

    start: function (e) {      
      let props = this.properties
      
      let code = "function(e) { return (" + props.code + ") }"
      this.tickFunction = Function('"use strict";return (' + code + ')')()
      
    },
  
    tick: function(e) {
      let text = this.tickFunction.call(this, e)      
      if (e.target.setText) {
        e.target.setText(text)
      }
    }
})

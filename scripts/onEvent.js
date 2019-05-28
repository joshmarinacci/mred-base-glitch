/*
#title onEvent
#description Runs the provided code in the specified event handler
*/
({
    properties: {
        event: {
            type:'string',
            title: "event name:",
            value: ""
        },
        code: {
            type:'string',
            title: "when event is fired:",
            value: "",
            hints: {
                multiline:true,
            }
        }
    },

    start: function (e) {      
      let props = this.properties
      
      let code = "function(e) { ((e) => {" + props.code + "}).call(this, e)}"
      let theFunction = Function('"use strict";return (' + code + ')')()
      
      if (code.hasOwnProperty(props.event)) {
        this.logger.error("onEvent script tried to overwrite event handler for " + props.event)
      } else {
        this.code[props.event] = theFunction
      }
    }
})

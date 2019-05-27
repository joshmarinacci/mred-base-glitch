/*
#title onEvents
#description Runs the provided code in the common event handlers
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
      this.theFunction = Function('"use strict";return (' + code + ')')()
      
      if (code.hasOwnProperty(props.event)) {
        this.logger.error("onEvent script tried to overwrite event handler for " + props.event)
      } else {
        
        // and run the start method!
      this.startFunction.call(this, e)
    },
  
    stop: function(e) {
      this.stopFunction.call(this, e)      
    },
  
    enter: function(e) {
      this.enterFunction.call(this, e)      
    },
  
    exit: function(e) {
      this.exitFunction.call(this, e)      
    },
  
    message: function(e) {
      this.messageFunction.call(this, e)      
    },
  
    tick: function(e) {
      this.tickFunction.call(this, e)      
    }
  
})

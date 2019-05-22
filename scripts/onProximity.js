/*
#title onEvents
#description runs the provided code in the common event handlers
*/
({
    properties: {
        trigger: {
            type:'string',
            title: "action on trigger event:",
            value: "",
            hints: {
                multiline:true,
            }
        },
        faraway: {
            type:'string',
            title: "action on faraway event:",
            value: "",
            hints: {
                multiline:true,
            }
        }
    },

    start: function (e) {      
      let props = this.properties
      
      let enter = "function(e) { ((e) => {" + props.trigger + "}).call(this, e)}"
      this.triggerFunction = Function('"use strict";return (' + enter + ')')()

      let exit = "function(e) { ((e) => {" + props.exit + "}).call(this, e)}"
      this.exitFunction = Function('"use strict";return (' + exit + ')')()

      let message = "function(e) { ((e) => {" + props.message + "}).call(this, e)}"
      this.messageFunction = Function('"use strict";return (' + message + ')')()

      let tick = "function(e) { ((e) => {" + props.tick + "}).call(this, e)}"
      this.tickFunction = Function('"use strict";return (' + tick + ')')()

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

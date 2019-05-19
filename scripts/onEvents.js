/*
#title onEvents
#description runs the provided code in the common event handlers
*/
({
    properties: {
        start: {
            type:'string',
            title: "when project starts:",
            value: "",
            hints: {
                multiline:true,
            }
        },
        stop: {
            type:'string',
            title: "when project stop:",
            value: "",
            hints: {
                multiline:true,
            }
        },
        enter: {
            type:'string',
            title: "when scene is entered:",
            value: "",
            hints: {
                multiline:true,
            }
        },
        exit: {
            type:'string',
            title: "when scene is exited:",
            value: "",
            hints: {
                multiline:true,
            }
        },
        tick: {
            type:'string',
            title: "on clock tick:",
            value: "",
            hints: {
                multiline:true,
            }
        },
        message: {
            type:'string',
            title: "when a message is received:",
            value: "",
            hints: {
                multiline:true,
            }
        }
    },

    start: function (e) {      
      let props = this.properties
      
      let start = "function(e) { ((e) => {" + props.start + "}).call(this, e)}"
      this.startFunction = Function('"use strict";return (' + props.start + ')')()
      
      let stop = "function(e) { ((e) => {" + props.stop + "}).call(this, e)}"
      this.stopFunction = Function('"use strict";return (' + props.stop + ')')()

      let enter = "function(e) { ((e) => {" + props.enter + "}).call(this, e)}"
      this.enterFunction = Function('"use strict";return (' + props.enter + ')')()

      let exit = "function(e) { ((e) => {" + props.exit + "}).call(this, e)}"
      this.exitFunction = Function('"use strict";return (' + props.exit + ')')()

      let message = "function(e) { ((e) => {" + props.message + "}).call(this, e)}"
      this.messageFunction = Function('"use strict";return (' + props.message + ')')()

      let tick = "function(e) { ((e) => {" + props.tick + "}).call(this, e)}"
      this.tickFunction = Function('"use strict";return (' + props.tick + ')')()

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

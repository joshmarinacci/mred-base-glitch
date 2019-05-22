/*
#title onProximity
#description Runs the provided code on proximity transitions
*/
({
    properties: {
        enter: {
            type:'string',
            title: "action on proximity near:",
            value: "",
            hints: {
                multiline:true,
            }
        },
        exit: {
            type:'string',
            title: "action on proximity far:",
            value: "",
            hints: {
                multiline:true,
            }
        }
    },

    start: function (e) {      
      let props = this.properties
      
      let enter = "function(e) { ((e) => {" + props.enter + "}).call(this, e)}"
      this.enterFunction = Function('"use strict";return (' + enter + ')')()

      let exit = "function(e) { ((e) => {" + props.exit + "}).call(this, e)}"
      this.exitFunction = Function('"use strict";return (' + exit + ')')()
    },
  
    proximity: function(e) {
      if (e.data.near) {
        this.enterFunction.call(this, e)
      } else {
        this.exitFunction.call(this, e)
      }
    }
})

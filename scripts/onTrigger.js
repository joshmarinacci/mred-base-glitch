/*
#title onTrigger
#description Runs the provided code on a trigger event
*/
({
    properties: {
        trigger: {
            type:'string',
            title: "action on trigger:",
            value: "",
            hints: {
                multiline:true,
            }
        }
    },

    start: function (e) {      
      let props = this.properties
      
      let trigger = "function(e) { ((e) => {" + props.trigger + "}).call(this, e)}"
      this.triggerFunction = Function('"use strict";return (' + trigger + ')')()
    },
  
    trigger: function(e) {
      this.triggerFunction.call(this, e)
    }
})

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
      
      let code = "function(e) { return ((e) => {" + props.code + "}).call(this, e)}"
      this.tickFunction = Function('"use strict";return (' + code + ')')()

      props.initialText = e.target.userData.div.innerHTML
    },
  
    tick: function(e) {
      let text = this.tickFunction.call(this, e)      
      if (e.target.setText) {
        e.target.setText(text)
      } else {
          this.logger.error("setText must be on text node")
          throw("setText must be on text node")
      }
    }
})

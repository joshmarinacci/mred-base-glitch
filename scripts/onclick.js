/*
#title onClick
#description runs the provided code in the click event handler
*/
({
    properties: {
        code: {
            type:'string',
          title: "code to run:",
            value: "",
          hints: {
                multiline:true,
            }

        }
    },

    start: function (e) {
      this.logger.log("looking for THREE?")
      let Three = window.THREE
      this.logger.log("did we find THREE? ", typeof(Three))
      
      let snippet = this.properties.code
      let code = "function(e) { call((e) => {" + snippet + "}, this)}"
      this.logger.log ("click function: ", code)
      this.clickFunction = Function('"use strict";return (' + code + ')')()
    this.logger.log("set click function")
    },
  
    click: function(e) {
      let that = this
      call(this.clickFunction(e), this)      
    }
})

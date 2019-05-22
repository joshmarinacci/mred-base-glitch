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
      let snippet = this.properties.code
      let code = "function(e) { ((e) => {" + snippet + "}).call(this, e)}"
      //this.logger.log ("click function: ", code)
      this.clickFunction = Function('"use strict";return (' + code + ')')()
      //this.logger.log("set click function")
    },
  
    click: function(e) {
      this.clickFunction.call(this, e)      
    }
})

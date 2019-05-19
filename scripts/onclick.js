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
      let Three = THREE
      this.logger.log("did we find THREE?", Three)
      
      let snippet = this.properties.code
      let code = "function(this,e) {" + snippet + "}"
      this.clickFunction = Function('"use strict";return (' + code + ')')()
    },
  
    click: function(e) {
      this.clickFunction(this,e)      
    }
})

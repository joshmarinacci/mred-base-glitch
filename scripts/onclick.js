/*
#title onClick
#description logs something when you get a wheee event
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

    init: function (e) {
      let snippet = this.properties.code
      let code = "function(this,e) {" + snippet + "}"
      this.clickFunction = Function('"use strict";return (' + code + ')')()
    },
  
    click: function(e) {
      this.clickFunction(this,e)      
    }
})

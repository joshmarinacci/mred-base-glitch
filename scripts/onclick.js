/*
#title Wheee
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

    click: function(e) {
      let code = this.properties.code
      if (code.length > 0) {
        
      }

    }
})

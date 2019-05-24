/*
#title proximityTrigger
#description fires trigger event on proximity transitions
*/
({
    properties: {
    },

    proximity: function(e) {
      this.fireEvent("trigger", e.data)
    }
})

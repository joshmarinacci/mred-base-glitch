/*
#title Proximity
#description Rotate object when something is nearby
*/
({

    properties: {
        delay: {
            type:'number',
            value: 1,
        },
    },

    proximity: function (e) {
      console.log("got an event")
      this.tween.prop({
        target: e.target.rotation,
        property: 'y',
        duration: 2.0,
        from: 0,
        to: 6.28,
        loop: 4,
      }).start()
    },

})


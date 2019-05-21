/*
#title Spinner
#description spins shape around the y axis at a certain speed
*/
({
    properties: {
        speed: {
            type:'number',
            value: 1,
        }
    },
    tick: function(e) {
        this.target.rotation.y += this.properties.speed/100
    },
})
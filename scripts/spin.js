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
        let degrees = 2 * Math.PI * e.deltaTime * this.properties.speed 
        e.target.rotation.y += degrees
    },
})
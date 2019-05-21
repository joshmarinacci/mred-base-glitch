/*
#title Spinner
#description spins shape around the y axis at "speed" times per second
*/
({
    properties: {
        speed: {
            type:'number',
            value: 1,
        }
    },
    tick: function(e) {
        let degrees = 2 * Math.PI * (e.deltaTime/1000) * this.properties.speed 
        e.target.rotation.y += degrees
    },
})
# scripting cheat sheet

* the behavior script itself has a bunch of special properties which gives you access to lots of things. 
* the event passed to your event handler has a target property which is the object the event happened on. In most cases this will be the object the behavior is added to

#### event

* `event.type`: the type of the event. `tick`, `exit`, etc.
* `event.target`:  the ThreeJS object this behavior is attached to
* `event.graphTarget`: the graph document object this behavior is attached to
* `event.time`: the time of the most recent tick event
* `event.deltaTime`: (only in `tick`) the elapsed time since last tick
* `event.name`: (only in `message`) the name of the message
* `event.payload`: (only in `message` and som)
	
#### behavior event handlers:

* `start()`: called on system start, even if you aren’t in the current scene
* `enter()`: called when entering a scene
* `exit()`: called when exiting a scene
* `message()`: called when a message is received
* `tick()`
* `stop()` called when the system stops
	
#### properties available to behavior event handlers

* `this.logger`: the logger for logging messages remotely. ex:  `this.logger.log("i'm doing cool stuff here")`
* `this.camera`: a reference to the current ThreeJS camera. ex: `console.log(this.camera.position)`
* `this.tween`: a reference to the tween manager. ex: `this.tween.prop({from:0, to:1.5})`
* `this.properties`: the property settings for this behavior. ex: if a behavior has a speed property you can access it with `this.properties.speed`.
* `this.globalState`: a place to set values that every behavior can access
* `this.globals` get a reference to useful global variables

### methods available to behavior event handlers

* `this.getCurrentScene()`: a reference to the current scene
* `this.getThreeObjectByTitle(title)`: find the ThreeJS object by its title
* `this.getThreeObjectById(id)`: find the ThreeJS object by its title
* `this.getObjectById(id)`: find the document object by its id
* `this.getAssetByTitle(title)`: find an asset by its title
* `this.navigateScene(id)`: navigate to a new scene, by id
* `this.playSound(id)`: play a sound by id
	
#### logger

Instead of using `console.log()` you can use `this.logger.log()`. This will print
output to the console prepended with `LOGGER` and also send it over the network to any other instance
of the editor that is editing the same document. This means you can use the desktop editor to view the output
of a document running on your iPhone.  You can also use `this.logger.error()` which does the same thing
but prepends the output text with `LOGGER ERROR`.

#### globals

You can call `this.globals` to get an object full of globals.  Currently the following globals are defined
* THREE: the ThreeJS top level object
* GLTFLoader: 
* GPUParticles:
* WebLayer3D:

Ex: to create a new Mesh at runtime with ThreeJS do:

```javascript

({
  start:function(evt) {
      const THREE = this.globals.THREE
      const mesh = new THREE.Mesh(
          new THREE.SphereGeometry(1),
          new THREE.MeshLambertMaterial({color:'red'})
      )
      mesh.position.set(3,0,-5)
      const sc = this.getCurrentScene()
      console.log("the scene is",sc)
      const scene = this.getThreeObjectByTitle(sc.title)
      scene.add(mesh)
  }
})

```

#### Asset object
	
* Asset object, returned by getAsset(name)
	* play()
	* stop()

Properties for behaviors are specified as a map of key names to prop definitions. The definitions look like this:
```
properties: {
	//a number property
	distance: { 
		type:'number',  //the type
		value:2,  //initial value
	},

  //a string
	enterMessage: {
		type:'string',
		title:'enter message',
		value:'entered',
	},

  // a reference to another node
	exitMessage: {
		type:'enum',
		value:null,
		hints: {
			type:'node',
			nodeType:'scene'
		}
	},

	//a reference to a video asset
	video: {
		type:'enum',
		value:null,
		hints: {
			type:'video'
		}
	},

},
```

## Examples
```
//move object two meters to the right when it is clicked
click(evt) {
   evt.target.position.x += 2
}
//spin target object using configurable speed
tick(evt) {
	e.target.rotation.y += this.properties.speed
}
//listen for proximity event and start particles
message(evt) {
	if(e.type === 'proximity-enter') {
		this.getObjectByTitle('fountain').start()
  }
}
//when scene enters, rotate target 4 times then play a sound
enter(evt) {
	this.tween.prop({
		target: e.target.rotation
		property: 'y',
		duration: 2.0,
		from: 0,
		to: toRadians(360)
		loop: 4,
  }).action(()=>{
		this.getAssetByTitle('chime').play()
  }).start()
}
```



The Tween API lets you create animations that are chained together in parallel or sequence.


### rotate the target object once
``` javascript
({
  // defines a target property. must be a scene
    enter: function(e) {
        this.tween.prop({
            duration:1.0,
            target:e.target.rotation,
            property:'y',
            from:0,
            to:3.14*2,
            loop:1,
        }).start()
    },
})
```

### rotate the target object around y and also move x from -1 to 1, in sequence
``` javascript
({
  // defines a target property. must be a scene
    enter: function(e) {
        this.tween.sequence()
            .then(this.tween.prop({
                duration:1.0,
                target:e.target.rotation,
                property:'y',
                from:0,
                to:3.14*2,
                loop:1,
            }))
            .then(this.tween.prop({
                duration:1.0,
                target:e.target.position,
                property:'x',
                from:-1,
                to:1,
            }))
            .start()
    },
})
```

### rotate the target object around y and also move x from -1 to 1, in parallel
``` javascript
({
  // defines a target property. must be a scene
    enter: function(e) {
        this.tween.parallel()
            .and(this.tween.prop({
                duration:1.0,
                target:e.target.rotation,
                property:'y',
                from:0,
                to:3.14*2,
                loop:1,
            }))
            .and(this.tween.prop({
                duration:1.0,
                target:e.target.position,
                property:'x',
                from:-1,
                to:1,
            }))
            .start()
    },
})
```

### move the x from -1 to 1, then back, then print a message
``` javascript
({
  // defines a target property. must be a scene
    enter: function(e) {
        this.tween.sequence()
            .then(this.tween.prop({
                duration:1.0,
                target:e.target.position,
                property:'x',
                from:-1,
                to:1,
                autoReverse:true,
            }))
            .then(()=> {
                this.logger.log("done here")
            })
            .start()
    },
})
```




/*
#title portal
#description shows a view to another scene
*/

({
    properties: {
        color: {
            type:'color',
            value: "white",
        },
        clear: {
            type:'color',
            value: "red",
        },
        width: {
            type:'number',
            value: 1,
        },
        height: {
            type:'number',
            value: 1,
        },
        frame: {
            type:'string',
            value: "output-onlinepngtools.png"
        },
        scene: {
            type:'enum',
            title: 'target scene',
            value:null,
            hints: {
                type:'node',
                nodeType:'scene'
            }
        },
    },

    start: function (e) {

      
      
        ////////////////////////////////////////////////////////////////////////////////
        // REFLECTOR
        ////////////////////////////////////////////////////////////////////////////////      
      

        let THREE = this.globals.THREE
      
        //
        // Build a constructor that can be invoked later by user
        //
        THREE.Reflector = function ( geometry, options ) {

            let scope = this

            // glue for threejs class injection
            THREE.Mesh.call( scope, geometry );
            scope.type = 'Reflector';
          
            // caller option handling
            options = options || {};
            var color = ( options.color !== undefined ) ? new THREE.Color( options.color ) : new THREE.Color( 0xFFFFFF );
            var clear = ( options.clear !== undefined ) ? new THREE.Color( options.clear ) : new THREE.Color( 0xFF0000 );
            var textureWidth = options.textureWidth || 512;
            var textureHeight = options.textureHeight || 512;
            var clipBias = options.clipBias || 0;
            var shader = options.shader || THREE.Reflector.ReflectorShader;
            var recursion = options.recursion !== undefined ? options.recursion : 1;

            // Build a few static variables to avoid thrashing memory at runtime
            var reflectorPlane = new THREE.Plane();
            var normal = new THREE.Vector3();
            var reflectorWorldPosition = new THREE.Vector3();
            var cameraWorldPosition = new THREE.Vector3();
            var scratchMatrix = new THREE.Matrix4();
            var lookAtPosition = new THREE.Vector3( 0, 0, - 1 );
            var clipPlane = new THREE.Vector4();
            var viewport = new THREE.Vector4();
            var view = new THREE.Vector3();
            var target = new THREE.Vector3();
            var q = new THREE.Vector4();
            var size = new THREE.Vector2();
            var textureMatrix = new THREE.Matrix4();
            var virtualCamera = new THREE.PerspectiveCamera();

            // Build a texture to render into
            var parameters = {
              minFilter: THREE.LinearFilter,
              magFilter: THREE.LinearFilter,
              format: THREE.RGBFormat,
              stencilBuffer: false
            }
            var renderTarget = this.renderTarget = new THREE.WebGLRenderTarget(
              textureWidth,
              textureHeight,
              parameters
            )
            if ( ! THREE.Math.isPowerOfTwo( textureWidth ) || ! THREE.Math.isPowerOfTwo( textureHeight ) ) {
              renderTarget.texture.generateMipmaps = false;
            }

            // After the target texture is rendered it needs to pretend it is a material so threejs can paint it
            var material = new THREE.ShaderMaterial( {
              uniforms: THREE.UniformsUtils.clone( shader.uniforms ),
              fragmentShader: shader.fragmentShader,
              vertexShader: shader.vertexShader
            } );
            material.uniforms[ "tDiffuse" ].value = renderTarget.texture;
            material.uniforms[ "color" ].value = color;
            material.uniforms[ "textureMatrix" ].value = textureMatrix;
            scope.material = material;

            // Have a private scene
            let privateScene = this.privateScene = new THREE.Scene()
            this.privateLight1 = new THREE.PointLight(0xffffff, 1, 1000)
            this.privateLight1.intensity = 2
            this.privateLight2 = new THREE.DirectionalLight()
            this.privateScene.add(scope.privateLight1)
            this.privateScene.add(scope.privateLight2)          
          
            // Every frame when painting this object, quickly go ahead and remake the texture based on a portal camera view
            scope.onBeforeRender = function ( renderer, portalParentGroup, camera ) {

                // This is the group that needs to be painted
                let group = options.scene
              
                // number of bounces - may be less useful for portals than mirrors?
                if ( 'recursion' in camera.userData ) {
                  if ( camera.userData.recursion === recursion ) return;
                  camera.userData.recursion ++;
                }

                // Do not bother rendering if facing away from the portal
                if(true) {
                    // where is the portal exterior
                    reflectorWorldPosition.setFromMatrixPosition( scope.matrixWorld )
                    // where is the main camera
                    cameraWorldPosition.setFromMatrixPosition( camera.matrixWorld )
                    // get a normal for the front of the portal
                    scratchMatrix.extractRotation( scope.matrixWorld )
                    normal.set( 0, 0, 1 )
                    normal.applyMatrix4( scratchMatrix )
                    view.subVectors( reflectorWorldPosition, cameraWorldPosition )
                    if ( view.dot( normal ) > 0 ) return
                }
              
                // remember where group was since local code may fiddle with it
                let currentUpdateGroup = group.matrixAutoUpdate
                group.matrixAutoUpdate = false; // paranoia
                let currentMatrixGroup = group.matrixWorld.clone()
              
                // test pipeline - move the group to the camera to minimize clipping plane complexity
                if(false) {

// TODO the portal may not be at the origin - it has to be unwound here also - but for testing this is fine for today
                  
                    // transform group to become local to camera
                    let cameraInverse = scratchMatrix.getInverse(camera.matrixWorld)
                    group.matrixWorld.multiply(cameraInverse)

                    // unwind the camera
                    virtualCamera = new THREE.PerspectiveCamera( 45, window.innerWidth/window.innerHeight, 0.1, 1000 )
                    virtualCamera.position.set(0,0,0)
                    virtualCamera.updateMatrixWorld(true);
                    virtualCamera.matrixAutoUpdate = false; // paranoia

                    // reflector is at the group origin
                    reflectorWorldPosition.setFromMatrixPosition( group.matrixWorld )

// TODO hmm, should the portal interior always face us after unwinding - probably?                  

                    // get direction of portal
                    scratchMatrix.extractRotation( group.matrixWorld )
                    normal.set( 0, 0, 1 )
//                    normal.applyMatrix4( scratchMatrix )
                }

                // Normal pipeline - transform camera to group
                else {
                    // get a clone of the current camera as a scratch space
                    // TODO slightly wasteful of CPU
                    virtualCamera = camera.clone()

                    // what is the pose of viewer relative to the portal exterior?
                    let portalInverse = scratchMatrix.getInverse(scope.matrixWorld)
                    virtualCamera.applyMatrix(portalInverse)

                    // what is the pose of viewer relative to the target group interior?
                    let groupInverse = scratchMatrix.getInverse(group.matrixWorld)
                    virtualCamera.applyMatrix(groupInverse)

                    // where is the target group?
                    reflectorWorldPosition.setFromMatrixPosition( group.matrixWorld )

                    // where is the viewer? (this is after the viewer has been transformed over to the group)
                    cameraWorldPosition.setFromMatrixPosition( virtualCamera.matrixWorld )

                    // get direction of portal
                    scratchMatrix.extractRotation( scope.matrixWorld )
                    normal.set( 0, 0, 1 )
                    normal.applyMatrix4( scratchMatrix )

                    // how far is the viewer from the target group?
                    //let distance = reflectorWorldPosition.distanceTo( cameraWorldPosition )

                    // what is the viewer lookAt? (cameras look down -z)
                    //scratchMatrix.extractRotation( virtualCamera.matrixWorld )
                    //lookAtPosition.set( 0, 0, - 1 )
                    //lookAtPosition.applyMatrix4( scratchMatrix )
                    //lookAtPosition.add( cameraWorldPosition )

                    //target.subVectors( reflectorWorldPosition, lookAtPosition )
                    //target.reflect( normal ).negate()
                    //target.add( reflectorWorldPosition )

                    //TODO these should already be ok
                    //virtualCamera.up.set( 0, 1, 0 )
                    //scratchMatrix.extractRotation( virtualCamera.matrixWorld )
                    //virtualCamera.up.applyMatrix4( scratchMatrix )
                    //virtualCamera.up.reflect( normal )
                    //virtualCamera.lookAt( target )
                    //virtualCamera.far = camera.far
                }

                // Update the texture matrix
                textureMatrix.set(
                  0.5, 0.0, 0.0, 0.5,
                  0.0, 0.5, 0.0, 0.5,
                  0.0, 0.0, 0.5, 0.5,
                  0.0, 0.0, 0.0, 1.0
                );
                textureMatrix.multiply( virtualCamera.projectionMatrix )
                textureMatrix.multiply( virtualCamera.matrixWorldInverse )
                textureMatrix.multiply( group.matrixWorld )

                //////////////////////////////////////////////////
                // Now update projection matrix with new clip plane, implementing code from: http://www.terathon.com/code/oblique.html
                // Paper explaining this technique: http://www.terathon.com/lengyel/Lengyel-Oblique.pdf
                //////////////////////////////////////////////////
              
// in the mirror example a camera is moved to a position on some side of a plane; it faces that plane
// then the clipping is set up at that plane
// here, a similar operation takes place, a camera is at a position looking at a group
// there is some estimate of an origin of the plane
// and the plane has some orientation
              
                if(true) {
                    reflectorPlane.setFromNormalAndCoplanarPoint( normal, reflectorWorldPosition );
                    reflectorPlane.applyMatrix4( virtualCamera.matrixWorldInverse );

                    clipPlane.set( reflectorPlane.normal.x, reflectorPlane.normal.y, reflectorPlane.normal.z, reflectorPlane.constant );

                    var projectionMatrix = virtualCamera.projectionMatrix;

                    q.x = ( Math.sign( clipPlane.x ) + projectionMatrix.elements[ 8 ] ) / projectionMatrix.elements[ 0 ];
                    q.y = ( Math.sign( clipPlane.y ) + projectionMatrix.elements[ 9 ] ) / projectionMatrix.elements[ 5 ];
                    q.z = - 1.0;
                    q.w = ( 1.0 + projectionMatrix.elements[ 10 ] ) / projectionMatrix.elements[ 14 ];

                    // Calculate the scaled plane vector
                    clipPlane.multiplyScalar( 2.0 / clipPlane.dot( q ) );

                    // Replacing the third row of the projection matrix
                    projectionMatrix.elements[ 2 ] = clipPlane.x;
                    projectionMatrix.elements[ 6 ] = clipPlane.y;
                    projectionMatrix.elements[ 10 ] = clipPlane.z + 1.0 - clipBias;
                    projectionMatrix.elements[ 14 ] = clipPlane.w;
                }

                // Render everything except portal
                scope.visible = false;

                // Temporarily move the target group to a private threejs scene
                let currentGroupParent = group.parent
                let currentGroupVisible = group.visible
                currentGroupParent.remove(group) // paranoia
                privateScene.add( group )
                group.visible = true

                // Render to the texture
                {
                    // Save renderer state
                    let currentRenderTarget = renderer.getRenderTarget();
                    let currentVrEnabled = renderer.vr.enabled;
                    let currentShadowAutoUpdate = renderer.shadowMap.autoUpdate;
                    let currentClearColor = renderer.getClearColor()

                    // Render to buffer
                    renderer.vr.enabled = false; // Avoid camera modification and recursion
                    renderer.shadowMap.autoUpdate = false; // Avoid re-computing shadows
                    renderer.setRenderTarget( renderTarget )
                    renderer.setClearColor( clear )
                    renderer.clear()
                    renderer.render( privateScene, virtualCamera, renderTarget )

                    // Restore renderer settings
                    renderer.setClearColor(currentClearColor)
                    renderer.vr.enabled = currentVrEnabled
                    renderer.shadowMap.autoUpdate = currentShadowAutoUpdate
                    renderer.setRenderTarget( currentRenderTarget )
                }

                // restore group to previous parent whatever it was
                group.visible = currentGroupVisible
                privateScene.remove(group) // paranoia
                currentGroupParent.add(group)

                // restore viewport
                var bounds = camera.bounds;
                if ( bounds !== undefined ) {
                  renderer.getSize( size );
                  var pixelRatio = renderer.getPixelRatio();
                  viewport.x = bounds.x * size.width * pixelRatio;
                  viewport.y = bounds.y * size.height * pixelRatio;
                  viewport.z = bounds.z * size.width * pixelRatio;
                  viewport.w = bounds.w * size.height * pixelRatio;
                  renderer.state.viewport( viewport );
                }
                // allow this object to render with its mirror material now
                scope.visible = true;

                // restore group matrix details
                group.matrixWorld.copy(currentMatrixGroup)
                group.matrixAutoUpdate = currentUpdateGroup

            }


        }

        //
        // Attach a copy shader to the Reflector which makes the texture present as a material to threejs
        // (this is done prior to allowing users to use the reflector itself)
        //
      
        THREE.Reflector.prototype = Object.create( THREE.Mesh.prototype );
        THREE.Reflector.prototype.constructor = THREE.Reflector;
        THREE.Reflector.ReflectorShader = {
          uniforms: {
            'color': {type: 'c',value: null},
            'tDiffuse': {type: 't',value: null},
            'textureMatrix': {type: 'm4',value: null}
          },
          vertexShader: [
            'uniform mat4 textureMatrix;',
            'varying vec4 vUv;',
            'void main() {',
            '	vUv = textureMatrix * vec4( position, 1.0 );',
            '	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
            '}'
          ].join( '\n' ),
          fragmentShader: [
            'uniform vec3 color;',
            'uniform sampler2D tDiffuse;',
            'varying vec4 vUv;',
            'float blendOverlay( float base, float blend ) {',
            '	return( base < 0.5 ? ( 2.0 * base * blend ) : ( 1.0 - 2.0 * ( 1.0 - base ) * ( 1.0 - blend ) ) );',
            '}',
            'vec3 blendOverlay( vec3 base, vec3 blend ) {',
            '	return vec3( blendOverlay( base.r, blend.r ), blendOverlay( base.g, blend.g ), blendOverlay( base.b, blend.b ) );',
            '}',
            'void main() {',
            '	vec4 base = texture2DProj( tDiffuse, vUv );',
            '	gl_FragColor = vec4( blendOverlay( base.rgb, color ), 1.0 );',
            '}'
          ].join( '\n' )
        }


      
      
        //////////////////////////////////////////////////////////////////////////////////
        // NORMAL START LOGIC
        /////////////////////////////////////////////////////////////////////////////////
      
        // find scene in question
        const scene = this.getThreeObjectById(this.properties.scene)
        if(!scene) {
          this.logger.error("no scene on portal")
          return
        }

        // manufacture a plane for the portal.
        // TODO this could pluck width and height from the parent
        let width = this.properties.width || 1
        let height = this.properties.height || 1
        let color = this.properties.color || "white"
        let clear = this.properties.clear || "red"
        var geometry = new THREE.PlaneBufferGeometry( width, height )
        let portal = this.portal = new THREE.Reflector( geometry, {
          scene:scene,
          clipBias: 0.001,
          textureWidth: 512,
          textureHeight: 512,
          color: color,
          clear: clear,
          recursion: 1
        } )
        e.target.add(portal)
 
    },
  
    tick: function(e) {
    },

})



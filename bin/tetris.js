
 
    
    /**
     * Initialisiere WebGL (Web Graphic Libary)  und waehlt den Rendering Context WebGL fuer das Canvas Element aus.
     * @param canvas
     */
	var gl;
    function initGL(canvas) {
        try {
            gl = canvas.getContext("webgl");
            gl.viewportWidth = canvas.width;
            gl.viewportHeight = canvas.height;
        } catch (e) { }
        if (!gl) {
            alert("Failed to get the rendering context for WebGL");
        }
    }


/**
 * Ruft den korrekten Shadertyp auf und liefert einen Grafikkarten kompatiblen Shader
 * @param gl
 * @param id
 * @returns
 */
   function getShader(gl, id) {
    	
        var shaderScript = document.getElementById(id);
        //Pruefe ob ein Element existiert
        if (!shaderScript) {
            return null;
        }
        
      //Pruefe ob alle elemente textelemente sind
        var str = "";
        var k = shaderScript.firstChild;
        while (k) {
            if (k.nodeType == 3) {			//If the node is a text node, the nodeType property will return 3.
                str += k.textContent;
            }
            k = k.nextSibling;				//Naechster (sibling = Geschwister)
        }

        //Pruefe welche Art von Shader und speichere in variable
        var shader;
        if (shaderScript.type == "x-shader/x-fragment") {
            shader = gl.createShader(gl.FRAGMENT_SHADER);
        } else if (shaderScript.type == "x-shader/x-vertex") {
            shader = gl.createShader(gl.VERTEX_SHADER);
        } else {
            return null;
        }

        //Konvertiere den Shader in eine GraKa kompatible Form
        gl.shaderSource(shader, str);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert(gl.getShaderInfoLog(shader));
            return null;
        }

        return shader;
    } 

   
   
   

    /**
     * Fuegt den Vertexshader (zustaendig fuer Berechnung der Eckpunkte des 3DModels)
     * und den Fragmentshader (zustaendig fuer die Oberflaeche des Modells),
     * zu einem WebGL Programm Objekt (ausfuerbar direkt auf der GraKa) zusammen.
     * Jedes Programm besteht aus jeweils einem Vertex- sowie Fragment- oder Pixelshader
     * @param gl
     * @param id
     * @returns
     */
    var shaderProgram;
    function initShaders() {
        var fragmentShader = getShader(gl, "shader-fs");
        var vertexShader = getShader(gl, "shader-vs");

        shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);

        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            alert("Could not initialise shaders");
        }

        gl.useProgram(shaderProgram);

        
        /*
         * Verknuepfe die script Variablen (im shaderProgram) mit den Shader Attributen (im shader der HMTL)
         */
        
        // Assign the buffer object to 'aVertexPosition' variable
        shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
        // Enable the assignment to 'aVertexPosition' variable
        gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

        shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
        gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);
        
        shaderProgram.pointSize = gl.getAttribLocation(shaderProgram, "aPointSize");
        
     // Get the location of uniform variable
        shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
        shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
    }
    
 
    
    
 
    
    
    
    /**
     * Wandle die Matrizen von Javascript auf WebGL (GraKa-seitig) um, 
     * damit die Sichtbarkeit fuer die Shaders garantiert ist
     */
    var mvMatrix = mat4.create();
    var pMatrix = mat4.create();
    function setMatrixUniforms() {
        gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
        gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
    }

    
    /**
     * Rechne Radiant in Grad um
     * @param degrees
     * @returns {Number}
     */
    function degToRad(degrees) {
        return degrees * Math.PI / 180;
    }
    
    
    /**
     * Speichere die globale mvMatrix (ModelView-) auf einen Stack
     */
    var mvMatrix = mat4.create();
    var mvMatrixStack = [];
    var pMatrix = mat4.create();
    function mvPushMatrix() {
        var copy = mat4.create();
        mat4.set(mvMatrix, copy);
        mvMatrixStack.push(copy);
    }

    /**
     * Lade die letzte Matrix vom Stack
     */
    function mvPopMatrix() {
        if (mvMatrixStack.length == 0) {
            throw "Invalid popMatrix!";
        }
        mvMatrix = mvMatrixStack.pop();
    }
    
    
    
    
    //Generate a number between 0 and 4 (included)
    function randomGenerator(){
    	return Math.floor( ( (Math.random() *10) + 1 ) % 5);
    }

    
    
    
    
    
    
    /**
     * Define the Object by using Vertices
     * Fill the graphic card with these Informations
     * 1. Create a buffer object ( gl.createBuffer() ).
     * 2. Bind the buffer object to a target ( gl.bindBuffer() ).
     * 3. Write data into the buffer object ( gl.bufferData() ).
     * 4. Assign the buffer object to an attribute variable ( gl.vertexAttribPointer() ).
     * 5. Enable assignment ( gl.enableVertexAttribArray() ).
     */

    function initBuffers() {
    	
    	
    	initO();
    	initT();
    	initI();
    	initL();
    	initS();
        
    }


    
    
    /**
     * Draw the Scene including the Object which are specified in initBuffer()
     * function gl.drawArrays(mode, first, count):
     * -mode: 	Specifies the type of shape to be drawn. The following symbolic constants are accepted: 
     * 			gl.POINTS , gl.LINES , gl.LINE_STRIP , gl.LINE_LOOP , gl.TRIANGLES , gl.TRIANGLE_STRIP
     * 			and gl.TRIANGLE_FAN.
     * -first: 	Specifies which vertex to start drawing from (integer). 
     * -count:	Specifies the number of vertices to be used (integer).
     * Shader will be executed 'count' times
     */
    var scale;
    var elem;
    var spawnPosition = [0.0, 0.0, -8.0];
    var landed = false;
    function drawScene() {
        gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        
        
        //Angaben zur Perspektive: (Field of View (Blickfeld in Grad), Hoehe/Breite-Verhaeltnis, min. Sichtweite, max. Sichtweite)
        //Speichere in pMatrix
        mat4.perspective(100, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);
        //setzte Ursprungspunkt bzw. setzte aktuelle Position/Rotation der Model-view Matrix in die Identity matrix;
        mat4.identity(mvMatrix);	
        //Multiply the mvMatrix with an Translationmatrix 
        mat4.translate(mvMatrix, spawnPosition);
        
        //mat4.translate(mvMatrix, mvMatrix, [x, y, Z]) <--- nach unten links bewegen
        
        //Elem 0=O, 1=T, 2=I, 3=L, 4=S 
        //elem = randomGenerator();
        
        elem = 0;
	        /*
	         *  --------Draw the O-Element------------
	         */         
		        //Store the mvMatrix before adaot it with other operations 
		        mvPushMatrix();
		        drawO();
		        //Restore the mvMatrix before the Rotation and Translation
		        mvPopMatrix();   
		        
        if(landed == true){
        	
	        if(elem == 0){
	        /*
	         *  --------Draw the O-Element------------
	         */         
		        //Store the mvMatrix before adaot it with other operations 
		        mvPushMatrix();
		        drawO();
		        //Restore the mvMatrix before the Rotation and Translation
		        mvPopMatrix();
	        }
	
	        if(elem == 1){
	        /*
	         *  --------Draw the T-Element------------
	         */           
		        mvPushMatrix();
		        drawT();
		        mvPopMatrix();          
	        }
	        
	        if(elem == 2){
	        /*
	         *  --------Draw the I-Element------------
	         */           
		        mvPushMatrix();
		        drawI();
		        mvPopMatrix(); 
	        }
	        
	        if(elem == 3){
	        /*
	         *  --------Draw the L-Element------------
	         */           
		        mvPushMatrix();
		        drawL();
		        mvPopMatrix(); 
	        }
	        
	        if(elem == 4){
	        /*
	         *  --------Draw the S-Element------------
	         */           
		        mvPushMatrix();
		        drawS();
		        mvPopMatrix();
	        }
        }
    }

    

    /**
     * Erstelle einen Hashtable: Jede Keyboardtaste wird einem KeyCode zugeordnet
     * HandleKeyDown: Aktion wenn eine Taste gedrueckt wird
     * HandleKeyDown: Aktion wenn eine Taste losgelassen wird
     * direction 1/2: counterclockwise/clockwise
     */
    
    var currentlyPressedKeys = {};
    var xSpeed = 1.0;
    var direction = 0;
    var grav = false;
    var gravSpeed = 0.1
    function handleKeyDown(event) {
      currentlyPressedKeys[event.keyCode] = true;
      
      //Ausgabe des zugehoerigen KeyCodes einer Taste: 
      		//alert(String.fromCharCode(event.keyCode));
      
      if ( String.fromCharCode(event.keyCode) == "%" || String.fromCharCode(event.keyCode) == "L") {
    	  //Cursor LEFT
    	  event.preventDefault();
    	  if(elem == 0)
    		  O_translation[0] -= xSpeed; 
    	  if(elem == 1)
    		  T_translation[0] -= xSpeed; 
    	  if(elem == 2)
    		  I_translation[0] -= xSpeed; 
    	  if(elem == 3)
    		  L_translation[0] -= xSpeed; 
    	  if(elem == 4)
    		  S_translation[0] -= xSpeed; 
      }
      if ( String.fromCharCode(event.keyCode) == "'" || String.fromCharCode(event.keyCode) == "R") {
    	  //Cursor RIGHT
    	  event.preventDefault();
    	  if(elem == 0)
    		  O_translation[0] += xSpeed;
    	  if(elem == 1)
    		  T_translation[0] += xSpeed;
    	  if(elem == 2)
    		  I_translation[0] += xSpeed;
    	  if(elem == 3)
    		  L_translation[0] += xSpeed;
    	  if(elem == 4)
    		  S_translation[0] += xSpeed;
      }
      if ( String.fromCharCode(event.keyCode) == "&" || String.fromCharCode(event.keyCode) == "U") {
    	  //Cursor UP
    	  event.preventDefault();
    	  grav = false;
    	  gravSpeed = 0.1;
    	  
    	  
      }
      if ( String.fromCharCode(event.keyCode) == "(" || String.fromCharCode(event.keyCode) == "D") {
    	  //Cursor DOWN
    	  event.preventDefault();
    	  if(grav == false)
    		  grav = true;
    	  else
    		  gravSpeed = 1.0;
    	  
      }
      if ( String.fromCharCode(event.keyCode) == "C") {
    	  elem++
    	  if(elem == 6)
    		  elem = 1;
      }
      if ( String.fromCharCode(event.keyCode) == "1") {
    	  if(elem == 0)
    		  O_rotation += 90;
    	  if(elem == 1)
    		  T_rotation += 90;
    	  if(elem == 2)
    		  I_rotation += 90;
    	  if(elem == 3)
    		  L_rotation += 90;
    	  if(elem == 4)
    		  S_rotation += 90;
    	  
    	  direction = 1;
      }
      if ( String.fromCharCode(event.keyCode) == "3") {
    	  if(elem == 0)
    		  O_rotation -= 90;
    	  if(elem == 1)
    		  T_rotation -= 90;
    	  if(elem == 2)
    		  I_rotation -= 90;
    	  if(elem == 3)
    		  L_rotation -= 90;
    	  if(elem == 4)
    		  S_rotation -= 90;
    	  
    	  direction = 3;
      }
      if ( String.fromCharCode(event.keyCode) == "I") {
    	  //Information window for debugging
    	  alert(gravSpeed);
      }
      if ( String.fromCharCode(event.keyCode) == "Q") {
    	 xSpeed += 0.05;
      }
      if ( String.fromCharCode(event.keyCode) == 'W') {
    	  if(xSpeed > 0.05)
    		  xSpeed -= 0.05;
      }
    }

    function handleKeyUp(event) {
      currentlyPressedKeys[event.keyCode] = false;
    }
    
    
    
    function rotation(){
    	
		
        if(O_rotationOld != O_rotation){
            if(direction == 1)
            	O_rotationOld += 5;
            else
            	if(direction == 3)
            		O_rotationOld -= 5;
        }
    	
        if(T_rotation != T_rotationOld){
	            if(direction == 1)
	            	T_rotationOld += 5;
	            else
	            	if(direction == 3)
	            		T_rotationOld -= 5;
        }
        
        if(I_rotation != I_rotationOld){
            if(direction == 1)
            	I_rotationOld += 5;
            else
            	if(direction == 3)
            		I_rotationOld -= 5;
        }
        if(L_rotation != L_rotationOld){
            if(direction == 1)
            	L_rotationOld += 5;
            else
            	if(direction == 3)
            		L_rotationOld -= 5;
        }
        if(S_rotation != S_rotationOld){
            if(direction == 1)
            	S_rotationOld += 5;
            else
            	if(direction == 3)
            		S_rotationOld -= 5;
        }
    }
    
    
    function gravity(){
    	
    	if(-9 < O_translation[1] || O_translation[1] < -10 )
    		O_translation[1] -= gravSpeed;
    	else
    		O_translation[1] = 0;
    }
    
    
    /**
     * 	Animate rotation
     */
    var lastTime = 0;
    function animate() {
    	var timeNow = new Date().getTime()
    	if (lastTime != 0) {
    		var elapsed = timeNow - lastTime;
    		
    		rotation();	
    		
    		if(grav == true)
    			gravity();
	        
        
    	}
    	lastTime = timeNow;
    }

    /**
     * Aktualisiert das Bild um eine Animation zu erschaffen
     */
    function tick() {
        requestAnimFrame(tick);	//Funktion des Scripts 'webgl-utils.js': Aktualisiert Seite Browser-unabhaengig (nur wenn Tab aktiv)
        drawScene();			//Zeichne neues Bild
        animate();

    }

    /** 
     * 	Initialisiert WebGL, den Vertex- und den Fragmentshader, sowie die Buffer fuer die Eckpunkte und Farbwerte, 
     * behandelt Tastatureingaben und wiederholt das Programm
     *   
     */
    function webGLStart() {
        var canvas = document.getElementById("canvas");	//Lade Canvas Element von HTML ins javascript
        
        if (!canvas) {
        	console.log('Failed to retrieve the <canvas> element ');
        	return false;
        }
        
        initGL(canvas);
        initShaders();
        createGrid();
        initBuffers();
        
        gl.clearColor(0.0, 0.0, 0.0, 0.0);
        gl.enable(gl.DEPTH_TEST);

        document.onkeydown = handleKeyDown;
        document.onkeyup = handleKeyUp;
        
        tick();
        
    }

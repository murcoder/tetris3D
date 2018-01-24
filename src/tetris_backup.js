
 
    
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

        // Assign the buffer object to 'aVertexPosition' variable
        shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
        // Enable the assignment to 'aVertexPosition' variable
        gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

        shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
        gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);
        
        //shaderProgram.scaleAttribute = gl.getAttribLocation(shaderProgram, "aScale");
        
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
     * Calculate from radiant to degree
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
    
    
    /**
     * Generate a number between 0 and 4 (included)
     */
    function randomGenerator(){
    	return Math.floor( ( (Math.random() *10) + 1 ) % 5);
    }
    
    
    
    
    /**
     * Creates a new Tetromino Object
     * @param name
     * @param items
     * @param posSize
     * @param colSize
     * @param colors
     * @param objectGrid
     * @returns the new created Tetromino with all Parameters
     */
    function tetrominoConstructor(name, items,posSize,colSize, colors, vertexIndices,
    		objectGrid0, objectGrid90, objectGrid180, objectGrid270,  topleft){
    	
	   	var tetromino = new Object();
	   	tetromino = {
	   		name: name,
	   		items: items,
		    posSize: posSize,
		    colSize: colSize,
			colors: colors,
			vertexIndices: vertexIndices,
		    rotationX: 0,
		    rotationAnimateX: 0,
		    rotationY: 0,
		    rotationAnimateY: 0,
		    rotationZ: 0,
		    rotationAnimateZ: 0,
		    position: [getStartX(), getStartY(), getStartZ()], //At default spawnposition
		    positionAnimate: [getStartX(), getStartZ()],
		    
		    //Grid data
		    objectGrid: objectGrid0,
		    objectGrid0: objectGrid0,
		    objectGrid90: objectGrid90,
		    objectGrid180: objectGrid180,
		    objectGrid270: objectGrid270,
		    topleft: topleft, //[x=middle-1, y=top-1, z=depthMiddle-1(z is positive for grid!)]; !Topleft Also saved in spawn()!
		    potentialTopleft: topleft,

		    drawObject: function () {
		    	mat4.rotate(mvMatrix, degToRad(this.rotationAnimateX), [1, 0, 0]);
		    	mat4.rotate(mvMatrix, degToRad(this.rotationAnimateY), [0, 1, 0]);
		    	mat4.rotate(mvMatrix, degToRad(this.rotationAnimateZ), [0, 0, 1]);
		    	
		  	  // Create Element of the default cube by draw only the objectGrid
		    	for(var z=0; z<this.objectGrid.length; z++){
		    		for(var y=0; y<this.objectGrid[z].length; y++){
		    			for(var x=0; x<this.objectGrid[z][y].length; x++){
		    				if(this.objectGrid[z][y][x] == 1){
		    					//Remember the position before
		    					mvPushMatrix();
			    					//draw the default block on a new position
							    	mat4.translate(mvMatrix, [-x, y, z]);
							    	
							    	//console.log(this.position);
							    	gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
							    	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.posSize, gl.FLOAT, false, 0, 0);
							    	
							    	gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
							        gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, this.colSize, gl.FLOAT, false, 0, 0);
							        
							        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
							        setMatrixUniforms();
							        
							        gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
						        mvPopMatrix();
		    				}
		    			}
		    		}
		    	}
		    }
		}
		
    	return tetromino;
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
    var tetrominos = [];
    var defaultBlock;
    function initBuffers() {
    	
    	
	  	  //    v7----- v6
	  	  //   /|      /|
	  	  //  v3------v2|
	  	  //  | |     | |
	  	  //  | |v4---|-|v5
	  	  //  |/      |/
	  	  //  v0------v1
    	// Vertex coordinates for Default Block
//	  	  defaultBlock =[
//		          
//	              // Front face v0-v1-v2-v3
//	             -0.5, -0.5,  0.5, //v0
//	              0.5, -0.5,  0.5, //v1
//	              0.5,  0.5,  0.5, //v2
//	             -0.5,  0.5,  0.5, //v3
//	
//	             // Back face v4-v7-v6-v5
//	             -0.5, -0.5, -0.5, //v4
//	             -0.5,  0.5, -0.5, //v7
//	              0.5,  0.5, -0.5, //v6
//	              0.5, -0.5, -0.5, //v5
//	
//	             // Top face v7-v3-v2-v6
//	             -0.5,  0.5, -0.5,
//	             -0.5,  0.5,  0.5,
//	              0.5,  0.5,  0.5,
//	              0.5,  0.5, -0.5,
//	
//	             // Bottom face v4-v5-v1-v0
//	             -0.5, -0.5, -0.5,
//	              0.5, -0.5, -0.5,
//	              0.5, -0.5,  0.5,
//	             -0.5, -0.5,  0.5,
//	
//	             // Right face v5-v6-v2-v1
//	              0.5, -0.5, -0.5,
//	              0.5,  0.5, -0.5,
//	              0.5,  0.5,  0.5,
//	              0.5, -0.5,  0.5,
//	
//	             // Left face v4-v0-v3-v7
//	             -0.5, -0.5, -0.5,
//	             -0.5, -0.5,  0.5,
//	             -0.5,  0.5,  0.5,
//	             -0.5,  0.5, -0.5];
    	
	  	  //    v7----- v6
	  	  //   /|      /|
	  	  //  v3------v2|
	  	  //  | |     | |
	  	  //  | |v4---|-|v5
	  	  //  |/      |/
	  	  //  v0------v1
  	// Vertex coordinates for Default Block
	  	  defaultBlock =[
	  			          
	  		              // Front face v0-v1-v2-v3
	  		              0.0,-1.0, 0.0, //v0
	  		              1.0,-1.0, 0.0, //v1
	  		              1.0, 0.0, 0.0, //v2
	  		              0.0, 0.0, 0.0, //v3
	  		
	  		             // Back face v4-v7-v6-v5
	  		              0.0,-1.0, -1.0, //v4
	  		              0.0, 0.0, -1.0, //v7
	  		              1.0, 0.0, -1.0, //v6
	  		              1.0,-1.0, -1.0, //v5
	  		
	  		             // Top face v7-v3-v2-v6
	  		              0.0, 0.0, -1.0, //v7
	  		              0.0, 0.0, 0.0, //v3
	  		              1.0, 0.0, 0.0, //v2
	  		              1.0, 0.0, -1.0, //v6
	  		              
	  		             // Bottom face v4-v5-v1-v0
	  		              0.0,-1.0, -1.0, //v4
	  		              1.0,-1.0, -1.0, //v5
	  		              1.0,-1.0, 0.0, //v1
	  		              0.0,-1.0, 0.0, //v0
	  		
	  		             // Right face v5-v6-v2-v1
	  		              1.0,-1.0, -1.0, //v5
	  		              1.0, 0.0, -1.0, //v6
	  		              1.0, 0.0, 0.0, //v2
	  		              1.0,-1.0, 0.0, //v1
	  		
	  		             // Left face v4-v0-v3-v7
	  		              0.0,-1.0, -1.0, //v4
	  		              0.0,-1.0, 0.0, //v0
	  		              0.0, 0.0, 0.0, //v3
	  		              0.0, 0.0, -1.0, //v7
	  		              ];
	  	  
	  	  
    	
    	//Fill the tetrominos array with these 5 Objects
    	initElem_O(); //0
    	initElem_T(); //1
    	initElem_I(); //2
    	initElem_L(); //3
    	initElem_S(); //4
    	
    	
    	
    	//Create all Tetrominos
    	for(var i=0; i<tetrominos.length; i++){
    		var verticesData = [];
        	var colorsData = [];
        	
        	//----Handle the Vertices of an object
        	tetrominos[i].positionBuffer = gl.createBuffer();
        	gl.bindBuffer(gl.ARRAY_BUFFER, tetrominos[i].positionBuffer);
        	
        	//Fill the buffer with the defaultBlock
        	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(defaultBlock), gl.STATIC_DRAW);
        	
        	//----Handle the colors of an object
        	tetrominos[i].colorBuffer = gl.createBuffer();
        	gl.bindBuffer(gl.ARRAY_BUFFER, tetrominos[i].colorBuffer);
            for (var c in tetrominos[i].colors) {
              var color = tetrominos[i].colors[c];
              for (var j=0; j < 4; j++) {
            	  colorsData = colorsData.concat(color);
              }
            }
        	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorsData), gl.STATIC_DRAW); 
        	
        	//----Handle the indices of an object
        	tetrominos[i].indexBuffer = gl.createBuffer();
        	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, tetrominos[i].indexBuffer);
        	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(tetrominos[i].vertexIndices), gl.STATIC_DRAW);
        	tetrominos[i].indexBuffer.itemSize = 1;
        	tetrominos[i].indexBuffer.numItems = 36;
        	
    	}
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
    var elem; //Elem 0=O, 1=T, 2=I, 3=L, 4=S
    var landed = false;
    var scale = 1;
    var perspectiveView = false;
    var toggleGrid = false;
    var removeGrid = false;
    var resetView = false;
    function drawScene() {
        gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        
        //Change perspective with 'P'
        if(perspectiveView)
        	//mat4.perspective(Field of View, height/width-ratio, min. visibility, max. visibility, matrix)
        	mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 200.0, pMatrix);
        else
        	//mat4.ortho(out, left, right, bottom, top, near, far)
        	mat4.ortho(-15.0, 15.0, -15.0, 15.0, 0.1, 100, pMatrix);
        
        //setzte Ursprungspunkt bzw. setzte aktuelle Position/Rotation der Model-view Matrix in die Identity matrix;
        mat4.identity(mvMatrix);	
        
        
        //Standard position for the camera
        mat4.translate(mvMatrix, [-11, -col/2, -50]);
        
        //Standard rotation for the camera
        mat4.rotate(mvMatrix, degToRad(20), [1, 0, 0]);
        mat4.rotate(mvMatrix, degToRad(-45), [0, 1, 0]);
        
        //Change the camera view by mouse (left translation/right rotation)
        if(!resetView){
        	mat4.translate(mvMatrix, [deltaX/10, -1*(deltaY/10), 0]);
        	
        	//Rotate around the center of the grid
        	mat4.translate(mvMatrix, [row/2, col/2, -(row/2)]);		//move to center
        	mat4.rotate(mvMatrix, degToRad(-1*deltaXrotate), [0,1,0]);
        	mat4.rotate(mvMatrix, degToRad(-1*deltaYrotate), [1,0,0]);
        	mat4.translate(mvMatrix, [-row/2, -col/2, (row/2)]);	//reset translation
        }
        else
        	mat4.translate(mvMatrix, [0, 0, 0]);
        
        

        
        
        if(!removeGrid){
        	//Draw globalGrid
	        mvPushMatrix();
	        mat4.scale(mvMatrix, [scale, scale, scale]);
	        for(var i=0; i<drawGrid.length; i++){
	        	
		    	gl.bindBuffer(gl.ARRAY_BUFFER, grid_PositionBuffer);
		    	//Fill the vertices buffer with a single line
		    	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(drawGrid[i]),gl.STATIC_DRAW);
		    	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
		    	
		    	gl.bindBuffer(gl.ARRAY_BUFFER, grid_ColorBuffer);
		        gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, 4, gl.FLOAT, false, 0, 0);
		        setMatrixUniforms();
		        //gl.drawArrays(gl.LINE_LOOP, 0, 16);
		        
		        gl.drawArrays(gl.LINES,0,2);
		        
	        }
	        mvPopMatrix();
	        
	        if(toggleGrid){
	        	createToggleGrid();
	        	//Draw the second part of the whole grid
		        mvPushMatrix();
		        mat4.scale(mvMatrix, [scale, scale, scale]);
		        for(var i=0; i<drawToggleGrid.length; i++){

			    	gl.bindBuffer(gl.ARRAY_BUFFER, grid_PositionBuffer2);
			    	//Fill the vertices buffer with a single line
			    	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(drawToggleGrid[i]),gl.STATIC_DRAW);
			    	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
			    	
			    	gl.bindBuffer(gl.ARRAY_BUFFER, grid_ColorBuffer2);
			        gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, 4, gl.FLOAT, false, 0, 0);
			        setMatrixUniforms();
			        gl.drawArrays(gl.LINES,0,2);
			        
		        }
		        mvPopMatrix();
	        }
        }
        
        
        
        //Draw already landed Objects
	        if(landedElems.length != 0){
	        	
	        	for(var i=0; i<landedElems.length; i++){
	        		//initCopy(landedElems[i]); //Initializing the buffer of the copied elements in the arrays
	        		mvPushMatrix();
	        		mat4.translate(mvMatrix, landedElems[i].position);
	        		landedElems[i].drawObject();
			        mvPopMatrix();
	        	}
	        }
        
        
        if(checkSpawnPosition()){
	        //Create random objectID
	        if(landed){
			//elem = randomGenerator(); //**DEBUGING: Set a number between 0-4 for random Tetromino
	        	elem=2 //****DEBUG*****
			landed = false;
	        }
	        //Spawn a new Object
	        if(!landed)
	        	spawn(elem);
	        	
        }else
        	gameOver();
        
        
        
    }

    
    /**
     * Show a window box where one can choose to restart the game or do nothing 
     */
    function gameOver(){

        var x;
        if (confirm("GAME OVER! Restart?") == true) 
        	//OK Button pressed => restart
        	restart();
        else
           //CANCEL pressed => do nothing
        	grav = false;
        	resetGrid();
        	 setMessages("GAME OVER: Restart the Game!");
    }
    	
    /**
     * reset the globalGrid and delete the landed Elements
     */
    function restart(){
    	landedElems=[];
    	resetGrid();
    	score = 0;
        grav = false;
        setGravSpeed(0.05);
        resetCurrentElem();
        setMessages("Hit 'W' to start!");
    }
    
    /**
     * Reset all Data of the current Object to default settings
     */
    function resetCurrentElem(){
    	//Reset data of the original object to the standard settings and position
		tetrominos[elem].position = [getStartX(), getStartY(), getStartZ()]; 
		tetrominos[elem].positionAnimate[0] = getStartX();
		tetrominos[elem].positionAnimate[1] = getStartZ();
		tetrominos[elem].rotationX = 0;
		tetrominos[elem].rotationAnimateX = 0;
		tetrominos[elem].rotationY = 0;
		tetrominos[elem].rotationAnimateY = 0;
		tetrominos[elem].rotationZ = 0;
		tetrominos[elem].rotationAnimateZ = 0;
		tetrominos[elem].objectGrid = tetrominos[elem].objectGrid0;
		
		//Reset topleft
		if(elem == 0) //O
    		tetrominos[elem].topleft = [row/2, col-(col-1), (row/2)-1];
		if(elem == 1) //T
    		tetrominos[elem].topleft = [row/2-2,col-(col-1), (row/2)-1];
		if(elem == 2) //I
    		tetrominos[elem].topleft = [row/2-2, col-col, (row/2)-1];
		if(elem == 3) //L
    		tetrominos[elem].topleft = [row/2-2,col-col, (row/2)-1];
		if(elem == 4) //S
    		tetrominos[elem].topleft = [row/2-1,col-(col-1),-(row/2)-1];

    	tetrominos[elem].potentialTopleft = tetrominos[elem].topleft;
    	
    }
    
    
    
    /**
     * Spawn a Tetromino at the top of the GolablGrid
     * go back if the element reached the bottom
     */
    var landedElems = [];
    function spawn(elem){
    	
    	mat4.scale(mvMatrix, [scale, scale, scale]);
    	//Start position at [8,18,-8] in default setting, or in general [row/2, col-2, -(row/2)]
    	mat4.translate(mvMatrix, tetrominos[elem].position);
    	
    	//If at the spawn position is already an object, do not draw any more ojects
    	if(!landed){
    		//Check if element landed
    		if(checkGrid(elem) == false)
    			landed = true;
    		else
    			drawElem(elem);
    	}
    	
    	if(landed){
    		//Make a hardcopy of elem and save it in landedElems and in the globalGrid
    		var copy = copyObject(tetrominos[elem]);
    		landedElems.push(copy);
    		
    		//Reset current elem data
    		resetCurrentElem();
	    	
    		setGravSpeed(0.05);
    		checkFullRow();
    	}
	}
    
    
    /**
     * Draws the requested element
     * 0=O, 1=T, 2=I, 3=L, 4=S 
     */
    function drawElem(elem){
    	
    	mvPushMatrix();
    	tetrominos[elem].drawObject();
    	mvPopMatrix();
    }
    

    
    /**
     * Returns a deep copy of the committed object
     * @param obj
     */
    function copyObject(orig){
    	var copy = tetrominoConstructor( orig.name, orig.items, orig.posSize, orig.colSize, orig.colors,  orig.vertexIndices,
    			orig.objectGrid0, orig.objectGrid90, orig.objectGrid180, orig.objectGrid270,  orig.topleft);
    	copy.rotationX = orig.rotationX;
    	copy.rotationAnimateX = orig.rotationAnimateX;
    	copy.rotationY = orig.rotationY;
    	copy.rotationAnimateY = orig.rotationAnimateY;
    	copy.rotationZ = orig.rotationZ;
    	copy.rotationAnimateZ = orig.rotationAnimateZ;
    	copy.position = orig.position;
    	copy.positionAnimate = orig.positionAnimate;
    	copy.objectGrid = orig.objectGrid;
        topleft = topleft;
        potentialTopleft = topleft;
    	initCopy(copy);
    	console.log("Copied"); //*****DEBUG****
    	return copy;
    }
    
    
    function initCopy(copy){
    	var verticesData = [];
    	var colorsData = [];
       	copy.positionBuffer = gl.createBuffer();
    	gl.bindBuffer(gl.ARRAY_BUFFER, copy.positionBuffer);
    	//vertices
    	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(defaultBlock), gl.STATIC_DRAW);
    	//color
    	copy.colorBuffer = gl.createBuffer();
    	gl.bindBuffer(gl.ARRAY_BUFFER, copy.colorBuffer);
        for (var c in copy.colors) {
            var color = copy.colors[c];
            for (var j=0; j < 4; j++) {
          	  colorsData = colorsData.concat(color);
            }
          }
    	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorsData), gl.STATIC_DRAW); 
    	//indices
    	copy.indexBuffer = gl.createBuffer();
    	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, copy.indexBuffer);
    	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(copy.vertexIndices), gl.STATIC_DRAW);
    	copy.indexBuffer.itemSize = 1;
    	copy.indexBuffer.numItems = 36;
    }
    
    
    
    /**
     * Move the object in y-axis (visual and in the grid)
     */
    var gravSpeed = 0.05
    var grav = false;
    function gravity(){
    	
    	
    	//Column - current y-position - from the middle
    	var tmp = col - Math.round(tetrominos[elem].position[1]);
    	//Check if there are two or just one block above the middle
    	if(tetrominos[elem].objectGrid.length >= 3)
    		tmp-=2;
    	else
    		tmp-=1;
    	
    	tetrominos[elem].potentialTopleft[1] = tmp; //Move in the grid
    	
    	if(checkGrid(elem) == true){
    		//No colission
    		tetrominos[elem].topleft[1] = tetrominos[elem].potentialTopleft[1];
    		tetrominos[elem].position[1] -= gravSpeed;	//Move the visual object
    	}else{
    		//console.log("potential: " + tetrominos[elem].potentialTopleft);
    		//console.log("lastposition nonround: " + tetrominos[elem].position);
    		
    		tetrominos[elem].position[1] = Math.round(tetrominos[elem].position[1]);
    		
    		//console.log("lastposition round: " + tetrominos[elem].position);
    		landed = false;
    	}
    }
    
    
    
    
    /**
     * Increase or reduce the rotation with the value 5
     */
    function transformationAnimation(){
    	
		/*
		 * Rotation Animation
		 */
        if(tetrominos[elem].rotationAnimateX != tetrominos[elem].rotationX){
            if(!clockwise)
            	tetrominos[elem].rotationAnimateX += 5;
            else
            	if(clockwise)
            		tetrominos[elem].rotationAnimateX -= 5;
        }
        if(tetrominos[elem].rotationAnimateY != tetrominos[elem].rotationY){
            if(!clockwise)
            	tetrominos[elem].rotationAnimateY += 5;
            else
            	if(clockwise)
            		tetrominos[elem].rotationAnimateY -= 5;
        }
        if(tetrominos[elem].rotationAnimateZ != tetrominos[elem].rotationZ){
            if(!clockwise)
            	tetrominos[elem].rotationAnimateZ += 5;
            else
            	if(clockwise)
            		tetrominos[elem].rotationAnimateZ -= 5;
        }
        
        
        /*
         * Translation Animation
         */
        //If the new Position is different with the current Position, +- 0.05 to X-axis until new postion is arrived in the inverval: [-0.05 < x < 0.05]
        if(checkGrid(elem)){
	        if(! ( (tetrominos[elem].positionAnimate[0]-0.05) < tetrominos[elem].position[0] && tetrominos[elem].position[0] < (tetrominos[elem].positionAnimate[0]+0.05)) ){
	            if(directionX == 1)
	            	tetrominos[elem].position[0] -= 0.1;
	            else
	            	if(directionX == 3)
	            		tetrominos[elem].position[0] += 0.1;
	        }
	        
	      //If the new Position is different with the current Position, +- 0.05 to Z-axis until new postion arrived in the inverval: [-0.05 < z < 0.05]
	        if(! ( (tetrominos[elem].positionAnimate[1]-0.05) < tetrominos[elem].position[2] && tetrominos[elem].position[2] < (tetrominos[elem].positionAnimate[1]+0.05)) ){
	            if(directionZ == 1)
	            	tetrominos[elem].position[2] -= 0.1;
	            else
	            	if(directionZ == 3)
	            		tetrominos[elem].position[2] += 0.1;
	        }
        }
        
        //Round the positions
        if( ( (tetrominos[elem].positionAnimate[0]-0.05) < tetrominos[elem].position[0] && tetrominos[elem].position[0] < (tetrominos[elem].positionAnimate[0]+0.05)) )
        	tetrominos[elem].position[0] = Math.round(tetrominos[elem].position[0]);
        
        if( ( (tetrominos[elem].positionAnimate[1]-0.05) < tetrominos[elem].position[2] && tetrominos[elem].position[2] < (tetrominos[elem].positionAnimate[1]+0.05)) )
        	tetrominos[elem].position[2] = Math.round(tetrominos[elem].position[2]);
    }
    
    

    
    
    /**
     * 	Animate any movement
     */
    var lastTime = 0;
    function animate() {
    	var timeNow = new Date().getTime()
    	if (lastTime != 0) {
    		var elapsed = timeNow - lastTime;
    		
    		transformationAnimation();	
    		
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

    function gridBigger(){
    	if(col <= 22 && row <= 18){
	    	col += 2;
	    	row += 2;
	    	createGrid();
	    	restart();
    	}
    }
    
    function gridSmaller(){
    	if(row > 4){
	    	col -= 2;
	    	row -= 2;
	    	createGrid();
	    	restart();
    	}
    }
    function defaultGrid(){
    	col = 20
    	row = 16;
    	createGrid();
    	restart();
    }
    	
	function showValue(newValue)
	{
		scale = document.getElementById("range").innerHTML=newValue;
	}
    
	function setScore(){
		document.getElementById("score").value = score;
	}
	function setMessages(str){
		document.getElementById("messages").value = str;
	}
    /** 
     * 	Initialisiert WebGL, den Vertex- und den Fragmentshader, sowie die Buffer fuer die Eckpunkte und Farbwerte, 
     * behandelt Tastatureingaben und wiederholt das Programm
     *   
     */

	//Default position at [8,18,-8] or in general [row/2, col-2, -(row/2)]
	function getStartX(){
		startX = (row/2);
		return startX;
	}
	function getStartY(){
		startY = (col-3);
		return startY;
	}
	function getStartZ(){
		startZ = -(row/2);
		return startZ;
	}
	function setGravSpeed(value){
		gravSpeed = value;
	}
	function turnGravOn(){
		setMessages(" ");
		if(grav)
			grav = false;
		else
			grav = true;
	}
	var startX;
	var startY;
	var score = 0;
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
        
        canvas.onmousedown = handleMouseDown;
        document.onmouseup = handleMouseUp;
        document.onmousemove = handleMouseMove;
        
        elem = randomGenerator();
        elem=2 //****DEBUG*****
        setScore();
    	startX=(row/2);
    	startY=(col-2);
    	startZ = -(row/2);
    	setMessages("Hit 'W' to start!");
    	//alert("Hit 'W' to start!");
        tick();
        
    }

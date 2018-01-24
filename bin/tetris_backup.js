
 
    
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
        
        //Erstelle das Attribut VertexPosition im Shader-Programm und aktiviere es
        shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
        gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

        //Erstelle das Attribut aVertexColor im Shader-Programm und aktiviere es
        shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
        gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);
        
        //Erstelle das Attribut aPointSize im Shader-Programm
        shaderProgram.pointSize = gl.getAttribLocation(shaderProgram, "aPointSize");
        
        //uniform deklaration = aehnlich einer globalen Variable welche veraendert werden kann
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
    
    /**
     * Definiere die Objekte mithilfer ihrer Eckpunkte
     * Fuelle GraKa Buffer mit informationen uber die gewuenschten Objekte
     */
    var triangleVertexPositionBuffer;
    var triangleVertexColorBuffer;
    
    var squareVertexPositionBuffer;
    var squareVertexColorBuffer;
    
    var elem2VertexPositionBuffer;
    var elem2VertexColorBuffer;
    function initBuffers() {
        /* 
         *		Speichere Dreieck in Grafikkarte --------  DIESES TESTOBJEKT WIRD IN NAECHSTER VERSION ENTFERNT
         */
        	
        	//Erstelle Buffer und weise folgende Operationen diesen Buffer zu (aktueller Array Buffer)
            triangleVertexPositionBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
            
            //Angabe der Eckpunte (Vertices) des Dreiecks als Javascript list 
            //Attribut
            var vertices = [
                 0.0,  1.0,  0.0,
                -1.0, -1.0,  0.0,
                 1.0, -1.0,  0.0
            ];
            
            //Wandle die Liste um fuer den WebGL Buffer
//            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
//            triangleVertexPositionBuffer.itemSize = 3;
//            triangleVertexPositionBuffer.numItems = 3;

            //Speichere die Farbwerte
            triangleVertexColorBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexColorBuffer);
            var colors = [
                1.0, 0.0, 0.0, 1.0,
                1.0, 1.0, 0.0, 1.0,
                1.0, 0.0, 1.0, 1.0
            ];
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
            triangleVertexColorBuffer.itemSize = 4;
            triangleVertexColorBuffer.numItems = 3;
        
        
     /*
      * 	Speichere element 1 (Block) in Grafikkarte
      */
        squareVertexPositionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
        
        //4x - x,y,z
        vertices = [
            -0.2,  0.0,  0.0,
             0.0,  0.0,  0.0,
             0.0,  0.2,  0.0,
            -0.2,  0.2,  0.0
        ];
        
//        var test = gl.getAttribLocation(shaderProgram, "aPointSize");
//        if(test == 2){
//        	alert("PointSize has changed!");
//        }
        
        //Schreibe die aktuellen Eckpunte in den WebGL Buffer
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        squareVertexPositionBuffer.itemSize = 3;	//3 Achsen
        squareVertexPositionBuffer.numItems = 4;	//4 Elemente
        
      //Speichere die Farbwerte
        squareVertexColorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexColorBuffer);
        colors = []
        for (var i=0; i < 4; i++) {
          colors = colors.concat([0.0, 0.2, 1.0, 1.0]);
        }
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
        squareVertexColorBuffer.itemSize = 4;
        squareVertexColorBuffer.numItems = 4;
        

        /*
         * 	Speichere element 2 in Grafikkarte
         */
        elem2VertexPositionBuffer = gl.createBuffer();
           gl.bindBuffer(gl.ARRAY_BUFFER, elem2VertexPositionBuffer);
           
           //4x - x,y,z
           vertices = [
                0.0,  0.2,  0.0,
                0.0,  0.0,  0.0,
                0.2,  0.0,  0.0,
               -0.2,  0.0,  0.0
           ];
           
           gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
           elem2VertexPositionBuffer.itemSize = 3;
           elem2VertexPositionBuffer.numItems = 4;
           
         //Erzeuge einfaerbige Objekte in dem alle Pixel  in einer Schleife eingefaerbt werden
           elem2VertexColorBuffer = gl.createBuffer();
           gl.bindBuffer(gl.ARRAY_BUFFER, elem2VertexColorBuffer);
           colors = []
           for (var i=0; i < 4; i++) {
             colors = colors.concat([1.0, 0.0, 0.0, 1.0]);
           }
           gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
           elem2VertexColorBuffer.itemSize = 4;
           elem2VertexColorBuffer.numItems = 4;        
        
    }


   
    
    
    function rotation(angle){
    	
    	var rotX = Math.cos(angle);
    	var rotY;
    	
    }
    
    
    /**
     * Zeichnet die Szene inklusive den Objekten
     */
    var rotationTri = 0;
    var rotationSquare = 0;
    var rotationElem2 = 0;
    var rotationElem2old = 0;
    var translationTri = [-1.5, 0.0, -7.0];
    var translationSquare = [2.0, 1.0, 0.0];
    var translationElem2 = [2.5, -1.0, 0.0];
    function drawScene() {
        gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        
        
        //Angaben zur Perspektive: (Field of View (Blickfeld in Grad), Hoehe/Breite-Verhaeltnis, min. Sichtweite, max. Sichtweite)
        //Speichere in pMatrix
        mat4.perspective(55, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);
	
        //setzte Ursprungspunkt bzw. setzte aktuelle Position/Rotation der Model-view Matrix in die Identity matrix;
        mat4.identity(mvMatrix);								

        /*
         *  --------Zeichne das Dreieck------------
         */
           
           //---Verschiebe das Objekt vom Ausgangspunkt aus---
           //Multipliziere die gegebene Matrix mit einem Translationsvektor (-1.5x,0y,-7z)
           mat4.translate(mvMatrix, translationTri);
           
           //Aendere Rotationswert der ModelView Matrix; Mittels PushMatrix wird die ModelViewMatrix zwischengespeichert;
           //Vertikal durch den Mittelpunkt
           mvPushMatrix();
           mat4.rotate(mvMatrix, degToRad(rotationTri), [0, 1, 0]);
           
           
           //Waehle den Farbuffer fuer das Dreieck
           gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexColorBuffer);
           gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, triangleVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
           
           
           //Waehle den Buffer aus und das Dreieck
           gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
           gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, triangleVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
           
           //Wandle die Daten von Javascript fuer die Grafikkarte (WebGL) um
           setMatrixUniforms();
           gl.drawArrays(gl.TRIANGLES, 0, triangleVertexPositionBuffer.numItems);

           mvPopMatrix();
        
        
     /*
      *  --------Zeichne das Element 1 (Block)------------
      */  
        
     	////Multipliziere die gegebene Matrix mit einer Translationsmatrix (-1.5x,0y,-7z)
        //Beispiel Lesson 1: Bewege Model-View Matrix 3 Einheiten nach rechts (Ausgangspunkt 1.5 links und 7 weg vom Screen)
        mat4.translate(mvMatrix, translationSquare);
        
        //Aendere Rotationswert der ModelView Matrix; PushMatrix zwischenspeichert die ModelViewMatrix;
        //Rotation horizontal durch den Mittelpunkt (1=horizontal, 2=vertikal)
        mvPushMatrix();
        mat4.rotate(mvMatrix, degToRad(rotationSquare), [1, 0, 0]);
        
        //Waehle den Farbuffer fuer das Dreieck
        gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexColorBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, squareVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
        
        //Waehle den Buffer aus und das Dreieck
        gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, squareVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
        
        //Wandle die Daten von Javascript fuer die Grafikkarte (WebGL) um
        //Zeichne das Element
        setMatrixUniforms();
        gl.drawArrays(gl.POINTS, 0, squareVertexColorBuffer.numItems);
        
        mvPopMatrix();
        
        
        /*
         *  --------Zeichne das Element 2 ------------ 
         */  
           //Verschiebe das Objekt
           mat4.translate(mvMatrix, translationElem2);
           
           mvPushMatrix();
           mat4.rotate(mvMatrix, degToRad(rotationElem2old), [0, 0, 1]);
           
           //Waehle den Farbuffer fuer das Dreieck
           gl.bindBuffer(gl.ARRAY_BUFFER, elem2VertexColorBuffer);
           gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, elem2VertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
           
           //Waehle den Buffer aus und das Dreieck
           gl.bindBuffer(gl.ARRAY_BUFFER, elem2VertexPositionBuffer);
           gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, elem2VertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
           
           //Zeichne das Element
           setMatrixUniforms();	//Uebergib Matrix an Shader
           gl.drawArrays(gl.POINTS, 0, elem2VertexColorBuffer.numItems);
           
           mvPopMatrix();
    }

    

    /**
     * Erstelle einen Hashtable: Jede Keyboardtaste wird einem KeyCode zugeordnet
     * HandleKeyDown: Aktion wenn eine Taste gedrueckt wird
     * HandleKeyDown: Aktion wenn eine Taste losgelassen wird
     * direction 1/2: counterclockwise/clockwise
     */
    var currentlyPressedKeys = {};
    var xSpeed = 0.05;
    var direction = 0;
    function handleKeyDown(event) {
      currentlyPressedKeys[event.keyCode] = true;
      
      //Ausgabe des zugehoerigen KeyCodes einer Taste: 
      		//alert(String.fromCharCode(event.keyCode));
      
      if ( String.fromCharCode(event.keyCode) == "%" || String.fromCharCode(event.keyCode) == "L") {
    	  //Cursor LEFT
    	  event.preventDefault();
    	  translationElem2[0] -= xSpeed;
      }
      if ( String.fromCharCode(event.keyCode) == "'" || String.fromCharCode(event.keyCode) == "R") {
    	  //Cursor RIGHT
    	  event.preventDefault();
    	  translationElem2[0] += xSpeed;
      }
      if ( String.fromCharCode(event.keyCode) == "&" || String.fromCharCode(event.keyCode) == "U") {
    	  //Cursor UP
    	  event.preventDefault();
    	  translationElem2[1] += xSpeed;
      }
      if ( String.fromCharCode(event.keyCode) == "(" || String.fromCharCode(event.keyCode) == "D") {
    	  //Cursor DOWN
    	  event.preventDefault();
    	  translationElem2[1] -= xSpeed;
      }

      if ( String.fromCharCode(event.keyCode) == "1") {
    	  rotationElem2 += 90;
    	  direction = 1;
      }
      if ( String.fromCharCode(event.keyCode) == "3") {
    	  rotationElem2 -= 90;
    	  direction = 2;
      }
      if ( String.fromCharCode(event.keyCode) == "4") {
    	  gl.vertexAttrib1f(shaderProgram.pointSize, 10.0);
      }
      if ( String.fromCharCode(event.keyCode) == "5") {
    	  gl.vertexAttrib1f(shaderProgram.pointSize, 20.0);
      }
      if ( String.fromCharCode(event.keyCode) == "6") {
    	  gl.vertexAttrib1f(shaderProgram.pointSize, 40.0);
      }
      if ( String.fromCharCode(event.keyCode) == "7") {
    	  gl.vertexAttrib1f(shaderProgram.pointSize, 60.0);
      }
      if ( String.fromCharCode(event.keyCode) == "I") {
    	  alert(xSpeed);
      }
      if ( String.fromCharCode(event.keyCode) == "O") {
    	  alert(rotationElem2old);
      }
      if ( String.fromCharCode(event.keyCode) == "P") {
    	  alert(rotationElem2);
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
    

    
    /**
     * 	Fuehrt eine Animation aus, wenn der Zielwinkel noch nicht erreicht wurde
     */
    var lastTime = 0;
    function animate() {
        var timeNow = new Date().getTime();
        
        if(rotationElem2 != rotationElem2old){
	        if (lastTime != 0) {
	            var elapsed = timeNow - lastTime;
	            
	            if(direction == 1)
	            	rotationElem2old += 5;
	            else
	            	if(direction == 2)
	            	rotationElem2old -= 5;
	        }
	        lastTime = timeNow;
        }
    
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
        initBuffers();
        
        gl.vertexAttrib1f(shaderProgram.pointSize, 20.0);	//Setzte die default Punktgroesse auf 20px 
        gl.clearColor(0.0, 0.0, 0.0, 0.0);
        gl.enable(gl.DEPTH_TEST);

        document.onkeydown = handleKeyDown;
        document.onkeyup = handleKeyUp;
        
        tick();
        
    }

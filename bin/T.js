/**
 * 	T-Element
 * 	A row of three blocks with one added below the center
 */
    var T_PositionBuffer;
    var T_ColorBuffer;
    var T_rotation = 0;
    var T_rotationOld = 0;
    var T_translation = [0.0, 0.0, 0.0];
    
    function initT() {
    	// Create a buffer object
    	T_PositionBuffer = gl.createBuffer();
    	// Bind the buffer object to the ARRAY_BUFFER (target)
        gl.bindBuffer(gl.ARRAY_BUFFER, T_PositionBuffer);
        var vertices = [
            -0.5,  0.0,  0.0,	//v0 	*unterer 4er Block - anfang
            -0.5, -1.0,  0.0,	//v1    *       
             0.5,  0.0,  0.0,	//v2	*
             0.5, -1.0,  0.0,	//v3	*
            -0.5,  0.0,  0.0,	//v4 	*unterer 4er Block - ende
            -1.5,  1.0,  0.0,	//v5 	links oben
            -1.5,  0.0,  0.0,	//v6 
            -0.5,  1.0,  0.0,	//v7
            -0.5,  0.0,  0.0,	//v8
             0.5,  1.0,  0.0,	//v9
             0.5,  0.0,  0.0,	//v10
             1.5,  1.0,  0.0,	//v11
             1.5,  0.0,  0.0,	//v12 	rechts unten
        ];
        
        //Write Data into a Buffer Object (Float32Array is optimized for large quantities of data of the same type)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        T_PositionBuffer.itemSize = 3;
        T_PositionBuffer.numItems = 13;

        T_ColorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, T_ColorBuffer);
        var colors = [
                  0.0, 0.6, 0.0, 1.0, 	//v0
                  0.0, 0.6, 0.0, 1.0,	//v1
                  0.0, 0.7, 0.0, 1.0,	//v2
                  0.0, 0.8, 0.0, 1.0,	//v3
                  0.0, 0.5, 0.0, 1.0,	//v4
                  0.0, 0.4, 0.0, 1.0,	//v5
                  0.0, 0.4, 0.0, 1.0,	//v6
                  0.0, 0.4, 0.0, 1.0,	//v7
                  0.0, 0.5, 0.0, 1.0,	//v8
                  0.0, 0.6, 0.0, 1.0,	//v9
                  0.0, 0.7, 0.0, 1.0,	//v10
                  0.0, 0.8, 0.0, 1.0,	//v11
                  0.0, 0.9, 0.0, 1.0,	//v12
              ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
        T_ColorBuffer.itemSize = 4;
        T_ColorBuffer.numItems = 13;
        
    }
    
    
    
    
    
    function drawT(){
    	mat4.translate(mvMatrix, T_translation);
        mat4.rotate(mvMatrix, degToRad(T_rotationOld), [0, 0, 1]);

        gl.bindBuffer(gl.ARRAY_BUFFER, T_PositionBuffer);
        //Assign the Buffer Object to the Attribute Variable 'vertexPositionAttribute' which is then again assigning to 'aVertexPosition'
        //gl.vertexAttribPointer(location, size, type, normalized, stride, offset)
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, T_PositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, T_ColorBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, T_ColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

        setMatrixUniforms();
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, T_PositionBuffer.numItems);
    	
    }
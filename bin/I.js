/**
 *  I-Element
 *  Four blocks in a straight line
 */
    var I_PositionBuffer;
    var I_ColorBuffer;
    var I_rotation = 0;
    var I_rotationOld = 0;
    var I_translation = [0.0, 0.0, 0.0];
    
    function initI() {
    	// Create a buffer object
    	I_PositionBuffer = gl.createBuffer();
    	// Bind the buffer object to the ARRAY_BUFFER (target)
        gl.bindBuffer(gl.ARRAY_BUFFER, I_PositionBuffer);
        var vertices = [
            -2.0,  0.5,  0.0,	//v0
            -2.0, -0.5,  0.0,	//v1
            -1.0,  0.5,  0.0,	//v2
            -1.0, -0.5,  0.0,	//v3
             0.0,  0.5,  0.0,	//v4		Mitte oben
             0.0, -0.5,  0.0,	//v5		Mitte unten
             1.0,  0.5,  0.0,	//v6
             1.0, -0.5,  0.0,	//v7
             2.0,  0.5,  0.0,	//v8
             2.0, -0.5,  0.0	//v9
        ];
        
        //Write Data into a Buffer Object (Float32Array is optimized for large quantities of data of the same type)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        I_PositionBuffer.itemSize = 3;
        I_PositionBuffer.numItems = 10;

        I_ColorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, I_ColorBuffer);
        var colors = [
                  0.3, 0.0, 0.0, 1.0, 	//v0
                  0.3, 0.0, 0.0, 1.0,	//v1
                  0.3, 0.0, 0.0, 1.0,	//v2
                  0.4, 0.0, 0.0, 1.0,	//v3
                  0.4, 0.0, 0.0, 1.0,	//v4
                  0.5, 0.0, 0.0, 1.0,	//v5
                  0.7, 0.0, 0.0, 1.0,	//v6
                  0.8, 0.0, 0.0, 1.0,	//v7
                  0.9, 0.0, 0.0, 1.0,	//v8
                  1.0, 0.0, 0.0, 1.0	//v9
              ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
        I_ColorBuffer.itemSize = 4;
        I_ColorBuffer.numItems = 10;
        
    }
    
    
    
    
    
    function drawI(){
    	mat4.translate(mvMatrix, I_translation);
        mat4.rotate(mvMatrix, degToRad(I_rotationOld), [0, 0, 1]);

        gl.bindBuffer(gl.ARRAY_BUFFER, I_PositionBuffer);
        //Assign the Buffer Object to the Attribute Variable 'vertexPositionAttribute' which is then again assigning to 'aVertexPosition'
        //gl.vertexAttribPointer(location, size, type, normalized, stride, offset)
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, I_PositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, I_ColorBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, I_ColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

        setMatrixUniforms();
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, I_PositionBuffer.numItems);
    	
    }
/**
 *  L-Element
 *  A row of three blocks with one added below the right side.
 */
    var L_PositionBuffer;
    var L_ColorBuffer;
    var L_rotation = 0;
    var L_rotationOld = 0;
    var L_translation = [0.0, 0.0, 0.0];
    
    function initL() {
    	// Create a buffer object
    	L_PositionBuffer = gl.createBuffer();
    	// Bind the buffer object to the ARRAY_BUFFER (target)
        gl.bindBuffer(gl.ARRAY_BUFFER, L_PositionBuffer);
        var vertices = [
                     //Top block
                    -0.5, 2.0, 0.0,
                    -0.5, 1.0, 0.0,
                     0.5, 2.0, 0.0,
                     0.5, 1.0, 0.0,
                    
	                 //Second top block
	                 -0.5, 1.0, 0.0,
	                 -0.5, 0.0, 0.0,
	                  0.5, 1.0, 0.0,
	                  0.5, 0.0, 0.0,
	                  
	                  //Lower middle block
	                  -0.5, 0.0, 0.0,
	                  -0.5,-1.0, 0.0,
	                   0.5, 0.0, 0.0,
	                   0.5,-1.0, 0.0,
	                   
	                   //Lower right block
	                   0.5, 0.0, 0.0,
	                   0.5,-1.0, 0.0,
	                   1.5, 0.0, 0.0,
	                   1.5,-1.0, 0.0
                    
        ];
        
        //Write Data into a Buffer Object (Float32Array is optimized for large quantities of data of the same type)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        L_PositionBuffer.itemSize = 3;
        L_PositionBuffer.numItems = 16;

        L_ColorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, L_ColorBuffer);
        var colors = [
                      //Top block
                       0.2, 0.2, 0.0, 1.0,
                       0.2, 0.2, 0.0, 1.0,
                       0.3, 0.3, 0.0, 1.0,
                       0.4, 0.4, 0.0, 1.0,
                      
                       //Second top block
                       0.4, 0.4, 0.0, 1.0,
                       0.4, 0.4, 0.0, 1.0,
                       0.4, 0.4, 0.0, 1.0,
                       0.4, 0.4, 0.0, 1.0,
                        
                      //Lower middle block
                       0.4, 0.4, 0.0, 1.0,
                       0.5, 0.5, 0.0, 1.0,
                       0.6, 0.6, 0.0, 1.0,
                       0.6, 0.6, 0.0, 1.0,
                         
                       //Lower right block
                       0.5, 0.5, 0.0, 1.0,
                       0.6, 0.6, 0.0, 1.0,
                       0.7, 0.7, 0.0, 1.0,
                       0.8, 0.8, 0.0, 1.0,
              ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
        L_ColorBuffer.itemSize = 4;
        L_ColorBuffer.numItems = 16;
        
    }
    
    
    
    
    
    function drawL(){
    	mat4.translate(mvMatrix, L_translation);
        mat4.rotate(mvMatrix, degToRad(L_rotationOld), [0, 0, 1]);

        gl.bindBuffer(gl.ARRAY_BUFFER, L_PositionBuffer);
        //Assign the Buffer Object to the Attribute Variable 'vertexPositionAttribute' which is then again assigning to 'aVertexPosition'
        //gl.vertexAttribPointer(location, size, type, normalized, stride, offset)
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, L_PositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, L_ColorBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, L_ColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

        setMatrixUniforms();
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, L_PositionBuffer.numItems);
    	
    }
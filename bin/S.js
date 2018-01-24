/**
 * 	S-Element
 * 	Two stacked horizontal dominos with the top one offset to the right.
 */
    var S_PositionBuffer;
    var S_ColorBuffer;
    var S_rotation = 0;
    var S_rotationOld = 0;
    var S_translation = [0.0, 0.0, 0.0];
    
    function initS() {
    	// Create a buffer object
    	S_PositionBuffer = gl.createBuffer();
    	// Bind the buffer object to the ARRAY_BUFFER (target)
        gl.bindBuffer(gl.ARRAY_BUFFER, S_PositionBuffer);
        var vertices = [
                        
                        //Lower left block
                        -1.5, 0.0, 0.0,
                        -1.5,-1.0, 0.0,
                        -0.5, 0.0, 0.0,
                        -0.5,-1.0, 0.0,
                        
                        //Lower middle block
                        -0.5, 0.0, 0.0,
                        -0.5,-1.0, 0.0,
                         0.5, 0.0, 0.0,
                         0.5,-1.0, 0.0,
                         
                         //Higher middle block
                         -0.5, 1.0, 0.0,
                         -0.5, 0.0, 0.0,
                          0.5, 1.0, 0.0,
                          0.5, 0.0, 0.0,
                          
                          //Higher right block
                          0.5, 1.0, 0.0,
                          0.5, 0.0, 0.0,
                          1.5, 1.0, 0.0,
                          1.5, 0.0, 0.0
                      
                        
        ];
        
        //Write Data into a Buffer Object (Float32Array is optimized for large quantities of data of the same type)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        S_PositionBuffer.itemSize = 3;
        S_PositionBuffer.numItems = 16;

        S_ColorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, S_ColorBuffer);
        var colors = [
                      //Lower left block
                       0.0, 0.4, 0.4, 1.0,
                       0.0, 0.4, 0.4, 1.0,
                       0.0, 0.5, 0.5, 1.0,
                       0.0, 0.5, 0.5, 1.0,
                      
                      //Lower middle block
                       0.0, 0.5, 0.5, 1.0,
                       0.0, 0.5, 0.5, 1.0,
                       0.0, 0.6, 0.6, 1.0,
                       0.0, 0.6, 0.6, 1.0,
                       
                       //Higher middle block
                       0.0, 0.6, 0.6, 1.0,
                       0.0, 0.7, 0.7, 1.0,
                       0.0, 0.7, 0.7, 1.0,
                       0.0, 0.7, 0.7, 1.0,
                        
                        //Higher right block
                       0.0, 0.7, 0.7, 1.0,
                       0.0, 0.7, 0.7, 1.0,
                       0.0, 0.8, 0.8, 1.0,
                       0.0, 0.9, 0.9, 1.0,                
                      
              ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
        S_ColorBuffer.itemSize = 4;
        S_ColorBuffer.numItems = 16;
        
    }
    
    
    
    
    
    function drawS(){
    	mat4.translate(mvMatrix, S_translation);
        mat4.rotate(mvMatrix, degToRad(S_rotationOld), [0, 0, 1]);

        gl.bindBuffer(gl.ARRAY_BUFFER, S_PositionBuffer);
        //Assign the Buffer Object to the Attribute Variable 'vertexPositionAttribute' which is then again assigning to 'aVertexPosition'
        //gl.vertexAttribPointer(location, size, type, normalized, stride, offset)
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, S_PositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, S_ColorBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, S_ColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

        setMatrixUniforms();
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, S_PositionBuffer.numItems);
    	
    }
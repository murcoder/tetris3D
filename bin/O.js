/**
 * 	O-Element
 * 	Four blocks in a 2×2 square
 */
    var O_PositionBuffer;
    var O_ColorBuffer;
    var O_rotation = 0;
    var O_rotationOld = 0;
    var O_translation = [0.0, 0.0, 0.0];
    
    function initO() {
    	// Create a buffer object
    	O_PositionBuffer = gl.createBuffer();
    	// Bind the buffer object to the ARRAY_BUFFER (target)
        gl.bindBuffer(gl.ARRAY_BUFFER, O_PositionBuffer);
        var vertices = [
            
            //Upper left block           
            -1.0,  1.0,  0.0,
            -1.0,  0.0,  0.0,
             0.0,  1.0,  0.0,
             0.0,  0.0,  0.0,
            
           //Upper right block
             0.0,  1.0,  0.0,
             0.0,  0.0,  0.0,
             1.0,  1.0,  0.0,
             1.0,  0.0,  0.0,
            
           //lower right block
             0.0,  0.0,  0.0,
             0.0, -1.0,  0.0,
             1.0,  0.0,  0.0,
             1.0, -1.0,  0.0,
             
           //lower left block
            -1.0,  0.0,  0.0,
            -1.0, -1.0,  0.0,
             0.0,  0.0,  0.0,
             0.0, -1.0,  0.0
        ];
        
        //Write Data into a Buffer Object (Float32Array is optimized for large quantities of data of the same type)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        O_PositionBuffer.itemSize = 3;
        O_PositionBuffer.numItems = 16;

        O_ColorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, O_ColorBuffer);
        var colors = [
                  
                  //Upper left block
                  0.0, 0.0, 0.2, 1.0,
                  0.0, 0.0, 0.3, 1.0,
                  0.0, 0.0, 0.4, 1.0,
                  0.0, 0.0, 0.6, 1.0,
                  
                  //Upper right block
                  0.0, 0.0, 0.4, 1.0,
                  0.0, 0.0, 0.6, 1.0,
                  0.0, 0.0, 0.6, 1.0,
                  0.0, 0.0, 0.6, 1.0,
                  
                  //lower right block
                  0.0, 0.0, 0.6, 1.0,
                  0.0, 0.0, 0.6, 1.0,
                  0.0, 0.0, 0.7, 1.0,
                  0.0, 0.0, 0.8, 1.0,
                  
                  //lower left block
                  0.0, 0.0, 0.3, 1.0,
                  0.0, 0.0, 0.6, 1.0,
                  0.0, 0.0, 0.6, 1.0,
                  0.0, 0.0, 0.6, 1.0
              ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
        O_ColorBuffer.itemSize = 4;
        O_ColorBuffer.numItems = 16;
        
       
        
    }
    
    
    function O_getGrid(){
    	
        var gridO = [ [0, 1, 1, 0],
        			  [0, 1, 1, 0] ];
        var gridPosition = [0, 4];
    }
    
    
    function drawO(){
    	mat4.translate(mvMatrix, O_translation);
        mat4.rotate(mvMatrix, degToRad(O_rotationOld), [0, 0, 1]);

        gl.bindBuffer(gl.ARRAY_BUFFER, O_PositionBuffer);
        //Assign the Buffer Object to the Attribute Variable 'vertexPositionAttribute' which is then again assigning to 'aVertexPosition'
        //gl.vertexAttribPointer(location, size, type, normalized, stride, offset)
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, O_PositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
        
     
        gl.bindBuffer(gl.ARRAY_BUFFER, O_ColorBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, O_ColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

        setMatrixUniforms();
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, O_PositionBuffer.numItems);
    	
    }
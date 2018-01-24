/**
 * Create a world-grid with x rows and y collums
 */

	var col = 20;
	var row = 16;
    var globalGrid;
    var drawGrid;
    var drawToggleGrid;
    var grid_PositionBuffer;
    var grid_ColorBuffer;
    var grid_PositionBuffer2;
    var grid_ColorBuffer2;
    var topleft = new Array(2);
    function createGrid(){
    	
    	//topleft = [row/2-2,col-col]; //with row=16,column=20: [x=6;y=0]
    	globalGrid = new Array(row);		//Set the Depth or z-size of the Grid
    	
    	//Create the matrix representation of the Grid
    	resetGrid();
    	
 
    	
	               
    	drawGrid = [];
    	var gridVertices;
    	
    	//------LINES OF BOTTOM FACE
    	//Bottom lines from z=0 to z=-row in x-steps (row times)
    	/*    |
    	 *  | |
    	 *  | ////
    	 *  |////
    	 *  0,1,i
    	 */
    	for(var i=0; i<row+1; i++){	
    		gridVertices = [ i, 0.0, 0.0,
    		                 i, 0.0, -row];
    		drawGrid.push(gridVertices);
    	}
    	//Bottom lines from x=0 to x=row in z-steps
    	/*    |
    	 *  | |
    	 *  | /----i
    	 *  |/----1
    	 *  -----0
    	 */
    	for(var i=0; i<row; i++){
    		gridVertices = [ 0.0, 0.0, -i,
    		                 row, 0.0, -i];
    		drawGrid.push(gridVertices);
    	}
    	
    	
    	//------LINES OF LEFT FACE
    	//Left face lines from y=0 to y=col in z-steps
      	 /*   |
    	 *   ||
    	 *  ||/i---
    	 *  |/1
    	 *  /0---
    	 */
    	for(var i=0; i<row+1; i++){	
    		gridVertices = [ 0.0, 0.0, -i,
    		                 0.0, col, -i];
    		drawGrid.push(gridVertices);
    	}
    	//Left face lines from z=0 to z=-row in y-steps
     	 /*     /|
    	 *     //|
    	 *    ///|
    	 *  i|// ---
    	 *  1|/
    	 *   0---
    	 */
    	for(var i=0; i<col+1; i++){	
    		gridVertices = [ 0.0, i, 0.0,
    		                 0.0, i, -row];
    		drawGrid.push(gridVertices);
    	}
    	
    	//------LINES OF BACK FACE
    	//Back face lines from y=0 to y=col in x-steps
    	/*		 012i
   	 	 *      /||||
    	 *     / ||||
    	 *    / /||||
    	 *   | / -----
    	 *   |/
    	 *    ----
    	 */
    	for(var i=1; i<row+1; i++){	
    		gridVertices = [ i, 0.0, -row,
    		                 i, col, -row];
    		drawGrid.push(gridVertices);
    	}    
    	//Back face lines from x=0 to x=row in y-steps
   	 	 /*     /|----
    	 *     / |----
    	 *    / /|----
    	 *  i| / -----
    	 *  1|/
    	 *   0----
    	 */
    	for(var i=0; i<col+1; i++){	
    		gridVertices = [ 0.0, i, -row,
    		                 row, i, -row];
    		drawGrid.push(gridVertices);
    	}
    	
    	
    	
    	//Create white color for the grid
        var gridLineColor = [ 1.0, 1.0, 1.0, 0.2,
                              1.0, 1.0, 1.0, 0.2];
    	
    	//Create and bind vertices buffer
		grid_PositionBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, grid_PositionBuffer);
		
		//Create, bind and fill color buffer
        grid_ColorBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, grid_ColorBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(gridLineColor),gl.STATIC_DRAW);
		
    }
    
    

    /**
     * Create the globalGrid: A Matrix representation of the drawGrid
     * 	   Y0------Z0
	 *	  /|      /|
	 *	 /-------Zn| 
	 *	 | |     | |
	 *	 | Yn----|-|
	 *	 |/      |/
	 *   X0------Xn
     */
    function resetGrid(){
    	
    	//Fill the Array with Zero
    	for(var z = 0; z<globalGrid.length; z++){
    		globalGrid[z] = new Array(col);		//Height or y-size or row size
    		
	    	for (var y = 0; y < globalGrid[z].length; y++) {
	    		globalGrid[z][y] = new Array(row);	//Width or x-size or column size
	    		
	    	    for (var x = 0; x < globalGrid[z][y].length; x++) 	
	    	        globalGrid[z][y][x] = 0;
	    	}
    	}
       	//******DEBUG******* Collision Test
    	//globalGrid[7][1][8] = 1;
    	
    }

    
    /**
     * Print the Grid for debugging
     */
    function printGrid(){
    	var str = "-";
    	for(var z=0; z<globalGrid.length; z++){
	    	for(var y=0; y<globalGrid.length; y++){
	    			console.log("z:" + z + str + globalGrid[z][y]);
	    			
	    	}
	    	str += "-";
    	}
    }
    
    
    
    /**
     * Create the rest of the grid
     */
    function createToggleGrid(){
 
    	
	               
    	drawToggleGrid = [];
    	var gridVertices;
    	
    	//------LINES OF TOP FACE
    	//Top lines from z=0 to z=-row in x-steps (row times)
    	for(var i=0; i<row+1; i++){	
    		gridVertices = [ i, col, 0.0,
    		                 i, col, -row];
    		drawToggleGrid.push(gridVertices);
    	}
    	//Bottom lines from x=0 to x=row in z-steps
    	for(var i=0; i<row; i++){
    		gridVertices = [ 0.0, col, -i,
    		                 row, col, -i];
    		drawToggleGrid.push(gridVertices);
    	}
    	
    	
    	//------LINES OF RIGHT FACE
    	//Left face lines from y=0 to y=col in z-steps
    	for(var i=0; i<row+1; i++){	
    		gridVertices = [ row, 0.0, -i,
    		                 row, col, -i];
    		drawToggleGrid.push(gridVertices);
    	}
    	//Left face lines from z=0 to z=-row in y-steps
    	for(var i=0; i<col+1; i++){	
    		gridVertices = [ row, i, 0.0,
    		                 row, i, -row];
    		drawToggleGrid.push(gridVertices);
    	}
    	
    	
    	//------LINES OF FRONT FACE
    	//Back face lines from y=0 to y=col in x-steps
    	for(var i=1; i<row+1; i++){	
    		gridVertices = [ i, 0.0, 0.0,
    		                 i, col, 0.0];
    		drawToggleGrid.push(gridVertices);
    	}    
    	//Back face lines from x=0 to x=row in y-steps
    	for(var i=0; i<col+1; i++){	
    		gridVertices = [ 0.0, i, 0.0,
    		                 row, i, 0.0];
    		drawToggleGrid.push(gridVertices);
    	}
    	
    	
    	
    	//Create white color for the grid
        var gridLineColor = [ 1.0, 1.0, 1.0, 0.2,
                              1.0, 1.0, 1.0, 0.2];
    	
    	//Create and bind vertices buffer
		grid_PositionBuffer2 = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, grid_PositionBuffer2);
		
		//Create, bind and fill color buffer
        grid_ColorBuffer2 = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, grid_ColorBuffer2);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(gridLineColor),gl.STATIC_DRAW);
		
    }
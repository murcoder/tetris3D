/**
 * Create a world-grid with x rows and y collums
 */

	var col = 20;
	var row = 16;
    var globalGrid;
    var grid_Position;
    var grid_PositionBuffer;
    var grid_ColorBuffer;
    var topleft = new Array(2);
    function createGrid(){
    	
    	topleft = [row/2-2,col-col]; //with row=16,column=20: [x=6;y=0]
    	globalGrid = new Array(row);		//Set the Depth or z-size of the Grid
    	//Create the Matrix representation
    	resetGrid();
    	
    	//******DEBUG******* Collision Test
    	//globalGrid[1][12] = 1;
    	//globalGrid[6][8] = 1;
    	
    	//Create the visual Grid
    	//Create Vertices and save in buffer for drawing the grid
    	var gridVertices = [
    	                    //Front Face
	                            0.0, col, 0.0,
	                            0.0, 0.0, 0.0,
	                            row, 0.0, 0.0,
	                            row, col, 0.0,
	                            
	                            //Right Face
	                            row, col, 0.0,
	                            row, 0.0, 0.0,
	                            row, 0.0, -row,
	                            row, col, -row,
	                            
	                            //Back Face
	                            row, col, -row,
	                            row, 0.0, -row,
	                            0.0, 0.0, -row,
	                            0.0, col, -row,
	                            
	                            //Left Face
	                            0.0, col, -row,
	                            0.0, 0.0, -row,
	                            0.0, 0.0, 0.0,
	                            0.0, col, 0.0
	                            
	                        ];
	                        

    	//Create white color for the grid
    	var gridColors = new Array(64);
    	for(var i=0; i<gridColors.length; i++){
    		gridColors[i] = 1.0;
    	}
    	
    	//1.Create, 2.bind, 3.fill
		grid_PositionBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, grid_PositionBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(gridVertices), gl.STATIC_DRAW);
		
		grid_ColorBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, grid_ColorBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(gridColors),gl.STATIC_DRAW);
		//printGrid();
    }
    
    
//		   Y0------Zn
//		  /|      /|
//		 /-------Z0| 
//		 | |     | |
//		 | Yn----|-|
//		 |/      |/
// 	     X0------Xn
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
    }

    
    /**
     * Print the Grid for debugging
     */
    function printGrid(){
    	var str = "-";
    	for(var z=0; z<globalGrid.length; z++){
	    	for(var y=0; y<globalGrid.length; y++){
	    			console.log(z + str + globalGrid[z][y]);
	    			
	    	}
	    	str += "-";
    	}
    }
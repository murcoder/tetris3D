/**
 *  Handles the Collision Detection in the globalGrid
 */

/**
 *  Return false if there is the spawnPosition is already taken
 */
function checkSpawnPosition(){
	
    	//set second row and forth column in globalGrid for spawning
    	var globalX = (row/2)-1; //-1 because indices starts with 0; -1 again because object grid can be -1 on left side
    	var globalY = 0;
    	var globalZ = (row/2)-1;
    	//console.log(globalX, globalY, globalZ);
    	for(var z=0; z<(tetrominos[elem].objectGrid.length); z++){
	    	//Check the columns of the object grid
	    	for(var y=0; y<tetrominos[elem].objectGrid[z].length; y++){
	    		//Check each line of the object grid
	    		for(var x=0; x<tetrominos[elem].objectGrid[z][y].length; x++){
	    			
	    			//Only where is an one in the object grid
	    			if(tetrominos[elem].objectGrid[z][y][x] == 1){
	    				if(globalGrid[globalZ][globalY][globalX] == 1){
	    					console.log("Spawn Collision at: [" + globalX + "," + globalY + "," + globalZ + "] !");
	    					return false;	//There is already an object
	    				}
	    			}
	    			globalX += 1;
	    			//console.log("[" + globalZ + ", " + globalY + ". " + globalX + "]" );
	    		}
	    		globalX = (row/2)-2;
	    		globalY += 1;
	    	}
	    	globalZ +=1;
    	}
    	globalY = 0;
    	globalZ = (row/2)-2;
    	return true;
}


var globalZ = 0;
var globalY = 0;
var globalX = 0;
/**
 * Check if the space for the objectGrid  is already taken in the globalGrid
 * @param elem
 */
function checkGrid(elem){
	
	
	//var objectLength;
	
	//Across the objectgrid
	for(var z=0; z<tetrominos[elem].objectGrid.length; z++){
		for(var y=0; y<tetrominos[elem].objectGrid[z].length; y++){
			for(var x=0; x<tetrominos[elem].objectGrid[z][y].length; x++){
				if(tetrominos[elem].objectGrid[z][y][x] != 0){
					//Check only blocks with 1 in objectgrid
					
					//Find the Object Position in the globalGrid
					globalZ = z+tetrominos[elem].potentialTopleft[2];		
					globalY = y+tetrominos[elem].potentialTopleft[1];
					globalX = x+tetrominos[elem].potentialTopleft[0];


					//Check if the object reached the ground
					if(globalY >= col){
						console.log("Landed on Ground!");
						drawInGrid(elem);
						return false;
					}
					
					//Check if the object reached left or right side
					if(globalX < 0 || globalX >= globalGrid[z][y].length || globalZ < 0 || globalZ >= globalGrid.length)
						return false;
					
					//Check for collision
					if(globalGrid[globalZ][globalY][globalX] != 0){
						console.log("Collision detected: [" + globalX + "," + globalY + "," + globalZ + "] !");
						drawInGrid(elem);
						return false; //Space occupied
					}
				}
			}
			
		}
	}
	return true;
}



/**
 * Draw an element in the globalGrid
 * @param elem
 */
function drawInGrid(elem){
	
	for(var z=0; z<tetrominos[elem].objectGrid.length; z++){
		for(var y=0; y<tetrominos[elem].objectGrid[z].length; y++){
			for(var x=0; x<tetrominos[elem].objectGrid[z][y].length; x++){
				if(tetrominos[elem].objectGrid[z][y][x] != 0){
					var globalZ = z+tetrominos[elem].topleft[2];
					var globalY = y+tetrominos[elem].topleft[1]-1;
					var globalX = x+tetrominos[elem].topleft[0];
					console.log(" [" + globalX + "," + globalY + "," + globalZ + "] !");
					if(globalGrid[globalZ][globalY][globalX] == 0){
						globalGrid[globalZ][globalY][globalX] = tetrominos[elem].objectGrid[z][y][x];
						console.log("Drawed in: [" + globalX + "," + globalY + "," + globalZ + "] !");
					}
				}
	
			}
		}
	}
	
}




/**
 * Check for full planes
 */
function checkFullRow(){

		//Start from bottom
		for(var y=col-1; y>=0; y--){
			var counter = 0;
			//Check first the whole y-plane in the z-axis
			for(var z=0; z<globalGrid.length; z++){
				for(var x=0; x<globalGrid[z][y].length; x++){
					if(globalGrid[z][y][x] == 1)
						counter += 1;
				}
				//console.log("counter: " + counter);
				
			}
			//If the counter reach the number of one whole plane (default=320): Give one point and clear the plane
			if(counter == (row*row) ){
				for(var z=0; z<globalGrid.length; z++){
					for(var x=0; x<globalGrid[z][y].length; x++)
						globalGrid[z][y][x] = 0;
		    		score += 1;
		    		setScore();
				}
			setMessages("+1 POINT - CONGRATULATIONS!");
			return;
			}
		}
}




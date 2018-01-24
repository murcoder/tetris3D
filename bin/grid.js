/**
 * 
 */

    //Create a world-grid with 16 rows and 10 collums
	var col = 16;
	var row = 10;
    var globalGrid = new Array(col);
    function createGrid(){
    	
    	
    	//Fill the Array with Zero
    	//row gives y-position, col gives x-position
    	for (var y = 0; y < col; y++) {
    		globalGrid[y] = new Array(row);
    	    for (var x = 0; x < row; x++) {
    	        globalGrid[y][x] = 0;
    	     }
    	}
    	
    	
    	console.log(globalGrid);
    }
    
    
    
    
    
    function printGrid(){
    	
    	var vertices = [
    	                
    	               
    	                
    	                
    	                ];
    	
    	
    }
/**
 * 	O-Element
 * 	8 blocks: 2x2x2 [x,y,z]
 */
   function initElem_O(){
    	
	var posSize = 3;
	var colSize = 4;
	var items = 24;
    
    
 
	 //-------------Define Color
	  var colors = [     // Colors
	                [1.0, 0.0, 0.0, 1.0],     // Front face
	                [1.0, 1.0, 0.0, 1.0],     // Back face
	                [0.0, 1.0, 0.0, 1.0],     // Top face
	                [1.0, 0.5, 0.5, 1.0],     // Bottom face
	                [1.0, 0.0, 1.0, 1.0],     // Right face
	                [0.0, 0.0, 1.0, 1.0],     // Left face
	                                    ];

      var vertexIndices = [
                   0, 1, 2,      0, 2, 3,    // Front face
                   4, 5, 6,      4, 6, 7,    // Back face
                   8, 9, 10,     8, 10, 11,  // Top face
                   12, 13, 14,   12, 14, 15, // Bottom face
                   16, 17, 18,   16, 18, 19, // Right face
                   20, 21, 22,   20, 22, 23  // Left face
                   ];
		
    //----------Grid data ------------
     //Create 3D - 4x4 object grid for each rotation
	//      1---1
	//     /   /|
	//    1---1 |
	//    |   | 1
	//    1---1/
  	var objectGrid0 = [			//z0
  	                  [ [1,1],		//y0 [x0,x1]
  	                    [1,1], ],]	//y1 [x0,x1]
  	                    
  	
  	var objectGrid90 = [			//z0
   	                 	 [ [1,1],],
         	           
	         	         [ [1,1],]]	
      	                    
  	var objectGrid180 = [			//z0
  	      	                  [ [1,1],		//y0 [x0,x1]
  	      	                    [1,1], ],]	//y1 [x0,x1]
  	      	                    
  	var objectGrid270 = [			
  	                 	 [ [1,1],],
  	         	           
  	         	         [ [1,1],]]	
  	      	                    
    var blocks_0 = [];
    var block1_0 = [0,0,0]
    var block2_0 = [-1,0,0]
    var block3_0 = [-1,1,0]
    var block4_0 = [0,1,0]
    
    blocks_0.push(block1_0);
    blocks_0.push(block2_0);
    blocks_0.push(block3_0);
    blocks_0.push(block4_0);
    
	 
	 var topleft = [row/2-1, col-col+2, (row/2)-1]; //[x=middle-1, y=top-1, z=depthMiddle-1]; Also saved in spawn()!
  	 var blocksFromMiddle = [1,1,1,1]; //[+x,-y,+y,-z] Default: 1 block left from middle, 1 block down form middle, 1 block back from middle 
  	 var objectLength = 4; //Default in rotation 0
	 
		tetrominos.push( tetrominoConstructor("O", items,posSize,colSize, colors, vertexIndices, blocks_0, objectGrid0, objectGrid90, objectGrid180, objectGrid270,  topleft, blocksFromMiddle));
		
		
    }
   
   
   
   
   
   
   
   
   
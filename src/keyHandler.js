/**
 * Handles the Key input by creating a Hashtable for each button on the keyboard
 * and change the globalGrid
 * HandleKeyDown: Handles an event when hitting the key
 * HandleKeyDown: Handles an event when relinquish the key 
 * directionY 1/3: counterclockwise/clockwise
 * directionX 1/3: left/right
 */
    
	//When button 'keyCode' is pressed, currentlyPressedKeys[keyCode] is true
    var currentlyPressedKeys = {};
    var move = 1.0;
    var rotDirection;
    var clockwise = false;
    var directionX = 0;
    var directionZ = 0;
    var zoomMax = false;
    function handleKeyDown(event) {
      currentlyPressedKeys[event.keyCode] = true;
      
      /*
       * ---------------------------DEBUGING---------------------------
       */
      	//console.log(String.fromCharCode(event.keyCode));
      	//console.log(currentlyPressedKeys);
      if ( String.fromCharCode(event.keyCode) == "I") {
    	  //Debugging Popup
    	  tetrominos[elem].printObject();
      }
      if ( String.fromCharCode(event.keyCode) == "O") {
    	  //Debugging Popup
    	  console.log(Math.floor( ( (Math.random() *10) + 1 ) % 2));
      }
      if ( String.fromCharCode(event.keyCode) == "U") {
    	  //Print the globalGrid in the console
    	  printGrid();
      }

      
      /*
       * ---------------------------MOVEMENT---------------------------
       */
      if ( String.fromCharCode(event.keyCode) == "%" || String.fromCharCode(event.keyCode) == "4") {
    	  //Cursor LEFT
    	  event.preventDefault();
		  tetrominos[elem].potentialTopleft[0] -= move; 
		  if(checkGrid(elem))
			  tetrominos[elem].positionAnimate[0] -= move;	//Animate moving in -X axis
		  else
			  tetrominos[elem].potentialTopleft[0] += move; //Reset: Moving not allowed
    		  
    	  directionX = 1;
      }
      
      if ( String.fromCharCode(event.keyCode) == "'" || String.fromCharCode(event.keyCode) == "6") {
    	  //Cursor RIGHT
    	  event.preventDefault();
		  tetrominos[elem].potentialTopleft[0] += move; 
		  if(checkGrid(elem))
			  tetrominos[elem].positionAnimate[0] += move;	//Animate moving in X axis
		  else
			  tetrominos[elem].potentialTopleft[0] -= move; //Reset: Moving not allowed
    		  
    	  directionX = 3;
      }
      
      
      if ( String.fromCharCode(event.keyCode) == "&" || String.fromCharCode(event.keyCode) == "8") {
    	  //Cursor UP
    	  event.preventDefault();
		  tetrominos[elem].potentialTopleft[2] -= move; 
		  if(checkGrid(elem))
			  tetrominos[elem].positionAnimate[1] -= move;	//Animate moving in -Z axis
		  else
			  tetrominos[elem].potentialTopleft[2] += move; //Reset: Moving not allowed
    		  
    	  directionZ = 1;
      }
      if ( String.fromCharCode(event.keyCode) == "(" || String.fromCharCode(event.keyCode) == "2") {
    	  //Cursor DOWN
    	  event.preventDefault();
		  tetrominos[elem].potentialTopleft[2] += move; 
		  if(checkGrid(elem))
			  tetrominos[elem].positionAnimate[1] += move;	//Animate moving in Z axis
		  else
			  tetrominos[elem].potentialTopleft[2] -= move; //Reset: Moving not allowed
    		  
    	  directionZ = 3;
    	  
      }
      


      /*
       * ---------------------------ROTATION---------------------------
       * Buttons: keyCode 16 = Shift; keyCode 88 = x; 89=y; 90=z;
       */
      if ( !currentlyPressedKeys[16] && currentlyPressedKeys[88] ) {
    	  //'x' rotate counterclockwise around x-axis
    	  if(checkGrid(elem)){
	    	  if(tetrominos[elem].rotationX+90 > 360){	//More then 360° => set to 0 again
	    		  tetrominos[elem].rotationX = 0;
	    		  tetrominos[elem].rotationAnimateX = 0;
	    	  }
	    	  tetrominos[elem].rotationX += 90;
	    	  
	    	  //Rotate the object grid
	    	  if(tetrominos[elem].rotationX == 90)
	    	   tetrominos[elem].objectGrid = tetrominos[elem].objectGrid90;
	    	  if(tetrominos[elem].rotationX == 180)
	       	   tetrominos[elem].objectGrid = tetrominos[elem].objectGrid180;
	    	  if(tetrominos[elem].rotationX == 270)
	       	   tetrominos[elem].objectGrid = tetrominos[elem].objectGrid270;
	    	  if(tetrominos[elem].rotationX == 0 || tetrominos[elem].rotationX == 360)
	       	   tetrominos[elem].objectGrid = tetrominos[elem].objectGrid0;
    	  
	    	  
	    	  
	    	  rotDirection = 'x';
	    	  clockwise = false;
    	  }
      }
       if ( currentlyPressedKeys[88] && currentlyPressedKeys[16] ) {
    	  //'X' rotate clockwise around x-axis
     	  if(checkGrid(elem)){
	    	  tetrominos[elem].rotationX -= 90;
	    	  //console.log("Old: " + tetrominos[elem].objectGrid);
	    	  if(tetrominos[elem].rotationX <= -360){
	    		  tetrominos[elem].rotationX = 0;
	    		  tetrominos[elem].rotationAnimateX = 0;
	    	  }
	    	  
	       	  //Rotate the object grid
	    	  if(tetrominos[elem].rotationX == -90)
	    	   tetrominos[elem].objectGrid = tetrominos[elem].objectGridDifferent;
	    	  if(tetrominos[elem].rotationX == -180)
	       	   tetrominos[elem].objectGrid = tetrominos[elem].objectGrid180;
	    	  if(tetrominos[elem].rotationX == -270)
	       	   tetrominos[elem].objectGrid = tetrominos[elem].objectGrid90;
	    	  if(tetrominos[elem].rotationX == 0 || tetrominos[elem].rotationX == 360)
	       	   tetrominos[elem].objectGrid = tetrominos[elem].objectGrid0;
	    	  
	
	    	  rotDirection = 'X';
	    	  clockwise = true;
    	  }
       }
       if ( !currentlyPressedKeys[16] && currentlyPressedKeys[89] ) {
     	  //'y'
     	  if(checkGrid(elem)){
	    	  if(tetrominos[elem].rotationY+90 > 360){	//More then 360° => set to 0 again
	    		  tetrominos[elem].rotationY = 0;
	    		  tetrominos[elem].rotationAnimateY = 0;
	    	  }
	    	  tetrominos[elem].rotationY += 90;
	    	  
	    	  
	    	  //Rotate the object grid
//	    	  if(tetrominos[elem].rotationY == 90)
//	    	   tetrominos[elem].objectGrid = tetrominos[elem].objectGridDifferent;
//	    	  if(tetrominos[elem].rotationY == 180)
//	       	   tetrominos[elem].objectGrid = tetrominos[elem].objectGrid180;
//	    	  if(tetrominos[elem].rotationY == 270)
//	       	   tetrominos[elem].objectGrid = tetrominos[elem].objectGrid270;
//	    	  if(tetrominos[elem].rotationY == 0 || tetrominos[elem].rotationY == 360)
//	       	   tetrominos[elem].objectGrid = tetrominos[elem].objectGrid0;
	    	  
	    	  rotDirection = 'y';
	    	  clockwise = false;
    	  }
       }
        if ( currentlyPressedKeys[89] && currentlyPressedKeys[16] ) {
     	  //'Y'
       	  if(checkGrid(elem)){
	    	  tetrominos[elem].rotationY -= 90;
	    	  
	    	  if(tetrominos[elem].rotationY <= -360){
	    		  tetrominos[elem].rotationY = 0;
	    		  tetrominos[elem].rotationAnimateY = 0;
	    	  }
	    	  
	    	  
	       	  //Rotate the object grid
//	    	  if(tetrominos[elem].rotationY == -90)
//	    	   tetrominos[elem].objectGrid = tetrominos[elem].objectGridDifferent;
//	    	  if(tetrominos[elem].rotationY == -180)
//	       	   tetrominos[elem].objectGrid = tetrominos[elem].objectGrid180;
//	    	  if(tetrominos[elem].rotationY == -270)
//	       	   tetrominos[elem].objectGrid = tetrominos[elem].objectGrid90;
//	    	  if(tetrominos[elem].rotationY == 0 || tetrominos[elem].rotationY == 360)
//	       	   tetrominos[elem].objectGrid = tetrominos[elem].objectGrid0;
	    	  
	    	  rotDirection = 'Y';
	    	  clockwise = true;
    	  }
        }
        if ( !currentlyPressedKeys[16] && currentlyPressedKeys[90] ) {
      	  //'z'
       	  if(checkGrid(elem)){
	    	  if(tetrominos[elem].rotationZ+90 > 360){	//More then 360° => set to 0 again
	    		  tetrominos[elem].rotationZ = 0;
	    		  tetrominos[elem].rotationAnimateZ = 0;
	    	  }
	    	  tetrominos[elem].rotationZ += 90;
	    	  
	    	  
	    	  //Rotate the object grid
//	    	  if(tetrominos[elem].rotationZ == 90)
//	    	   tetrominos[elem].objectGrid = tetrominos[elem].objectGridDifferent;
//	    	  if(tetrominos[elem].rotationZ == 180)
//	       	   tetrominos[elem].objectGrid = tetrominos[elem].objectGrid180;
//	    	  if(tetrominos[elem].rotationZ == 270)
//	       	   tetrominos[elem].objectGrid = tetrominos[elem].objectGrid270;
//	    	  if(tetrominos[elem].rotationZ == 0 || tetrominos[elem].rotationZ == 360)
//	       	   tetrominos[elem].objectGrid = tetrominos[elem].objectGrid0;
	    	  
	    	  
	    	  rotDirection = 'z';
	    	  clockwise = false;
    	  }
        }
         if ( currentlyPressedKeys[90] && currentlyPressedKeys[16] ) {
      	  //'Z'
	      	  if(checkGrid(elem)){
		    	  tetrominos[elem].rotationZ -= 90;
		    	  
		    	  if(tetrominos[elem].rotationZ <= -360){
		    		  tetrominos[elem].rotationZ = 0;
		    		  tetrominos[elem].rotationAnimateZ = 0;
		    	  }
		    	  
		       	  //Rotate the object grid
//		    	  if(tetrominos[elem].rotationZ == -90)
//		    	   tetrominos[elem].objectGrid = tetrominos[elem].objectGridDifferent;
//		    	  if(tetrominos[elem].rotationZ == -180)
//		       	   tetrominos[elem].objectGrid = tetrominos[elem].objectGrid180;
//		    	  if(tetrominos[elem].rotationZ == -270)
//		       	   tetrominos[elem].objectGrid = tetrominos[elem].objectGrid90;
//		    	  if(tetrominos[elem].rotationZ == 0 || tetrominos[elem].rotationZ == 360)
//		       	   tetrominos[elem].objectGrid = tetrominos[elem].objectGrid0;
		    	  
		    	  
		    	  rotDirection = 'Z';
		    	  clockwise = true;
	    	  }
         }
         
         
         
         
         /*
          * --------------------------VIEW---------------------------
          */
         if ( String.fromCharCode(event.keyCode) == "P") {
       	  //Change beetween perspective or orthonoal
       	  if(perspectiveView)
       		  perspectiveView = false;
       	  else
       		  perspectiveView = true;
         }
         
	       if ( String.fromCharCode(event.keyCode) == "G") {
	    	   if(toggleGrid)
	    		   toggleGrid = false;
	    	   else
	    		   toggleGrid = true;
	        }
	       if ( String.fromCharCode(event.keyCode) == "R") {
	    	   if(!removeGrid)
	    		   removeGrid = true;
	    	   else
	    		   removeGrid = false;
	        }
	       if ( String.fromCharCode(event.keyCode) == "W") {
	    	   setMessages(" ");
	    	   if(!grav)
	    		   grav = true;
	    	   else
	    		   grav = false;
	        }
	       if ( String.fromCharCode(event.keyCode) == "S") {
	    	   
	    	   if(!resetView){
	    		   setMessages("Restore the camera with 'Q'");
		    	   if(scale < 3 && zoomMax == false)
		    		   scale += 0.1;
		    	   else
		    		   zoomMax = true;
		    	   
		    	   if(scale > 0 && zoomMax == true)
		    		   scale -= 0.1;
		    	   else
		    		   zoomMax = false;
	    	   }
	        }
	       
	       if ( event.keyCode == 32) {
	    	   //Space
	    	   grav = true;
	    	   gravSpeed = 1.0;
	    	   setMessages(" ");
	        }
	       
	       if ( String.fromCharCode(event.keyCode) == "Q") {
	    	   reset();
	    		   
	        }
      //HandleKeyDown ENDLINE
    }


    /**
     * Deactivate the released button 
     */
    function handleKeyUp(event) {
      currentlyPressedKeys[event.keyCode] = false;
    }
    
    
    /**
     * Mouse handling: modified version of http://learningwebgl.com/blog/?p=1253
     * Mouse position is [0,0] in the topleft corner of the desktop
     */
    var mouseDown = false;
    var rightMouse = false;
    var lastMouseX = 0.0;
    var lastMouseY = 0.0;
    var deltaX=0.0;
    var deltaY=0.0;
    var deltaXrotate=0.0;
    var deltaYrotate=0.0;
    function handleMouseDown(event) {
    	event.preventDefault();
        mouseDown = true;
        lastMouseX = event.clientX;
        lastMouseY = event.clientY;
        
        //Right mouse button
        if(event.button == 2)
        	rightMouse = true;
        
        //alert(event.button);
        
      }

      function handleMouseUp(event) {
        mouseDown = false;
        rightMouse = false;
      }

      function handleMouseMove(event) {
    	event.preventDefault();
        if (!mouseDown) 
          return;
        
        if(!resetView){
        	setMessages("Restore the camera with 'Q'");
	        var newX = event.clientX;
	        var newY = event.clientY;
	        
        	if(!rightMouse){
		        deltaX = newX - lastMouseX;
		        deltaY = newY - lastMouseY;
		    }else{
		        deltaXrotate = newX - lastMouseX;
		        deltaYrotate = newY - lastMouseY;
		    	
		    }
        }
      }
      
      
      
      
      
      
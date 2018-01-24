/**
 * 
 */
function multMatrix(m) {
  mvMatrix = mvMatrix.x(m);
}


function tansposeMatrixCounterclockwise (oldMat){
	
	var newArray = oldMat[0].map(function(col, i) { 
		  return oldMat.map(function(row) { 
		    return row[i] 
		  })
		});
	return newArray;
}
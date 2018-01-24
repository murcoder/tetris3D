Tetris - Task 2
VU Introduction to Computer Graphics
Christoph Murauer - 1127084
----------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------

1. ARBEITSABLAUF: 
Als Lernunterlagen für WebGL habe ich vorwiegend folgende Quellen verwendet:
Buch: WebGL Programming Guide / Kouichi Matsuda, Rodger Lea
Online: http://learningwebgl.com/blog/?page_id=1217; https://developer.mozilla.org/de/docs/Web/JavaScript; http://webglfundamentals.org/webgl/lessons/webgl-fundamentals.html;
Weiters verwende ich das CSS-Framework 'Foundation'(http://foundation.zurb.com/) um die Seite etwas ansehnlicher zu gestalten.
Als Programmiersprachen werden Javascript, HTML und GLSL ES genutzt.

STARTEN: Das Programm wird einfach gestartet, indem man die 'Start.html' in einem beliebigen Webbrowser ausführt. 

STEUERUNG: Mit den Cursortasten "<-" und "->" kann man das Objekt in die entsprechende Richtung bewegen. Mit den Tasten '1' und '3' wird 
das Objekt entweder gegen- oder im Uhrzeigersinn rotieren. Weiters ist es möglich, mit dem Slider auf der HTML Seite, die Größe der Objekte zu skalieren.
Die Steuerung wird auch zusätzlich auf der HTML-Seite beschrieben. 


2. Programmstruktur
--------------------------------------------------------------
SPIELFELD
globalGrid: hierbei handelt es sich um die Matrix-repräsentation des Spielfelds im Hintergrund. Es wird verwendet um die Kollisionsabfrage zu handeln. Wird erstellt in <b>grid.js/resetGrid().
drawGrid:  Dies ist die gezeichnete, visuelle Variante des Grids. Wird erstellt in <b>grid.js/createGrid()</b> sowie createToggleGrid() und gezeichnet in tetris.js/drawScene() 

TETROMINOS
Die Form, Farbe und der Objektgrid jedes Tetromino wird übersichtlichkeitshalber in einer eigenen Javascript Datei definiert (O.js, S.js,usw.).
Zusätzlich wird in jeder Tetromino-Datei ein Objekt erstellt, mittels der Funktion tetrominoConstructor() (Tetris.js) und anschließend in das Array 
tetrominos[] gespeichert. Aufgerufen werden die Dateien einmalig in initBuffer() (Tetris.js). Jedes Objekt hat seinen eigenen Namen, Farbwerte, blocks, sowie
individuelle positionen im golbalGrid sowie im drawGrid.
Gelandete Elementewerden im Array landedElems[] gespeichert und in drawScene() fortlaufend gezeichnet.

STEUERUNG
Die Steuerung wird in keyHandler.js, mittels event-handling realisiert.

KOLLISIONSABFRAGE
In collisionDetection.js wird im globalGrid auf Kollisionen kontrolliert.checkSpawnPosition() prüft die Startposition und liefert false zurück, wenn sie besetzt ist, was zum gameOver() führt. 
checkGrid() hingegen kontrolliert bei jeder Bewegung den globalGrid.
Ist ein Objekt gelandet, so wird die Funktion drawInGrid() aufgerufen, welche den ObjectGrid des Tetrominos in den globalGrid mit '1' speichert. 

TETRIS.JS
<p>Hier sind alle essentiellen Funktionen implementiert, die für das aktuelle lauffähige Tetris Programm notwendig sind.
<li><b>tetrominoConstructor(name, items,posSize,colSize, blocks, colors, vertexIndices,
	objectGrid0, objectGrid90, objectGrid180, objectGrid270, startPointGrid, endPointGrid, topleft):</b> Erzeuge ein neues Tetromino Objekt. </li>
<li><b>spawn(elem):</b> Überwacht, ob ein Element gelandet ist oder nicht. Nicht Gelandet: Zeichne das aktuelle Objekt; Gelandet: Kopiere das aktuelle Element und speichere in landedElems[]</li>
<li><b>gravity():</b> Bewege das Objekt in konstanter Geschwindigkeit in -Y Richtung. Speichere gleichzeitig die aktuelle Y-Position des Objekts.</li>
<li><b>transformationAnimation():</b> Animiere Roationen und Bewegungen.</li> 
<li><b>webGLStart():</b> Initialisiert WebGL, den Vertex- und den Fragmentshader, sowie die Buffer fuer die Eckpunkte und Farbwerte, behandelt Tastatureingaben und wiederholt das Programm</li>
<li><b>initGL(canvas):</b>  Initialisiere WebGL (Web Graphic Libary) und waehlt den Rendering Context WebGL fuer das Canvas Element aus.</li>
<li><b>getShader(gl, id):</b> Ruft den korrekten Shadertyp auf und liefert einen Grafikkarten kompatiblen Shader</li>
<li><b>initShaders():</b> Fuegt den Vertexshader (zustaendig fuer Berechnung der Eckpunkte des 3DModels) und den Fragmentshader (zustaendig fuer die Oberflaeche des Modells), zu einem WebGL 
Programm Objekt (ausfuerbar direkt auf der GraKa) zusammen. Jedes Programm besteht aus jeweils einem Vertex- sowie Fragment- oder Pixelshader.</li>
<li><b>setMatrixUniforms():</b>  Wandle die Matrizen von Javascript auf WebGL (Grafikkarten-seitig) um, damit die Sichtbarkeit fuer die Shaders garantiert ist.</li>
<li><b>degToRad(degrees):</b> Umrechnung vom Radiant- zum Grad Winkelmaß</li>
<li><b>mvPushMatrix():</b> Speichere die globale mvMatrix (ModelView-) auf einen Stack.</li>
<li><b>mvPopMatrix():</b> Lade die letzte Matrix vom Stack.</li>
<li><b>initBuffers():</b> Definiere die Objekte mithilfer ihrer Eckpunkte. Fuelle Grafikkarten Buffer mit informationen uber die gewuenschten Objekte.</li>
<li><b>drawScene():</b>  Zeichnet die Szene inklusive den Objekten und den drawGrid.</li>
<li><b>animate():</b> Fuehrt eine Animation aus, wenn der Zielwinkel noch nicht erreicht wurde.</li>
<li><b>tick():</b> Aktualisiert das Bild um eine Animation zu erschaffen.</li></p>

START.HTML
Im Head werden alle Scripts aufgerufen, wobei sich der Code der beiden Shaderscripts (Vertex- und Fragmentshader) direkt in der HTML befindet. 
Außerdem ist hier natürlich der gesamte HTML Code zum Seitenaufbau enthalten und ruft beim Seitenaufruf sofort die Funktion webGLStart()(in Tetris.js) auf.

WEBGL-UTILS.JS
Liefert das entsprechende unabhängige Refresh-Plugin für den Browser, damit sich dieser Grafik-Änderungen sofort wahrnimmt und darstellt.

GLMATRIX-0.9.5.MIN.JS
Bibliothek die alle mathematischen Matrix operationen beinhaltet.


3. Steuerung
--------------------------------------------------------------

		              <ul>
		              	<h5>------------Movement------------</h5>
		              	<li>'\/' or '2'..........move in -Z direction</li>
		              	<li>'/\' or '8'..........move in  Z direction</li>
		              	<li>'<-' or '4'.........move in -X direction (left)</li>
		              	<li>'->' or '6'.........move in X direction   (right)</li>
		              	<li>'Space'..........release the object</li>
		              	<li>'W'.................stop/start the gravity</li>
		              	<h5>------------Rotation-------------</h5>
		              	<li>'x'/'X'..............rotate counter-/clockwise around the X-axis</li>
		              	<li>'y'/'Y'..............rotate counter-/clockwise around the Y-axis</li>
		              	<li>'z'/'Z'..............rotate counter-/clockwise around the Z-axis</li>
		              	<h5>---------------View---------------</h5>
		              	<li>'Mouse'.........change cameraposition - left: translation / right: rotation 
		              	<li>'P'.................switch between orthographic and perspective view</li>
		              	<li>'G'.................toggle wireframe.</li>
		              	<li>'R'.................hide the whole wireframe</li>
		              	<li>'Q'.................restore the View/Lock the mouse</li>
		              	<li>'S'.................zoom in/out</li>
		              	<h5>--------------Debug--------------</h5>
		              	<li>'U'.................print the grid in the console(F12)</li>
		              	<li>'I'..................see the current position of the element</li>
		              </ul>


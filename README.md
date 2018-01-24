-------------------------------------------<br />
----------- 3D Tetris Prototyp ------------<br>
---- Created for University of Vienna -----<br>
-------------------------------------------<br>



Controls
------------Movement------------
'\/' or '2'..........move in -Z direction
'/\' or '8'..........move in Z direction
'<-' or '4'.........move in -X direction (left)
'->' or '6'.........move in X direction (right)
'Space'..........release the object
'W'.................stop/start the gravity
------------Rotation-------------
'x'/'X'..............rotate counter-/clockwise around the X-axis
'y'/'Y'..............rotate counter-/clockwise around the Y-axis
'z'/'Z'..............rotate counter-/clockwise around the Z-axis
---------------View---------------
'Mouse'.........change cameraposition - left: translation / right: rotation
'P'.................switch between orthographic and perspective view
'G'.................toggle wireframe.
'R'.................hide the whole wireframe
'Q'.................restore the View/Lock the mouse
'S'.................zoom in/out
--------------Debug--------------
'I'...................print all informations about the current Object in the console(F12)
'U'.................print the globalGrid in the console(F12)



ARBEITSABLAUF
-----------------------
Als Lernunterlagen für WebGL habe ich vorwiegend folgende Quellen verwendet: -Buch: WebGL Programming Guide / Kouichi Matsuda, Rodger Lea -Online: http://learningwebgl.com/blog/?page_id=1217; https://developer.mozilla.org/de/docs/Web/JavaScript; http://webglfundamentals.org/webgl/lessons/webgl-fundamentals.html; Weiters verwende ich das CSS-Framework 'Foundation' (http://foundation.zurb.com/) um die Seite etwas ansehnlicher zu gestalten. Als Programmiersprachen werden Javascript, HTML und GLSL ES genutzt.


PROGRAMMSTRUKTUR
-----------------------
SPIELFELD
globalGrid: Hierbei handelt es sich um die Matrix-repräsentation des Spielfelds im Hintergrund. Es wird verwendet um die Kollisionsabfrage zu handeln. Wird erstellt in grid.js/resetGrid().
drawGrid: Dies ist die gezeichnete, visuelle Variante des Grids. Wird erstellt in grid.js/createGrid() sowie createToggleGrid() und gezeichnet in tetris.js/drawScene()

TETROMINOS
Die Form, Farbe und der Objektgrid jedes Tetromino wird übersichtlichkeitshalber in einer eigenen Javascript Datei definiert (O.js, S.js,usw.). 
Zusätzlich wird in jeder Tetromino-Datei ein Objekt erstellt, mittels der Funktion tetrominoConstructor() (Tetris.js) und anschließend in das Array tetrominos[] gespeichert. Aufgerufen werden die Dateien einmalig in initBuffer() (Tetris.js). 
Jedes Objekt hat seinen eigenen Namen, Farbwerte, blocks, sowie individuelle positionen im golbalGrid sowie im drawGrid. Gelandete Elemente werden im Array landedElems[] gespeichert und in drawScene() fortlaufend gezeichnet.

STEUERUNG
-----------------------
Die Steuerung wird in keyHandler.js, mittels event-handling realisiert.

KOLLISIONSABFRAGE
-----------------------
In collisionDetection.js wird im globalGrid auf Kollisionen kontrolliert. checkSpawnPosition() prüft die Startposition und liefert false zurück, wenn sie besetzt ist, was zum gameOver() führt. 
checkGrid() hingegen kontrolliert bei jeder Bewegung den globalGrid. Ist ein Objekt gelandet, so wird die Funktion drawInGrid() aufgerufen, welche den ObjectGrid des Tetrominos in den globalGrid mit '1' speichert.

TETRIS.JS
-----------------------
Hier sind alle essentiellen Funktionen implementiert, die für das aktuelle lauffähige Tetris Programm notwendig sind.

tetrominoConstructor(name, items,posSize,colSize, blocks, colors, vertexIndices, objectGrid0, objectGrid90, objectGrid180, objectGrid270, startPointGrid, endPointGrid, topleft): Erzeuge ein neues Tetromino Objekt.

spawn(elem): Überwacht, ob ein Element gelandet ist oder nicht. Nicht Gelandet: Zeichne das aktuelle Objekt; Gelandet: Kopiere das aktuelle Element und speichere in landedElems[]

gravity(): Bewege das Objekt in konstanter Geschwindigkeit in -Y Richtung. Speichere gleichzeitig die aktuelle Y-Position des Objekts.
transformationAnimation(): Animiere Roationen und Bewegungen.

webGLStart(): Initialisiert WebGL, den Vertex- und den Fragmentshader, sowie die Buffer fuer die Eckpunkte und Farbwerte, behandelt Tastatureingaben und wiederholt das Programm

initGL(canvas): Initialisiere WebGL (Web Graphic Libary) und waehlt den Rendering Context WebGL fuer das Canvas Element aus.
getShader(gl, id): Ruft den korrekten Shadertyp auf und liefert einen Grafikkarten kompatiblen Shader

initShaders(): Fuegt den Vertexshader (zustaendig fuer Berechnung der Eckpunkte des 3DModels) und den Fragmentshader (zustaendig fuer die Oberflaeche des Modells), zu einem WebGL Programm Objekt (ausfuerbar direkt auf der GraKa) zusammen. Jedes Programm besteht aus jeweils einem Vertex- sowie Fragment- oder Pixelshader.

setMatrixUniforms(): Wandle die Matrizen von Javascript auf WebGL (Grafikkarten-seitig) um, damit die Sichtbarkeit fuer die Shaders garantiert ist.

degToRad(degrees): Umrechnung vom Radiant- zum Grad Winkelmaß

mvPushMatrix(): Speichere die globale mvMatrix (ModelView-) auf einen Stack.

mvPopMatrix(): Lade die letzte Matrix vom Stack.

initBuffers(): Definiere die Objekte mithilfer ihrer Eckpunkte. Fuelle Grafikkarten Buffer mit informationen uber die gewuenschten Objekte.

drawScene(): Zeichnet die Szene inklusive den Objekten und den drawGrid.

animate(): Fuehrt eine Animation aus, wenn der Zielwinkel noch nicht erreicht wurde.

tick(): Aktualisiert das Bild um eine Animation zu erschaffen.

START.HTML
Im Head werden alle Scripts aufgerufen, wobei sich der Code der beiden Shaderscripts (Vertex- und Fragmentshader) direkt in der HTML befindet. Außerdem ist hier natürlich der gesamte HTML Code zum Seitenaufbau enthalten und ruft beim Seitenaufruf sofort die Funktion webGLStart() (in Tetris.js) auf.

WEBGL-UTILS.JS
Liefert das entsprechende unabhängige Refresh-Plugin für den Browser, damit sich dieser Grafik-Änderungen sofort wahrnimmt und darstellt.

GLMATRIX-0.9.5.MIN.JS
Bibliothek die alle mathematischen Matrix operationen beinhaltet.

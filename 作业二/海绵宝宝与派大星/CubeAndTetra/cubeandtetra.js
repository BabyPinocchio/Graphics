"use strict";

var canvas;
var gl;

var Size1=1;
var Size2=1;
var numVertices  = 36;//立方体顶点数
var numCube = 0;
var numTetra= 0;
var iBufferCubeID0 = new Array(30);
var cBufferCubeID0 = new Array(30);
var vBufferCubeID0 = new Array(30);

var iBufferTetraID0 = new Array(30);
var cBufferTetraID0 = new Array(30);
var vBufferTetraID0 = new Array(30);

var vColor0 = new Array(30);
var vPosition0 = new Array(30);

var vColor1 = new Array(30);
var vPosition1 = new Array(30);

var CurModelViewMatrix = mat4(); //当前变换矩阵
var CurModelViewMatrixLoc; //shader 变量
var CubeTx = 0; //立方体平移量
var TetraTx = 0; //四面体平移量
var CubeRotateAngle = 0; //立方体旋转角度
var TetraRotateAngle = 0; //四面体旋转角度
var position=[0,0,0];
var T1 = mat4();
var R1 =mat4();

var S1 =mat4();
var T2 = mat4();
var R2 =mat4();

var S2 =mat4();
    var verticesCube = [];
    var colorsCube = [];
    var indicesCube = [];
    //立方体
    var cVertices;
    var cColors;
    var cIndices;
    function cube(x1,y1,z1,x2,y2,z2,colors)
    {
        var cVertices = [
            vec3(x1,y1,z1),
            vec3(x1,y2,z1),
            vec3(x2,y2,z1),
            vec3(x2,y1,z1),
            vec3(x1,y1,z2),
            vec3(x1,y2,z2),
            vec3(x2,y2,z2),
            vec3(x2,y1,z2),
        ];
        var cColors = colors;
        var cIndices = [
            0,1,2,
            1,2,3,
            4,1,0,
            4,1,5,
            4,6,5,
            4,6,7,
            2,7,6,
            2,7,3,
            1,6,2,
            1,6,5,
            0,7,4,
            0,7,3
        ];
        verticesCube.push(cVertices);
        colorsCube.push(cColors);
        indicesCube.push(cIndices);
        numCube++;
    }

    //四面体
    var verticesTetra = [];
    var colorsTetra = [];
    var indicesTetra = [];
    
    var tVertices;
    var tColors;
    var tIndices;
    
    function Tetra(x1,y1,z1,x2,y2,z2,x3,y3,z3,x4,y4,z4,colors)
    {
        var tVertices = [
            vec3(x1,y1,z1),
            vec3(x2,y2,z2),
            vec3(x3,y3,z3),
            vec3(x4,y4,z4),
        ];
        var tColors = colors;
        var tIndices = [
            0,3,1,
            0,2,1,
            1,3,2,
            0,3,2
        ];

        verticesTetra.push(tVertices);
        colorsTetra.push(tColors);
        indicesTetra.push(tIndices);
        numTetra++;
    }
    var colorYellow = [
        vec4( 1.0, 1.0, 0.0, 1.0 ),  
        vec4( 1.0, 1.0, 0.0, 1.0 ),
        vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow
        vec4( 1.0, 1.0, 0.0, 1.0 ), 
        vec4( 1.0, 1.0, 0.0, 1.0 ),
        vec4( 1.0, 1.0, 0.0, 1.0 ),
        vec4( 1.0, 1.0, 0.0, 1.0 ),
        vec4( 1.0, 1.0, 0.0, 1.0 ),   
    ];
    var colorBlack = [
        vec4( 0.0, 0.0, 0.0, 1.0 ),  //black
        vec4( 0.0, 0.0, 0.0, 1.0 ),
        vec4( 0.0, 0.0, 0.0, 1.0 ),  
        vec4( 0.0, 0.0, 0.0, 1.0 ),
        vec4( 0.0, 0.0, 0.0, 1.0 ),
        vec4( 0.0, 0.0, 0.0, 1.0 ),
        vec4( 0.0, 0.0, 0.0, 1.0 ),  
        vec4( 0.0, 0.0, 0.0, 1.0 ),
    ];
    var colorWhite=[
        vec4( 1.0, 1.0, 1.0, 1.0 ),  //white
        vec4( 1.0, 1.0, 1.0, 1.0 ),
        vec4( 1.0, 1.0, 1.0, 1.0 ),  
        vec4( 1.0, 1.0, 1.0, 1.0 ),
        vec4( 1.0, 1.0, 1.0, 1.0 ),
        vec4( 1.0, 1.0, 1.0, 1.0 ),
        vec4( 1.0, 1.0, 1.0, 1.0 ),  
        vec4( 1.0, 1.0, 1.0, 1.0 ),
    ];
    var colorBrown=[
        vec4( 150/255, 75/255, 0, 1.0 ),  //brown
        vec4( 150/255, 75/255, 0, 1.0 ),
        vec4( 150/255, 75/255, 0, 1.0 ),  
        vec4( 150/255, 75/255, 0, 1.0 ),
        vec4( 150/255, 75/255, 0, 1.0 ),
        vec4( 150/255, 75/255, 0, 1.0 ),
        vec4( 150/255, 75/255, 0, 1.0 ),  
        vec4( 150/255, 75/255, 0, 1.0 ),
    ];
    var colorBlue=[
        vec4( 65/255, 105/255, 225/255, 1.0 ),  //blue
        vec4( 65/255, 105/255, 225/255, 1.0 ),
        vec4( 65/255, 105/255, 225/255, 1.0 ),  
        vec4( 65/255, 105/255, 225/255, 1.0 ),
        vec4( 65/255, 105/255, 225/255, 1.0 ),
        vec4( 65/255, 105/255, 225/255, 1.0 ),
        vec4( 65/255, 105/255, 225/255, 1.0 ),  
        vec4( 65/255, 105/255, 225/255, 1.0 ),
    ];
    var colorRed=[
        vec4( 1.0, 0.0, 0.0, 1.0 ),  //red
        vec4( 1.0, 0.0, 0.0, 1.0 ),
        vec4( 1.0, 0.0, 0.0, 1.0 ),
        vec4( 1.0, 0.0, 0.0, 1.0 ),
        vec4( 1.0, 0.0, 0.0, 1.0 ),
        vec4( 1.0, 0.0, 0.0, 1.0 ),
        vec4( 1.0, 0.0, 0.0, 1.0 ),
        vec4( 1.0, 0.0, 0.0, 1.0 ),
    ];
    var colorCoffee=[
        vec4( 96/255, 57/255, 18/255, 1.0 ),  //coffee
        vec4( 96/255, 57/255, 18/255, 1.0 ),
        vec4( 96/255, 57/255, 18/255, 1.0 ),
        vec4( 96/255, 57/255, 18/255, 1.0 ),
        vec4( 96/255, 57/255, 18/255, 1.0 ),
        vec4( 96/255, 57/255, 18/255, 1.0 ),
        vec4( 96/255, 57/255, 18/255, 1.0 ),
        vec4( 96/255, 57/255, 18/255, 1.0 ),
    ];
    var colorWarmGrey=[
        vec4( 128/255, 128/255, 105/255, 1.0 ),  //warm grey
        vec4( 128/255, 128/255, 105/255, 1.0 ),
        vec4( 128/255, 128/255, 105/255, 1.0 ),
        vec4( 128/255, 128/255, 105/255, 1.0 ),
        vec4( 128/255, 128/255, 105/255, 1.0 ),
        vec4( 128/255, 128/255, 105/255, 1.0 ),
        vec4( 128/255, 128/255, 105/255, 1.0 ),
        vec4( 128/255, 128/255, 105/255, 1.0 ),
    ];
    var colorPink=[
        vec4(242/255, 83/255, 159/255, 1.0),//pink
        vec4(242/255, 83/255, 159/255, 1.0),
        vec4(242/255, 83/255, 159/255, 1.0),
        vec4(242/255, 83/255, 159/255, 1.0),
        vec4(242/255, 83/255, 159/255, 1.0),
        vec4(242/255, 83/255, 159/255, 1.0),
        vec4(242/255, 83/255, 159/255, 1.0),
        vec4(242/255, 83/255, 159/255, 1.0),
    ];
    var colorGreen=[
        vec4(50/255,205/255,50/255,1.0),//green
        vec4(50/255,205/255,50/255,1.0),
        vec4(50/255,205/255,50/255,1.0),
        vec4(50/255,205/255,50/255,1.0),
        vec4(50/255,205/255,50/255,1.0),
        vec4(50/255,205/255,50/255,1.0),
        vec4(50/255,205/255,50/255,1.0),
        vec4(50/255,205/255,50/255,1.0),
    ]
    var colorPurple=[
        vec4(148/255,0,211/255,1.0),//purple
        vec4(148/255,0,211/255,1.0),
        vec4(148/255,0,211/255,1.0),
        vec4(148/255,0,211/255,1.0),
        vec4(148/255,0,211/255,1.0),
        vec4(148/255,0,211/255,1.0),
        vec4(148/255,0,211/255,1.0),
        vec4(148/255,0,211/255,1.0),
    ]
    cube(-0.25,0.3,-0.1,0.25,-0.25,0.1,colorYellow);//身体
    cube(-0.15,-0.30,-0.07,-0.1,-0.4,0.07,colorBlack);//左腿
    cube(0.1,-0.30,-0.07,0.15,-0.4,0.07,colorBlack);//右腿
    cube(0.28,0.02,-0.07,0.37,-0.01,0.07,colorBlack);//左臂
    cube(-0.37,0.02,-0.07,-0.28,-0.01,0.07,colorBlack);//右臂
    cube(-0.2,0.2,-0.10,-0.05,0.05,-0.12,colorWhite);//左眼
    cube(0.05,0.2,-0.10,0.2,0.05,-0.12,colorWhite);//右眼
    cube(-0.14,0.14,-0.12,-0.05,0.05,-0.15,colorBlue);//左眼球
    cube(0.05,0.14,-0.12,0.14,0.05,-0.15,colorBlue);//右眼球
    cube(-0.26,-0.17,0.12,0.26,-0.26,-0.12,colorBrown);//背带裤
    cube(-0.12,0.12,-0.15,-0.05,0.06,-0.18,colorBlack);//左眼球球
    cube(0.05,0.12,-0.15,0.12,0.06,-0.18,colorBlack);//右眼球球
    cube(-0.26,-0.10,0.12,0.26,-0.17,-0.12,colorWhite);//衬衫
    cube(-0.02,-0.10,-0.12,0.02,-0.19,-0.15,colorRed);//领带
    cube(-0.08,0,-0.10,0.08,-0.02,-0.12,colorBlack);//嘴
    cube(-0.04,-0.01,-0.10,-0.005,-0.04,-0.12,colorWhite);//左牙
    cube(0.005,-0.01,-0.10,0.04,-0.04,-0.12,colorWhite);//右牙
    cube(-0.20,-0.25,-0.08,-0.05,-0.30,0.08,colorCoffee);//左裤子
    cube(0.05,-0.25,-0.08,0.20,-0.30,0.08,colorCoffee);//右裤子
    cube(-0.28,0.05,-0.08,-0.25,-0.04,0.08,colorWhite);//左袖子
    cube(0.25,0.05,-0.08,0.28,-0.04,0.08,colorWhite);//右袖子
    cube(-0.175,-0.40,-0.1,-0.09,-0.42,0.1,colorWarmGrey);//左鞋子
    cube(0.09,-0.40,-0.1,0.175,-0.42,0.1,colorWarmGrey);//右鞋子

    Tetra(-0.3,-0.25,-0.1,0.3,-0.25,-0.1,0,-0.25,0.1,0,0.5,-0.1,colorPink);
    Tetra(0.1,0.25,-0.1,0.2,0,-0.1,0,0,0,0.38,-0.15,-0.1,colorPink);//右胳膊
    Tetra(-0.1,0.25,-0.1,-0.2,0,-0.1,0,0,0,-0.38,-0.15,-0.1,colorPink);//左胳膊
    Tetra(0.20,-0.25,-0.1,0.13,-0.38,-0.1,0.06,-0.25,-0.1,0.13,-0.25,0,colorPink);//右腿
    Tetra(-0.06,-0.25,-0.1,-0.13,-0.38,-0.1,-0.20,-0.25,-0.1,-0.13,-0.25,0,colorPink);//左腿
    Tetra(0.2,0,-0.12,-0.22,-0.05,-0.12,-0.2,0,-0.12,0,-0.25,0.1,colorGreen);//腰带上
    Tetra(0.2,0,-0.12,-0.22,-0.05,-0.12,0.22,-0.05,-0.12,0,-0.25,0.1,colorGreen);//腰带下
    Tetra(0.22,-0.05,-0.12,-0.22,-0.05,-0.12,-0.3,-0.25,-0.12,0,-0.25,0.1,colorPurple);//裤子上
    Tetra(-0.3,-0.25,-0.12,0.22,-0.05,-0.12,0.3,-0.25,-0.12,0,-0.25,0.1,colorPurple);//裤子下

    Tetra(0.08,0.15,-0.12,-0.08,0.15,-0.12,-0.0801,0.149,-0.12,0,-0.25,0.1,colorBlack);//嘴巴
    Tetra(-0.02,0.39,-0.12,-0.01,0.39,-0.12,-0.0201,0.39999,-0.12,0,-0.25,0.1,colorBlack);//眉毛
    Tetra(0.02,0.39,-0.12,0.01,0.39,-0.12,0.0201,0.39999,-0.12,0,-0.25,0.1,colorBlack);//眉毛

    

window.onload = function init() {
    canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL isn't available"); }

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(100/255, 149/255, 237/255, 1.0);

    gl.enable(gl.DEPTH_TEST);

    
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);
    for(var i=0; i<numCube; i++){
        //立方体各参数
        // color array atrribute buffer
        cBufferCubeID0[i] = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, cBufferCubeID0[i]);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(colorsCube[i]), gl.STATIC_DRAW);
        vColor0[i] = gl.getAttribLocation(program, "vColor");
        gl.enableVertexAttribArray(vColor0[i]);
    
        // array element buffer
        iBufferCubeID0[i] = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBufferCubeID0[i]);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indicesCube[i]), gl.STATIC_DRAW); //注意类型转换  
        
        //vertex buffer
        vBufferCubeID0[i] = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vBufferCubeID0[i]);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(verticesCube[i]), gl.STATIC_DRAW);
        vPosition0[i] = gl.getAttribLocation(program, "vPosition");
        gl.enableVertexAttribArray(vPosition0[i]);
    }
    for(var i=0; i<numTetra; i++){
        //四面体各参数
        // color array atrribute buffer
        cBufferTetraID0[i] = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, cBufferTetraID0[i]);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(colorsTetra[i]), gl.STATIC_DRAW);
        vColor1[i] = gl.getAttribLocation(program, "vColor");
        gl.enableVertexAttribArray(vColor1[i]);
    
        // array element buffer
        iBufferTetraID0[i] = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBufferTetraID0[i]);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indicesTetra[i]), gl.STATIC_DRAW); //注意类型转换  
        
        //vertex buffer
        vBufferTetraID0[i] = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vBufferTetraID0[i]);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(verticesTetra[i]), gl.STATIC_DRAW);
        vPosition1[i] = gl.getAttribLocation(program, "vPosition");
        gl.enableVertexAttribArray(vPosition1[i]);
    }

    

    CurModelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");

    //event listeners for buttons
    document.getElementById("CubeLeft").onclick = function() {
        CubeTx -= 0.1;
        T1 = translate(-CubeTx*Math.sin(radians(CubeRotateAngle)), 0.0,
            CubeTx*Math.cos(radians(CubeRotateAngle)));
        
    };
    document.getElementById("CubeRight").onclick = function() {
        CubeTx += 0.1;
        T1 = translate(-CubeTx*Math.sin(radians(CubeRotateAngle)), 0.0, 
            CubeTx*Math.cos(radians(CubeRotateAngle)));
        
    };
    document.getElementById("CubeR1").onclick = function() {
        CubeRotateAngle -= 5;
        R1 = rotateY(CubeRotateAngle);
        
    };
    document.getElementById("CubeR2").onclick = function() {
        CubeRotateAngle += 5;
        R1 = rotateY(CubeRotateAngle);
    };
    document.getElementById("Obj1Shrink").onclick = function() {
        Size1 -= 0.2;
        S1 = scalem(Size1,Size1,Size1);
        
    };
    document.getElementById("Obj1Enlarge").onclick = function() {
        Size1 += 0.2;
        S1 = scalem(Size1,Size1,Size1);
        
    };
    

    document.getElementById("TetraLeft").onclick = function() {
        TetraTx -= 0.1;
        T2 = translate(-TetraTx*Math.sin(radians(TetraRotateAngle)), 0.0,
            TetraTx*Math.cos(radians(TetraRotateAngle)));
        
    };
    document.getElementById("TetraRight").onclick = function() {
        TetraTx += 0.1;
        T2 = translate(-TetraTx*Math.sin(radians(TetraRotateAngle)), 0.0, 
            TetraTx*Math.cos(radians(TetraRotateAngle)));
        
    };
    document.getElementById("TetraR1").onclick = function() {
        TetraRotateAngle -= 5;
        R2 = rotateY(TetraRotateAngle);
    };
    document.getElementById("TetraR2").onclick = function() {
        TetraRotateAngle += 5;
        R2 = rotateY(TetraRotateAngle);
        
    };
    document.getElementById("Obj2Shrink").onclick = function() {
        Size2 -= 0.2;
        S2 = scalem(Size2,Size2,Size2);
        
    };
    document.getElementById("Obj2Enlarge").onclick = function() {
        Size2 += 0.2;
        S2 = scalem(Size2,Size2,Size2);
       
    };

    render();
}

function render() {

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    CurModelViewMatrix = mult(T1, mult(R1, S1));
    gl.uniformMatrix4fv(CurModelViewMatrixLoc, false, flatten(CurModelViewMatrix));
    
    for(var i=0; i<numCube; i++){
        gl.bindBuffer(gl.ARRAY_BUFFER, cBufferCubeID0[i]);
        gl.vertexAttribPointer(vColor0[i], 4, gl.FLOAT, false, 0, 0);
        //立方体顶点
        gl.bindBuffer(gl.ARRAY_BUFFER, vBufferCubeID0[i]);
        gl.vertexAttribPointer(vPosition0[i], 3, gl.FLOAT, false, 0, 0);
        //立方体索引
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBufferCubeID0[i]);

        //绘制立方体
        gl.drawElements(gl.TRIANGLES, numVertices, gl.UNSIGNED_BYTE, 0);
    }
    CurModelViewMatrix = mult(T2, mult(R2, S2));
    gl.uniformMatrix4fv(CurModelViewMatrixLoc, false, flatten(CurModelViewMatrix));

    for(var i=0;i<numTetra;i++)
    {
        TetraTx = 0.6;
        
        gl.bindBuffer(gl.ARRAY_BUFFER, cBufferTetraID0[i]);
        gl.vertexAttribPointer(vColor1[i], 4, gl.FLOAT, false, 0, 0);
        //四面体顶点
        gl.bindBuffer(gl.ARRAY_BUFFER, vBufferTetraID0[i]);
        gl.vertexAttribPointer(vPosition1[i], 3, gl.FLOAT, false, 0, 0);
        //四面体索引
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBufferTetraID0[i]);

        //绘制四面体
        gl.drawElements(gl.TRIANGLES, 12, gl.UNSIGNED_BYTE, 0);
        TetraTx-=0.6;

    }
    
    
    requestAnimFrame(render);
}

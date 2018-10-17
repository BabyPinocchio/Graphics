var gl; 
var points;
var circles=0;
var ellipses=0;
var lines=0;
var triangles=0;
var semicircles=0;
var rectangles=0;
window.onload = function init(){
    var canvas = document.getElementById( "gl-canvas" );
    gl = WebGLUtils.setupWebGL( canvas ); 

    if ( !gl ) { alert( "WebGL isn't available" );
}
// Nine Vertices
var vertices = [];

var vertexColors = [];
black=vec4(0.0, 0.0, 0.0, 1.0);
white=vec4(1.0, 1.0, 1.0, 1.0);
blue=vec4(40/255, 160/255, 254/255, 1.0);
red=vec4(203/255, 64/255,66/255, 1.0);
orange=vec4(241/255, 104/255,103/255, 1.0);
gray=vec4(215/255, 196/255,187/255, 1.0)


// circle(vertices,vertexColors,
//     0.0,
//     -0.3,
//     0.6,
//     blue); //body
circle(vertices,vertexColors,
    0.0,
    0.5,
    0.5,
    blue); //head
circle(vertices,vertexColors,
    0.0,
    0.375,
    0.3735,
    white); //face
circle(vertices,vertexColors,
    0.0,
    0.63,
    0.04,
    red); //nose

ellipse(vertices,vertexColors,-0.08,0.75,0.08,0.12,gray);//left eye
ellipse(vertices,vertexColors,0.08,0.75,0.08,0.12,gray);//right eye
circle(vertices,vertexColors,
    -0.03,
    0.75,
    0.03,
    black); //left eye
circle(vertices,vertexColors,
    0.03,
    0.75,
    0.03,
    black); //right eye

semicircle(vertices,vertexColors,
    0.0,
    0.31,
    0.26,
    orange); 
//mouth

line(vertices,vertexColors,0,0.59,0,0.31,black);//nose-mouth
line(vertices,vertexColors,-0.04,0.47,-0.28,0.47,black);//moustache
line(vertices,vertexColors,0.04,0.47,0.28,0.47,black);//moustache
line(vertices,vertexColors,-0.04,0.52,-0.26,0.57,black);//moustache
line(vertices,vertexColors,0.04,0.52,0.26,0.57,black);//moustache
line(vertices,vertexColors,-0.04,0.42,-0.26,0.37,black);//moustache
line(vertices,vertexColors,0.04,0.42,0.26,0.37,black);//moustache
line(vertices,vertexColors,-0.26,0.31,0.26,0.31,black);//mouth

// triangle(vertices,vertexColors,0.2,-0.1,-0.2,-0.1,-0.2,-0.5,white);
// triangle(vertices,vertexColors,0.2,-0.1,-0.2,-0.5,0.2,-0.5,white);

//  Configure WebGL
gl.viewport( 0, 0, canvas.width, canvas.height );
gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

//  Load shaders and initialize attribute buffers
var program=initShaders(gl,"vertex-shader","fragment-shader");
gl.useProgram( program );

//color array atrribute buffer
var cBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
gl.bufferData(gl.ARRAY_BUFFER, flatten(vertexColors), gl.STATIC_DRAW);

var vColor = gl.getAttribLocation(program, "vColor");
gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(vColor);

// Load the data into the GPU
var bufferId = gl.createBuffer(); 
gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

// Associate out shader variables with our data buffer
var vPosition = gl.getAttribLocation( program, "vPosition" );
gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
gl.enableVertexAttribArray( vPosition ); 
render(); 
};

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLES, 0, triangles*3);      
    for(i=0;i<circles+ellipses;i++){
        gl.drawArrays( gl.TRIANGLE_FAN, triangles*3+i*362, 362);       
    }
    for(i=0;i<semicircles;i++){
        gl.drawArrays( gl.TRIANGLE_FAN, triangles*3+(circles+ellipses)*362+i*181, 181);       
    }
    for(i=0;i<lines;i++){        
        gl.drawArrays(gl.LINES,(circles+ellipses)*362+triangles*3+i*2+semicircles*181,2);
    }
}

function circle(vertices,vertexColors,centerx,centery,radis,colour){
    for(var i=0;i<362;i++){
        vertices.push(vec2(centerx+radis*Math.cos(i/360*6.28),centery+radis*Math.sin(i/360*6.28)));
        vertexColors.push(colour);
    }
    circles++;
}

function ellipse(vertices,vertexColors,centerx,centery,radisx,radisy,colour){
    for(var i=0;i<362;i++){
        vertices.push(vec2(centerx+radisx*Math.cos(i/360*6.28),centery+radisy*Math.sin(i/360*6.28)));
    vertexColors.push(colour);
    }
    ellipses++;
}
function semicircle(vertices,vertexColors,centerx,centery,radis,colour){
    var points = 360;
    for(var i=0;i<181;i++){
        angle = 6.28 * (i+180) / points;
        vertices.push(vec2(centerx+radis*Math.cos(angle),centery+radis*Math.sin(angle)));
        if(i!=0)
            vertexColors.push(colour);
        else
            vertexColors.push(white);
    }
    semicircles++;
}

function line(vertices,vertexColors,x1,y1,x2,y2,colour){  
    vertices.push(vec2(x1,y1));
    vertices.push(vec2(x2,y2));
    vertexColors.push(colour);
    vertexColors.push(colour);    
    lines++;
}
function triangle(vertices,vertexColors,x1,y1,x2,y2,x3,y3,colour){  
    vertices.push(vec2(x1,y1));
    vertices.push(vec2(x2,y2));
    vertices.push(vec2(x3,y3));    
    vertexColors.push(colour,colour,colour);  
    triangles++;
}
// function reline(vertices,vertexColors,x1,y1,x2,y2,colour){  
//     vertices.push(vec2(x1,y1));
//     vertices.push(vec2(x2,y2));
//     vertexColors.push(colour);
//     vertexColors.push(colour);
// }
// function rectangle(vertices,vertexColors,x1,y1,x2,y2,x3,y3,x4,y4,colour){  
//     reline(vertices,vertexColors,x1,y1,x2,y2,colour);
//     reline(vertices,vertexColors,x2,y2,x3,y3,colour);
//     reline(vertices,vertexColors,x3,y3,x4,y4,colour);
//     reline(vertices,vertexColors,x4,y4,x1,y1,colour);
//     rectangles++;
// }

// function semicircle(vertices,vertexColors,centerx,centery,radis,colour){
//     for(var i=180;i<362;i++){
//         vertices.push(vec2(centerx+radis*Math.cos(i/360*6.28),centery+radis*Math.sin(i/360*6.28)));
//         if(i!=0)
//             vertexColors.push(colour);
//         else
//             vertexColors.push(white);
//     }
//     semicircles++;
// }
// function triangle(vertices,vertexColors,x1,y1,x2,y2,x3,y3,colour){  
//     vertices.push(vec2(x1,y1));
//     vertices.push(vec2(x2,y2));
//     vertices.push(vec2(x3,y3));    
//     vertexColors.push(colour,colour,colour);  
//     triangles++;
// }

// blue=vec4(46/255, 169/255, 223/255, 1.0);
// red=vec4(203/255, 64/255,66/255, 1.0);
// orange=vec4(241/255, 124/255,103/255, 1.0)
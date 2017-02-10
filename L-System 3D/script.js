//created by Jose Suarez Principe
var escena;
var camara;
var control;
var renderer;
var longitud;
var i = 0,j = 0;
var tamLinea = 1;

var ArbolA;

var listaReglas;

$(function () {

    listaReglas = new Array();
    listaReglas.push("F[+F]/F\\F^[F&F]");
    listaReglas.push("F[-F]F&[F/F]^[-F]/F");

    ArbolA = new Arbol("++++F",listaReglas,22.5); // angulo
    dibujar(ArbolA,"arbol1");//enviamos el Arbol y el Div en donde se dibujar

    window.addEventListener( 'resize', onWindowResize, false );
});

function dibujar(Arbol,div) {

    var arbol = Arbol;
    var axioma = hallarAxiomaFinal(arbol.reglas,arbol.axioma);
    dibujarArbol(axioma,arbol.angulo,div);

}

function hallarAxiomaFinal(reglaArbol,axiomaArbol) {

    var regla = reglaArbol;
    var axioma = axiomaArbol;
    var axiomaFinal = "";

    for(i=0;i<5;i++){
        longitud = axioma.length;
        for(j=0;j<longitud;j++){
            if(axioma[j] == 'F'){

                //estocasticos
                var indice = parseInt(Math.random()*10)%2;
                axiomaFinal = axiomaFinal + regla[indice];
            }
            else{
                axiomaFinal = axiomaFinal + axioma[j];
            }
        }
        axioma = axiomaFinal;
        axiomaFinal = "";
    }

    //alert(axioma);
    return axioma;

}

function dibujarArbol(axioma,angulo,div) {

    escena = new THREE.Scene();
    camara = new THREE.PerspectiveCamera();

    camara.position.set(0,0,200);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth,window.innerHeight);
    document.getElementById(div).appendChild(renderer.domElement);


    var geometry;
    var material;
    var figura;
    var orientacionZ = 0;
    var orientacionX = 0;
    var orientacionY = 0;
    var xi=0,yi=-90,xf=0,yf=0,zi=0,zf=0;

    var stackNodo = new Array();
    var nodoActual = new Nodo(0,0,0.0);

    for(i=0;i<axioma.length;i++){

        if(axioma[i] == '+'){
            orientacionZ += angulo;
        }
        else if(axioma[i] == '-'){
            orientacionZ -= angulo;
        }
        else if(axioma[i] == '/'){
            orientacionX += angulo;
        }
        else if(axioma[i] == '\\'){
            orientacionX -= angulo;
        }
        else if(axioma[i] == '^'){
            orientacionY += angulo;
        }
        else if(axioma[i] == '&'){
            orientacionY -= angulo;
        }
        else if(axioma[i] == 'F'){

            //angulo en Z
            xf = xi + tamLinea * Math.cos(orientacionZ * Math.PI / 180 );
            yf = yi + tamLinea * Math.sin(orientacionZ * Math.PI / 180 );
            zf = zi;

            //angulo en X
            xf = xf;
            yf = yf + tamLinea * Math.cos(orientacionX * Math.PI / 180 );
            zf = zf + tamLinea * Math.sin(orientacionX * Math.PI / 180 );

            //angulo en Y
            xf = xf + tamLinea * Math.sin(orientacionY * Math.PI / 180 );
            yf = yf;
            zf = zf + tamLinea * Math.cos(orientacionY * Math.PI / 180 );

            geometry = new THREE.Geometry();
            geometry.vertices.push(new THREE.Vector3(xi,yi,zi));
            geometry.vertices.push(new THREE.Vector3(xf,yf,zf));

            material = new THREE.LineBasicMaterial({color : 0x2FEF16});

            figura = new THREE.Line(geometry,material);
            escena.add(figura);

            xi = xf;
            yi = yf;
            zi = zf;

        }
        else if(axioma[i] == '['){

            stackNodo.push(new Nodo(xi,yi,zi,orientacionX,orientacionY,orientacionZ));

        }
        else if(axioma[i] == ']'){

            nodoActual = stackNodo.pop();
            xi = nodoActual.x;
            yi = nodoActual.y;
            zi = nodoActual.z;
            orientacionX = nodoActual.anguloX;
            orientacionY = nodoActual.anguloY;
            orientacionZ = nodoActual.anguloZ;
        }
    }

    control = new THREE.OrbitControls(camara,renderer.domElement);
    animacion();
}

function animacion() {
    requestAnimationFrame(animacion);
    renderGrafica();
}

function renderGrafica() {
    control.update();
    renderer.render(escena,camara);
}


//clase Arbol
function Arbol(axiom,reglas,angulo) {

    this.axioma = axiom;
    this.reglas = reglas;
    this.angulo = angulo;

    this.retornarAxioma = function () {
        return this.axioma;
    }

}


//Clase Nodo
function Nodo(x,y,z,anguloX,anguloY,anguloZ) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.anguloX = anguloX;
    this.anguloY = anguloY;
    this.anguloZ = anguloZ;
}


function onWindowResize() {

    camara.aspect = window.innerWidth / window.innerHeight;
    camara.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

//created by Jose Suarez Principe








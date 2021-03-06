/**
 * Created with JetBrains PhpStorm.
 * User: guillaume
 * Date: 10/05/13
 * Time: 07:41
 * To change this template use File | Settings | File Templates.
 */
var tableauPosition = [
    [0, 474]
]; // initialisation du point avec les coordonée minimale  soit (6.5m/s)
var tableauViteseProf = [] //tableau contenant toutes les valeurs converties de la coube soit 650 valeurs. les pixels manquants sont rajouté et calculé
var canvas = $("#canvas");
var ctx = canvas[0].getContext("2d");
var canvasGlobes = $('#canvasGlobe');
var ctxGlobe = canvasGlobes[0].getContext("2d")
makeGraduation()

canvas.on("dblclick", ctx, function (event) {
    $(this).on('mousemove', event.data, clicCanevas);
    $(this).on('click',
        function () {
            $(this).off('mousemove');
            canvas.on('mousemove', ctx, showValues);
            makeTabVitesse();
        })
});

dragOn.apply(document.getElementById("dragBox"), {
    moveArea: document.getElementById("container")
});

canvas.on('mousemove', ctx, showValues);
circle(400, 400, 300); //Terre
//circle(515, 100, 4, "FF4422") //pount de depart

function clicCanevas(event) {
    var x = event.pageX - $('#canvas').offset().left;
    var y = event.pageY - $('#canvas').offset().top;
    var pos = [];
    pos.push(x, y);

    tracePoint(event.data, x, y, pos);
}
function showValues(event) {
    var x = event.pageX - $('#canvas').offset().left;
    var y = event.pageY - $('#canvas').offset().top;
    var propValueX = x * 6500 / 650, propValueY = 125 - (1 / 4 * y);
    document.getElementById('verticalValue').innerHTML = propValueY;
    document.getElementById('horizontalValue').innerHTML = propValueX;
}
function tracePoint(ctx, x, y, posTab) {

    var lenght = tableauPosition.length;
    var lenth2 = lenght - 1;
    console.log("lenth: " + lenght + " lenth2: " + lenth2 + " pos : " + posTab + "x: " + x + "y: " + y);

    var propValueY = 125 - (1 / 4 * y);
    var tabVitesse = [];


    if (lenght == 0 || posTab[0] > tableauPosition[lenth2][0]) {
        tableauPosition.push(posTab);
        traceLigneTempsReel(posTab[0], posTab[1]);
    }
    else {

    }
}
function circle(x, y, radus, color) {
    ctxGlobe.beginPath();
    ctxGlobe.lineWidth = "2";
    ctxGlobe.arc(x, y, radus, 0, 2 * Math.PI);
    if (color) {
        ctxGlobe.fillStyle = "#" + color;
        ctxGlobe.fill();
    }
    else {
        ctxGlobe.stroke();
    }
}
function calculateRay() {
    var nbRay = document.getElementById('numberOfRay').value;
    var angle = 180 / (parseInt(nbRay) + 1);
    console.log("l'angle de depart des Rays est de :" + angle + " degreeé");
    return {angle: angle, nbRais: nbRay};
}
function drawLine(fromX, fromY, toX, toY) {
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.strokeStyle = '#FF4422';
    ctx.stroke();
}
function reini() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    tableauPosition = [
        [0, 474]
    ];
    makeGraduation();
}
function traceLigneTempsReel(x, y) {
    var sizeof = tableauPosition.length - 2
    drawLine(tableauPosition[sizeof][0], tableauPosition[sizeof][1], x, y);
}
function makeGraduation() {
    ctx.font = "10pt Calibri,Geneva,Arial";
    ctx.fillStyle = "rgb(0,0,0)";
    ctx.fillText("Vitesse (m/s)", 10, 20);
    ctx.fillText("Profondeur (km)", 550, 490)
    ctx.fillText("- 6.5 M/s", 0, 477)
    ctx.fillText("| 3250Km", 322, 498)
}
function makeTabVitesse() {
    var tabvitesspx = []
    for (i = 0; i < tableauPosition.length; i++) {
        //utilisation de la formule (x'-x1)/(x2-x1)*(y2-y1)
        var ajout = 1
        if (i == tableauPosition.length - 1) {
            ajout = 0
        }
        var intervalToCalculate = tableauPosition[i + ajout][0] - tableauPosition[i][0]
        for (i2 = 0; i2 < intervalToCalculate; i2++) {
            var newX = tableauPosition[i][0] + i2
            var pixelVitese = (newX - tableauPosition[i][0]) / (tableauPosition[i + ajout][0] - tableauPosition[i][0]) * (tableauPosition[i + ajout][1] - tableauPosition[i][1]) + tableauPosition[i][1]
            var temp = [newX, pixelVitese]
            tabvitesspx.push(temp)
        }
    }
    if (tabvitesspx.length < 650) {
        var manque = 650 - tabvitesspx.length
        var lenbth = tabvitesspx.length - 1
        console.log(manque)
        var lastValue = [tabvitesspx[lenbth][0], tabvitesspx[lenbth][1]]
        console.log(lastValue)
        for (i7 = 0; i7 < manque; i7++) {
            var newi = i7 + 1 + lenbth
            y = lastValue[1]
            tabvitesspx.push([newi, y])
        }
    }

    //boulcle a faire pour resortir des vitesse et des profondeur dans un tableau :
    for (i3 = 0; i3 < tabvitesspx.length; i3++) {
        var propValueX = tabvitesspx[i3][0] * 6500 / 650
        var propValueY = 125 - (1 / 4 * tabvitesspx[i3][1]);
        temp = propValueY
        tableauViteseProf.push(temp);
    }
    terre.tabVitesses = tableauViteseProf;
}
function minimizeGraph() {
    document.getElementById("dragBox").style.display = 'none';
    document.getElementById("minimizeGraph").innerHTML = '<button type="button" class="btn" onclick="maximizeGraph();">Graphique</button>';
}

function maximizeGraph() {
    document.getElementById("dragBox").style.display = '';
    document.getElementById("minimizeGraph").innerHTML = '';
}

function startGeneration() {
    //alert("Hi !");
    var tabRais = [];
    var r = calculateRay();
    for (var i = 0; i < r.nbRais; i++) {
        tabRais[i] = new Rai(r.angle * (i+1) );
    }
    tabRaisEnCour = (function (x) {
        var tab = [];
        for (var i = 0; i < x; i++) {
            tab.push(i);
        }
        return tab;
    })(r.nbRais)

    console.log(tabRaisEnCour);

    var xA = 0, xB = 0, yA = 0, yB = 0, position = {x: 0, y: 0}, t = {};

    for (var i = 0; i < 100; i++) {

        for (var j = 0, jMax = tabRaisEnCour.length; j < jMax; j++) {
        	t = tabRais[ tabRaisEnCour[j] ];
        	//if (t.prof<0) continue;
            xA = t.posX;
            yA = t.posY;

            t.vitessePrecedente = t.vitesse;
            t.vitesse = t.vitesse2();
            t.nouvellePosition();
            t.angleIncidence = t.nouvelAngle();


            ctxGlobe.beginPath();
            ctxGlobe.moveTo(xA, yA);
            ctxGlobe.lineTo(t.posX, t.posY);
            ctxGlobe.strokeStyle = t.couleur;
            ctxGlobe.stroke();

            
            console.log(tabRaisEnCour[j], t, j, i)
        }
    }

    /*
     xA = tabRais[1].posX;
     yA = tabRais[1].posY;

     tabRais[1].vitessePrecedente = tabRais[1].vitesse;
     tabRais[1].vitesse = tabRais[1].vitesse2();
     position = tabRais[1].nouvellePosition();
     tabRais[1].angleIncidence = tabRais[1].nouvelAngle();

     ctxGlobe.beginPath();
     ctxGlobe.moveTo(xA, yA);
     ctxGlobe.lineTo(position.x, position.y);
     ctxGlobe.strokeStyle = '#FF4422';
     ctxGlobe.stroke();

     tabRais[1].posX = position.x;
     tabRais[1].posY = position.y;
     tabRais[1].prof = tabRais[1].profondeur();

     console.log(tabRais[1])*/
}
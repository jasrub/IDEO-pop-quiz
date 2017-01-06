/**
 * Created by jasrub on 1/5/17.
 */

var values = {
    paths: 30,
    minPoints: 5,
    maxPoints: 22,
    minRadius: 80,
    maxRadius: 200
};

var hitOptions = {
    segments: true,
    stroke: true,
    fill: true,
    tolerance: 5
};

var creatures = []
function randomBlob(center){
    var radiusDelta = values.maxRadius - values.minRadius;
    var pointsDelta = values.maxPoints - values.minPoints;
    var radius = values.minRadius + Math.random() * radiusDelta;
    var points = values.minPoints + Math.floor(Math.random() * pointsDelta);
    creatures.push(createBlob(center, radius, points));
}

function createBlob(center, maxRadius, points) {
    var path = new Path();
    path.closed = true;
    for (var i = 0; i < points; i++) {
        var delta = new Point({
            length: (maxRadius * 0.5) + (Math.random() * maxRadius * 0.5),
            angle: (360 / points) * i
        });
        path.add(center + delta);
    }
    path.smooth();

    var lightness = 0.8; //(Math.random() - 0.5) * 0.4 + 0.4;
    var hue = Math.random() * 360;
    path.fillColor = { hue: hue, saturation: 0.6, lightness: lightness };
    path.strokeColor = 'black';

    var group = new Group();
    group.addChild(path);
    group.addChildren(createEyes(center, maxRadius));
    group.addChild(createMouth(center, maxRadius));

    // When the mouse is double clicked on the item, remove it:
    group.onDoubleClick = function(event) {
        console.log(this);
        this.removeChildren();
        this.remove();
    }
    group.onMouseDrag = function(event) {
        this.position += event.delta;
    }
}

function createMouth(center, maxRadius) {

    var mouth = new Path();
    mouth.strokeColor = 'black';

    var length = 30;//0.5 * (minRadius + maxRadius);

    var pts = 3 + Math.random() * 5;

    mouthOffset = new Point(0, Math.random() * 30);

    for (var i = 0; i < pts; i++) {
        var r = Math.random() * 10;
        mouth.add(center + mouthOffset + new Point({ length: length + r, angle: 180 / pts * i }));
    }

    mouth.smooth();
    return mouth;

}

function createEyes(center, maxRadius){
    var eyeMinSize = 3;
    var eyeMaxSize = 15;
    var r1 = getRandomArbitrary(eyeMinSize, eyeMaxSize);
    var r2 = getRandomArbitrary(eyeMinSize, eyeMaxSize);
    var eyesColor = new Color(Math.random());
    var eyeOffset = getRandomArbitrary((r1+r2)/2, maxRadius * 0.5)
    var eye1 = new Path.Circle({
        radius: r1,
        center: [center.x+eyeOffset, center.y],
        strokeColor: 'black',
        fillColor: eyesColor

    });
    var eye2 = new Path.Circle({
        radius: r2,
        center: [center.x-eyeOffset, center.y],
        strokeColor: 'black',
        fillColor:eyesColor
    });
    return [eye1, eye2]
}


function onMouseDown(event) {
    var hitResult = project.hitTest(event.point, hitOptions);
    if (!hitResult) {
        randomBlob(event.point);
        return;
    }
}

// Returns a random number between min (inclusive) and max (exclusive)
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

//currently name doesn't seem to work in some browsers.
//Save SVG from paper.js as a file.
var downloadAsSVG = function (fileName) {

    if(!fileName) {
        fileName = "creature_generator.svg"
    }

    var url = "data:image/svg+xml;utf8," + encodeURIComponent(project.exportSVG({asString:true}));

    var link = document.createElement("a");
    link.download = fileName;
    link.href = url;
    link.click();
}


//Listen for SHIFT-P to save content as SVG file.
function onKeyUp(event) {
    if(event.character == "P") {
        downloadAsSVG();
    }
}
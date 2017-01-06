/**
 * Created by jasrub on 1/5/17.
 */


function onMouseDown(event) {
    var hue = Math.random() * 360;
    project.currentStyle.fillColor = {
        hue: hue,
        saturation: 1,
        brightness: 1
    };
}

function onMouseDrag(event) {
    var delta = event.point - event.downPoint;
    var radius = delta.length;
    var points = 5 + Math.round(radius / 50);
    var path = new Path.Star({
        center: event.downPoint,
        points: points,
        radius1: radius / 2,
        radius2: radius
    });
    path.rotate(delta.angle);
    // Remove the path automatically before the next mouse drag
    // event:
    path.removeOnDrag();
}

var values = {
    paths: 30,
    minPoints: 5,
    maxPoints: 18,
    minRadius: 80,
    maxRadius: 200
};

var hitOptions = {
    segments: true,
    stroke: true,
    fill: true,
    tolerance: 5
};

//createPaths();

function createPaths() {
    var radiusDelta = values.maxRadius - values.minRadius;
    var pointsDelta = values.maxPoints - values.minPoints;
    for (var i = 0; i < values.paths; i++) {
        var radius = values.minRadius + Math.random() * radiusDelta;
        var points = values.minPoints + Math.floor(Math.random() * pointsDelta);
        var path = createBlob(view.size * Point.random(), radius, points);
        var lightness = 0.8; //(Math.random() - 0.5) * 0.4 + 0.4;
        var hue = Math.random() * 360;
        path.fillColor = { hue: hue, saturation: 0.6, lightness: lightness };
        path.strokeColor = 'black';
        // When the mouse is double clicked on the item, remove it:
    };
}

function randomBlob(center){
    console.log("random blob!")
    var radiusDelta = values.maxRadius - values.minRadius;
    var pointsDelta = values.maxPoints - values.minPoints;
    var radius = values.minRadius + Math.random() * radiusDelta;
    var points = values.minPoints + Math.floor(Math.random() * pointsDelta);
    var path = createBlob(center, radius, points);
    var lightness = 0.8; //(Math.random() - 0.5) * 0.4 + 0.4;
    var hue = Math.random() * 360;
    path.fillColor = { hue: hue, saturation: 0.6, lightness: lightness };
    path.strokeColor = 'black';
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
    // When the mouse is double clicked on the item, remove it:
    path.onDoubleClick = function(event) {
        this.remove();
    }
    return path;
}

var segment, path;
var movePath = false;
function onMouseDown(event) {
    segment = path = null;
    var hitResult = project.hitTest(event.point, hitOptions);
    if (!hitResult) {
        randomBlob(event.point);
    }

    if (event.modifiers.shift) {
        if (hitResult.type == 'segment') {
            hitResult.segment.remove();
        };
        return;
    }

    if (hitResult) {
        path = hitResult.item;
        if (hitResult.type == 'segment') {
            segment = hitResult.segment;
        } else if (hitResult.type == 'stroke') {
            var location = hitResult.location;
            segment = path.insert(location.index + 1, event.point);
            path.smooth();
        }
    }
    movePath = hitResult.type == 'fill';
    if (movePath)
        project.activeLayer.addChild(hitResult.item);
}

function onMouseMove(event) {
    project.activeLayer.selected = false;
    if (event.item)
        event.item.selected = true;
}

function onMouseDrag(event) {
    if (segment) {
        segment.point += event.delta;
        path.smooth();
    } else if (path) {
        path.position += event.delta;
    }
}
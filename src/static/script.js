const VERSION = "1.1.2"

var points = [];
var selectedPoint;
var dragging = false;

function calculateDistance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

$(document).ready(function () {
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');

    ctx.strokeWidth = 2;
    ctx.lineWidth = 5;
    var img = new Image();

    fetch('/get-image-url')
    .then(response => response.json())
    .then(data => {
        const imageUrl = data.image_url;
        img.src = imageUrl;
    })

    img.onload = function () {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };

    function drawAutonPoint(x, y, isSelected) {
        ctx.beginPath();
        ctx.arc(x, y, 12, 0, 2 * Math.PI, false);

        if (isSelected) drawSquare(x, y);

        ctx.stroke();
    }

    function drawSquare(x, y) {
        ctx.rect(x - 15, y - 15, 30, 30);
    }

    function drawAutonLine(x1, y1, x2, y2) {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }

    function refreshCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        for (var i = 0; i < points.length - 1; i++) {
            drawAutonLine(points[i].x, points[i].y, points[i + 1].x, points[i + 1].y);
        }

        points.forEach(point => drawAutonPoint(point.x, point.y, point === selectedPoint ? true : false));
    }

    $('.canvas').on('contextmenu', function (event) {
        event.preventDefault();

        var x = event.pageX - $(this).offset().left;
        var y = event.pageY - $(this).offset().top;

        drawAutonPoint(x, y);

        points.push({ x: x, y: y });

        $('.x').text(`X: ${x.toFixed(2)}`);
        $('.y').text(`Y: ${y.toFixed(2)}`);

        if (points.length > 1) {
            var previousPointX = points[points.findIndex((i) => i.x == x) - 1].x;
            var previousPointY = points[points.findIndex((i) => i.y == y) - 1].y;
            drawAutonLine(previousPointX, previousPointY, x, y);

            var distance = calculateDistance(previousPointX, previousPointY, x, y);
            $('.distance').text('Distance: ' + distance.toFixed(2) + ' pixels inches soon');
        }
    });

    $('canvas').mousedown(function (event) {
        var mouseX = event.pageX - $(this).offset().left;
        var mouseY = event.pageY - $(this).offset().top;

        for (var i = 0; i < points.length; i++) {
            dx = mouseX - points[i].x;
            dy = mouseY - points[i].y;

            if (dx * dx + dy * dy <= 196) {
                selectedPoint = points[i];
                dragging = true;
                $('.x').text(`X: ${selectedPoint.x.toFixed(2)}`);
                $('.y').text(`Y: ${selectedPoint.y.toFixed(2)}`);
                refreshCanvas();
                break;
            } else {
                selectedPoint = null;
            }

            refreshCanvas();
        }

    }).mousemove(function (event) {
        if (selectedPoint && dragging) {
            var canvasOffset = $(this).offset();
            selectedPoint.x = event.pageX - canvasOffset.left;
            selectedPoint.y = event.pageY - canvasOffset.top;

            $('.x').text(`X: ${selectedPoint.x.toFixed(2)}`);
            $('.y').text(`Y: ${selectedPoint.y.toFixed(2)}`);

            refreshCanvas();
        }

    }).mouseup(function (event) {
        dragging = false;
    });
});

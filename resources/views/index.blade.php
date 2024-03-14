<html lang="ja">
<head>
    <meta charset="UTF-8">
    <title>ホラーゲームネットワーク</title>
    <meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" name="viewport">
    <link rel="icon" href="{{ asset('favicon.ico') }}">

    <link href="{{ asset('app.css') }}?t={{ time() }}" rel="stylesheet">
</head>
<body>
<div style="padding: 30px;">
    <div class="title" id="title"><h1>ホラーゲーム<br>ネットワーク</h1></div>
    <div class="node-list">
        <div class="node">
            <div class="node-item">
                Horror Game Lineup
            </div>
        </div>
        <div class="node">
            <div class="node-item">
            Login / Sign Up
            </div>
        </div>
        <div class="node">
            <div class="node-item">
            About
            </div>
        </div>
        <div class="node">
            <div class="node-item">
            Privacy Policy
            </div>
        </div>
        <div class="node">
            <div class="node-item">
            Site Map
            </div>
        </div>
    </div>
    <canvas id="lineCanvas" style="position: absolute;top:0;left:0; z-index: -100;"></canvas>
    <canvas id="backgroundCanvas1" style="position: absolute;top:0;left:0; z-index: -100;"></canvas>
    <canvas id="backgroundCanvas2" style="position: absolute;top:0;left:0; z-index: -100;"></canvas>
    <canvas id="backgroundCanvas3" style="position: absolute;top:0;left:0; z-index: -100;"></canvas>
</div>
<script>
    const NOTCH_LENGTH = 20;
    let lineCanvas = null;
    let lineCtx = null;
    let bg1Canvas = null;
    let bg1Ctx = null;
    window.onload = function() {
        lineCanvas = document.getElementById('lineCanvas');
        bg1Canvas = document.getElementById('backgroundCanvas1');

        // Set the canvas size to full window
        lineCanvas.width = window.innerWidth;
        lineCanvas.height = window.innerHeight;
        bg1Canvas.width = window.innerWidth;
        bg1Canvas.height = window.innerHeight;

        if(lineCanvas.getContext) {
            lineCtx = lineCanvas.getContext('2d');
            drawLine(lineCtx);
        }

        if(bg1Canvas.getContext) {
            bg1Ctx = bg1Canvas.getContext('2d');
            //drawBackground1(bg1Ctx);
        }
    }

    function drawLine(ctx)
    {
        var div = document.getElementById('title');

        drawNodeHexagon(ctx, div);


        let nodes = [...document.getElementsByClassName('node-item')];
        nodes.forEach(function (node) {
            drawNodeHexagon(ctx, node);
        });
    }

    function drawNodeHexagon(ctx, node)
    {
        var nodePos = {x: node.offsetLeft, y: node.offsetTop};
        var nodeSize = {width: node.offsetWidth, height: node.offsetHeight};

        ctx.beginPath();
        ctx.moveTo(nodePos.x + NOTCH_LENGTH, nodePos.y);
        ctx.lineTo(nodePos.x + nodeSize.width - NOTCH_LENGTH, nodePos.y);
        ctx.lineTo(nodePos.x + nodeSize.width, nodePos.y + nodeSize.height * 0.5);
        ctx.lineTo(nodePos.x + nodeSize.width - NOTCH_LENGTH, nodePos.y + nodeSize.height);
        ctx.lineTo(nodePos.x + NOTCH_LENGTH, nodePos.y + nodeSize.height);
        ctx.lineTo(nodePos.x, nodePos.y + nodeSize.height * 0.5);
        ctx.closePath();

        // Set line color
        ctx.strokeStyle = "rgba(0, 255, 0, 0.8)"; // 線の色と透明度
        ctx.lineWidth = 3; // 線の太さ
        ctx.lineJoin = "round"; // 線の結合部分のスタイル
        ctx.lineCap = "round"; // 線の末端のスタイル
        ctx.shadowColor = "lime"; // 影の色
        ctx.shadowBlur = 15; // 影のぼかし効果
        ctx.stroke();
    }

    let hexagons = {};

    function drawBackground1(ctx) {
        const centerX = Math.trunc(bg1Canvas.width / 2);
        const centerY = Math.trunc(bg1Canvas.height / 2);
        const sideLength = 50; // 六角形の一辺の長さ
        const parentHexagon = {center: {x: 0, y: 0}, vertices: [], children: []};
        const angleStep = Math.PI / 3;
        const offset1 = Math.trunc(sideLength * Math.cos(angleStep));
        const offset2 = Math.trunc(sideLength * Math.sin(angleStep));
        const offset3 = Math.trunc(sideLength * Math.cos(angleStep * 90));

        parentHexagon.center.x = centerX;
        parentHexagon.center.y = centerY;
        let x = centerX + offset1;
        let y = centerY + offset2;
        parentHexagon.vertices.push({x: x, y: y});
        x = centerX - offset1;
        parentHexagon.vertices.push({x: x, y: y});
        x = centerX - offset3;
        y = centerY;
        parentHexagon.vertices.push({x: x, y: y});
        x = centerX - offset1;
        y = centerY - offset2;
        parentHexagon.vertices.push({x: x, y: y});
        x = centerX + offset1;
        parentHexagon.vertices.push({x: x, y: y});
        x = centerX + offset3;
        y = centerY;
        parentHexagon.vertices.push({x: x, y: y});
        hexagons[centerX.toString() + '-' + centerY.toString()] = parentHexagon;

        drawHexagon(ctx, parentHexagon, "green");

        addChild(parentHexagon, offset1, offset2, offset3);
        console.debug(parentHexagon.children);

        parentHexagon.children.forEach(hexagon => {
            drawHexagon(ctx, hexagon, "red");
            addChild(hexagon, offset1, offset2, offset3);

            hexagon.children.forEach(hexagon => {
                drawHexagon(ctx, hexagon, "yellow");
            });
        });
    }

    function addChild(parentHexagon, offset1, offset2, offset3)
    {
        let child, key;

        child = moveHexagon(parentHexagon, -offset3 - offset1, -offset2);
        key = child.center.x.toString() + '-' + child.center.y.toString();
        if (!(key in hexagons)) {
            hexagons[key] = child;
            parentHexagon.children.push(child);
        }
        child = moveHexagon(parentHexagon, 0, -offset2-offset2);
        key = child.center.x.toString() + '-' + child.center.y.toString();
        if (!(key in hexagons)) {
            hexagons[key] = child;
            parentHexagon.children.push(child);
        }
        child = moveHexagon(parentHexagon, offset3 + offset1, -offset2);
        key = child.center.x.toString() + '-' + child.center.y.toString();
        if (!(key in hexagons)) {
            hexagons[key] = child;
            parentHexagon.children.push(child);
        }
        child = moveHexagon(parentHexagon, offset3 + offset1, offset2);
        key = child.center.x.toString() + '-' + child.center.y.toString();
        if (!(key in hexagons)) {
            hexagons[key] = child;
            parentHexagon.children.push(child);
        }
        child = moveHexagon(parentHexagon, 0, offset2+offset2);
        key = child.center.x.toString() + '-' + child.center.y.toString();
        if (!(key in hexagons)) {
            hexagons[key] = child;
            parentHexagon.children.push(child);
        }
        child = moveHexagon(parentHexagon, -offset3 - offset1, offset2);
        key = child.center.x.toString() + '-' + child.center.y.toString();
        if (!(key in hexagons)) {
            hexagons[key] = child;
            parentHexagon.children.push(child);
        }
    }

    function moveHexagon(baseHexagon, x, y)
    {
        let newHexagon = {center: {x: 0, y: 0}, vertices: [], children: []};

        newHexagon.center.x = baseHexagon.center.x + x;
        newHexagon.center.y = baseHexagon.center.y + y;

        newHexagon.vertices[0] = {x: baseHexagon.vertices[0].x + x, y: baseHexagon.vertices[0].y + y};
        newHexagon.vertices[1] = {x: baseHexagon.vertices[1].x + x, y: baseHexagon.vertices[1].y + y};
        newHexagon.vertices[2] = {x: baseHexagon.vertices[2].x + x, y: baseHexagon.vertices[2].y + y};
        newHexagon.vertices[3] = {x: baseHexagon.vertices[3].x + x, y: baseHexagon.vertices[3].y + y};
        newHexagon.vertices[4] = {x: baseHexagon.vertices[4].x + x, y: baseHexagon.vertices[4].y + y};
        newHexagon.vertices[5] = {x: baseHexagon.vertices[5].x + x, y: baseHexagon.vertices[5].y + y};

        return newHexagon;
    }

    function drawHexagon(ctx, hexagon, style)
    {

        ctx.beginPath();
        ctx.moveTo(hexagon.vertices[0].x, hexagon.vertices[0].y);

// 残りの頂点に線分を引く
        ctx.lineTo(hexagon.vertices[1].x, hexagon.vertices[1].y);
        ctx.lineTo(hexagon.vertices[2].x, hexagon.vertices[2].y);
        ctx.lineTo(hexagon.vertices[3].x, hexagon.vertices[3].y);
        ctx.lineTo(hexagon.vertices[4].x, hexagon.vertices[4].y);
        ctx.lineTo(hexagon.vertices[5].x, hexagon.vertices[5].y);
        ctx.closePath();

// 線の色と太さを設定
        ctx.strokeStyle = 'lime';
        ctx.lineWidth = 2;
        ctx.stroke();


        hexagon.vertices.forEach(vertex => {
            ctx.beginPath();
            ctx.arc(vertex.x, vertex.y, 5, 0, 2 * Math.PI);
            ctx.shadowColor = 'rgba(255, 255, 0, 0.5)'; // 黄色の半透明
            ctx.shadowBlur = 20; // ぼかし具合
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            ctx.fillStyle = 'rgba(255, 165, 0, 1)'; // オレンジ色
            ctx.fill();
        });
    }

</script>
</body>
</html>

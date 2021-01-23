// https://github.com/hibye1217/hibye1217.github.io/blob/cd2e204b6bdb71c5492f6a59bc6b07023a833111/Page/Main.html

const W = 500, R = 200, D = 50;
let OH, OW;

let rectStyle = function(x,y){
    return    'position: absolute;'
            + 'width: ' + D + 'px;'
            + 'height: ' + D + 'px;'
            + 'top: ' + (y - D/2) + 'px;'
            + 'left: ' + (x - D/2) + 'px;'
            + 'display: flex;'
            + 'justify-content: center;'
            + 'align-items: center;'
            + 'border: 2px solid black;'
            + 'background-color: #FFFFFF;'
            + 'border-radius: ' + (D/2) + 'px;'
            + 'font-size: 32px;'
}
let lineStyle = function(dis,ang,x,y){
    return    'background-color: #000000;'
            + 'width: ' + dis + 'px;'
            + 'height: 1px;'
            + '-moz-transform: rotate(' + ang + 'rad);'
            + '-webkit-transform: rotate(' + ang + 'rad);'
            + '-o-transform: rotate(' + ang + 'rad);'  
            + '-ms-transform: rotate(' + ang + 'rad);'  
            + 'position: absolute;'
            + 'top: ' + y + 'px;'
            + 'left: ' + x + 'px;'
}

let nodeCount, edgeCount;
let nodeList, edgeList;

function DrawGraph(){
    const input = document.getElementById('input');
    const output = document.getElementById('output');

    OH = output.offsetTop; OW = output.offsetLeft;

    output.innerHTML = "";
    console.log(output);

    const str = input.value;
    const arr = str.split('\n');
    for (let i = 0; i < arr.length; i++){
        arr[i] = arr[i].split(' ');
        //console.log(i, arr[i]);
    }

    if (arr[0].length != 2){ return; }
    if (isNaN(arr[0][0]) || isNaN(arr[0][1])){ return; }
    
    nodeCount = parseInt(arr[0][0]); edgeCount = parseInt(arr[0][1]);

    if (arr.length != edgeCount+1){ return; }

    nodeList = new Array(nodeCount+2); edgeList = new Array(edgeCount+2);

    for (let i = 1; i <= nodeCount; i++){
        nodeList[i] = {
            id: i,
            x: 0, y: 0,
            adjList: []
        };
    }

    for (let i = 1; i <= edgeCount; i++){
        if (arr[i].length != 2){ return; }
        if (isNaN(arr[i][0]) || isNaN(arr[i][1])){ return; }
        let v1 = parseInt(arr[i][0]), v2 = parseInt(arr[i][1]);
        if (1 > v1 || v1 > nodeCount){ return; }
        if (1 > v2 || v2 > nodeCount){ return; }

        if (nodeList[v1].adjList.indexOf(v2) == -1){
            nodeList[v1].adjList.push(v2);
        }

        if (nodeList[v2].adjList.indexOf(v1) == -1){
            nodeList[v2].adjList.push(v1);
        }
    }

    console.log(nodeList);

    for (let i = 1; i <= nodeCount; i++){
        let angle = 2 * Math.PI * (nodeList[i].id - 1) / nodeCount;
        nodeList[i].x = Math.sin(angle) * R + W/2 + OW;
        nodeList[i].y = -Math.cos(angle) * R + W/2 + OH;
        console.log(i, nodeList[i]);
    }

    for (let i = 1; i <= nodeCount; i++){
        for (let j = 0; j < nodeList[i].adjList.length; j++){
            let v1 = nodeList[i], v2 = nodeList[ nodeList[i].adjList[j] ];
            if (v1.id > v2.id){ continue; }
            let dx = v1.x - v2.x, dy = v1.y - v2.y;
            let dis = Math.sqrt(dx*dx + dy*dy);
            let midx = (v1.x + v2.x) / 2, midy = (v1.y + v2.y) / 2;
            let X = midx - dis/2, Y = midy;
            let angle = Math.PI - Math.atan2(-dy, dx);
            let div = document.createElement('div');
            div.setAttribute('style', lineStyle(dis, angle, X, Y));
            output.appendChild(div);
        }
    }

    for (let i = 1; i <= nodeCount; i++){
        let v = nodeList[i];
        let div = document.createElement('div');
        div.setAttribute('style', rectStyle(v.x, v.y));
        div.innerHTML = v.id;
        output.appendChild(div);
    }
}
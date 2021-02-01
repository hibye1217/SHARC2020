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

    // 일반적인 그래프
    if (arr[0].length == 2){
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
    }

    // 이진 트리
    if (arr[0].length == 1){
        if (isNaN(arr[0][0])){ return; }
    
        nodeCount = parseInt(arr[0][0]);

        if (arr.length != nodeCount){ return; }

        nodeList = new Array(nodeCount + 1);

        for (let i = 1; i <= nodeCount; i++){
            nodeList[i] = {
                id: i,
                x: 0, y: 0,
                adjList: []
            };
        }
        /* 
        이진트리인지 검사하는 법
        1. 트리인지 검사
        (1) 간선의 개수가 n - 1 개 (v)
        (2) 중복 간선이 없어야 함 (v)
        (3) Loop 가 없어야 함 (v)
        2. 자식의 개수가 2개 이하인지 검사
            # 1번 노드의 자식 <= 2
            # 그 외 노드의 indegree <= 3 ( 부모 포함 )
        */
        for (let i = 1; i <= nodeCount - 1; i++){
            if (arr[i].length != 2){ return; }
            if (isNaN(arr[i][0]) || isNaN(arr[i][1])){ return; }
            let v1 = parseInt(arr[i][0]), v2 = parseInt(arr[i][1]);
            if (1 > v1 || v1 > nodeCount) { return; }
            if (1 > v2 || v2 > nodeCount) { return; }
            if (v1 == v2) { return; }

            if (nodeList[v1].adjList.indexOf(v2) == -1){
                nodeList[v1].adjList.push(v2);
            } else {
                return;
            }

            if (nodeList[v2].adjList.indexOf(v1) == -1){
                nodeList[v2].adjList.push(v1);
            } else {
                return;
            }
        }
        // 2번 검사
        if (nodeList[1].adjList.length > 2) { return; }
        for (let i = 2; i <= nodeCount; i++) {
            if (nodeList[i].adjList.length > 3) { return; }
        }

        // 트리의 높이, 너비 계산, 좌표 매기기
        let width = 1, height = 1;
        function dfs(cur, depth, pv) {
            let c1 = -1, c2 = -1;
            for (let i = 0; i < nodeList[cur].adjList.length; i++) {
                let v = nodeList[cur].adjList[i];
                if (v == pv) { continue; }
                if (c1 == -1) { c1 = v; }
                else if (c2 == -1) { c2 = v; }
            }
            if (c1 != -1) {
                dfs(c1, depth + 1, cur);
            }
            nodeList[cur].x = width;
            nodeList[cur].y = depth;
            width++;
            if (height < depth) { height = depth; }
            if (c2 != -1) {
                dfs(c2, depth + 1, cur);
            }
        }
        dfs(1, 1, -1);
        console.log(nodeList);
        // [1, width], [1, height]
        width--;
        for (let i = 1; i <= nodeCount; i++) {
            let x = nodeList[i].x, y = nodeList[i].y;
            nodeList[i].x = x * 500 / (width + 1) + OW;
            nodeList[i].y = y * 500 / (height + 1) + OH;
            console.log(i, nodeList[i]);
        }
    }

    // 그래프 그리기
    // 간선 (선) 그리기
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

    // 정점 (원) 그리기
    for (let i = 1; i <= nodeCount; i++){
        let v = nodeList[i];
        let div = document.createElement('div');
        div.setAttribute('style', rectStyle(v.x, v.y));
        div.innerHTML = v.id;
        output.appendChild(div);
    }
}
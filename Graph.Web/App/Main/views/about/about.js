(function () {
    var controllerId = 'app.views.about';
    angular.module('app').controller(controllerId,  [
        '$scope', '$http', function ($scope, $http) {
            var vm = this;
            vm.uploadFile = uploadFile;
            
            //About logic...

            vm.G = new jsnx.Graph();
            vm.n = "50";
            vm.p = "0.1";
            vm.m = "1";
            vm.optDirected = false;
            vm.E = "0";           
            
            vm.gnpRandomGraph = gnpRandomGraph;
            vm.fastGnpRandomGraph = fastGnpRandomGraph;
            vm.binomialGraph = binomialGraph;
            vm.erdosRenyiGraph = erdosRenyiGraph;
            vm.barabasiAlbertGraph = barabasiAlbertGraph;
            vm.cliques;
            vm.numberOfCliques;

            vm.addNode = false;
            vm.addEdge = false;
            vm.removeNode = false;
            vm.removeEdge = false;
            vm.draw = draw;
            vm.g_add_node = g_add_node;
            vm.randHistogramm = randHistogramm;
            vm.removeNodes = removeNodes;
            vm.shortestPathLength = ShortestPathLength;
            //vm.matrix = matrix;
            vm.loadMatrix;
            vm.epidemic = epidemic;
            vm.myPlot2 = myplot2;            

            $scope.matrix;
            $scope.mdlNetwork=[];
            $scope.gridOptions = {
                enableSorting: false,
                columnDefs: [
                  { name: '', field: '6' },
                  { name: 'S', field: '0', cellFilter: 'number: 2'},
                  { name: 'I', field: '1', cellFilter: 'number: 2'},
                  { name: 'E', field: '2', cellFilter: 'number: 2'},
                  { name: 'M', field: '3', cellFilter: 'number: 2'},
                  { name: 'D', field: '4', cellFilter: 'number: 2'},
                  { name: 'R', field: '5', cellFilter: 'number: 2'}

                ],
                data: [{
                    "6":"S",
                    "0": 0,
                    "1": 0,
                    "2": 0,
                    "3": 0,
                    "4": 0,
                    "5": 0,
                }, {
                    "6": "I",
                    "0": 0,
                    "1": 0,
                    "2": 0,
                    "3": 0,
                    "4": 0,
                    "5": 0,
                },
                {
                    "6": "E",
                    "0": 0,
                    "1": 0,
                    "2": 0,
                    "3": 0,
                    "4": 0,
                    "5": 0,
                }
                , {
                    "6": "M",
                    "0": 0,
                    "1": 0,
                    "2": 0,
                    "3": 0,
                    "4": 0,
                    "5": 0,
                }
                , {
                    "6": "D",
                    "0": 0,
                    "1": 0,
                    "2": 0,
                    "3": 0,
                    "4": 0,
                    "5": 0,
                },
                {
                    "6": "R",
                    "0": 0,
                    "1": 0,
                    "2": 0,
                    "3": 0,
                    "4": 0,
                    "5": 0,
                }
                ]
            }; 
            $scope.gridOptions2 =  {
                enableSorting: false,
                columnDefs: [
                  { name: 'Слой', field: '0' },
                  { name: 'Общее число узлов', field: '1' },
                  { name: 'Заражено', field: '2'  },
                  { name: 'Имунизированно', field: '3' },
               
                ],
                data:[{"0":0, "1":0, "2":0,"3":0 }]
            }; 

            draw();            

            function draw() {  
                //console.log( getTransitionMatrix($scope.gridOptions.data))
                vm.E = ShortestPathLength(vm.G);
                if (vm.n > 500) return;
                var color = d3.scale.category20();                
                var degree = jsnx.degree(vm.G).values();             
                jsnx.draw(vm.G, {
                    element: '#canvas',
                    layoutAttr: {
                        charge: -30,                        
                        gravity: 0.1,
                        linkDistance: 20                       
                    },
                    height: 600,
                    withLabels: true,
                    //with_edge_labels: true,
                    weighted: true,                    
                    edgeStyle: {
                        'stroke-width': 1
                    },
                    nodeStyle: {
                        fill: function(d) { 
                            return color(jsnx.degree(vm.G, d.node));
                        }                    
                    },
                    nodeAttr: {
                        r: function (d) { return (jsnx.degree(vm.G, d.node)+ 10); },
                        weight: function (d) { return jsnx.degree(vm.G, d.node); },
                        name: function (d) { return jsnx.degree(vm.G, d.node); }
                    },
                    stickyDrag: true

                }, true); 
                if(vm.G.numberOfNodes() >0){
                    epidemic(toMatrix(vm.G));
                }
                
               
            }
            function g_add_node() {
                vm.G.addNode(vm.G.node.size + 1);               
            }
            function g_add_edge() {
                vm.G.addNode(vm.G.node.size + 1);               
            }

            function fastGnpRandomGraph(){
                vm.G = jsnx.fastGnpRandomGraph(vm.n, vm.p, vm.optDirected);                
                draw();
            };
            function gnpRandomGraph(){
                vm.G = jsnx.gnpRandomGraph(vm.n, vm.p, vm.optDirected);
                draw();
            };
            function binomialGraph(){
                vm.G = jsnx.binomialGraph(vm.n, vm.p, vm.optDirected);
                draw();
            };
            function erdosRenyiGraph(){
                vm.G = jsnx.erdosRenyiGraph(vm.n, vm.p, vm.optDirected);
                draw();
            };
            function barabasiAlbertGraph() {
                vm.G = genBarabasiAlbertGraph(Number(vm.n), Number(vm.m));                
                draw();
            };        

            function genBarabasiAlbertGraph(n, m) {
                var G = new jsnx.Graph();
                var edges;
                var rangeN = d3.range(n);
                var targets = d3.range(m);
                var repeatedNodes = [];
                var source = m;
                var sourceArray = [];
                G.name = 'barabasi_albert_graph(' + n + ', ' + m + ')';

                while (source < n) {
                    sourceArray = [];
                    for(var i=0; i<m; i++){
                        sourceArray.push(source);
                    }                    
                    // Add one node to the list for each new edge just created.
                    G.addEdgesFrom(d3.zip(sourceArray, targets));
                    // And the new node "source" has m edges to add to the list.                    
                    repeatedNodes = d3.merge([repeatedNodes, sourceArray, targets]);
                    targets = _random_subset(repeatedNodes, m);                    
                    source += 1;
                }
                return G;
            };

            function _random_subset(seq, m) {
                var targets = [];
                while (targets.length<m){
                    var x = getRandomInt(0, seq.length-1);
                    targets.push(seq[x]);
                }
                return targets
            }            
            // использование Math.round() даст неравномерное распределение!
            
            function getRandomInt(min, max) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            };                 
            function randHistogramm() {
                d3.select(".histogramm").remove();
                var data = jsnx.degreeHistogram(vm.G);

               
                var margin = { top: 20, right: 20, bottom: 30, left: 40 },
                    width = 960 - margin.left - margin.right,
                    height = 500 - margin.top - margin.bottom;

                var x = d3.scale.ordinal()
                    .rangeRoundBands([0, width], .1);

                var y = d3.scale.linear()
                    .range([height, 0]);               

                var xAxis = d3.svg.axis()
                    .scale(x)
                    .orient("bottom");

                var yAxis = d3.svg.axis()
                    .scale(y)
                    .orient("left")
                    .tickValues(data);
                var dataSum = d3.sum(data);
                x.domain(data.map(function (d, index) { return index }));
                //x.domain([0, data.length]);
                y.domain([0, d3.max(data, function (d) { return d ; })]);
                //y2.domain([0, d3.max(data, function (d) { return d / dataSum; })]);

                var svg = d3.select('[ng-controller="app.views.about as vm"]')
                  .append("svg")
                    .attr("class", "histogramm")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                  .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + height + ")")
                    .call(xAxis);

                svg.append("g")
                    .attr("class", "y axis")
                    .call(yAxis)
                  .append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 6)
                    .attr("dy", ".71em")
                    .style("text-anchor", "end")
                    .text("Frequency");
                svg.selectAll(".bar")
                    .data(data)
                    .enter().append("rect")
                    .attr("class", "bar")
                    .attr("x", function (d, index) { return x(index); })
                    .attr("width", x.rangeBand())
                    .attr("y", function (d) { return y(d); })
                    .attr("height", function (d) { return height - y(d); });

            };
            function ShortestPathLength(G) {
                var n = vm.G.numberOfNodes();
                var E = 0;
                if (n > 1) {
                    var length = jsnx.allPairsShortestPathLength(vm.G);
                    var sum = avgD(length);  
                    E = (1 / (n * (n - 1))) * sum;                   
                    //console.log('Глобальная эффективность сети = '+E);                   
                    
                }
                return E;
            }
            function avgD(data) {                
                var sum;
                var n = data.size;                
                sum = 0;                
                for (var i in data._numberValues) {
                    for (var j in data._numberValues[i]._numberValues) {                       
                        if ( j > 0 ) {
                            sum = sum + (1 / j);                            
                        }
                    }
                    
                }               
                return sum;
            }
            function removeNodes(G) {
                var n = 1//Math.floor(G.numberOfNodes() * 0.1);
                if (n == 0) n = 1;
                for (var i = 0; i < n; i++) {
                    var node ;//= (Math.floor(Math.random() * G.numberOfNodes()));
                    node = _random_subset(G.nodes(), 1);                   
                    G.removeNodesFrom(node);
                }                
                vm.E = ShortestPathLength(G);                
            }
            function matrix() {
                console.log(jsnx.toEdgelist(vm.G));
            }
            function uploadFile(files) {
                var fd = new FormData();
                var uploadUrl = 'api/upload';
                //Take the first selected file
                fd.append("file", files[0]);

                $http.post(uploadUrl, fd, {
                    withCredentials: true,
                    headers: { 'Content-Type': undefined },
                    transformRequest: angular.identity
                })//.success(console.log('uploaded'));
                .then(
                    function (data, ststus) {
                        var json = (data.data).split("");
                        console.log(json);
                        var matrix = [];
                        var iCount = 0;
                        var jCount = 0;
                        matrix[iCount] = [];
                        for (i = 0; i < json.length; i++) {
                            if (json[i] == "1" || json[i] == "0") {
                                matrix[iCount][jCount] = Number(json[i]);
                                jCount += 1;
                            }
                            if (json[i] == "\n") {
                                iCount += 1;
                                jCount = 0;
                                matrix[iCount] = [];
                            }
                        }
                        vm.loadMatrix = matrix;
                        epidemic(matrix);
                    },
                    function (data, status) {
                        console.log(data);
                    }
                );
                

            };
            function toMatrix(G) {
                var diclist = jsnx.toDictOfLists(G);
                var n = G.numberOfNodes();
                var matrix = [];
                var dicCount = 0;                
                for (i = 0; i < n; i++) {
                    matrix[i] = [];
                    for (j = 0; j < n; j++) {
                        if (diclist[i].some(elem => elem == j)) {
                            matrix[i][j] = 1;
                        }
                        else {
                            matrix[i][j] = 0;
                        }
                    }
                }
                return matrix;

            };
            function getTransitionMatrix(dic){
                var matrix = [];
                for (i= 0 ; i < 6; i ++){
                    matrix[i]= [];
                    for (j=0;j<6; j++){
                        matrix[i][j] = dic[i][j];
                    }
                }
                return matrix;
            };
            function epidemic(m){

                var s = [];
                var sum = 0;
                var max = 0;
                var n = m.length;   
                console.log('Полученная матрица');
                console.log(m);

                var mysl = [];                
                //Посчитал сумму по строкам и записал все это в массив s[i]
                for(i=0;i<n;i++)
                {
                    for(j=0;j<n;j++)
                    {
                        sum+=m[i][j];                        
                        if(j == n-1)
                        {
                            s[i]=sum;
                            if (max < sum) max = sum;
                            sum=0;
                        }
                    }
                }
                console.log('Это выводит инфу в консольку, нужна для проверки правильности работы проги');
                console.log(max);
                //Находим количество вершин каждого слоя
                for ( i = 0; i < max; i++) //Убрать
                    mysl[i] = 0;
                for ( i = 0; i < max; i++){
                    for ( j = 0; j < n; j++) {
                        if (s[j] == i+1)
                            mysl[i] += 1;
                    }
                }
                console.log('количество вершин каждого слоя ');
                console.log(mysl);

                var mdlNetwork = [];
                var pos=0;
                for (i=0;i<max;i++){
                      
                    if(mysl[i] > 0 ){
                        mdlNetwork[pos]=[];
                        mdlNetwork[pos][0] = Number(pos+1);
                        mdlNetwork[pos][1] = Number(mysl[i]);
                        mdlNetwork[pos][2] = Number(0);
                        mdlNetwork[pos][3] = Number(0);
                        pos++;
                    }
                }
                console.log('mdlNetwork');
                console.log(mdlNetwork);
                $scope.gridOptions2.data = mdlNetwork;


                //Создал матрицу, в которой в первой строке и столбце записаны суммы MS
                var ms = [];
                for (i=0;i<n+1;i++){
                    ms[i]=[];
                    for (j=0;j<n+1;j++){
                        ms[i][j]=0;
                    }
                }
                for(i=1,ii=0;i<n+1;i++,ii++)
                {
                    ms[0][i]=s[ii];
                    ms[i][0]=s[ii];
                }
                ms[0][0]=0;
                for(i=0,ii=1;i<n;i++,ii++){
                    for(j=0,jj=1;j<n;j++,jj++){
                        ms[ii][jj]=m[i][j];
                    }
                }
                console.log('Создал матрицу, в которой в первой строке и столбце записаны суммы MS');
                console.log(ms);
                //Здесь будем хранить матрицу связности с существующими слоями
                var matrix = [];
                for ( i = 0; i < pos; i++){
                    matrix[i] = [];
                    for (j=0;j<pos;j++){
                        matrix[i][j]=0;
                    }
                } 
                // Это промежуточный массив для вычислений. Проблема в том, что у нас существуют не все слои с макс. значения степени и до минимального.
                // Поэтому, если их убрать, сдвинутся индексы в массиве, и мы не сможем записывать в массив значения по номеру степени.
                // Придется искать соотв. степени индекс, что еще больше все запутает и усложнит.
                // Лучше потратим лишнюю память
                var array = [];
                for ( i = 0; i < max; i++){
                    array[i]=[];
                    for ( j = 0; j<max; j++){
                        array[i][j] = 0;
                    }
                }
                //Считаем число связей между слоями
                for ( i = 1; i<n+1; i++){
                    for ( j=1; j< n+1; j++) {
                        if(ms[i][j] == 1 && i!=j){
                            var ind_row = ms[i][0] - 1;
                            var ind_col = ms[0][j] - 1;
                            //console.log('Считаем число связей между слоями в цикле');
                            //console.log(array[ind_row][ind_col] + 1);
                            array[ind_row][ind_col] += 1;
                        }
                    }
                }
                console.log('array');
                console.log(array);
                //В матрицу связности заносим коэффициент Ps = число связей между слоями / общее число связей слоя

                for ( i = 0; i < pos; i++){
                    //var index = mdlNetwork[i][0];
                    var cur_row = mdlNetwork[i][0]; //Текущий слой, для которого мы считаем связность
                    console.log('Текущий слой, для которого мы считаем связность');
                    console.log(cur_row);

                    //index = mdlNetwork[i][1];
                    var n_versh = mdlNetwork[i][1];; //Общее число вершин в слое
                    console.log('Общее число вершин в слое');
                    console.log(n_versh);

                    var n_sv = cur_row * n_versh; // Общее число связей в слое - степень * число вершин в слое
                    console.log('Общее число связей в слое - степень * число вершин в слое');
                    console.log(n_sv);
                    for ( j = 0; j < pos; j++) {
                        //index = mdlNetwork[j][0];
                        var cur_col = mdlNetwork[j][0];
                        console.log('цикл по j');
                        console.log(cur_col);                        
                        matrix[i][j] = (array[cur_row-1][cur_col-1])/n_sv;
                        console.log(matrix[i][j]);
                    }
                }
                console.log('matrix');
                console.log(matrix);
                $scope.matrix = matrix;
                //myplot2();

                //Рассчитывает эпидемию по модели из методички

                         
            }
            function myplot2() {
                var mdlNetwork = $scope.gridOptions2.data;
                var n = mdlNetwork.length; // Число слоев в сети
                var mdl_fraktal = getTransitionMatrix($scope.gridOptions.data);
                var mass=[];
                var mass2=[];


                //QColor color;

                /*switch(this->cur_color) {
                    case 0:
                        color = Qt::blue;
                        break;
                    case 1:
                        color = Qt::green;
                        break;
                    case 2:
                        color = Qt::red;
                        break;
                    case 3:
                        color = Qt::yellow;
                        break;
                    default:
                        color = Qt::black;
                }

                this->cur_color ++;*/

                for ( i = 0; i < n; i++) {
                    mass[i]=[];
                    mass2[i]=[];
                    for ( j = 0; j < 6; j++) {
                        mass[i][j] = 0;
                        mass2[i][j] = 0;
                    }
                }
                console.log('пустые mass');
                console.log(mass);
                console.log('пустые mass2');
                console.log(mass2);

                //QPolygonF points;

                //Заносим в первый массив начальные условия (число зараженных, иммунизированых и уязвимых по всем слоям)
                for (var i = 0; i < n; i++) {

                    var index = mdlNetwork[i][2];
                    var inf = index;
                    console.log('inf ' + inf);

                    index = mdlNetwork[i][ 3];
                    var imm = index;
                    console.log('imm ' + imm);

                    index = mdlNetwork[i][1];
                    console.log('mdlNetwork ' + index);
                    var susp = index - inf - imm;
                    console.log('susp ' + susp);

                    mass2[i][0] = susp;
                    mass2[i][2] = inf;
                    mass2[i][3] = imm;

                }
                console.log(mass2);
                    


                //Заполняем из таблицы матрицу вероятностей

                var p = [];
                for ( i = 0; i < 6; i++) {
                    p[i]=[];
                    for ( j = 0; j < 6; j++) {
                        var index = mdl_fraktal[i][j];
                        p[i][j] = index;
                    }
                }


                var count = 0; // Число шагов эпидемии, которые мы посчитали
                var gPoints =[];
                while (count < 100) {

                    //Переписали в матрицу с текущим количеством вершин разных состояний по слоям значения из матрицы для расчетов
                    // В mass[] хранятся параметры для i-ого шага, а в mass2[] - для i+1 ого

                    for ( i =0; i < n; i++){
                        for ( j = 0; j < 6; j++) {
                            mass[i][j] = mass2[i][j];
                        }
                    }
                    console.log('mass');
                    console.log(mass);
                    console.log('mass2');
                    console.log(mass2);

                    //Расчет текущего числа источников эпидемии
                    var cur_i = 0;
                    for ( i =0; i < n; i++)
                        cur_i = cur_i + mass[i][2];
                    var points =[];
                    points.push(cur_i);
                    console.log('вершины');
                    console.log(points);
                    gPoints.push({"x":count, "y":cur_i});

                    var color = d3.scale.category20();   

                    //Рассчитываем общее число атакованных вершин в слое
                    // v = Сумма по всем слоям (Число источников в атакующем слое * степень атакующего слоя  * вероятность связности
                    // * доля зараженных в текущем слое
                    var v; //Количество атак на вершины рассчитываемого слоя
                    var is; // Источников инфекции в атакующем слое
                    var s;   //Степень атакующего слоя
                    var ps;  // Вероятность связности из матрицы
                    var ks;  // Доля уязвимых вершин в текущем слое
                    var matrix = $scope.matrix;
                    console.log('matrix =====');
                    console.log(matrix);

                    console.log( "SHAG " + count);
                    console.log("==============================================");

                    //Расчет переходов
                    for ( i = 0; i<n; i++) {

                        v = 0;
                        var n_vers =  mdlNetwork[i][1];
                        ks = mass[i][0]/n_vers;
                        console.log( "UYAZVIMIH "+ mass[i][0]);
                        console.log(" VERSHIN V SLOE "+ n_vers);
                        console.log("KS "+ ks);
                        console.log("");

                        for ( j = 0; j < n; j++) {
                            console.log( "+++++ SLOI " + j + " ++++++++");
                            is = mass[j][2];
                            console.log( "IS " + mass[j][2]);
                           
                             s = mdlNetwork[j][0];
                            
                            console.log( "S " + s);
                            ps = matrix[j][i];
                            console.log( "PS " + ps);
                            v = v + (is*(s-1)*ps*ks*ks);
                        }


                        console.log( "VSEGO ATAK " + v);
                        console.log( " ///////////////////////////////");

                        /////////////////////////////////////////////////

                        //S->E
                        mass2[i][1] = mass2[i][1] + p[0][2]*v;
                        mass2[i][0] = mass2[i][0] - p[0][2]*v;

                        //S->I
                        mass2[i][2] = mass2[i][2] + p[0][1]*v;
                        mass2[i][0] = mass2[i][0] - p[0][1]*v;
                        console.log("SHAG " + count + " SLOI  " + i + " mass2 " + mass2[i][2]);

                        //S->M
                        mass2[i][3] = mass2[i][3] + mass[i][0]*p[0][3];
                        mass2[i][0] = mass2[i][0] - mass[i][0]*p[0][3];

                        //S->D
                        mass2[i][4] = mass2[i][4] + mass[i][0]*p[0][4];
                        mass2[i][0] = mass2[i][0] - mass[i][0]*p[0][4];

                        //S->R
                        mass2[i][5] = mass2[i][5] + mass[i][0]*p[0][5];
                        mass2[i][0] = mass2[i][0] - mass[i][0]*p[0][5];

                        //            ////////////////////////////////////////////////

                        //E->S
                        mass2[i][0] = mass2[i][0] + mass[i][1]*p[2][0];
                        mass2[i][1] = mass2[i][1] - mass[i][1]*p[2][0];

                        //E->I
                        mass2[i][2] = mass2[i][2] + mass[i][1]*p[2][1];
                        mass2[i][1] = mass2[i][1] - mass[i][1]*p[2][1];

                        //E->M
                        mass2[i][3] = mass2[i][3] + mass[i][1]*p[2][3];
                        mass2[i][1] = mass2[i][1] - mass[i][1]*p[2][3];

                        //E->D
                        mass2[i][4] = mass2[i][4] + mass[i][1]*p[2][4];
                        mass2[i][1] = mass2[i][1] - mass[i][1]*p[2][4];

                        //E->R
                        mass2[i][5] = mass2[i][5] + mass[i][1]*p[2][5];
                        mass2[i][1] = mass2[i][1] - mass[i][1]*p[2][5];

                        //            ////////////////////////////////////////////////

                        //I->S
                        mass2[i][0] = mass2[i][0] + mass[i][2]*p[1][0];
                        mass2[i][2] = mass2[i][2] - mass[i][2]*p[1][0];

                        //I->E
                        mass2[i][1] = mass2[i][1] + mass[i][2]*p[1][2];
                        mass2[i][2] = mass2[i][2] - mass[i][2]*p[1][2];

                        //I->M
                        mass2[i][3] = mass2[i][3] + mass[i][2]*p[1][3];
                        mass2[i][2] = mass2[i][2] - mass[i][2]*p[1][3];

                        //I->D
                        mass2[i][4] = mass2[i][4] + mass[i][2]*p[1][4];
                        mass2[i][2] = mass2[i][2] - mass[i][2]*p[1][4];

                        //I->R
                        mass2[i][5] = mass2[i][5] + mass[i][2]*p[1][5];
                        mass2[i][2] = mass2[i][2] - mass[i][2]*p[1][5];

                        //            ////////////////////////////////////////////////

                        //M->S
                        mass2[i][0] = mass2[i][0] + mass[i][3]*p[3][0];
                        mass2[i][3] = mass2[i][3] - mass[i][3]*p[3][0];

                        //M->E
                        mass2[i][1] = mass2[i][1] + mass[i][3]*p[3][2];
                        mass2[i][3] = mass2[i][3] - mass[i][3]*p[3][2];

                        //M->I
                        mass2[i][2] = mass2[i][2] + mass[i][3]*p[3][1];
                        mass2[i][3] = mass2[i][3] - mass[i][3]*p[3][1];

                        //M->D
                        mass2[i][4] = mass2[i][4] + mass[i][3]*p[3][4];
                        mass2[i][3] = mass2[i][3] - mass[i][3]*p[3][4];

                        //M->R
                        mass2[i][5] = mass2[i][5] + mass[i][3]*p[3][5];
                        mass2[i][3] = mass2[i][3] - mass[i][3]*p[3][5];

                        //            ////////////////////////////////////////////////

                        //D->S
                        mass2[i][0] = mass2[i][0] + mass[i][4]*p[4][0];
                        mass2[i][4] = mass2[i][4] - mass[i][4]*p[4][0];

                        //D->E
                        mass2[i][1] = mass2[i][1] + mass[i][4]*p[4][2];
                        mass2[i][4] = mass2[i][4] - mass[i][4]*p[4][2];

                        //D->I
                        mass2[i][2] = mass2[i][2] + mass[i][4]*p[4][1];
                        mass2[i][4] = mass2[i][4] - mass[i][4]*p[4][1];

                        //D->M
                        mass2[i][3] = mass2[i][3] + mass[i][4]*p[4][3];
                        mass2[i][4] = mass2[i][4] - mass[i][4]*p[4][3];

                        //D->R
                        mass2[i][5] = mass2[i][5] + mass[i][4]*p[4][5];
                        mass2[i][4] = mass2[i][4] - mass[i][4]*p[4][5];

                        //            ////////////////////////////////////////////////

                        //R->S
                        mass2[i][0] = mass2[i][0] + mass[i][5]*p[5][0];
                        mass2[i][5] = mass2[i][5] - mass[i][5]*p[5][0];

                        //R->E
                        mass2[i][1] = mass2[i][1] + mass[i][5]*p[5][2];
                        mass2[i][5] = mass2[i][5] - mass[i][5]*p[5][2];

                        //R->I
                        mass2[i][2] = mass2[i][2] + mass[i][5]*p[5][1];
                        mass2[i][5] = mass2[i][5] - mass[i][5]*p[5][1];

                        //R->M
                        mass2[i][3] = mass2[i][3] + mass[i][5]*p[5][3];
                        mass2[i][5] = mass2[i][5] - mass[i][5]*p[5][3];

                        //R->D
                        mass2[i][4] = mass2[i][4] + mass[i][5]*p[5][4];
                        mass2[i][5] = mass2[i][5] - mass[i][5]*p[5][4];

                        //            ////////////////////////////////////////////////
                        var n_obs = mass[i][0]+mass[i][1]+mass[i][2]+mass[i][3]+mass[i][4]+mass[i][5];
                        console.log('n_obs');
                        console.log(n_obs);
                        /*if (n_obs > n_vers) {
                            mass[i][0] = 0;
                            mass[i][2] = n_vers - (mass[i][1]+mass[i][3]+mass[i][4]+mass[i][5]);
                        }*/


                    }

                    count++;

                }
                console.log(gPoints);
                linearEpidemic(gPoints);

            };
            function linearEpidemic(data) {
                d3.select(".epidemic").remove();
                //var data = jsnx.degreeHistogram(vm.G);
                //var data = data[0];
                console.log(data);
                //var svg = d3.select('[ng-controller="app.views.about as vm"]') 
                var margin = {top: 30, right: 20, bottom: 30, left: 50},
                    width = 600 - margin.left - margin.right,
                    height = 270 - margin.top - margin.bottom;

                // Parse the date / time
                //var parseDate = d3.time.format("%d-%b-%y").parse;

                // Set the ranges
                var x = d3.scale.linear().range([0, width]);
                var y = d3.scale.linear().range([height, 0]);

                // Define the axes
                var xAxis = d3.svg.axis().scale(x)
                    .orient("bottom").ticks(20);

                var yAxis = d3.svg.axis().scale(y)
                    .orient("left").ticks(20);

                // Define the line
                var valueline = d3.svg.line()
                    .x(function(d) { return x(d.x); })
                    .y(function(d) { return y(d.y); });
    
                // Adds the svg canvas
                var svg = d3.select('[ng-controller="app.views.about as vm"]') 
                    
                    .append("svg")
                        .attr("class", "epidemic")
                        .attr("width", width + margin.left + margin.right)
                        .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                        .attr("transform", 
                              "translate(" + margin.left + "," + margin.top + ")");               
               

                // Scale the range of the data
                x.domain(d3.extent(data, function(d) { return d.x; }));
                y.domain([0, d3.max(data, function(d) { return d.y; })]);

                // Add the valueline path.
                svg.append("path")
                    .attr("class", "line")
                    .attr("d", valueline(data));

                // Add the X Axis
                svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + height + ")")
                    .call(xAxis);

                // Add the Y Axis
                svg.append("g")
                    .attr("class", "y axis")
                    .call(yAxis);

            };
        
        
        
        
        
        
        
        } 
        
    ]);
})();
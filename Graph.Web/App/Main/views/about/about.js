(function () {
    var controllerId = 'app.views.about';
    angular.module('app').controller(controllerId, [
        '$scope', function ($scope) {
            var vm = this;            
            //About logic...

            vm.G = new jsnx.Graph();
            vm.n = "50";
            vm.p = "0.1";
            vm.m = "2";
            vm.optDirected = false;
            
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

            draw();
            

            function draw() {
                if (vm.n > 500) return;
                var color = d3.scale.category20();                
                var degree = jsnx.degree(vm.G).values();
                jsnx.draw(vm.G, {
                    element: '#canvas',
                    layoutAttr: {
                        charge: -120,                        
                        gravity: 1,
                        linkDistance: 60                       
                    },
                    height: 600,
                    withLabels: true,
                    with_edge_labels: true,
                    weighted: true,                    
                    edgeStyle: {
                        'stroke-width': 1
                    },
                    nodeStyle: {
                        fill: function(d) { 
                            return color(jsnx.degree(vm.G, d.node));
                        }                    
                    },
                    stickyDrag: true

                }, true);
                //vm.degreeHistogram = jsnx.degreeHistogram(vm.G);
                
                //console.log(jsnx.toEdgelist (vm.G));
                
               
            }
            function g_add_node() {
                vm.G.addNode(vm.G.node.size + 1);
                console.log(vm.G.node.size);
            }
            function g_add_edge() {
                vm.G.addNode(vm.G.node.size + 1);
                console.log(vm.G.node.size);
            }

            function fastGnpRandomGraph(){
                vm.G = jsnx.fastGnpRandomGraph(vm.n, vm.p, vm.optDirected);
                console.log(jsnx.degreeHistogram(vm.G));
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
                console.log(jsnx.degreeHistogram(vm.G));
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
                console.log(data);
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

                var svg = d3.select("body").append("svg")
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

            }
        }
        
    ]);
})();
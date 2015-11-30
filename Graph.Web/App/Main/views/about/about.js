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
                    G.addEdgesFrom(d3.zip(sourceArray, targets));
                    // Add one node to the list for each new edge just created.
                    //repeatedNodes.push(targets);
                    //# And the new node "source" has m edges to add to the list.
                    //repeatedNodes.push(sourceArray);
                    repeatedNodes = d3.merge([repeatedNodes, sourceArray, targets]);
                    targets = _random_subset(repeatedNodes, m);
                    //console.log(targets);
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
            /*function range(optStart, optEnd, optStep) {
                //console.log(Array.from(genRange(optStart, optEnd, optStep)));
                return Array.from(d3.range(optStart,optEnd,optStep));
            };    */        
            function randHistogramm(){
                // Generate a Bates distribution of 10 random variables.
                var values = d3.range(1000).map(d3.random.bates(10));

                // A formatter for counts.
                var formatCount = d3.format(",.0f");

                var margin = { top: 10, right: 30, bottom: 30, left: 30 },
                    width = 960 - margin.left - margin.right,
                    height = 500 - margin.top - margin.bottom;

                var x = d3.scale.linear()
                    .domain([0, 1])
                    .range([0, width]);

                // Generate a histogram using twenty uniformly-spaced bins.
                var data = d3.layout.histogram()
                    .bins(x.ticks(20))
                    (values);

                var y = d3.scale.linear()
                    .domain([0, d3.max(data, function (d) { return d.y; })])
                    .range([height, 0]);

                var xAxis = d3.svg.axis()
                    .scale(x)
                    .orient("bottom");

                var svg = d3.select("body").append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                  .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                var bar = svg.selectAll(".bar")
                    .data(data)
                  .enter().append("g")
                    .attr("class", "bar")
                    .attr("transform", function (d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });

                bar.append("rect")
                    .attr("x", 1)
                    .attr("width", x(data[0].dx) - 1)
                    .attr("height", function (d) { return height - y(d.y); });

                bar.append("text")
                    .attr("dy", ".75em")
                    .attr("y", 6)
                    .attr("x", x(data[0].dx) / 2)
                    .attr("text-anchor", "middle")
                    .text(function (d) { return formatCount(d.y); });

                svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + height + ")")
                    .call(xAxis);
            }
        }
        
    ]);
})();
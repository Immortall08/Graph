(function () {
    var controllerId = 'app.views.about';
    angular.module('app').controller(controllerId, [
        '$scope', function ($scope) {
            var vm = this;            
            //About logic...

            vm.G = new jsnx.Graph();
            vm.n = 50;
            vm.p = 0.1;
            vm.m = 2;
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
            vm.degreeHistogram ;

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
                vm.G = genBarabasiAlbertGraph(vm.n, vm.m);
                console.log(jsnx.degreeHistogram(vm.G));
                draw();
            };

            function genBarabasiAlbertGraph(n,m){
                var G = new jsnx.Graph();
                var edges;
                var rangeN = range(n);
                var targets = range(m);
                var repeatedNodes = [];
                var source = m;
                //var sourceArray = [];
                G.name = 'barabasi_albert_graph('+n+', '+m+')';

                while (source < n) {
                    //sourceArray = [];
                    // Add edges to m nodes from the source.
                    for (var i = 0; i < m; i++) {
                        G.addEdge(source, targets[i]);
                        // And the new node "source" has m edges to add to the list.
                        repeatedNodes.push(source);
                    };
                    //G.addEdgesFrom(zip([source] * m, targets));
                    // Add one node to the list for each new edge just created.
                    for (var i = 0; i < m; i++) {
                        repeatedNodes.push(targets[i]);
                    }
                    
                    // Now choose m unique nodes from the existing nodes
                    // Pick uniformly from repeated_nodes (preferential attachement)
                    //console.log(targets);
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
            function range(optStart, optEnd, optStep) {
                //console.log(Array.from(genRange(optStart, optEnd, optStep)));
                return Array.from(genRange(optStart, optEnd, optStep));
            };
            function* genRange(optStart, optEnd, optStep) {

                if (optStart == null) {
                    return;
                }
                else if (optEnd == null) {
                    optEnd = optStart;
                    optStart = 0;
                    optStep = 1;
                }
                else if (optStep == null) {
                    optStep = 1;
                }
                else if (optStep === 0) {
                    throw new RangeError("opt_step can't be 0");
                }

                var negative = optStep < 0;
                for (var i = optStart; negative && i > optEnd || !negative && i < optEnd; i += optStep) {
                    yield i;
                }
            };
        }
        
    ]);
})();
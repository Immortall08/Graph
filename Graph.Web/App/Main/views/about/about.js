(function () {
    var controllerId = 'app.views.about';
    angular.module('app').controller(controllerId, [
        '$scope', function ($scope) {
            var vm = this;            
            //About logic...

            vm.G = new jsnx.Graph();
            vm.n = 50;
            vm.p = 0.1;
            vm.optDirected = false;
            
            vm.gnpRandomGraph = gnpRandomGraph;
            vm.fastGnpRandomGraph = fastGnpRandomGraph;
            vm.binomialGraph = binomialGraph;
            vm.erdosRenyiGraph = erdosRenyiGraph;
            vm.cliques;
            vm.numberOfCliques;

            vm.addNode = false;
            vm.addEdge = false;
            vm.removeNode = false;
            vm.removeEdge = false;
            
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

                });
                
                console.log(degree);
               
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

        }
    ]);
})();
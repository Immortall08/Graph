(function () {
    var controllerId = 'app.views.about';
    angular.module('app').controller(controllerId, [
        '$scope', function ($scope) {
            var vm = this;            
            //About logic...
            vm.G = new jsnx.Graph();
            vm.G = jsnx.gnpRandomGraph(50, 0.1);
            

            jsnx.draw(vm.G, {
                element: '#canvas',                
                height: 600,
                weighted: true,
                edgeStyle: {
                    'stroke-width': 1
                }
            });
        }
    ]);
})();
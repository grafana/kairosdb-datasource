define(["require", "exports"], function (require, exports) {
    var KairosDBConfigCtrl = (function () {
        /** @ngInject */
        function KairosDBConfigCtrl($scope) {
            this.current.jsonData = this.current.jsonData || {};
        }
        KairosDBConfigCtrl.templateUrl = 'partials/config.html';
        return KairosDBConfigCtrl;
    })();
    exports.KairosDBConfigCtrl = KairosDBConfigCtrl;
});

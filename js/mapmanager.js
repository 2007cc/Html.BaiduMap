
(function() {
    
    //继承自navmap

    /**
     *@ mapmanager
     */
    var MapManager =
        /**
         * MapManager
         * @class 用来管理地图相关内容及交互
         * @constructor
         * @param {Map} map 地图的一个实例。
         * @url 数据源地址
         * @remark 地图UI容器
         *    
         */
        BMapLib.MapManager = function() {

            BMapLib.NavMap.call(this);

            this.layers = [];

            this.projectLayer = null;

            this.employeeLayer = null;

            this.layerSelectorControl = null;
        };


        /**
        * 继承
        */
//        BMapLib.MapManager.prototype = new BMapLib.NavMap();

    inheritPrototype(MapManager, BMapLib.NavMap);

        MapManager.constructor = MapManager;

        /**
        * 地图初始化
        */
        MapManager.prototype.initializeMapEx = function (map) {

           
        };

        /**
        * 配置地图属性
        */
        MapManager.prototype.configMapAttributeEx = function () {

            
            
        };


        /**
        * 配置地图控件
        */
        MapManager.prototype.configMapControlEx = function () {
            

            if (BMapLib.LayerSelectorControl) {
                var options = {
                    anchor: BMAP_ANCHOR_TOP_RIGHT,
                    offset: new BMap.Size(10, 20)
                };
                var layerSelectorControl = this.layerSelectorControl = new BMapLib.LayerSelectorControl(options);
                window.mapManager.Map.addControl(layerSelectorControl);
            }

//            if (BMapLib.LocateControl) {
//                var options = {
//                    anchor: BMAP_ANCHOR_TOP_LEFT,
//                    offset: new BMap.Size(10, 100)
//                };
//                var locateControl = new BMapLib.LocateControl(options);
//                window.mapManager.Map.addControl(locateControl);
//            }

            this.configLayer();

            
        };

        /**
        * 配置地图事件
        */
        MapManager.prototype.configMapEventEx = function () {

            var that = this;

            this.Map.addEventListener('load', function () {

                
            });


        };

        /**
        * 配置图层
        */
        MapManager.prototype.configLayer = function () {
            var that = this;

            var employeeLayer = new BMapLib.EmployeeLayer();
            employeeLayer.id = 'employeeLayer';
            employeeLayer.name = '员工';
            employeeLayer.url = '00';
            window.mapManager.addLayer(employeeLayer);

            that.employeeLayer = employeeLayer;

            this.layerSelectorControl.addItem({
                icon: '../image/employee_offline_normal.png',
                txt: '员工',
                fn:function() {
                    that.employeeLayer.toggleVisiable();
                }

            });


            var projectLayer = new BMapLib.ProjectLayer();
            projectLayer.id = 'projectLayer';
            projectLayer.name = '项目';
            projectLayer.url = '';


            that.projectLayer = projectLayer;
            window.mapManager.addLayer(projectLayer);
            this.layerSelectorControl.addItem({
                icon: '../image/feature_nonMonitor_normal.png',
                txt: '项目',
                fn: function () {
                    that.projectLayer.toggleVisiable();
                }
            });
        };

        /**
        * 添加图层
        * @ layer objec 图层对象
        */
        MapManager.prototype.addLayer = function(layer) {

            var isExists = false;
            for (var i = 0; i < window.mapManager.layers.length; i++) {
                var layerObj = window.mapManager.layers[i];
                if (layer.id === layerObj.id) {

                    window.mapManager.layers[i].layer = layer;
                    isExists = true;
                    break;
                }
            }

            if (!isExists) {
                window.mapManager.layers.push({ id: layer.id, layer: layer });
            }
            layer.setMap(window.mapManager.Map);
        };
        
        /**
        * 移除图层
        * @ id number 图层对象id
        */
        MapManager.prototype.removeLayer = function (id) {
            for (var i = 0; i < window.mapManager.layers.length; i++) {
                var layerObj = window.mapManager.layers[i];
                if (id === layerObj.id) {
                    window.mapManager.layers.splice(i, 1);
                    break;
                }
            }
        };


       

})();







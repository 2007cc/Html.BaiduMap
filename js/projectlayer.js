
(function () {

    /**
     *@ ProjectLayer
     */
    var ProjectLayer =
        /**
         * ProjectLayer
         * @class 项目图层
         * @constructor
         * @param {Map} map 地图的一个实例。
         * @remark 
         *    
         */
        BMapLib.ProjectLayer = function () {

            BMapLib.LayerBase.call(this);

            this.id = null;
            this.map = null;
            this.attribute = {};

            this.loading = false;
            
        };


//        ProjectLayer.prototype = new BMapLib.LayerBase();

    inheritPrototype(ProjectLayer, BMapLib.LayerBase);

        ProjectLayer.constructor = ProjectLayer;


        /**
        * 创建图形符号
        * param data 符号元素据
        */
        ProjectLayer.prototype.createGraphic = function (data) {

            var pt = new BMap.Point(data.Lng,data.Lat);
            var img = "http://192.168.50.254/assets/img/feature/feature_nonMonitor_normal.png";
            var myIcon = new BMap.Icon(img, new BMap.Size(24, 24));
            var graphic = new BMapLib.Graphic(pt, { icon: myIcon });
            graphic.id = data.Id;
            graphic.attribute = data;
            graphic.map = this.map;


            if (data.isAlarm) {
                graphic.setAnimation('singleyellow');
            }
            graphic.click = function() {
                var obj = {
                    FunctionName: "ProjectClick",
                    FunctionParams: data.Id,
                };
                var json = JSON.stringify(obj);
                if (window.invokeCSharpAction)
                    window.invokeCSharpAction(json);
            };
            return graphic;
        };

        ProjectLayer.prototype.businessDataType = function () {
            return 2;
        };



        ProjectLayer.prototype.load = function () {
            try {

                if (this.loading || !this.visiable) return;
                this.loading = true;

                var functionParams = this.getSearchContextParam();
                functionParams = JSON.stringify(functionParams);
                var obj = {
                    FunctionName: "MapSearch",
                    FunctionParams: functionParams,
                    Callback: 'window.mapManager.projectLayer.loadCallback'
                };

                var json = JSON.stringify(obj);
                if (window.invokeCSharpAction)
                    window.invokeCSharpAction(json);
            } catch (e) {
                window.mapManager.projectLayer.loadCallback();
                console.log(e.toLocaleString());
            }

//            var graphic=this.createGraphic({ Id: 10759, Lng: 104.08, Lat: 30.7 });
//            this.addGraphic(graphic);
        };

        ProjectLayer.prototype.loadComplete = function () {

            this.loading = false;

            
        };


        ProjectLayer.prototype.setAlarmState = function() {
            this.setIcon('');
        };

        ProjectLayer.prototype.setErrorState = function () {
            this.setIcon('');
        };
        ProjectLayer.prototype.setProblemState = function () {
            this.setIcon('');
        };

        ProjectLayer.prototype.updateState = function(data) {
            //todo

            if (data) {

                data = decodeURIComponent(data);

                data = JSON.parse(data);

                if (data.length > 0) {
                    for (var i = 0, obj; obj = data[i]; i++) {
                        var graphic = this.getGraphic(obj.ProjectId);
                        if (graphic) {
                            
                            // todo 根据不同条件设置图标

                            if (obj.IsInCommunicationFailure) {
                                
                            }

                        }
                        
                    }
                }
                
            }
        };


})()
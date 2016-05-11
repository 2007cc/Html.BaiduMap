
(function () {

    /**
     *@ EmployeeLayer
     */
    var EmployeeLayer =
        /**
         * EmployeeLayer
         * @class 员工图层
         * @constructor
         * @param {Map} map 地图的一个实例。
         * @remark 
         *    
         */
        BMapLib.EmployeeLayer = function () {

            BMapLib.LayerBase.call(this);

            this.id = null;
            this.map = null;
            this.attribute = {};
            this.loading = false;
        };


    //        EmployeeLayer.prototype = new BMapLib.LayerBase();

    inheritPrototype(EmployeeLayer, BMapLib.LayerBase);
    EmployeeLayer.constructor = EmployeeLayer;




        /**
        * 创建图形符号
        * param data 符号元素据
        */
        EmployeeLayer.prototype.createGraphic = function (data) {
            
            var pt = new BMap.Point(data.Lng, data.Lat);
            var img = "http://192.168.50.254/assets/img/feature/employee_offline_normal.png";
            var myIcon = new BMap.Icon(img, new BMap.Size(24, 24));
            var graphic = new BMapLib.Graphic(pt, { icon: myIcon });
            graphic.id = data.Id;
            graphic.attribute = data;
            graphic.map = this.map;

            graphic.click = function () {
                var obj = {
                    FunctionName: "EmployeeClick",
                    FunctionParams: data.Id,
                };

                var json = JSON.stringify(obj);
                if (window.invokeCSharpAction)
                    window.invokeCSharpAction(json);
            };

            return graphic;
        };

        EmployeeLayer.prototype.businessDataType = function () {
            return 1;
        };


        EmployeeLayer.prototype.load = function () {
            try {
                if (this.loading || !this.visiable) return;
                this.loading = true;

                var functionParams = this.getSearchContextParam();
                functionParams = JSON.stringify(functionParams);

                var obj = {
                    FunctionName: "MapSearch",
                    FunctionParams: functionParams,
                    Callback: 'window.mapManager.employeeLayer.loadCallback'
                };
                var json = JSON.stringify(obj);

                if (window.invokeCSharpAction)
                    window.invokeCSharpAction(json);
            } catch (e) {
                window.mapManager.employeeLayer.loadCallback();
                console.log(e.toLocaleString());
            }

        };

        EmployeeLayer.prototype.loadComplete = function () {

            this.loading = false;

        };

        EmployeeLayer.prototype.updateState = function (data) {
            //todo
        };


})()
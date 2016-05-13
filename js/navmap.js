
var BMapLib = window.BMapLib = BMapLib || {};


function object(o) {
    function F() { }
    F.prototype = o;
    return new F();
}

function inheritPrototype(subClass, superClass) {
    var prototype = object(superClass.prototype);
    prototype.constructor = subClass;
    subClass.prototype = prototype;
}

(function() {

    window.addEventListener('load', function () {
        var obj = {
            FunctionName: "load",
            FunctionParams: '',
        };
        var json = JSON.stringify(obj);
        if (window.invokeCSharpAction)
            window.invokeCSharpAction(json);
    });




    window.onerror = function (error) {
        console.log(error);
    };



    /**
     *@ NavMap
     */
    var NavMap =
        /**
         * NavMap
         * @class 地图基本页面
         * @constructor
         * @param {Map} map 地图的一个实例。
         * @remark 地图UI容器
         *    
         */
        BMapLib.NavMap = function (options) {

            
            //定义一堆属性
            
            this.options=options||{};
            
            this.Map = null;

            this.locateControl = null;
            
            this.currentLocation = null;

            this.driving =null;

            this.init = false;

            this.isMapLoaded = false;

          
        };

        NavMap.constructor = NavMap;

        /**
         * 加载外部js库
         * @ param url 地址
         * @ param callback 完成回调
         */
        NavMap.prototype.loadJScript = function (url, callback) {
            var script = document.createElement("script");
            script.type = "text/javascript";
            script.src = url;
            script.onload = callback;
            document.body.appendChild(script);
        };

        NavMap.prototype.initializeMapEx = function() {

        };

        /**
        * 初始化
        */
        NavMap.prototype.initializeMap = function (map) {

            this.Map = map;

            // 创建地图
            if (BMap && BMap.Map && !this.init) {

                var that = this;

                this.configMapAttribute();

                this.initializeMapEx();

                this.init = true;

                setTimeout(function () {
                    that.mapLoaded();
                }, 1000);
            } else {
                return;
            }
        };

        NavMap.prototype.configMapAttributeEx = function() {
        
        };
        /**
        * 配置地图属性
        */
        NavMap.prototype.configMapAttribute = function() {

            
            this.configMapEvent();

            var that = this;
            this.Map.enableScrollWheelZoom(false);

            var point = new BMap.Point(104, 31);
            this.Map.centerAndZoom(point, 10);

            var myCity = new BMap.LocalCity();
            myCity.get(function(result) {

                that.currentLocation = result.center;

                that.Map.centerAndZoom(result.name, result.level);
            });

            this.configMapAttributeEx();
            this.configMapControl();
        };

        NavMap.prototype.configMapControlEx = function() {
            
        };
        /**
        * 配置地图控件
        */
        NavMap.prototype.configMapControl = function() {

            var that = this;

            var opts = { type: BMAP_NAVIGATION_CONTROL_ZOOM };
            this.Map.addControl(new BMap.NavigationControl(opts));

            var options = {
                anchor: BMAP_ANCHOR_BOTTOM_LEFT,
                locationIcon: new BMap.Icon("../image/icon_center_point.png", new BMap.Size(24, 24)),
                enableAutoLocation: true,
            };

            this.locateControl = new BMapLib.LocateControl(options);

            this.locateControl.addEventListener('locationSuccess', function (ob) {
                //更新
                that.currentLocation = ob.point;

                var obj = {
                    FunctionName: "locationSuccess",
                    FunctionParams: JSON.stringify(ob.point),
                };
                var json = JSON.stringify(obj);
                if (window.invokeCSharpAction)
                    window.invokeCSharpAction(json);
            });
            this.locateControl.addEventListener('locationError', function (ob) {
                var obj = {
                    FunctionName: "locationError",
                    FunctionParams: JSON.stringify(ob.code),
                };
                var json = JSON.stringify(obj);
                if (window.invokeCSharpAction)
                    window.invokeCSharpAction(json);
            });
            that.Map.addControl(this.locateControl);

            var top_left_control = new BMap.ScaleControl({anchor: BMAP_ANCHOR_BOTTOM_LEFT});

            that.Map.addControl(top_left_control);

            this.configMapControlEx();

            
            window.addEventListener('load',function () {
                
            });
            
            

        };

        NavMap.prototype.configMapEventEx = function() {
        
        };

        /**
        * 配置地图事件
        */
        NavMap.prototype.configMapEvent = function () {

            var that = this;

            this.Map.addEventListener('touchstart', function () {
                var obj = {
                    FunctionName: "MapClick",
                    FunctionParams: '',
                };
                var json = JSON.stringify(obj);
                if (window.invokeCSharpAction)
                    window.invokeCSharpAction(json);
            });

            this.Map.addEventListener('load', function () {

                that.driving = new BMap.DrivingRoute(that.Map, { renderOptions: { map: that.Map, autoViewport: true } });
                that.driving.setInfoHtmlSetCallback(function (obj) {
                    obj.marker.closeInfoWindow();
                });

                

                
            });


            this.configMapEventEx();
        };

        NavMap.prototype.setMapLoadedResponsed = function() {
            this.isMapLoaded = true;
        };

        NavMap.prototype.mapLoaded = function () {

            

            this.isMapLoaded = true;
            var obj = {
                FunctionName: "MapLoaded",
                FunctionParams: ''
            };
            var json = JSON.stringify(obj);
            if (window.invokeCSharpAction)
                window.invokeCSharpAction(json);

            this.onMapLoaded();
        };


        NavMap.prototype.onMapLoaded = function() {
//            var ds = document.getElementsByClassName('BMap_geolocationIcon');
            //            ds[1].click();

            this.locateControl.location();
        };
        /**
        * 定位
        */
        NavMap.prototype.location = function () {
            try {
                var that = this;
                var fn = that.locateControl.location;
                setTimeout(function () {
                    fn.call(that.locateControl);
                }, 500);
            } catch (e) {
                console.log(e.trace);
            }
        };

        /**
        * 路径规划
        * @ targetPostion 目标点{BaiduLng,BaiduLat}对象
        */
        NavMap.prototype.drivingRoute = function (targetPostion) {

            targetPostion = decodeURIComponent(targetPostion);

            targetPostion = JSON.parse(targetPostion);

            if (this.currentLocation && this.driving) {
                this.clearDrivingRoute();

                var currLocation = new BMap.Point(targetPostion.startLng, targetPostion.startLat);
                var targetPt = new BMap.Point(targetPostion.BaiduLng, targetPostion.BaiduLat);
                this.driving.search(currLocation, targetPt);
            }
        };

        /**
        * 清除路径规划
        * @ 
        */
        NavMap.prototype.clearDrivingRoute = function () {
            if (this.driving) {
                this.driving.clearResults();
            }
        };

})();







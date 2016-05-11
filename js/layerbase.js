
(function () {

    /**
     *@ LayerBase
     */
    var LayerBase =
        /**
         * LayerBase
         * @class 图形图层基类
         * @constructor
         * @param {Map} map 地图的一个实例。
         * @url 数据源地址
         * @remark 
         *    
         */
        BMapLib.LayerBase = function () {
            this.id = null;
            this.map = null;
            this.url = null;
            this.name = null;
            this.visiable = true;
            this.graphics = [];
            this.lastActiveGraphic = null;
        };


        LayerBase.constructor = LayerBase;


        /**
        * 设置是否可见
        * @ param value bool
        */
        LayerBase.prototype.setVisiable = function(value) {
            if (this.visiable !== value) {
                this.visiable = value;
                if (value) {
                    this.load();
                } else {
                    this.clear();//todo这里先粗暴一点
                }
            }
            
        };

        /**
        * 获取是否可见
        * 
        */
        LayerBase.prototype.getVisiable = function () {
            return this.visiable;
        };

        LayerBase.prototype.toggleVisiable = function () {
            if (this.visiable) {
                this.setVisiable(false);
            } else {
                this.setVisiable(true);
            }
        };
        /**
        * 设置地图对象
        * @ param map {BMap.Map}
        */
        LayerBase.prototype.setMap = function(map) {
            this.map = map;
            var that = this;
            this.map.addEventListener('zoomend', function () {
                if (that.visiable)
                    that.load();
            });
            this.map.addEventListener('moveend', function () {
                if (that.visiable)
                    that.load();
            });
        };

        /**
        * 加载
        */
        LayerBase.prototype.load = function () {
            this.clear();

            
        };

        /**
        * 加载完成
        */
        LayerBase.prototype.loadComplete = function () {

        };

        /**
        * 加载完成后回调
        * @ param data {object}
        */
        LayerBase.prototype.loadCallback = function (data) {

            try {
                if (data) {

                    data=decodeURIComponent(data);

                    data = JSON.parse(data);

                    if (data.Results) {

                        this.clear();

                        for (var i = 0, obj; obj = data.Results[i]; i++) {
                            var graphic = this.createGraphic(obj);
                            this.addGraphic(graphic);
                        }
                    }
                }
            } catch (e) {
                console.log(e.stack);
            } finally {
                this.loadComplete();
            }
        };
        

        /**
        * 添加一个图形
        @ param graphic object 图形对象
        */
        LayerBase.prototype.addGraphic = function (graphic) {
            if (this.graphics[graphic.id])
                this.map.removeOverlay(this.graphic);
            this.graphics[graphic.id] = graphic;
            this.map.addOverlay(graphic);
        };

        /**
        * 移除一个图形
        @ param id 图形id
        */
        LayerBase.prototype.removeGraphic = function (id) {
            if (this.graphics[id]) {
                this.map.removeOverlay(this.overlays[id]);
                delete this.graphics[id];
            }
        };

        /**
        * 清空所有图形
        */
        LayerBase.prototype.clear = function() {
            for (var i in this.graphics) {
                this.map.removeOverlay(this.graphics[i]);
                delete this.graphics[i];
            }
            this.graphics = [];
        };


        /**
        * 创建图形符号
        * param data {object} 创建符号的元素据
        */
        LayerBase.prototype.createGraphic = function (data) {

            var graphic = new BMapLib.Graphic();
            graphic.id = data.id;
            graphic.attribute = data;
            graphic.map = this.map;
            return graphic;
        };


        /**
        * 获取业务数据类型
        * return 返回类型
        */
        LayerBase.prototype.businessDataType = function() {
            return 1;
        };

        /**
        * 获取上下文搜索参数
        * return 返回请求参数 {object}
        */
        LayerBase.prototype.getSearchContextParam = function () {
            try {
            

                var bounds = this.map.getBounds();
                var minX = bounds.getSouthWest() != null ? bounds.getSouthWest().lat : 0;
                var minY = bounds.getSouthWest() != null ? bounds.getSouthWest().lng : 0;
                var maxX = bounds.getNorthEast() != null ? bounds.getNorthEast().lat : 180;
                var maxY = bounds.getNorthEast() != null ? bounds.getNorthEast().lng : 90;
                var zoom = this.map.getZoom();
                var param ={
                    ZoomLevel: zoom,
                    MaxLat: maxX,
                    MinLat: minX,
                    MaxLng: maxY,
                    MinLng: minY,
                    BusinessDataType: this.businessDataType(),//1 员工，2项目
                    Keyword: '',
                    PageIndex: 1,
                    PageSize: 10,
                    SearchMode: 0,
                    AdministrativeRegionId: 0,
                    LogicAreaId: 0,
                    SessionId:'',
                };
                return param;
            } catch (e) {
                console.log(e.toString());
            }
        };


        LayerBase.prototype.updateState = function (data) { };


        LayerBase.prototype.getGraphic = function(id) {
            return this.graphics[id];
        };

    
        LayerBase.prototype.setActive = function (id) {
            if (this.graphics[id] && this.lastActiveGraphic !== this.graphics[id]) {
                this.graphics[id].toggleActive();
                if (this.lastActiveGraphic)
                    this.lastActiveGraphic.toggleActive();

                this.lastActiveGraphic = this.graphics[id];
                
            }
        };
})()
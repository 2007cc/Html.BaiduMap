
(function () {




    /**
     *@ Graphic
     */
    var Graphic =
        /**
         * Graphic
         * @class 图形类
         * @constructor
         * @param {point} point 坐标点
         * @param {size} size 大小
         * @param {opts} iconoptions 图标信息
         * @remark 
         *    
         */
        BMapLib.Graphic = function (point, options) {
            this.point = point;
            this.options = options || {
                icon:{
                    imageUrl: '',
                    size: { width: 24, height: 24 },
                },
                animation: 'singlegreen'
            };
            this.container = null;
            this.id = null;
            this.map = null;
            this.img = null;
            this.text = '';
            this.attribute = {};
        };


        Graphic.prototype = new BMap.Overlay();

        /**
        * 初始化
        * remarks 覆盖父类方法
        * param map {BMap.Map} map对象
        */
        Graphic.prototype.initialize = function (map) {
            this.map = map;
            var container=this.container = document.createElement('div');
            this.container.className = '';
            this.img = document.createElement('img');

            var that = this;
            container.addEventListener('touchstart', function () {
                if (event)
                    event.stopPropagation();
                 that.click.call(this);
            });

            this.configAttribute();

            this.configStyle();

            this.container.appendChild(this.img);

            this.draw();

            this.map.getPanes().labelPane.appendChild(this.container);

            return this.container;
        };

        /**
        * 触控事件
        * 
        * 
        */
        Graphic.prototype.click = function () {
            
            var obj = {
                FunctionName: "ProjectClick",
                FunctionParams: '',
            };
            var json = JSON.stringify(obj);
            if (window.invokeCSharpAction)
                window.invokeCSharpAction(json);
        };

        /**
        * 设置html属性
        */
        Graphic.prototype.configAttribute = function () {
            if (this.container) {
                this.container.innerText = this.text;
                this.img.src = this.options.icon.imageUrl;
            }
        };

      

        /**
        * 设置样式
        */
        Graphic.prototype.configStyle = function () {
            if (this.container) {

                this.toggleClass(this.container, this.options.animation);
                this.container.style.cssText = this.buildContainerCss();

                this.img.style.cssText = this.buildIconCss();
            }
        };



        /**
        * 绘制
        * remarks 覆盖父类方法
        */
        Graphic.prototype.draw = function() {
            var map = this.map;

            var pixel = map.pointToOverlayPixel(this.point);
            this.container.style.left = pixel.x - parseInt(this.container.style.width)/2 + "px";
            this.container.style.top = pixel.y - parseInt(this.container.style.height)/2 + "px";
        };



        /**
        * 设置并更新位置
        * param point {BMap.Point} point对象
        */
        Graphic.prototype.setPosition = function(point) {
            this.point = point;
            this.draw();
        };


        /**
        * 构建样式
        */
        Graphic.prototype.buildContainerCss = function() {
            var cssText = [];
            cssText.push('position: absolute;');
            cssText.push('margin: 0px;');
            cssText.push('padding: 0px;');
            cssText.push('width: 36px;');
            cssText.push('height: 36px;');
            cssText.push('border-radius: 50%;');
            cssText.push('left: 0px;');
            cssText.push('top: 0px;');
            cssText.push('text-align: center;');
            cssText.push('line-height: 36px;');
            cssText.push('color: white;');
            cssText.push('font-family: "Microsoft Yahei", sans-serif;');
            cssText.push('font-weight: bold;');
            cssText.push('font-size: 16px;');
            return cssText.join('');
        };

        /**
        * 构建图标样式
        * param point {BMap.Point} point对象
        */
        Graphic.prototype.buildIconCss = function() {
            var size = this.options.icon.size;
            var cssTxt = [];
            cssTxt.push('width: ' + size.width + 'px;');
            cssTxt.push('height: ' + size.height + 'px;');
            cssTxt.push('display: block;');
            cssTxt.push('border: none;');
            cssTxt.push('margin-left:' + size.width / 4 + 'px;');
            cssTxt.push('cursor:pointer;');
            cssTxt.push('margin-top: ' + size.height / 4 + 'px;');
            return cssTxt.join('');
        };


        /**
        * 设置动画效果
        * param animation "single系列"
        */
        Graphic.prototype.setAnimation = function (animation) {

            this.options.animation = animation;

            this.configStyle();
        };

        /**
        * 设置显示的文本
        * param text ""
        */
        Graphic.prototype.setText = function (text) {

            this.text = text;

            this.configAttribute();
        };

        /**
        * 设置icon
        */
        Graphic.prototype.setIcon = function (icon) {
            if (this.img) {
                this.img.src = icon;
                this.options.icon = icon;
            }
        };

        /**
        * 设置active
        */
        Graphic.prototype.toggleActive = function () {
            this.toggleClass(this.container, 'breathe-btn');
        };


        Graphic.prototype.hasClass = function (obj, cls) {
            return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
        };

        Graphic.prototype.addClass = function (obj, cls) {
            if (!this.hasClass(obj, cls)) obj.className += " " + cls;
        };

        Graphic.prototype.removeClass = function (obj, cls) {
            if (this.hasClass(obj, cls)) {
                var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
                obj.className = obj.className.replace(reg, ' ');
            }
        };

        Graphic.prototype.toggleClass = function (obj, cls) {
            if (this.hasClass(obj, cls)) {
                this.removeClass(obj, cls);
            } else {
                this.addClass(obj, cls);
            }
        };

})()
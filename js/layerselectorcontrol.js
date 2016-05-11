
(function () {

    /**
     *@ LayerSelectotControl
     */
    var LayerSelectorControl =
        /**
         * LayerSelectotControl
         * @class 图形选择类
         * @constructor
         * @param {Map} map 地图的一个实例。
         * @url 数据源地址
         * @remark 
         *    
         */
        BMapLib.LayerSelectorControl = function (options) {
            this.defaultAnchor = options.anchor;
            this.defaultOffset = options.offset;
            this.map = null;
            this.container = null;

            this.divContent = null;
        };


    LayerSelectorControl.prototype = new BMap.Control();

       /**
        * 
        *
        */
        LayerSelectorControl.prototype.click = function () {

            if (this.divContent.style.visibility !== 'visible') {
                this.showContent();
            } else {
                this.closeContent();
            }
            if (event) {
                event.stopPropagation();
            }
        };

       /**
        * 初始化
        */
    LayerSelectorControl.prototype.initialize = function (map) {
            this.map = map;
            var that = this;
            var container = this.container = document.createElement('div');
            container.addEventListener('click', function() {
                that.click();
            });
            container.style.cssText += this.buildContainerCss();


            var divBtn = document.createElement('span');
            divBtn.style.cssText += this.buildCss();
            
            container.appendChild(divBtn);

            this.divContent =  document.createElement('div');

            this.divContent.style.cssText = this.buildDivContentCss();
            container.appendChild(this.divContent);

            this.map.getContainer().appendChild(container);

       
            return container;

        };
    LayerSelectorControl.prototype.showContent = function() {
        this.divContent.style.visibility = 'visible';
    };

    LayerSelectorControl.prototype.closeContent = function () {
        this.divContent.style.visibility = 'hidden';
    };

    /**
    * obj {icon:'',txt:'',fn:function}
    */
    LayerSelectorControl.prototype.addItem = function(obj) {

        var eSpan = document.createElement('div');
        eSpan.style.cssText += this.buildItemCss();
        this.divContent.appendChild(eSpan);

        var img = document.createElement('img');
        img.src = obj.icon;
        img.style.display = 'block';
        img.style.height = '40px';
        img.style.margin = '5px auto';

        var a = document.createElement('a');
        a.style.display = 'block';
        a.innerText = obj.txt;


        eSpan.appendChild(img);
        eSpan.appendChild(a);
        eSpan.className += 'layerItem';
        eSpan.className += ' active';

        var that = this;
        eSpan.addEventListener('click', function() {
            that.toggleClass(this, 'active');
            if (typeof obj.fn === 'function') {
                obj.fn();
            }
        });
    };


    LayerSelectorControl.prototype.hasClass = function(obj, cls) {
        return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
    };

    LayerSelectorControl.prototype.addClass = function(obj, cls) {
        if (!this.hasClass(obj, cls)) obj.className += " " + cls;
    };

        LayerSelectorControl.prototype.removeClass = function(obj, cls) {
            if (this.hasClass(obj, cls)) {
            var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
            obj.className = obj.className.replace(reg, ' ');
        }
    };

    LayerSelectorControl.prototype.toggleClass = function(obj, cls) {
        if (this.hasClass(obj, cls)) {
            this.removeClass(obj, cls);
        } else {
            this.addClass(obj, cls);
        }
    };


    LayerSelectorControl.prototype.buildContainerCss = function () {
            var csstext = [];
            csstext.push('border-radius: 4;');
            csstext.push('background-color: #fff');
            csstext.push('width: 26px');
            csstext.push('height: 26px');
            csstext.push('background-color: #fff');
            csstext.push('text-align: center');
            csstext.push('overflow: visible');
            csstext.push('line-height: 26px');
            csstext.push('float: left');
            csstext.push('opacity: 1');

            return csstext.join(';');
        };



    LayerSelectorControl.prototype.buildCss = function () {
            var csstext = [];
            csstext.push('width: 14px');
            csstext.push('height: 14px');
            csstext.push('vertical-align: middle');
            csstext.push('cursor: pointer');
            
            csstext.push('display: inline-block');
            csstext.push('background-size: 76px,auto');
            csstext.push('background:url(' + 'http://webmap2.map.bdstatic.com/wolfman/static/common/images/ipLocation/ipLocation_723c166.png' + ')');
            csstext.push('background-position:-14px 0;');
            return csstext.join(';');
        };

    LayerSelectorControl.prototype.buildItemCss = function () {
        var csstext = [];
        csstext.push('width: 100px');
        csstext.push('height: 75px');
        csstext.push('vertical-align: middle');
        csstext.push('cursor: pointer');

        csstext.push('display: inline-block');
        csstext.push('margin: 5px;');
        return csstext.join(';');
    };


    LayerSelectorControl.prototype.buildDivContentCss = function() {
        var csstext = [];
        csstext.push('width: 240px');
        csstext.push('float: right');
        csstext.push('background-color: white');
        csstext.push('visibility: hidden');
        csstext.push('padding: 5px');
        return csstext.join(';');
    };

})()
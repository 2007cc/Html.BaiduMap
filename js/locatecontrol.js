

(function () {

    /**
     *@ LocateControl
     */
    var LocateControl =
        /**
         * LocateControl
         * @class 
         * @constructor
         * @param {Map} map 地图的一个实例。
         * @remark 
         *    
         */
        BMapLib.LocateControl = function (options) {
            this.defaultAnchor = options.anchor;
            this.defaultOffset = options.offset || new BMap.Size(10, 20);
            this.map = null;
            this.marker = null;
            this.addTxt = null;
        };


        LocateControl.prototype = new BMap.Control();

       /**
        * 定位
        *
        */
        LocateControl.prototype.location = function (autoCenter) {
            var that = this;

            that.locating();
            var geolocation = new BMap.Geolocation();
            geolocation.getCurrentPosition(function (r) {
                try {
                    if (this.getStatus() == BMAP_STATUS_SUCCESS) {
                        if (!that.marker) {
                            var icon = new BMap.Icon('../image/icon_center_point.png', new BMap.Size(24, 24));
                            that.marker = new BMap.Marker(r.point, { icon: icon });
                            that.map.addOverlay(that.marker);
                        } else {
                            that.marker.setPosition(r.point);
                        }
                        if (autoCenter === true)
                            that.map.panTo(r.point);

                        var address = r.address;
                        var txt= address.province + address.city + address.district + address.street + address.street_number;

                        that.showAddress(txt);

                        var c = {};
                        c.point = r.point;
                        c.code = this.getStatus();
                        c.address = that.addTxt.innerText;
                        c.message = "定位成功";
                        c.type = "locationSuccess";
                        that.dispatchEvent(c);

                    } else {
                        that.showAddress('定位失败');
                        var c = {};
                        c.code = this.getStatus();
                        c.message = "超时";
                        c.type = "locationError";
                        that.dispatchEvent(c);
                    }
                } catch (e) {
                    console.log(e.trace);
                } finally {
                    that.located();
                }
            },
            {
                enableHighAccuracy: true,
                timeout: 2E4,
                maximumAge: 0
            });

        };

       /**
        * 初始化
        */
        LocateControl.prototype.initialize = function(map) {
            this.map = map;
            var that = this;
            map.addEventListener('touchstart', function () {
                that.closeAddress();
            });
            map.addEventListener('click', function () {
                that.closeAddress();
            });

            
            var container = document.createElement('div');
            container.style.cssText += this.buildContainerCss();
            container.className += " breathe-btn";
           

            var bgDiv  = document.createElement('div');
            bgDiv.style.cssText += this.buildBgCss();
            container.appendChild(bgDiv);


            var locationIcon = this.locationIcon = document.createElement('div');
            
            locationIcon.style.cssText += this.buildIconCss();
            locationIcon.addEventListener('click', function () { that.location(true); });
            bgDiv.appendChild(locationIcon);
            

            var address = this.bgDiv = document.createElement('div');
            address.style.cssText += this.buildAddressCss();

            var adDiv = document.createElement('div');
            adDiv.style.cssText += "height: 32px;display: table-cell;vertical-align: middle;";
            address.appendChild(adDiv);

            var addTxt = this.addTxt = document.createElement('div');
            addTxt.style.cssText += "font-size: 12px;color: #666666;text-overflow: ellipsis;white-space: nowrap;overflow: hidden;display: block;min-width: 50px;";
            adDiv.appendChild(addTxt);
            addTxt.innerText = '';

            

            container.appendChild(address);

            window.addEventListener('error', function () {
                that.showAddress('定位失败');
                that.located();
            });

            this.map.getContainer().appendChild(container);
            return container;

        };


    LocateControl.prototype.locating = function() {
        this.locationIcon.style.backgroundImage='url("http://api0.map.bdimg.com/images/geolocation-control/mobile/loading-40x40.gif")';
    };

    LocateControl.prototype.located= function () {
        this.locationIcon.style.backgroundImage = 'url("http://api0.map.bdimg.com/images/geolocation-control/mobile/default-40x40.png")';
    };
        
        LocateControl.prototype.showAddress = function (txt) {
            this.addTxt.innerText = txt;
            this.bgDiv.style.display = 'block';
        };

        LocateControl.prototype.closeAddress = function () {
            this.bgDiv.style.display = 'none';
        };

        LocateControl.prototype.buildContainerCss = function () {
            var csstext = [];
            csstext.push('height: 32px');
            csstext.push('margin: 0px');
            csstext.push('box-sizing: border-box');
            csstext.push('border: 1px solid #d9d7d5');
            csstext.push('border-radius: 3px');
            csstext.push('overflow: hidden');
            csstext.push('-webkit-box-shadow: 1px 1px 1px rgba(0,0,0,.2)');

            return csstext.join(';');
        };

        LocateControl.prototype.buildBgCss = function () {
            var csstext = [];
            csstext.push('float: left');
            csstext.push('width: 32px');
            csstext.push('height: 32px');
            csstext.push('background-image: url("http://api0.map.bdimg.com/images/geolocation-control/mobile/gradient-bg-1x64.png")');
            csstext.push('background-size: 1px 32px');
            csstext.push('background-repeat: repeat-x');

            return csstext.join(';');
        };

        LocateControl.prototype.buildIconCss = function () {
            var csstext = [];
            csstext.push('width: 32px');
            csstext.push('height: 32px');
            csstext.push('cursor: pointer');
            csstext.push('background-image: url("http://api0.map.bdimg.com/images/geolocation-control/mobile/default-40x40.png")');
            csstext.push('background-size: 20px 20px');
            csstext.push('background-position: 50% 50%');
            csstext.push('background-repeat: no-repeat');

            return csstext.join(';');
        };

        LocateControl.prototype.buildAddressCss = function () {
            var csstext = [];
            csstext.push('display: none');
            csstext.push('float: left');
            csstext.push('min-width: 50px');
            csstext.push('padding-left: 10px');
            csstext.push('padding-right: 10px');
            csstext.push('border-left-width: 1px');
            csstext.push('border-left-style: solid');
            csstext.push('border-left-color: rgb(217, 215, 213)');
            csstext.push('background-image: url("http://api0.map.bdimg.com/images/geolocation-control/mobile/gradient-bg-1x64.png")');
            csstext.push('background-size: 1px 32px');
            csstext.push('background-repeat: repeat-x');

            return csstext.join(';');
        };

        LocateControl.prototype.buildCss = function() {
            var csstext = [];
            csstext.push('width: 14px');
            csstext.push('height: 14px');
            csstext.push('vertical-align: middle');
            csstext.push('display: inline-block');
            csstext.push('background-size: 76px,auto');
            csstext.push('background:url(' + 'http://webmap2.map.bdstatic.com/wolfman/static/common/images/ipLocation/ipLocation_723c166.png' + ')');
            csstext.push('background-position:-14px 0;');
            return csstext.join(';');
        };

})()
/**
 * @fileoverview MarkerClusterer标记聚合器用来解决加载大量点要素到地图上产生覆盖现象的问题，并提高性能。
 * 主入口类是<a href="symbols/BMapLib.MarkerClusterer.html">MarkerClusterer</a>，
 * 基于Baidu Map API 1.2。
 *
 * @author Baidu Map Api Group -bnb modify
 * @version 1.2
 */

/**
 * @namespace BMap的所有library类均放在BMapLib命名空间下
 */
var BMapLib = window.BMapLib = BMapLib || {};
(function () {
        /**
         * 获取一个扩展的视图范围，把上下左右都扩大一样的像素值。
         * @param {Map} map BMap.Map的实例化对象
         * @param {BMap.Bounds} bounds BMap.Bounds的实例化对象
         * @param {Number} gridSize 要扩大的像素值
         *
         * @return {BMap.Bounds} 返回扩大后的视图范围。
         */
        var getExtendedBounds = function (map, bounds, gridSize) {
            bounds = cutBoundsInRange(bounds);
            var pixelNE = map.pointToPixel(bounds.getNorthEast());
            var pixelSW = map.pointToPixel(bounds.getSouthWest());
            pixelNE.x += gridSize;
            pixelNE.y -= gridSize;
            pixelSW.x -= gridSize;
            pixelSW.y += gridSize;
            var newNE = map.pixelToPoint(pixelNE);
            var newSW = map.pixelToPoint(pixelSW);
            return new BMap.Bounds(newSW, newNE);
        };

        /**
         * 按照百度地图支持的世界范围对bounds进行边界处理
         * @param {BMap.Bounds} bounds BMap.Bounds的实例化对象
         *
         * @return {BMap.Bounds} 返回不越界的视图范围
         */
        var cutBoundsInRange = function (bounds) {
            var maxX = getRange(bounds.getNorthEast().lng, -180, 180);
            var minX = getRange(bounds.getSouthWest().lng, -180, 180);
            var maxY = getRange(bounds.getNorthEast().lat, -74, 74);
            var minY = getRange(bounds.getSouthWest().lat, -74, 74);
            return new BMap.Bounds(new BMap.Point(minX, minY), new BMap.Point(maxX, maxY));
        };

        /**
         * 对单个值进行边界处理。
         * @param {Number} i 要处理的数值
         * @param {Number} min 下边界值
         * @param {Number} max 上边界值
         *
         * @return {Number} 返回不越界的数值
         */
        var getRange = function (i, mix, max) {
            mix && (i = Math.max(i, mix));
            max && (i = Math.min(i, max));
            return i;
        };

        /**
         * 判断给定的对象是否为数组
         * @param {Object} source 要测试的对象
         *
         * @return {Boolean} 如果是数组返回true，否则返回false
         */
        var isArray = function (source) {
            return '[object Array]' === Object.prototype.toString.call(source);
        };

        /**
         * 返回item在source中的索引位置
         * @param {Object} item 要测试的对象
         * @param {Array} source 数组
         *
         * @return {Number} 如果在数组内，返回索引，否则返回-1
         */
        var indexOf = function (item, source) {
            var index = -1;
            if (isArray(source)) {
                if (source.indexOf) {
                    index = source.indexOf(item);
                } else {
                    for (var i = 0, m; m = source[i]; i++) {
                        if (m === item) {
                            index = i;
                            break;
                        }
                    }
                }
            }
            return index;
        };

        /**
         *@exports MarkerClusterer as BMapLib.MarkerClusterer
         */
        var MarkerClusterer =
            /**
             * MarkerClusterer
             * @class 用来解决加载大量点要素到地图上产生覆盖现象的问题，并提高性能
             * @constructor
             * @param {Map} map 地图的一个实例。
             * @param {Json Object} options 可选参数，可选项包括：<br />
             *    markers {Array<Marker>} 要聚合的标记数组<br />
             *    girdSize {Number} 聚合计算时网格的像素大小，默认60<br />
             *    maxZoom {Number} 最大的聚合级别，大于该级别就不进行相应的聚合<br />
             *    minClusterSize {Number} 最小的聚合数量，小于该数量的不能成为一个聚合，默认为2<br />
             *    isAverangeCenter {Boolean} 聚合点的落脚位置是否是所有聚合在内点的平均值，默认为否，落脚在聚合内的第一个点<br />
             *    styles {Array<IconStyle>} 自定义聚合后的图标风格，请参考TextIconOverlay类<br />
             */
            BMapLib.MarkerClusterer = function (map, options) {
                /*
                    @map 地图实例
                    @options 样式配置参数及marker点集合
                */
                //如果前台穿过来的map实例无效则就return
                if (!map) {
                    return;
                }
                //------------------------------------------------------start
                //将map实例赋值给this._map
                this._map = map;
                //构建一个_markers容器
                this._markers = [];
                //构建一个_clusters容器
                this._clusters = [];
                //声明一个pots的变量=传过来的options或者是个对象
                //------------------------------------------------------end
                var opts = options || {};
                //是否自适应聚合，如果是，则按照gridSize进行自适应
                this._autoCluster = true;

                //记录所有聚合点和点中心，20191129
                this._clusterToAddToMap = new Map();
                //点击聚合圈出来的maker点
                this._clickMaker = [];
                //记录上一次地图聚合中心点
                this._markerCenter = {};
                // var _markerCenterBig = {};
                // var getZoom = 0;
                this._getZoom = 0;
                this._markersShow = [];//展示出来的所有marker
                this._clusterList = [];//闪烁图效果list
                this._clustererShow = {};//记录聚合图坐标和点数
                this.nginxImage = window.TextIconOverlayUrl + "/nbcbimages/upload/909e46fa-f567-4bb6-ba5f-2f4ebb141f7e.png";

                if (opts['autoCluster'] != undefined) {
                    this._autoCluster = opts['autoCluster'];
                }

                //最大层marker是自动绘制，还是手动绘制
                this._autoMarkerInMaxZoom = true;
                if (opts['autoMarkerInMaxZoom'] != undefined) {
                    this._autoMarkerInMaxZoom = opts['autoMarkerInMaxZoom'];
                }

                //自适应聚合范围，按照屏幕像素大小计算
                this._gridSize = opts["gridSize"] || 60;
                //如果是固定距离聚合，则指定距离，单位m
                this._clusterRadius = opts["clusterRadius"] || 500;
                this._maxZoom = opts["maxZoom"] || 18;
                this._minClusterSize = opts["minClusterSize"] || 2;
                this._minClickSlideSize = opts["minClickSlideSize"] || 100;
                this._topFlickerSize = opts["topFlickerSize"] || 0;
                this._clusterSlide = opts["clusterSlide"] || false;
                this._isAverageCenter = false;
                if (opts['isAverageCenter'] != undefined) {
                    this._isAverageCenter = opts['isAverageCenter'];
                }

                this._stylesFlicker = opts["styles"] || [];
                var styles = opts["styles"] || [];
                var style = [];
                for (var i = 0; i < styles.length; i++) {
                    var obj = {};
                    for (var key in styles[i]) {
                        if (key == 'size') {
                            obj[key] = new MapCore.Size(styles[i][key].height, styles[i][key].width)
                        } else {
                            obj[key] = styles[i][key];
                        }
                    }
                    style.push(obj);
                }
                this._styles = style;

                // function deepCopy(o) {
                //     if (o instanceof Array) {
                //         let n = [];
                //         for (let i = 0; i < o.length; ++i) {
                //             n[i] = deepCopy(o[i]);
                //             return n;
                //         }
                //     } else if (o instanceof Object) {
                //         let n = {}
                //         for (let i in o) {
                //             n[i] = deepCopy(o[i]);
                //         }
                //         return n;
                //     } else {
                //         return o;
                //     }
                // }

                //是否有新的marker被加入到聚合范围，来控制缩放时不要重绘问题
                this._lastClusterMarkerCount = 0;

                this._options = options;
                var mkrs = opts["markers"];
                isArray(mkrs) && this.addMarkers(mkrs);
                this._map._me_options = options;

                var that = this;
                this.zoomendFun = function () {
                    that._redraw();
                    //缩放或放大地图后删除点击聚合圈出来的maker点
                    for (var i = 0; i < that._clickMaker.length; i++) {
                        that._map.removeOverlay(that._clickMaker[i]);
                    }
                };
                this.dragendFun = function () {
                    that._redraw();
                };
                this.addEventListeners();

            };
        MarkerClusterer.prototype.addEventListeners = function () {
            var that = this;
            //监听地图级别
            this._map.addEventListener("zoomend", that.zoomendFun);
            this._map.addEventListener("dragend", that.dragendFun);
        };
        MarkerClusterer.prototype.removeEvent = function () {
            var that = this;
            this._map.removeEventListener("zoomend", that.zoomendFun);
            this._map.removeEventListener("dragend", that.dragendFun);
        };
        /**
         * 添加要聚合的标记数组。
         * @param {Array<Marker>} markers 要聚合的标记数组
         *
         * @return 无返回值。
         */
        MarkerClusterer.prototype.addMarkers = function (markers) {
            for (var i = 0, len = markers.length; i < len; i++) {
                this._pushMarkerTo(markers[i]);
            }
            this._createClusters();
        };

        /**
         * 把一个标记添加到要聚合的标记数组中
         * @param {BMap.Marker} marker 要添加的标记
         *
         * @return 无返回值。
         */
        MarkerClusterer.prototype._pushMarkerTo = function (marker) {
            var index = indexOf(marker, this._markers);
            if (index === -1) {
                marker.isInCluster = false;
                this._markers.push(marker);//Marker拖放后enableDragging不做变化，忽略
            }
        };

        /**
         * 添加一个聚合的标记。
         * @param {BMap.Marker} marker 要聚合的单个标记。
         * @return 无返回值。
         */
        MarkerClusterer.prototype.addMarker = function (marker) {
            this._pushMarkerTo(marker);
            this._createClusters();
        };

        /**
         * 根据所给定的标记，创建聚合点
         * @return 无返回值
         */
        MarkerClusterer.prototype._createClusters = function () {
            var mapBounds = this._map.getBounds();
            var extendedBounds = getExtendedBounds(this._map, mapBounds, this._gridSize);
            //从这里修改
            var markers = [];
            var _curClusterMarkerCount = 0;
            for (var i = 0, marker; marker = this._markers[i]; i++) {
                if (!marker.isInCluster && extendedBounds.containsPoint(marker.getPosition())) {
                    markers.push(marker);
                    _curClusterMarkerCount++;
                }
            }
            //如果是点聚合，进行重计算
            if (markers.length > 0) {
                if (this._autoCluster) {
                    this._addToClosestClusterBatch(markers);
                } else if (_curClusterMarkerCount > this._lastClusterMarkerCount) {
                    //需要重绘，则清空
                    this._addToClosestClusterBatchNotAuto(markers);
                    this._lastClusterMarkerCount = _curClusterMarkerCount;
                }
            }
            var that = this
            if (this._autoCluster == false && this._map.getZoom() > this._maxZoom) {
                if (this._map.getZoom() > this._maxZoom) {
                    for (var i = 0; i < this._markers.length; i++) {
                        that._clearLastClusters();
                        this._map.addOverlay(this._markers[i])
                        this._addToClosestClusterBatchNotAuto(markers);
                        this._lastClusterMarkerCount = _curClusterMarkerCount;
                    }
                } else {
                    this._clearLastClusters();
                }
            }
            this.clock = new Array(this.level);
            //启动top闪烁效果
            if (this._topFlickerSize > 0) {
                var textList = [];
                var topList = [];
                for (var key in this._clustererShow) {
                    if (textList.indexOf(this._clustererShow[key]) < 0) {
                        textList.push(this._clustererShow[key]);
                    }
                }

                function sortId(a, b) {
                    return b - a;
                }

                if (textList.length > this._topFlickerSize) {
                    topList = textList.sort(sortId).slice(0, this._topFlickerSize);
                } else {
                    topList = textList;
                }
                var that = this;
                for (var key in this._clustererShow) {
                    if (topList.indexOf(this._clustererShow[key]) >= 0) {
                        var center = new BMap.Point(key.split(",")[0], key.split(",")[1]);
                        var clusterMarker = new BMapLib.TextIconOverlay(center, this._clustererShow[key], {"styles": this._stylesFlicker}, true);
                        this._clusterList.push(clusterMarker);

                    }
                }
                for (var j = 0; j < this._clusterList.length; j++) {
                    this._clusterList[j].startFlicker(1500, 5000);
                }
            }
        };


        /**
         * 根据标记的位置，把它添加到最近的聚合中
         * @param {BMap.Marker} marker 要进行聚合的单个标记
         *
         * @return 无返回值。
         */
        MarkerClusterer.prototype._addToClosestCluster = function (marker) {
            var distance = 4000000;
            var clusterToAddTo = null;
            var position = marker.getPosition();
            for (var i = 0, cluster; cluster = this._clusters[i]; i++) {
                var center = cluster.getCenter();
                if (center) {
                    var d = this._map.getDistance(center, marker.getPosition());
                    if (d < distance) {
                        distance = d;
                        clusterToAddTo = cluster;
                    }
                }
            }

            if (clusterToAddTo && clusterToAddTo.isMarkerInClusterBounds(marker)) {
                clusterToAddTo.addMarker(marker);
            } else {
                var cluster = new Cluster(this);
                cluster.addMarker(marker);
                this._clusters.push(cluster);
            }
        };
        /**
         *处理所有marker点，将距离近的坐标聚合为聚合点，放到Map里面
         *
         */
        MarkerClusterer.prototype._addToClosestClusterBatch = function (markers) {

            //多个mark
            var clusterToAddToMap = new Map();
            for (var j = 0; j < markers.length; j++) {
                var clusterToAddTo = null;

                var distance = 4000000;

                var marker = markers[j];
                var position = marker.getPosition();
                //为当前marker在已有的clusters找距离最近的cluster
                for (var i = 0, cluster; cluster = this._clusters[i]; i++) {
                    var center = cluster.getCenter();
                    if (center) {
                        var d = this._map.getDistance(center, marker.getPosition());
                        if (d < distance) {
                            distance = d;
                            clusterToAddTo = cluster;
                        }
                    }
                }
                //如果找到了距离最近的cluster，而且，当前当前点的距离范围
                if (clusterToAddTo && clusterToAddTo.isMarkerInClusterBounds(marker)) {
                    if (clusterToAddTo.isMarkerInClusterBounds(marker)) {
                        if (this._isAverageCenter) {
                            var l = this._markers.length + 1;
                            var lat = (clusterToAddTo._center.lat * (l - 1) + marker.getPosition().lat) / l;
                            var lng = (clusterToAddTo._center.lng * (l - 1) + marker.getPosition().lng) / l;
                            clusterToAddTo._center = new BMap.Point(lng, lat);
                            clusterToAddTo.updateGridBounds();
                        }
                        if (clusterToAddToMap.get(clusterToAddTo._center.lng + "," + clusterToAddTo._center.lat) == null) {
                            var ary = new Array();
                            ary.push(marker);
                            clusterToAddToMap.put(clusterToAddTo._center.lng + "," + clusterToAddTo._center.lat, ary);
                        } else {
                            var ary = clusterToAddToMap.get(clusterToAddTo._center.lng + "," + clusterToAddTo._center.lat);
                            ary.push(marker);
                        }

                    } else {
                        var cluster = new Cluster(this);
                        cluster._center = marker.getPosition();
                        cluster.updateGridBounds();
                        this._clusters.push(cluster);

                        if (clusterToAddToMap.get(cluster._center.lng + "," + cluster._center.lat) == null) {
                            var ary = new Array();
                            ary.push(marker);
                            clusterToAddToMap.put(cluster._center.lng + "," + cluster._center.lat, ary);
                        } else {
                            var ary = clusterToAddToMap.get(cluster._center.lng + "," + cluster._center.lat);
                            ary.push(marker);
                        }
                    }
                } else {
                    var cluster = new Cluster(this);
                    cluster._center = marker.getPosition();
                    cluster.updateGridBounds();
                    this._clusters.push(cluster);

                    if (clusterToAddToMap.get(cluster._center.lng + "," + cluster._center.lat) == null) {
                        var ary = new Array();
                        ary.push(marker);
                        clusterToAddToMap.put(cluster._center.lng + "," + cluster._center.lat, ary);
                    } else {
                        var ary = clusterToAddToMap.get(cluster._center.lng + "," + cluster._center.lat);
                        ary.push(marker);
                    }
                }
            }
            for (key in clusterToAddToMap.object) {
                for (var i = 0; i < this._clusters.length; i++) {
                    if (key == this._clusters[i]._center.lng + "," + this._clusters[i]._center.lat) {

                        this._clusters[i].addMarkers(clusterToAddToMap.get(key), this._clusters[i]._center, this);
                        break;
                    }
                }
            }
            //将上次聚合点记录下来
            this._clusterToAddToMap = new Map();
            this._clusterToAddToMap = clusterToAddToMap;
            this._getZoom = this._map.getZoom();
        };


//非自适应，固定距离聚合
        MarkerClusterer.prototype._addToClosestClusterBatchNotAuto = function (markers) {
            //多个mark
            var clusterToAddToMap = new Map();
            for (var j = 0; j < markers.length; j++) {
                var clusterToAddTo = null;
                var distance = this._clusterRadius;  //用指定距离初始化过滤
                var marker = markers[j];
                var position = marker.getPosition();
                //为当前marker在已有的clusters找距离最近的cluster
                for (var i = 0, cluster; cluster = this._clusters[i]; i++) {
                    var center = cluster.getCenter();
                    if (center) {
                        var d = this._map.getDistance(center, marker.getPosition());
                        if (d < distance) {
                            distance = d;
                            clusterToAddTo = cluster;
                        }
                    }
                }
                //如果找到了符合距离范围且最近的cluster
                if (clusterToAddTo) {
                    //如果是平均几何中心，则放在平均中心
                    if (this._isAverageCenter) {
                        var l = this._markers.length + 1;
                        var lat = (clusterToAddTo._center.lat * (l - 1) + marker.getPosition().lat) / l;
                        var lng = (clusterToAddTo._center.lng * (l - 1) + marker.getPosition().lng) / l;
                        clusterToAddTo._center = new BMap.Point(lng, lat);
                        clusterToAddTo.updateGridBounds();
                    }

                    var centerKey = clusterToAddTo._center.lng + "," + clusterToAddTo._center.lat;
                    if (clusterToAddToMap.get(centerKey) == null) {
                        var ary = new Array();
                        ary.push(marker);
                        clusterToAddToMap.put(centerKey, ary);
                    } else {
                        var ary = clusterToAddToMap.get(centerKey);
                        ary.push(marker);
                    }
                } else {
                    var cluster = new Cluster(this);
                    cluster._center = marker.getPosition();
                    cluster.updateGridBounds();
                    this._clusters.push(cluster);

                    var centerKey = cluster._center.lng + "," + cluster._center.lat;
                    //如果是计算平均距离，每次都会变化，所以要映射
                    if (clusterToAddToMap.get(centerKey) == null) {
                        var ary = new Array();
                        ary.push(marker);
                        clusterToAddToMap.put(centerKey, ary);
                    } else {
                        var ary = clusterToAddToMap.get(centerKey);
                        ary.push(marker);
                    }
                }

            }
            for (key in clusterToAddToMap.object) {
                for (var i = 0; i < this._clusters.length; i++) {
                    if (key == this._clusters[i]._center.lng + "," + this._clusters[i]._center.lat) {

                        this._clusters[i].addMarkers(clusterToAddToMap.get(key), this._clusters[i]._center, this);
                        break;
                    }
                }
            }
            //将上次聚合点记录下来
            this._clusterToAddToMap = clusterToAddToMap
            this._getZoom = this._map.getZoom();
        };

        function Map() {
            this.object = {};
            Map.prototype.put = function (key, value) {
                this.object[key] = value;
            }
            Map.prototype.get = function (key) {
                return this.object[key];
            }
        }

//模拟实现map
        /*
        function Map(){

            var struct=function(key,value){
                this.key=key;
                this.value=value;
            }

            Map.prototype.put=function (key,value){
                for(var i=0;i<this.arr.length;i++){
                    if(this.arr[i].key==key){
                        this.arr[i].value=value;
                        return;
                    }
                }
                this.arr[this.arr.length]=new struct(key,value);
            }

            Map.prototype.get = function(key){
                for(var i=0;i<this.arr.length;i++){
                    if(this.arr[i].key==key){
                        return this.arr[i].value;
                    }
                }
                return null;
            }

            this.arr=new Array();

        }
        */
        /**
         * 清除上一次的聚合的结果
         * @return 无返回值。
         */
        MarkerClusterer.prototype._clearLastClusters = function () {
            for (var i = 0, cluster; cluster = this._clusters[i]; i++) {
                cluster.remove();
            }

            this._clusters = [];//置空Cluster数组
            this._removeMarkersFromCluster();//把Marker的cluster标记设为false
        };

        /**
         * 清除某个聚合中的所有标记
         * @return 无返回值
         */
        MarkerClusterer.prototype._removeMarkersFromCluster = function () {
            for (var i = 0, marker; marker = this._markers[i]; i++) {
                marker.isInCluster = false;
            }
        };

        /**
         * 把所有的标记从地图上清除
         * @return 无返回值
         */
        MarkerClusterer.prototype._removeMarkersFromMap = function () {
            for (var i = 0, marker; marker = this._markers[i]; i++) {
                marker.isInCluster = false;
                this._map.removeOverlay(marker);
            }
        };

        /**
         * 删除单个标记
         * @param {BMap.Marker} marker 需要被删除的marker
         *
         * @return {Boolean} 删除成功返回true，否则返回false
         */
        MarkerClusterer.prototype._removeMarker = function (marker) {
            var index = indexOf(marker, this._markers);
            if (index === -1) {
                return false;
            }
            this._map.removeOverlay(marker);
            this._markers.splice(index, 1);
            return true;
        };

        /**
         * 删除单个标记
         * @param {BMap.Marker} marker 需要被删除的marker
         *
         * @return {Boolean} 删除成功返回true，否则返回false
         */
        MarkerClusterer.prototype.removeMarker = function (marker) {
            var success = this._removeMarker(marker);
            if (success) {
                this._clearLastClusters();
                this._createClusters();
            }
            return success;
        };

        /**
         * 删除滑动maker生成的点 20191129
         * @param {BMap.Marker} marker 需要被删除的marker
         *
         * @return {Boolean} 删除成功返回true，否则返回false
         */
        MarkerClusterer.prototype.removeSlideMarkers = function (markers) {
            var success = false;
            for (var i = 0; i < markers.length; i++) {
                var r = this._removeMarker(markers[i]);
                success = success || r;
            }
            return success;
        };

        /**
         * 删除一组标记
         * @param {Array<BMap.Marker>} markers 需要被删除的marker数组
         *
         * @return {Boolean} 删除成功返回true，否则返回false
         */
        MarkerClusterer.prototype.removeMarkers = function (markers) {
            var success = false;
            for (var i = 0; i < markers.length; i++) {
                var r = this._removeMarker(markers[i]);
                success = success || r;
            }

            if (success) {
                this._clearLastClusters();
                this._createClusters();
            }
            return success;
        };

        /**
         * 从地图上彻底清除所有的标记
         * @return 无返回值
         */
        MarkerClusterer.prototype.clearMarkers = function () {
            this._clearLastClusters();
            this._removeMarkersFromMap();
            this._markers = [];
        };

        /**
         * 重新生成，比如改变了属性等
         * @return 无返回值
         */
        MarkerClusterer.prototype._redraw = function () {
            // || this._map.getZoom() > this._maxZoom
            //如果是点聚合，则清除
            if (this._autoCluster) {
                this._clearLastClusters();
            }
            //动地图后删除上次闪烁效果,2019/12/24
            if (this._clusterList) {
                for (var j = 0; j < this._clusterList.length; j++) {
                    this._clusterList[j].removeFlicker();
                }
                this._clusterList = [];
                var style = [];
                for (var i = 0; i < this._styles.length; i++) {
                    var obj = {};
                    for (var key in this._styles[i]) {
                        if (key == 'size') {
                            obj[key] = new MapCore.Size(this._styles[i][key].height, this._styles[i][key].width)
                        } else {
                            obj[key] = this._styles[i][key];
                        }
                    }
                    style.push(obj);
                }
                this._stylesFlicker = style;
                this._clustererShow = {};
            }
            this._createClusters();
        };

        /**
         * 获取网格大小
         * @return {Number} 网格大小
         */
        MarkerClusterer.prototype.getGridSize = function () {
            return this._gridSize;
        };

        /**
         * 设置网格大小
         * @param {Number} size 网格大小
         * @return 无返回值
         */
        MarkerClusterer.prototype.setGridSize = function (size) {
            this._gridSize = size;
            this._redraw();
        };

        /**
         * 获取聚合的最大缩放级别。
         * @return {Number} 聚合的最大缩放级别。
         */
        MarkerClusterer.prototype.getMaxZoom = function () {
            return this._maxZoom;
        };

        /**
         * 设置聚合的最大缩放级别
         * @param {Number} maxZoom 聚合的最大缩放级别
         * @return 无返回值
         */
        MarkerClusterer.prototype.setMaxZoom = function (maxZoom) {
            this._maxZoom = maxZoom;
            this._redraw();
        };

        /**
         * 获取聚合的样式风格集合
         * @return {Array<IconStyle>} 聚合的样式风格集合
         */
        MarkerClusterer.prototype.getStyles = function () {
            return this._styles;
        };

        /**
         * 设置聚合的样式风格集合
         * @param {Array<IconStyle>} styles 样式风格数组
         * @return 无返回值
         */
        MarkerClusterer.prototype.setStyles = function (styles) {
            this._styles = styles;
            this._redraw();
        };

        /**
         * 获取单个聚合的最小数量。
         * @return {Number} 单个聚合的最小数量。
         */
        MarkerClusterer.prototype.getMinClusterSize = function () {
            return this._minClusterSize;
        };

        /**
         * top闪烁数量。
         * @return {Number} 单个聚合的最小数量。
         */
        MarkerClusterer.prototype.getTopFlickerSize = function () {
            return this._topFlickerSize;
        };

        /**
         * 获取点击单个聚合滑动散开的最小数量。
         * @return {Number} 单个聚合的最小数量。
         */
        MarkerClusterer.prototype.getMinClickSlideSize = function () {
            return this._minClickSlideSize;
        };

        /**
         * 获取是否滑动效果状态。
         * @return {Number} 单个聚合的最小数量。
         */
        MarkerClusterer.prototype.getClusterSlide = function () {
            return this._clusterSlide;
        };

        /**
         * 设置单个聚合的最小数量。
         * @param {Number} size 单个聚合的最小数量。
         * @return 无返回值。
         */
        MarkerClusterer.prototype.setMinClusterSize = function (size) {
            this._minClusterSize = size;
            this._redraw();
        };

        /**
         * 获取单个聚合的落脚点是否是聚合内所有标记的平均中心。
         * @return {Boolean} true或false。
         */
        MarkerClusterer.prototype.isAverageCenter = function () {
            return this._isAverageCenter;
        };

        /**
         * 获取聚合的配置。
         * @return {Json}。
         */
        MarkerClusterer.prototype.getOptions = function () {
            return this._options;
        };
        /**
         * 获取聚合的Map实例。
         * @return {Map} Map的示例。
         */
        MarkerClusterer.prototype.getMap = function () {
            return this._map;
        };

        /**
         * 获取所有的标记数组。
         * @return {Array<Marker>} 标记数组。
         */
        MarkerClusterer.prototype.getMarkers = function () {
            return this._markers;
        };

        /**
         * 获取聚合的总数量。
         * @return {Number} 聚合的总数量。
         */
        MarkerClusterer.prototype.getClustersCount = function () {
            var count = 0;
            for (var i = 0, cluster; cluster = this._clusters[i]; i++) {
                cluster.isReal() && count++;
            }
            return count;
        };

        /**
         * 判断pc和移动端
         */
        _checkBrowserType = function () {
            var agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
            var userAgentInfo = navigator.userAgent;
            var flag = true;
            for (var i = 0; i < agents.length; i++) {
                if (userAgentInfo.indexOf(agents[i]) > 0) {
                    flag = false;
                    break;
                }
            }
            return flag;
        }
        var flag = _checkBrowserType();

        /**
         * @ignore
         * Cluster
         * @class 表示一个聚合对象，该聚合，包含有N个标记，这N个标记组成的范围，并有予以显示在Map上的TextIconOverlay等。
         * @constructor
         * @param {MarkerClusterer} markerClusterer 一个标记聚合器示例。
         */
        function Cluster(markerClusterer) {
            this._markerClusterer = markerClusterer;
            this._map = markerClusterer.getMap();
            this._minClusterSize = markerClusterer.getMinClusterSize();
            this._minClickSlideSize = markerClusterer.getMinClickSlideSize();
            this._ClusterSlide = markerClusterer.getClusterSlide();
            this._isAverageCenter = markerClusterer.isAverageCenter();
            this._center = null;//落脚位置
            this._markers = [];//这个Cluster中所包含的markers
            this._gridBounds = null;//以中心点为准，向四边扩大gridSize个像素的范围，也即网格范围
            this._isReal = false; //真的是个聚合
            this._markerOptions = markerClusterer.getOptions().markerOptions;
            //不绘制cluster时是否显示重复marker数量
            this._showRepeatCount = markerClusterer.getOptions().showRepeatCount == undefined ? false : markerClusterer.getOptions().showRepeatCount;
            this._labels4Count = [];//为重复点数量显示的点数
            this._clusterMarker = new BMapLib.TextIconOverlay(this._center, this._markers.length, {"styles": this._markerClusterer.getStyles()});
        }

        /**
         * 向该聚合添加一个标记。
         * @param {Marker} marker 要添加的标记。
         * @return 无返回值。
         */
        Cluster.prototype.addMarker = function (marker) {
            if (this.isMarkerInCluster(marker)) {
                return false;
            }//也可用marker.isInCluster判断,外面判断OK，这里基本不会命中

            if (!this._center) {
                this._center = marker.getPosition();
                this.updateGridBounds();//
            } else {
                if (this._isAverageCenter) {
                    var l = this._markers.length + 1;
                    var lat = (this._center.lat * (l - 1) + marker.getPosition().lat) / l;
                    var lng = (this._center.lng * (l - 1) + marker.getPosition().lng) / l;
                    this._center = new BMap.Point(lng, lat);
                    this.updateGridBounds();
                }//计算新的Center
            }
            marker.isInCluster = true;
            this._markers.push(marker);

            var len = this._markers.length;
            if (len < this._minClusterSize) {
                this._map.addOverlay(marker);
                return true;

            } else if (len === this._minClusterSize) {
                for (var i = 0; i < len; i++) {
                    this._markers[i].getMap() && this._map.removeOverlay(this._markers[i]);
                }
            }
            this._map.addOverlay(this._clusterMarker);
            this._isReal = true;
            this.updateClusterMarker();
            return true;
        };

        function centerMap() {
            this.markerCenter = {};
            centerMap.prototype.put = function (key, value) {
                this.markerCenter[key] = value;
            }
            centerMap.prototype.get = function (key) {
                return this.markerCenter[key];
            }
        }

//添加一个聚合点到地图上
        Cluster.prototype.addMarkers = function (markers, center, me) {
            var markerMap = new Map();
            for (var i = 0; i < markers.length; i++) {
                var marker;
                marker = markers[i];
                marker.isInCluster = true;
                this._markers.push(marker);
                var len = markers.length;
                //放大地图，轨迹点扩展效果

                if (len < this._minClusterSize) {
                    //自定义绘制图标
                    if (markerMap.get(marker.point.lng + "," + marker.point.lat) == undefined) {
                        markerMap.put(marker.point.lng + "," + marker.point.lat, "1");
                        if (this._markerOptions != undefined) {
                            var _opts = this._markerOptions;
                            //如果显示label
                            if (_opts.labelOptions && _opts.labelOptions.baseJson) {
                                var _labelOptions = _opts.labelOptions;
                                var _label = new MapCore.Label(_labelOptions.baseJson);
                                //如果有labelStyle
                                if (_labelOptions.styles) {
                                    _label.setStyles(_labelOptions.styles);
                                }
                                if (marker.labelContent) {
                                    _label.setContent(marker.labelContent);
                                }
                                marker.setLabel(_label);
                            }
                            //如果自定义icon
                            if (_opts.icon != undefined) {
                                marker.setIcon(_opts.icon);
                            }
                            //分类上色
                            if (marker.styleType != undefined && _opts.markerStyles != undefined) {
                                var option = eval(_opts.markerStyles);
                                var Icon = option[marker.styleType];
                                marker.setIcon(Icon);
                            }
                        }
                        this._map.addOverlay(marker);
                    }
                    if (me._getZoom <= this._map.getZoom() && this._ClusterSlide) {//放大地图，轨迹点滑动效果
                        me._markersShow.push(marker.point.lng + "," + marker.point.lat);
                        var key = marker.point.lng + "," + marker.point.lat;
                        if (key in me._markerCenter) {
                            if (me._markerCenter[key] != marker.point) {
                                me._markersShow.push(marker.point.lng + "," + marker.point.lat);
                                var points = this.splitPoints(me._markerCenter[key], marker.point, 10);
                                this.makerMove(points, 50, marker);
                            }
                        }
                    }
                    return true;//continue
                } else {
                    if (this._ClusterSlide) {
                        //记录聚合中心点
                        var key = marker.point.lng + "," + marker.point.lat;
                        me._markerCenter[key] = center;
                    }
                }
                if (me._getZoom > this._map.getZoom() && this._ClusterSlide) {//缩放地图，轨迹点聚合效果
                    if (len <= 100 && len >= this._minClusterSize) {
                        if (me._markersShow.indexOf(marker.point.lng + "," + marker.point.lat) >= 0) {
                            var points = this.splitPoints(marker.point, center, 10);
                            this.makerMove(points, 50, marker, true);
                        }
                    }
                }
                this._isReal = true;
            }
            this.updateClusterMarker(me);
            return true;
        };
        /**
         * 判断一个标记是否在该聚合中。
         * @param {Marker} marker 要判断的标记。
         * @return {Boolean} true或false。
         */
        Cluster.prototype.isMarkerInCluster = function (marker) {
            if (this._markers.indexOf) {
                return this._markers.indexOf(marker) != -1;
            } else {
                for (var i = 0, m; m = this._markers[i]; i++) {
                    if (m === marker) {
                        return true;
                    }
                }
            }
            return false;
        };
        /**
         * 判断一个标记是否在该聚合网格范围中。
         * @param {Marker} marker 要判断的标记。
         * @return {Boolean} true或false。
         */
        Cluster.prototype.isMarkerInClusterBounds = function (marker) {
            return this._gridBounds.containsPoint(marker.getPosition());
        };
        Cluster.prototype.isReal = function (marker) {
            return this._isReal;
        };
        /**
         * 更新该聚合的网格范围。
         * @return 无返回值。
         */
        Cluster.prototype.updateGridBounds = function () {
            var bounds = new BMap.Bounds(this._center, this._center);
            this._gridBounds = getExtendedBounds(this._map, bounds, this._markerClusterer.getGridSize());
        };
        /**
         * 更新该聚合的显示样式，也即TextIconOverlay。
         * @return 无返回值。
         */
        Cluster.prototype.updateClusterMarker = function (me) {
            var _clusterToAddToMap = me._clusterToAddToMap;
            if (this._map.getZoom() > this._markerClusterer.getMaxZoom()) {
                //自动绘制
                var markerMap = new Map();
                var labelJson;
                this._clusterMarker && this._map.removeOverlay(this._clusterMarker);

                for (var i = 0, marker; marker = this._markers[i]; i++) {

                    //如果是新的点，则进行绘制，否则则不绘制，提升性能
                    if (markerMap.get(marker.point.lng + "," + marker.point.lat) == undefined) {
                        markerMap.put(marker.point.lng + "," + marker.point.lat, 1);
                        if (this._markerOptions != undefined) {
                            var _opts = this._markerOptions;
                            if (_opts.enableDragging != undefined && _opts.enableDragging == true) {
                                marker.enableDragging();
                            }
                            if (_opts.disableMassClear != undefined && _opts.disableMassClear == true) {
                                marker.disableMassClear();
                            }
                            //如果显示label
                            if (_opts.labelOptions && _opts.labelOptions.baseJson) {
                                var _labelOptions = _opts.labelOptions;
                                var _label = new MapCore.Label(_labelOptions.baseJson);
                                //如果有labelStyle
                                if (_labelOptions.styles) {
                                    _label.setStyles(_labelOptions.styles);
                                }
                                if (marker.labelContent) {
                                    _label.setContent(marker.labelContent);
                                }
                                marker.setLabel(_label);
                            }
                            //如果自定义icon
                            if (_opts.icon != undefined) {
                                marker.setIcon(_opts.icon);
                            }
                            //分类上色
                            if (marker.styleType != undefined && _opts.markerStyles != undefined) {
                                var option = eval(_opts.markerStyles);
                                var Icon = option[marker.styleType];
                                marker.setIcon(Icon);
                            }

                        }
                        this._map.addOverlay(marker);
                    } else {
                        //若已经存在，则记录数+1
                        var markerRepeatCount = markerMap.get(marker.point.lng + "," + marker.point.lat);
                        markerMap.put(marker.point.lng + "," + marker.point.lat, markerRepeatCount + 1);
                    }
                }


                if (this._showRepeatCount) {
                    //用label绘制重复点的数量
                    for (var p in markerMap.object) {
                        var _count = markerMap.object[p];
                        if (_count == 1) {//如果没有重复
                            continue;
                        }
                        var lnglat = p.split(",");
                        var _label4Count = new MapCore.Label({
                            text: _count,//重复点的数量
                            options: {
                                offset: new MapCore.Size(-30, 10),
                                position: new MapCore.Point([lnglat[0], lnglat[1]])
                            }
                        });
                        _label4Count.setStyles({
                            borderRadius: "50%",
                            width: "18px",
                            height: "18px",
                            lineHeight: "18px",
                            textAlign: "center",
                            backgroundColor: "#E9C2E6"
                        });
                        this._map.addOverlay(_label4Count);
                        this._labels4Count.push(_label4Count);
                    }
                }


                return;


            }
            if (this._markers.length < this._minClusterSize) {
                this._clusterMarker.hide();
                return;
            }

            this._map.addOverlay(this._clusterMarker);

            this._clusterMarker.setPosition(this._center);

            this._clusterMarker.setText(this._markers.length);

            //记录聚合图坐标和点数
            me._clustererShow[this._center.lng + "," + this._center.lat] = this._markers.length;

            //this._clusterMarker.setText(2);
            //聚合图的滑动聚合效果
            // for (key in _clusterToAddToMap.object) {
            //     var count = 0;
            //     //找到聚合图中的点 上次属于哪个聚合图
            //     for (var i = 0; i < _clusterToAddToMap.get(key).length; i++) {
            //         var clusterMarker;
            //         for (var j = 0; j < this._markers.length; j++) {
            //             var mk = this._markers[j];
            //             if (_clusterToAddToMap.get(key)[i].point.lng == mk.point.lng &&
            //                 _clusterToAddToMap.get(key)[i].point.lat == mk.point.lat) {
            //                 count++;
            //                 continue;
            //             }
            //         }
            //         if (count > 0) {
            //             break;
            //         }
            //     }
            //     if (count > 0) {
            //         var keyPoint = new MapCore.Point([key.split(",")[0], key.split(",")[1]])
            //         clusterMarker = new BMapLib.TextIconOverlay(keyPoint, _clusterToAddToMap.get(key).length, {"styles": this._markerClusterer.getStyles()});
            //         var points = this.splitPoints(keyPoint, this._center, 10);
            //         this.makerMove(points, 60, clusterMarker, true);
            //         //一个聚合结果只移动向一个新的聚合点
            //         _clusterToAddToMap.put(key, []);
            //     }
            // }
            var that = this;
            var _mousedownAction = function (event) {
                //that._map.zoomTo(that._map._getZoom + 2)
                for (var i = 0; i < that._markers.length; i++) {
                    var icon = new MapCore.Icon({
                        iconUrl: me.nginxImage,
                        size: new BMap.Size(23, 23)
                    })
                    var points = that.splitPoints(that._center, that._markers[i].point, 10);
                    me._clickMaker.push(that._markers[i]);//记录点击聚合图出来的maker点
                    that._markers[i].point = that._center;
                    that.makerMove(points, 30, that._markers[i]);

                }
                that._map.removeOverlay(that._clusterMarker);
            }
            var thatMap = this._map;
            var thatBounds = this.getBounds();
            if (this._ClusterSlide) {
                if (flag) {//是否pc端
                    if (this._minClickSlideSize >= this._markers.length) {
                        this._clusterMarker.addEventListener('click', _mousedownAction);
                    }
                    this._clusterMarker.addEventListener("dblclick", function (event) {
                        thatMap.setViewport(thatBounds);
                    });
                } else {//手机端
                    if (this._minClickSlideSize >= this._markers.length) {
                        var ele = document.getElementById(that._center.lng + "," + that._center.lat);
                        ele.addEventListener("touchstart", _mousedownAction);
                    }
                    this._map.addEventListener("dblclick", function (event) {
                        thatMap.setViewport(thatBounds);
                    });
                }
            } else {
                if (flag) {//是否pc端
                    this._clusterMarker.addEventListener("click", function (event) {
                        thatMap.setViewport(thatBounds);
                    });
                }else{
                    var ele = document.getElementById(that._center.lng + "," + that._center.lat);
                    ele.addEventListener("touchstart", function () {
                        thatMap.setViewport(thatBounds);
                    });
                }

            }
        };

        /**
         * 拆分点，获取prevPoint和newPoint之间的num个点
         * */
        Cluster.prototype.splitPoints = function (prePoint, newPoint, num) {
            var lat;
            var lng;
            var points = [];
            if (prePoint.lng > newPoint.lng && prePoint.lat > newPoint.lat) {
                lat = Math.abs(prePoint.lat - newPoint.lat) / num;
                lng = Math.abs(prePoint.lng - newPoint.lng) / num;
                points[0] = prePoint;
                for (var i = 1; i < num - 1; i++) {
                    points[i] = new MapCore.Point([prePoint.lng - lng * (i + 1), prePoint.lat - lat * (i + 1)]);
                }
            }

            if (prePoint.lng > newPoint.lng && prePoint.lat < newPoint.lat) {
                lat = Math.abs(prePoint.lat - newPoint.lat) / num;
                lng = Math.abs(prePoint.lng - newPoint.lng) / num;
                points[0] = prePoint;
                for (var i = 1; i < num - 1; i++) {
                    points[i] = new MapCore.Point([prePoint.lng - lng * (i + 1), prePoint.lat + lat * (i + 1)]);
                }
            }

            if (prePoint.lng < newPoint.lng && prePoint.lat > newPoint.lat) {
                lat = Math.abs(prePoint.lat - newPoint.lat) / num;
                lng = Math.abs(prePoint.lng - newPoint.lng) / num;
                points[0] = prePoint;
                for (var i = 1; i < num - 1; i++) {
                    points[i] = new MapCore.Point([prePoint.lng + lng * (i + 1), prePoint.lat - lat * (i + 1)]);
                }
            }

            if (prePoint.lng < newPoint.lng && prePoint.lat < newPoint.lat) {
                lat = Math.abs(prePoint.lat - newPoint.lat) / num;
                lng = Math.abs(prePoint.lng - newPoint.lng) / num;
                points[0] = prePoint;
                for (var i = 1; i < num - 1; i++) {
                    points[i] = new MapCore.Point([prePoint.lng + lng * (i + 1), prePoint.lat + lat * (i + 1)]);
                }
            }

            return points;
        };

        /**
         * maker点滑动效果
         * */
        Cluster.prototype.makerMove = function (allPoints, times, mkrBus, status) {
            var paths = allPoints.length; //共有多少个点
            var time = times;        //两点之间移动时间
            var onZoom = status || false;
            this._map.addOverlay(mkrBus);
            i = 0;
            var that = this;

            function resetMkPoint(i) {
                mkrBus.setPosition(allPoints[i]);
                if (i < paths) {
                    setTimeout(function () {
                        i++;
                        resetMkPoint(i);
                    }, time);
                }
                if (i == paths && onZoom) {
                    that._map.removeOverlay(mkrBus)
                }

            }

            setTimeout(function () {
                resetMkPoint(0);
            }, time)
            this._map.remove
        };


        /**
         * 删除该聚合。
         * @return 无返回值。
         */
        Cluster.prototype.remove = function () {
            for (var i = 0, m; m = this._markers[i]; i++) {
                this._markers[i].getMap() && this._map.removeOverlay(this._markers[i]);
            }//清除散的标记点
            this._map.removeOverlay(this._clusterMarker);

            for (var i = 0, m; m = this._labels4Count[i]; i++) {
                this._map.removeOverlay(this._labels4Count[i]);
            }

            this._markers.length = 0;
            delete this._markers;
        }

        /**
         * 获取该聚合所包含的所有标记的最小外接矩形的范围。
         * @return {BMap.Bounds} 计算出的范围。
         */
        Cluster.prototype.getBounds = function () {
            var bounds = new BMap.Bounds(this._center, this._center);
            for (var i = 0, marker; marker = this._markers[i]; i++) {
                bounds.extend(marker.getPosition());
            }
            return bounds;
        };

        /**
         * 获取该聚合的落脚点。
         * @return {BMap.Point} 该聚合的落脚点。
         */
        Cluster.prototype.getCenter = function () {
            return this._center;
        };

    }
)
();

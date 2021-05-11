document.write('<script type="text/javascript" src="//api.map.baidu.com/getscript?v=2.0&ak=ITHn7gGNIHKT2WQHzrnVgtYnQ7wh5Ltm"></script>');
document.write('<script type="text/javascript" src="//api.map.baidu.com/?qt=verify&v=2.1&ak=ITHn7gGNIHKT2WQHzrnVgtYnQ7wh5Ltm&callback=BMap._rd._cbk70060&seckey=undefined"></script>');
document.write('<script type="text/javascript" src="//api.map.baidu.com/library/DistanceTool/1.2/src/DistanceTool_min.js?&ak=ITHn7gGNIHKT2WQHzrnVgtYnQ7wh5Ltm"></script>');
document.write('<script type="text/javascript" src="//api.map.baidu.com/library/TextIconOverlay/1.2/src/TextIconOverlay_min.js?ak=ITHn7gGNIHKT2WQHzrnVgtYnQ7wh5Ltm"></script>');
document.write('<script type="text/javascript" src="//api.map.baidu.com/library/Heatmap/2.0/src/Heatmap_min.js"></script>');
document.write('<script type="text/javascript" src="//api.map.baidu.com/library/AreaRestriction/1.2/src/AreaRestriction_min.js"></script>');
document.write('<script type="text/javascript" src="//api.map.baidu.com/library/LuShu/1.2/src/LuShu_min.js"></script>');
document.write('<script type="text/javascript" src="//api.map.baidu.com/library/SearchInfoWindow/1.5/src/SearchInfoWindow_min.js"></script>');
document.write('<script type="text/javascript" src="//api.map.baidu.com/library/TrafficControl/1.4/src/TrafficControl_min.js"></script>');
document.write('<script type="text/javascript" src="//api.map.baidu.com/library/GeoUtils/1.2/src/GeoUtils_min.js"></script>');
document.write('<script type="text/javascript" src="//api.map.baidu.com/library/Heatmap/2.0/src/Heatmap_min.js"></script>');
document.write('<script type="text/javascript" src="//api.map.baidu.com/library/CurveLine/1.5/src/CurveLine.min.js"></script>');
// document.write('<script type="text/javascript" src="./turf.min.js"></script>');
document.write('<link rel="stylesheet" href="//api.map.baidu.com/library/DrawingManager/1.4/src/DrawingManager_min.css"/>');
document.write('<link rel="stylesheet" href="//api.map.baidu.com/library/SearchInfoWindow/1.5/src/SearchInfoWindow_min.css"/>');
document.write('<link rel="stylesheet" href="//api.map.baidu.com/library/TrafficControl/1.4/src/TrafficControl_min.css"/>');

/**
 * 地图平台基础类库(百度)
 * @author 陈浩
 * @date 2015-05-22
 */

 var _prejoctUrl = 'optimoveAppAddress';
 var _geoserverUrl = 'geoserverAppAddress';
 var bd_data_version;
 (function (a) {
 
     window.TextIconOverlayUrl = 'gateWayAddress'; //textIconOverlay.js中代替地址
     /**
      * 地图核心类库
      * @param container 地图容器的id
      * @param MapOptions 地图初始化可选参数 如：{enableMapClick:false} 关闭地图poi事件
      */
     function MapCore(container, MapOptions) {
         this.provider = "providertmp"; //地图供应商
         this.key = "keytmp";
         //解决注入问题
         if (MapOptions == undefined) {
             MapOptions = {};
             MapOptions.enableMapClick = false;
         }
         if (MapOptions != undefined && MapOptions.enableMapClick == undefined) {
             MapOptions.enableMapClick = false;
         } //地图key
         this.map = new BMap.Map(container, MapOptions); //百度地图对象
         this.mapDivId = container;
         this.zoom; //缩放级别
         this.centerPoint; //中心点
         this.clickPoint; //双击时的点
         this.meMapValue = {}; //存放方法值  通过getMeMapValue(方法名称获得)  removeMeMapValue(方法名称进行删除)
         this.mapType = 'baidu';
         this.resultJson = [];       // 存放画图返回的json数组
         this.drawOverlys = [];
         this.stmapUrl = 'stmapAppAddress';
         this.prejoctUrl = 'optimoveAppAddress';
         this.nginxUrl = 'gateWayAddress';
         this.nginxImage = 'gateWayAddressnbcbimages';
         this.uploadImageUrl = '_UPLOAD_IMAGE_URL';
         this.pixelToMeterAry = [64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64,
             64, 64, 32, 16, 8, 4, 2, 1];
     }
 
     /**
      * 地图类的成员方法
      */
     MapCore.prototype = {
         constructor: MapCore, //地图构造方法
         /**
          * @param json
          */
         setMapStyle: function (json) {
             this.map.setMapStyle(json);
         },
         enableZoom: function (flag) { //启用缩放
             if (flag) {
                 this.map.enableScrollWheelZoom();
             } else {
                 this.map.disableScrollWheelZoom();
             }
         },
         setCenterAndZoom: function (centerPoint, zoom) { //定位
             this.centerPoint = centerPoint;
             this.zoom = zoom;
             this.map.centerAndZoom(centerPoint, zoom);
         },
         panTo: function (Point) { //将地图的中心点更改为给定的点
             this.map.panTo(Point);
         },
         panBy: function (x, y, option) {
             if (option == null) {
                 option = {
                     noAnimation: false
                 };
             }
             this.map.panBy(x, y, option);
         },
         goPan: function (point) { //将地图的中心点更改为给定的点
             this.map.panTo(new BMap.Point(point.lon, point.lat));
         },
         getCenter: function () {
             return this.map.getCenter(); //获取地图当前中心点
         },
         setCenter: function (Point) { //设置中心点
             this.map.setCenter(Point);
         },
         addMarker: function (marker) { //添加标志
             this.map.addOverlay(marker);
         },
         getZoom: function () { //返回当前缩放级别
             return this.map.getZoom();
         },
         setZoom: function (zoomNum) { //重新设置地图级别
             this.map.setZoom(zoomNum);
         },
         setMarkerIcon: function (marker, vicon, x, y) { //添加标记的图标
             if (marker == undefined || vicon == undefined) {
                 return;
             }
             if (!x) {
                 x = 32
             }
             if (!y) {
                 y = 32
             }
             var icon = new BMap.Icon(vicon, new BMap.Size(x, y), {
                 anchor: new BMap.Size(10, 30)
             });
             marker.setIcon(icon);
         },
         addControl: function (object) { //地图添加控件
             this.map.addControl(object);
         },
         addMapTypeControl: function (json) { //地图类型类
             if (!json) {
                 //去掉三维地图
                 json = {
                     mapTypes: [BMAP_NORMAL_MAP, BMAP_SATELLITE_MAP]
                 };
             }
             this.map.addControl(new BMap.MapTypeControl(json));
         },
         addScaleControl: function () { //比例尺类
             this.map.addControl(new BMap.ScaleControl());
         },
         addOverviewMapControl: function () { //鹰眼图
             this.map.addControl(new BMap.OverviewMapControl());
         },
         addNavigationControl: function () { //导航条
             this.map.addControl(new BMap.NavigationControl());
         },
         setCluster: function (markers) { //聚合点
             var myMap = this.map;
             myMap.cluster = new BMapLib.MarkerClusterer(myMap, {
                 markers: markers
             });
             return myMap.cluster;
         },
         //路径规划 k4345
         pathTo: function (Map, Dom, Data, provider, appid, panel) {
             var myMap = this.map;
             myMap.PathProject = new MapCoreLib.PathProject(myMap, Dom, Data,
                 provider, appid, panel);
             return myMap.PathProject;
         },
         //addby wangqy 增加自定义配置
         setClusterByOptions: function (markers, options) { //聚合点
             var myMap = this.map;
             options.markers = markers;
             myMap.cluster = new BMapLib.MarkerClusterer(myMap, options);
             return myMap.cluster;
         },
         clearMarkers: function (MarkerClusterer) { //清除点聚合
             MarkerClusterer = this.map.cluster;
             if (MarkerClusterer != undefined) {
                 MarkerClusterer.clearMarkers();
             }
         },
         getContainer: function () { //得到地图容器
             return this.map.getContainer();
         },
         //返回数组，因为会有同位置点
         getMarker: function (Point) { //根据坐标获得Marker
             var markers = [];
             var allOverlay = map.getOverlays();
             for (var i = 0; i < allOverlay.length; i++) {
                 if (allOverlay[i].point != null) {
                     if (allOverlay[i].point.lng == Point.lng
                         && allOverlay[i].point.lat == Point.lat) {
                         markers.push(allOverlay[i]);
                     }
                 }
             }
             return markers;
         },
 
         pixelToPoint: function (pixel) {
             return this.map.pixelToPoint(pixel);
         },
 
         pointToPixel: function (point) {
             return this.map.pointToPixel(point);
         },
         overlayPixelToPoint: function (pixel) {
             return this.map.overlayPixelToPoint(pixel);
         },
 
         pointToOverlayPixel: function (point) {
             return this.map.pointToOverlayPixel(point);
         },
         getProjection: function () {
             return this.map.getMapType().getProjection();
         },
         getMap: function () {
             return this.map;
         },
         createTileLayer: function (baseUrl) {
             var tileLayer = new BMap.TileLayer({
                 isTransparenting: true
             });
             tileLayer.getTilesUrl = function (tileCoord, zoom) {
                 var x = tileCoord.x;
                 var y = tileCoord.y;
                 return baseUrl + "/tiles/" + zoom + "_" + x + "_" + y + ".png";
             };
             return tileLayer;
         },
         addTileLayer: function (baseUrl) {
             this.map.addTileLayer(this.createTileLayer(baseUrl));
         },
         removeTileLayer: function (tileLayer) {
             this.map.removeTileLayer(tileLayer);
         },
         buildPolyline: function (lng1, lat1, lng2, lat2, style) {
             var polyline = new BMap.Polyline([new BMap.Point(lng1, lat1),
                 new BMap.Point(lng2, lat2)], style);
 
             return polyline;
         },
 
         buildDirectionRoute: function (json) {
             var waypoints = [];
             var mapvdata = [];
             if (json.data == undefined) {
                 return;
             } else {
                 for (var i = 0; i < json.data.length; i++) {
                     var obj = json.data[i];
                     var point = new MapCore.Point([obj["LONGITUDE"],
                         obj["LATITUDE"]]);
                     waypoints.push(point);
                     mapvdata.push({
                         geometry: {
                             type: 'Point',
                             coordinates: [obj["LONGITUDE"], obj["LATITUDE"]]
                         }
                         //,
                         //icon: img
                     });
                 }
             }
 
             this.map.setViewport(waypoints);
             if (json.showLine != false) {
                 var lostThreshold = 300000;//阈值5分钟 默认值
                 if (json.line != undefined
                     && json.line.lostThreshold != undefined)
                     lostThreshold = json.line.lostThreshold;
                 var renderNormal = json.line == undefined ? undefined
                     : json.line.renderNormal;
                 var renderLost = json.line == undefined ? undefined
                     : json.line.renderLost;
                 if (renderNormal == undefined) {
                     renderNormal = { //默认正常轨迹线样式
                         strokeColor: 'blue',
                         strokeOpacity: 0.7,
                         strokeWeight: 7
                     };
                 }
                 if (renderLost == undefined) {
                     renderLost = {//默认失联轨迹线样式
                         strokeColor: 'grey',
                         strokeOpacity: 0.7,
                         strokeWeight: 7,
                         strokeStyle: 'dashed'
                     };
                 }
 
                 //draw trajectory line
                 var traLinePoints = [];
                 var lostLinePoints = [];
 
                 for (i = 0; i < json.data.length; i++) {
                     if (i == 0) {
                         if (json.data[i + 1]["TIME"] - json.data[i]["TIME"] <= lostThreshold)
                             traLinePoints.push(waypoints[i]);
                         else
                             lostLinePoints.push(waypoints[i]);
                     } else if (i == json.data.length - 1) {
                         if (json.data[i]["TIME"] - json.data[i - 1]["TIME"] <= lostThreshold)
                             traLinePoints.push(waypoints[i]);
                         else
                             lostLinePoints.push(waypoints[i]);
                     } else {
                         var cur = json.data[i]["TIME"];
                         var prev = json.data[i - 1]["TIME"];
                         var next = json.data[i + 1]["TIME"];
                         if ((cur - prev <= lostThreshold)
                             && (next - cur > lostThreshold)) {
                             //转换点，该点加入两个数组
                             traLinePoints.push(waypoints[i]);
                             var polyline = map.setPolyline(traLinePoints,
                                 renderNormal);
                             map.addOverlay(polyline);
                             traLinePoints = [];
                             lostLinePoints.push(waypoints[i]);
                         } else if ((cur - prev > lostThreshold)
                             && (next - cur <= lostThreshold)) {
                             //转换点，该点加入两个数组
                             lostLinePoints.push(waypoints[i]);
                             var polyline = map.setPolyline(lostLinePoints,
                                 renderLost);
                             this.map.addOverlay(polyline);
                             lostLinePoints = [];
                             traLinePoints.push(waypoints[i]);
                         } else if ((cur - prev <= lostThreshold)
                             && (next - cur <= lostThreshold)) {
                             traLinePoints.push(waypoints[i]);
                         } else if ((cur - prev > lostThreshold)
                             && (next - cur > lostThreshold)) {
                             lostLinePoints.push(waypoints[i]);
                         }
                     }
                 }
                 //最后一个点的处理
                 if (traLinePoints.length >= 2) {
                     var polyline = map.setPolyline(traLinePoints, renderNormal);
                     this.map.addOverlay(polyline);
                     traLinePoints = [];
                 }
                 //最后一个点的处理
                 if (lostLinePoints.length >= 2) {
                     var polyline = map.setPolyline(lostLinePoints, renderLost);
                     this.map.addOverlay(polyline);
                     lostLinePoints = [];
                 }
             }
             //绘制有向箭头
             if (json.showDirection != false) {
                 var dataSet = new mapv.DataSet(mapvdata);
                 var directLineRender = json.directLine == undefined ? undefined
                     : json.directLine.render;//有向箭头样式
                 if (directLineRender == undefined) {
                     directLineRender = { //默认有向箭头样式
                         strokeStyle: '#FFFF00',
                         lineWidth: 1,
                         lineCap: 'square'
                     }
                 }
                 var options = {
                     draw: 'routedirection',
                     directLine: directLineRender
                 }
                 var mapvLayer = new mapv.baiduMapLayer(map.getMap(), dataSet,
                     options);
             }
             var _markers = [];
             //所有顶点
             if (json.showVertex != false) {
                 for (var i = 1; i < json.data.length - 1; i++) {
                     var obj = json.data[i];
                     var marker = new MapCore.Marker(waypoints[i]);
                     //	marker.setInfoWindow(obj["TIMEALIAS"]);//日期别名2017/03/02 00:00:00
                     _markers.push(marker);
                     //this.map.addOverlay(marker);
                 }
             }
             var _styles = [{
                 size: new MapCore.Size(23, 23),
                 drawtype: 'circle'
             }, {
                 size: new MapCore.Size(36, 36),
                 drawtype: 'circle',
                 backgroundColor: 'rgba(255, 152, 0, 0.77)'
             }, {
                 size: new MapCore.Size(40, 40),
                 drawtype: 'circle',
                 backgroundColor: 'rgba(255, 152, 0, 0.77)'
             }, {
                 size: new MapCore.Size(46, 46),
                 drawtype: 'circle',
                 backgroundColor: 'rgba(255, 152, 0, 0.77)'
             }, {
                 size: new MapCore.Size(50, 50),
                 drawtype: 'circle',
                 backgroundColor: 'rgba(255, 152, 0, 0.77)'
             }];
             var _options = {
                 autoCluster: true,
                 styles: _styles
             };
             var markerClusterer = map.setClusterByOptions(_markers, _options);
 
             //绘制起点和终点
             if (json.showStartEndPoint != false) {
                 //startPoint
                 var img_start = new Image();
                 var icon_start = json.startPoint == undefined ? undefined
                     : json.startPoint.icon;
                 if (icon_start == undefined) {
                     icon_start = {
                         size: [36, 36],
                         offset: [-18, -36],
                         iconSrc: 'route_start.png'
                     };
                 }
                 img_start.src = icon_start.iconSrc;
                 //endPoint
                 var img_end = new Image();
                 var icon_end = json.endPoint == undefined ? undefined
                     : json.endPoint.icon;
                 if (icon_end == undefined) {
                     icon_end = {
                         size: [36, 36],
                         offset: [-18, -36],
                         iconSrc: 'route_end.png'
                     };
                 }
                 img_end.src = icon_end.iconSrc;
 
                 //mapdraw
                 var myIcon_start = new BMap.Icon(
                     icon_start.iconSrc,
                     new MapCore.Size(icon_start.size[0], icon_start.size[1]));
                 var marker_start = new BMap.Marker(waypoints[0], {
                     icon: myIcon_start,
                     offset: new BMap.Size(icon_start.offset[0]
                         + (icon_start.size[0]) / 2.0, icon_start.offset[1]
                         + (icon_start.size[1]) / 2.0)
                 });
                 var infoWindow = new BMap.InfoWindow(json.data[0]["TIMEALIAS"]);//日期别名2017/03/02 00:00:00
                 marker_start.addEventListener("click", function (e) {
                     this.map.openInfoWindow(infoWindow, e.target.point);
                 });
 
                 marker_start.setTop(true);
                 this.map.addOverlay(marker_start);
 
                 var myIcon_end = new BMap.Icon(icon_end.iconSrc,
                     new MapCore.Size(icon_end.size[0], icon_end.size[1]));
                 var marker_end = new BMap.Marker(
                     waypoints[waypoints.length - 1], {
                         icon: myIcon_end,
                         offset: new BMap.Size(icon_end.offset[0]
                             + (icon_end.size[0]) / 2.0,
                             icon_end.offset[1] + (icon_end.size[1])
                             / 2.0)
                     });
                 var infoWindow = new BMap.InfoWindow(json.data[0]["TIMEALIAS"]);//日期别名2017/03/02 00:00:00
                 marker_start.addEventListener("click", function (e) {
                     this.map.openInfoWindow(infoWindow, e.target.point);
                 });
                 //marker_end.setInfoWindow(json.data[json.data.length-1]["TIMEALIAS"]);//日期别名2017/03/02 00:00:00
                 marker_end.setTop(true);
                 this.map.addOverlay(marker_end);
 
                 //mapvdraw
                 //mapv start
                 var dataSet_start = new mapv.DataSet([{
                     geometry: {
                         type: 'Point',
                         coordinates: [waypoints[0]["lng"],
                             waypoints[0]["lat"]]
                     },
                     icon: img_start
                 }]);
                 var options_start = {
                     draw: 'icon',
                     //offset: [-18,-18]
                     offset: [icon_start.offset[0], icon_start.offset[1]]
                 }
                 //	var mapvLayer = new mapv.baiduMapLayer(map.getMap(), dataSet_start, options_start);
 
                 //mapv end
                 var dataSet_end = new mapv.DataSet([{
                     geometry: {
                         type: 'Point',
                         coordinates: [waypoints[waypoints.length - 1]["lng"],
                             waypoints[waypoints.length - 1]["lat"]]
                     },
                     icon: img_end
                 }]);
                 var options_end = {
                     draw: 'icon',
                     //offset: [-18,-18]
                     offset: [icon_end.offset[0], icon_end.offset[1]]
                 }
                 //	var mapvLayer = new mapv.baiduMapLayer(map.getMap(), dataSet_end, options_end);
             }
         },
         //--------------------add by hxp---------------
         //构建marker点
         buildMarkerPoints: function (pointsAry, img, handleClickPoint) {
             this.map.addEventListener("zoomend", function () {
                 mapLayer.hide();
                 showMarkerPoint();
             });
 
             this.map.addEventListener("moveend", function () {
                 mapLayer.hide();
                 showMarkerPoint();
             });
 
             this.bindMarkerPointClickEvent(pointsAry, handleClickPoint);
             var _this = this;
             showMarkerPoint();
 
             function showMarkerPoint() {
                 //浏览器端过滤
                 var data = filterFromBrower(pointsAry);
                 //构造数据集
                 var dataSet = new mapv.DataSet(data);
                 //参数
                 var options = {
                     draw: "icon",
                     zIndex: 9999
                 };
                 //生成mapLayer图层
                 mapLayer = new mapv.baiduMapLayer(map.getMap(), dataSet,
                     options);
                 //显示mapv
                 mapLayer.show();
             }
 
             //数据从后台查寻出来后，地图缩放拖动操作的过滤
             function filterFromBrower(data) {
                 //边界
                 var bounds = _this.getBounds();
                 //过滤后的结果
                 var filteredPoints = new Array();
                 //判断是否处理过对象
                 var object = new Object();
 
                 for (var i = 0; i < data.length; i++) {
                     var point = data[i];
                     //相同经纬度会跳过此次循环
                     if (object[point.LONGITUDE + "," + point.LATITUDE] == null) {
                         object[point.LONGITUDE + "," + point.LATITUDE] = true;
                     } else {
                         continue;
                     }
 
                     //经纬度转像素点
                     var pixel = _this.pointToPixel(new BMap.Point(
                         point["LONGITUDE"], point["LATITUDE"]));
                     //获取向左上角偏移后的经纬度
                     var coordSwift = _this.pixelToPoint(new BMap.Pixel(pixel.x
                         - img.width / 2, pixel.y - img.height));
 
                     //点在边界内
                     if (bounds.containsPoint(new BMap.Point(point["LONGITUDE"],
                         point["LATITUDE"]))) {
                         filteredPoints
                             .push({
                                 geometry: {
                                     type: "Point",
                                     coordinates: [coordSwift.lng,
                                         coordSwift.lat]
                                 },
                                 icon: img
                             });
 
                     }
                 }
                 return filteredPoints;
             }
         },
 
         //--------------------add by hxp---------------
         bindMarkerPointClickEvent: function (pointsAry, handleClickPoint) {
             this.map.removeEventListener("click");
             //添加地图点击事件
             this.addEventListener(
                 "click",
                 function (point) {
                     //搜索最近点击marker点
                     searchMarkerClickPoints(point, pointsAry,
                         handleClickPoint);
 
                 });
 
             //搜索最近点击marker点
             function searchMarkerClickPoints(lgnlat, pointsAry,
                                              handleClickPoint) {
                 //获取像素坐标
                 var pixel = map.pointToPixel(new BMap.Point(lgnlat.lng,
                     lgnlat.lat));
                 //得到距离点半个矩形距离的东北，西北，西南，东南 4个点经纬度坐标
                 var nw = map.pixelToPoint(new BMap.Pixel(pixel.x - img.width
                     / 2, pixel.y - img.height));
                 var ne = map.pixelToPoint(new BMap.Pixel(pixel.x + img.width
                     / 2, pixel.y - img.height));
                 var sw = map.pixelToPoint(new BMap.Pixel(pixel.x - img.width
                     / 2, pixel.y + img.height));
                 var se = map.pixelToPoint(new BMap.Pixel(pixel.x + img.width
                     / 2, pixel.y + img.height));
 
                 //将四个点放到数组里生成多边形
                 var points = new Array();
                 var point4 = new BMap.Point(nw.lng, nw.lat);
                 points.push(point4);
                 var point1 = new BMap.Point(ne.lng, ne.lat);
                 points.push(point1);
                 var point2 = new BMap.Point(se.lng, se.lat);
                 points.push(point2);
                 var point3 = new BMap.Point(sw.lng, sw.lat);
                 points.push(point3);
                 var polygon = new BMap.Polygon(points);
                 //实际点与点击处点的距离
                 var distance = null;
                 //距离点击点最近的点
                 var newCenter = null;
                 //是否存在附近点
                 var hasPoint = false;
                 //遍历所有点
                 for (var i = 0; i < pointsAry.length; i++) {
                     var point = new BMap.Point(pointsAry[i]["LONGITUDE"],
                         pointsAry[i]["LATITUDE"]);
                     //计算点与电击点的距离
                     var d = BMapLib.GeoUtils.getDistance(point, lgnlat);
                     //如果是第一次计算
                     if (distance == null) {
                         //distance始终保持最小值
                         distance = d;
                         //如果点在期望的矩形范围内则这个点被选取
                         if (BMapLib.GeoUtils.isPointInPolygon(point, polygon)) {
                             newCenter = point;
                             hasPoint = true;
                         }
                     } else {
                         if (d < distance) {
                             distance = d;
                             if (BMapLib.GeoUtils.isPointInPolygon(point,
                                 polygon)) {
                                 hasPoint = true;
                                 newCenter = point;
                             }
                         } else if (d == distance) {
                             if (BMapLib.GeoUtils.isPointInPolygon(point,
                                 polygon)) {
                                 hasPoint = true;
                             }
                         }
                     }
                 }
                 //如果存在点则查询此坐标信息，并显示
                 if (hasPoint) {
                     handleClickPoint(newCenter);
                 }
 
             }
         },
         //
 
         //---------------add by ltq  20151117  start----------------//
 
         searchPrivateDataAtEX: function (modelcode, resultpoint,
                                          queryConditions, header, CallbankName) { //在地图上画圈条件检索
             if (modelcode == undefined || queryConditions == undefined) {
                 alert("参数不可为空！");
                 return;
             }
             jQuery.support.cors = true;
             var searchByAnyModelData = "optimoveAppAddress/tlmapService/modelattributes/searchByAnyModelDataEX.do";
             var arrayList;
             $.ajax({
                 url: searchByAnyModelData,
                 async: false,
                 cache: false,
                 dataType: "jsonp",
                 jsonp: "jsonpcallback",
                 jsonpCallback: CallbankName, //jsonp的回调函数名
                 type: "get",
                 data: {
                     modelcode: modelcode,
                     resultpoint: resultpoint,
                     queryConditions: queryConditions,
                     header: header
                 },
                 success: function (_data) {
 
                 },
                 error: function (XMLHttpRequest, textStatus, errorThrown) {
                     alert("异常:" + XMLHttpRequest.status + ";"
                         + XMLHttpRequest.readyStatus + ";" + textStatus);
                 }
             });
             return arrayList;
         },
 
         dataToMarkers: function (data, ThisfieldName, fn) { //将json数组转换成标注点集合
             if (data == undefined || ThisfieldName == undefined) {
                 alert("参数不可为空！");
                 return;
             }
             if (data.length == undefined || data.length == 0) {
                 alert("没有要标注的地址");
                 return;
             }
             if (data.length > 50000) {
                 alert("取点数据大于50000条，请增加筛选条件");
                 return;
             }
             var markers = [];
             var points = [];
             var centerPoint = new MapCore.Point([data[0]["LONGITUDE"],
                 data[0]["LATITUDE"]]);
             for (var i = 0; i < data.length; i++) {
                 if (data[i]["PROVIDERID"] == 'baidu') {
 
                 } else if (data[i]["PROVIDERID"] == 'gaode') {
                     var baiduPoint = GPS.bd_encrypt(data[i]["LATITUDE"],
                         data[i]["LONGITUDE"]);
                     data[i]["LATITUDE"] = baiduPoint.lat;
                     data[i]["LONGITUDE"] = baiduPoint.lon;
                 }
                 var point = new MapCore.Point([data[i]["LONGITUDE"],
                     data[i]["LATITUDE"]]);
                 var marker = new MapCore.Marker(point);
                 var obj = data[i];
                 marker.addEvent("click", function (e) {
                     if (fn) {
                         e.point = e.currentTarget.getPosition();
                         fn(e);
                     }
                 });
                 markers.push(marker);
                 points.push(point);
             }
             var MarkerClusterer = this.setCluster(markers);
             if (points.length < 2000) {
                 //点少时自动调整视野
                 this.map.setViewport(points);
             } else {
                 this.map.centerAndZoom(centerPoint, 14);
             }
             return MarkerClusterer;
         },
         dataToMassMarks: function (data) { //海量点
             if (data == undefined) {
                 alert("参数不可为空！");
                 return;
             }
             if (data.length == 0) {
                 alert("没有要标注的地址");
                 return;
             }
             var points = [];
             for (var i = 0; i < data.length; i++) {
                 if (data[i]["PROVIDERID"] == 'baidu') {
 
                 } else if (data[i]["PROVIDERID"] == 'gaode') {
                     var baiduPoint = GPS.bd_encrypt(data[i]["LATITUDE"],
                         data[i]["LONGITUDE"]);
                     data[i]["LATITUDE"] = baiduPoint.lat;
                     data[i]["LONGITUDE"] = baiduPoint.lon;
                 }
                 var point = new MapCore.Point([data[i]["LONGITUDE"],
                     data[i]["LATITUDE"]]);
                 //var point = {lnglat:[data[i]["LONGITUDE"],data[i]["LATITUDE"]],name:i,id:i};
                 points.push(point);
             }
             //判断当前浏览器是否支持海量点
             if (document.createElement('canvas').getContext) {
                 var options = {
                     size: BMAP_POINT_SIZE_SMALL,
                     shape: BMAP_POINT_SHAPE_STAR,
                     color: 'red'
                 };
                 //初始化pointCollection
                 var pointCollection = new BMap.PointCollection(points, options);
                 //监听点击事件
                 /*pointCollection.addEventListener('click',function(e){
                  alert('单击点的坐标为：'+e.point.lng+','+e.point.lat);
                  });*/
                 //添加Overlay
                 map.addOverlay(pointCollection);
                 this.map.setViewport(points);
             } else {
                 alert("当前浏览器不支持海量点功能。");
             }
             return pointCollection;
         },
         /**
          *
          * @param data
          * @param options
          *    {
                     size:	BMAP_POINT_SIZE_SMALL,    	//海量点尺寸
                                 BMAP_POINT_SIZE_TINY		超小，高宽为2px
                                 BMAP_POINT_SIZE_SMALLER		很小，高宽为4px
                                 BMAP_POINT_SIZE_SMALL		小，高宽为8px
                                 BMAP_POINT_SIZE_NORMAL		正常，高宽为10px，默认尺寸
                                 BMAP_POINT_SIZE_BIG			大，高宽为16px
                                 BMAP_POINT_SIZE_BIGGER		很大，高宽为20px
                                 BMAP_POINT_SIZE_HUGE		超大，高宽为30px
                     shape: BMAP_POINT_SHAPE_STAR,		//海量点形状
                     color: 'red'						//海量点颜色
             }
          * @param url
          * @return
          */
         dataToMassMarksByOptions: function (data, options, url) {
             if (data == undefined) {
                 alert("参数不可为空！");
                 return;
             }
             if (data.length == 0) {
                 alert("没有要标注的地址");
                 return;
             }
             var points = [];
             for (var i = 0; i < data.length; i++) {
                 if (data[i]["PROVIDERID"] == 'baidu') {
 
                 } else if (data[i]["PROVIDERID"] == 'gaode') {
                     var baiduPoint = GPS.bd_encrypt(data[i]["LATITUDE"],
                         data[i]["LONGITUDE"]);
                     data[i]["LATITUDE"] = baiduPoint.lat;
                     data[i]["LONGITUDE"] = baiduPoint.lon;
                 }
                 //var point = new MapCore.Point([data[i][0], data[i][1]]);
 
                 var point = new MapCore.Point([data[i]["LONGITUDE"],
                     data[i]["LATITUDE"]]);
                 //var point = {lnglat:[data[i]["LONGITUDE"],data[i]["LATITUDE"]],name:i,id:i};
                 points.push(point);
             }
             //判断当前浏览器是否支持海量点
             if (document.createElement('canvas').getContext) {
                 var pointCollection = new BMap.PointCollection(points, options);
                 //监听点击事件
                 /*pointCollection.addEventListener('click',function(e){
                  alert('单击点的坐标为：'+e.point.lng+','+e.point.lat);
                  });*/
                 //添加Overlay
                 map.addOverlay(pointCollection);
                 this.map.setViewport(points);
             } else {
                 alert("当前浏览器不支持海量点功能。");
             }
             return pointCollection;
         },
         //添加海量点
         addMassMarker: function (json) {
             if (!json.data) {
                 return;
             }
             var data = json.data;
             var points = [];
             for (var i = 0; i < data.length; i++) {
 
                 var lng = data[i]["LONGITUDE"];
                 var lat = data[i]["LATITUDE"];
                 var providerId = data[i]["PROVIDERID"];
                 var id = data[i]["ID"];
 
                 if (data[i] instanceof Array) {
 
                     var lng = data[i][0];
                     var lat = data[i][1];
                     var providerId = data[i][2];
                 }
                 if (providerId == 'baidu') {
 
                 } else if (providerId == 'gaode') {
                     var baiduPoint = GPS.bd_encrypt(lat, lng);
                     lat = baiduPoint.lat;
                     lng = baiduPoint.lon;
                 }
 
                 var point = new MapCore.Point([lng, lat]);
                 point.sourceData = data[i];
                 points.push(point);
             }
             //判断当前浏览器是否支持海量点
             var pointCollection;
             if (document.createElement('canvas').getContext) {
                 if (!json.options) {
                     json.options = {
                         size: BMAP_POINT_SIZE_SMALL,
                         shape: BMAP_POINT_SHAPE_CIRCLE,
                         color: '#0000ac'
                     };
                 }
                 if (json.options && json.options.shape) {
                     json.options.shape = window['BMAP_POINT_SHAPE_' + json.options.shape];
                 }
                 pointCollection = new BMap.PointCollection(points, json.options);
                 //添加Overlay
                 map.addOverlay(pointCollection);
             } else {
                 alert("当前浏览器不支持海量点功能。");
             }
 
             if (pointCollection && json.clickFun) {
                 pointCollection.addEventListener('click', function (e) {
                     json.clickFun(e);
                 });
             }
 
             var result = [pointCollection, points];
             return result;
         },
         dataToMassMarksByEXOptions: function (data, options, url) {
             var map = this;
             if (data == undefined) {
                 alert("参数不可为空！");
                 return;
             }
             if (data.length == 0) {
                 alert("没有要标注的地址");
                 return;
             }
             var points = [];
             for (var i = 0; i < data.length; i++) {
                 if (data[i]["PROVIDERID"] == 'baidu') {
 
                 } else if (data[i]["PROVIDERID"] == 'gaode') {
                     var baiduPoint = GPS.bd_encrypt(data[i]["LATITUDE"],
                         data[i]["LONGITUDE"]);
                     data[i]["LATITUDE"] = baiduPoint.lat;
                     data[i]["LONGITUDE"] = baiduPoint.lon;
                 }
 
                 var point = new MapCore.Point([data[i][0], data[i][1]]);
                 points.push(point);
             }
             //判断当前浏览器是否支持海量点
             if (document.createElement('canvas').getContext) {
                 var pointCollection = new BMap.PointCollection(points, options);
                 //添加Overlay
                 map.addOverlay(pointCollection);
             } else {
                 alert("当前浏览器不支持海量点功能。");
             }
             var result = [pointCollection, points];
             return result;
         },
         massMarksAddInfo: function (data, mass, ThisfieldName) { //给海量点添加信息窗
             if (data == undefined || mass == undefined
                 || ThisfieldName == undefined) {
                 return;
             }
             var markers = [];
             var points = [];
             mass
                 .addEventListener(
                     'click',
                     function (e) {
                         for (var i = 0; i < data.length; i++) {
                             if ((data[i]["LATITUDE"] == e.point.lat)
                                 && (data[i]["LONGITUDE"] == e.point.lng)) {
                                 var obj = data[i];
                                 var imgs = "";
                                 $
                                     .each(
                                         obj,
                                         function (key, value) {
                                             for (var i = 0; i < ThisfieldName.length; i++) {
                                                 if (ThisfieldName[i]["modelattribute"] == key) {
                                                     imgs += "<h>"
                                                         + ThisfieldName[i]["modelattributename"]
                                                         + "："
                                                         + obj[key]
                                                         + "</h></br>";
                                                     continue;
                                                 }
                                             }
                                         });
                                 var infoWindow = new BMap.InfoWindow(
                                     imgs);
                                 this.map.openInfoWindow(infoWindow,
                                     e.point);
                                 return;
                             }
 
                         }
 
                     });
         },
         massMarksAddInfoByText: function (mass, callBack) { //给海量点添加信息窗
             if (mass == undefined) {
                 return;
             }
             if (typeof (callBack) != 'function') {
                 alert("callBack必须为函数类型");
                 return;
             }
             mass.addEventListener('click', function (e) {
                 callBack(e);
                 //var infoWindow = new BMap.InfoWindow(Text);
                 //this.map.openInfoWindow(infoWindow,e.point);
                 //var infoWindow = map.addTextInfoWindow(text,opts1);
                 //this.map.openInfoWindow(infoWindow,e.point);
 
             });
         },
 
         //添加矢量图标
         addVectorMarker: function (json) {
             if (!json.data) {
                 return;
             }
             var data = json.data;
             var points = [];
             for (var i = 0; i < data.length; i++) {
                 var lng = data[i]["LONGITUDE"];
                 var lat = data[i]["LATITUDE"];
                 var providerId = data[i]["PROVIDERID"];
                 var id = data[i]["ID"];
 
                 if (data[i] instanceof Array) {
 
                     var lng = data[i][0];
                     var lat = data[i][1];
                     var providerId = data[i][2];
                 }
                 if (providerId == 'baidu') {
 
                 } else if (providerId == 'gaode') {
                     var baiduPoint = GPS.bd_encrypt(lat, lng);
                     lat = baiduPoint.lat;
                     lng = baiduPoint.lon;
                 }
 
                 var point = new MapCore.Point([lng, lat]);
                 point.sourceData = data[i];
                 points.push(point);
 
                 var vectorMarker = new MapCore.VMarker(point, {
                     icon: new BMap.Symbol(BMap_Symbol_SHAPE_RECTANGLE, {
                         scale: 10,
                         fillColor: json.options.color,
                         fillOpacity: 0.8,
                         strokeWeight: 1
                     })
 
                 });
                 var imgs = " <div id = \"header\">ATM信息卡片</div>"
                     + "<div id = \"container\">"
                     + "<div class='kp' id = \"xm\">编号：" + data[i][7]
                     + "</div>" + "<div class='kp' id = \"dh\">类型："
                     + data[i][3] + "</div>"
                     + "<div class='kp' id = \"mc\">当前状态：" + data[i][6]
                     + "</div>" + "<div class='kp' id = \"dz\">名称："
                     + data[i][8] + "</div>"
                     + "<div class='kp' id = \"dz\">地址：" + data[i][5]
                     + "</div>" + "</div>";
                 //添加信息窗
                 vectorMarker.setInfoWindow(imgs);
 
                 map.addOverlay(vectorMarker);
             }
             //map.setViewport(points);
             var result = [null, points];
             return result;
         },
         //---------------add by wangqy  2016.7.28 start----------------//
         /**
          * 根据浏览器定位
          */
         getLocationByExplore: function (callback) {
             var geolocation = new BMap.Geolocation();
             var _map = this.map;
             geolocation.getCurrentPosition(function (r) {
                 if (this.getStatus() == BMAP_STATUS_SUCCESS) {
 
                     var mk = new BMap.Marker(r.point);
                     _map.addOverlay(mk);
                     _map.panTo(r.point);
                     var pointM = new MapCore.Point(
                         [r.point.lng, r.point.lat]);
                     callback(pointM);
                     //	BMap.Convertor.translate(r.point,2,function(point){});
 
                 } else {
                     alert('failed' + this.getStatus());
                     callback(null);
                 }
             }, {
                 enableHighAccuracy: true
             })
 
         },
         //---------------add by wangqy  2016.7.28 end----------------//
         //---------------add by wangqy  2016.7.28 start----------------//
         /**
          * 根据IP定位
          */
         getLocationByIP: function (callback) {
             var myCity = new BMap.LocalCity();
             myCity.get(callback);
         },
         //---------------add by wangqy  2016.7.28 end----------------//
         //---------------add by tpj  2016.10.9 start----------------//
         /**
          * H5原生定位
          * @param callback 回调函数
          * @param isGeo 定位失败的时候是否使用供应商的浏览器定位服务
          * @return
          */
         getLocationByBrower: function (callback, isGeo) {
             var This = this;
             if (window.navigator.geolocation) {
                 var options = {
                     enableHighAccuracy: true, //是否尝试更精确地读取经度和纬度，默认为false
                     timeout: 10000
                 };
                 window.navigator.geolocation.getCurrentPosition(function (position) {
                     var lng = position.coords.longitude;
                     var lat = position.coords.latitude;
                     var ggPoint = new BMap.Point(lng, lat);
                     var pointArr = [];
                     pointArr.push(ggPoint);
                     var convertor = new BMap.Convertor();
                     convertor.translate(pointArr, 1, 5, function (data) {
                         if (data.status === 0) {
                             lng = data.points[0].lng;
                             lat = data.points[0].lat;
                         }
                         var pos = {
                             status: 'ok',
                             lng: lng,
                             lat: lat
 
                         };
                         callback(pos);
                     });
                 }, function (error) {
                     var pos = {
                         status: 'fail',
                         lng: 0,
                         lat: 0
                     };
                     if (isGeo) {
                         This.getLocationByExplore(callback);
                     } else {
                         callback(pos);
                     }
                 }, options);
             } else {
                 alert("浏览器不支持HTML5获取地理位置信息");
             }
         },
         drawClusterByQuery: function (options) { //处理后台聚合计算
             var that = this;
             var centers = options.centerPoints;
             var markers = options.centerMarkers;
             var _styles = options.styles || [
                 {size: new MapCore.Size(23, 23), drawtype: 'circle', backgroundColor: '#03A9F4', border: '#03A9F4'},
                 {size: new MapCore.Size(36, 36), drawtype: 'circle', backgroundColor: '#03A9F4', border: '#03A9F4'},
                 {size: new MapCore.Size(40, 40), drawtype: 'circle', backgroundColor: '#03A9F4', border: '#03A9F4'},
                 {size: new MapCore.Size(46, 46), drawtype: 'circle', backgroundColor: '#03A9F4', border: '#03A9F4'},
                 {size: new MapCore.Size(50, 50), drawtype: 'circle', backgroundColor: '#03A9F4', border: '#03A9F4'}
             ];
             for (var i = 0; i < centers.length; i++) {//对每一个中心进行遍历
                 var centerPoint = new MapCore.Point([centers[i].split(',')[0], centers[i].split(',')[1]]);
                 var centerMarker = markers[i];
                 var clusterDraw = new BMapLib.DrawCluster(centerPoint, centerMarker.length, //创建聚合
                     {
                         styles: _styles,
                         clickFun: options.clickFun
                     });
                 that.addOverlay(clusterDraw);
                 clusterDraw.showClusterMarkers(); //对每一个聚合添加点击事件
             }
         },
         /**
          * 百度坐标转换(gps坐标转百度坐标)
          * @param callback 回调函数
          * @param point 要转换的点
          */
         transCoordinate: function (callback, point) {
             var pointArr = [];
             pointArr.push(point);
             var convertor = new BMap.Convertor();
             convertor.translate(pointArr, 1, 5, function (data) {
                 if (data.status === 0) {
                     var lng = data.points[0].lng;
                     var lat = data.points[0].lat;
                     var po = new MapCore.Point([lng, lat]);
                     var res = {
                         result: 'ok',
                         point: po
                     };
                     callback(res);
                 } else {
                     var res = {
                         result: 'fail',
                         point: point
                     };
                     callback(res);
                 }
             });
         },
         //---------------add by tpj  2016.10.9 end----------------//
         /**
          * 添加麻点图层
          */
         addCustomerLayerView: function (customLayerOpts) {
             if (customLayer) {
                 this.map.removeTileLayer(customLayer);
             }
             customLayer = new BMap.CustomLayer(customLayerOpts);
             this.map.addTileLayer(customLayer);
         },
         //-----------------------添加麻点图层end---------------//
         route: function () { //添加导航功能
             var p1;
             var p2;
             var menu = new BMap.ContextMenu();
             var geoc = new BMap.Geocoder();
             var beginStr = '';
             var endStr = '';
             //文本框
             var opts = {
                 width: 200,
                 height: 100
             }
 
             $("#r-beginEnd").html(beginStr + "<br/>" + endStr + "<br/>");
 
             var txtMenuItem = [
                 {
                     text: '设为起点',
                     callback: function (e) {
                         //alert(e.lng+","+e.lng);
                         p1 = e;
                         driving.search(p1, p2);
                         //根据坐标查地区明细
                         geoc.getLocation(e, function (rs) {
                             var addComp = rs.addressComponents;
                             beginStr = "起点:" + addComp.province + ","
                                 + addComp.city + "," + addComp.district
                                 + "," + addComp.street + ","
                                 + addComp.streetNumber;
                             //var infoWindow = new BMap.InfoWindow(beginStr,opts);
                             //this.map.openInfoWindow(infoWindow,e);
                             //$("#r-beginEnd").html(beginStr+"<br/>"+endStr+"<br/>");
                             //alert("起点为"+addComp.province+","+addComp.city+","+addComp.district+","+addComp.street+","+addComp.streetNumber);
                         });
 
                     }
                 },
                 {
                     text: '设为终点',
                     callback: function (e) {
                         //alert(e.lng+","+e.lng);
                         p2 = e;
                         driving.search(p1, p2);
                         //根据坐标查地区明细
                         geoc.getLocation(e, function (rs) {
                             var addComp = rs.addressComponents;
                             endStr = "终点:" + addComp.province + ","
                                 + addComp.city + "," + addComp.district
                                 + "," + addComp.street + ","
                                 + addComp.streetNumber;
                             //var infoWindow = new BMap.InfoWindow(endStr,opts);
                             //$("#r-beginEnd").html(beginStr+"<br/>"+endStr+"<br/>");
                             //this.map.openInfoWindow(infoWindow,e);
 
                             //alert("终点为"+addComp.province+","+addComp.city+","+addComp.district+","+addComp.street+","+addComp.streetNumber);
                         });
                     }
                 }];
 
             for (var i = 0; i < txtMenuItem.length; i++) {
                 menu.addItem(new BMap.MenuItem(txtMenuItem[i].text,
                     txtMenuItem[i].callback || function () {
                     }, {
                         width: 100
                     }));
             }
             this.map.addContextMenu(menu);
 
             var driving = new BMap.DrivingRoute(this.map, {
                 renderOptions: {
                     map: this.map,
                     panel: "r-result",//路线面板
                     autoViewPort: true,
                     enableDragging: true
                     //路线可以鼠标拖拽
                 }
             });
         },
 
         /**
          * 轨迹上传
          */
         uploadTrajectoryData: function (json) {
             var url = "optimoveAppAddress/tlmapService/modelattributes/uploadTrajectoryData.do";
             json.callBackFun = function (data) {
                 console.log(data);
             };
             this.runJsonp(json, url);
         },
 
         /**
          * 通过id查找轨迹图形
          */
         getTrajectoryShape: function (id) {
             var url = "optimoveAppAddress/tlmapService/modelattributes/searchShape.do";
             this.runJsonp({
                 emmid: id,
                 callBackFun: function (data) {
                     console.log(data);
                 }
 
             }, url);
         },
         /**
          * 轨迹检索
          */
         selectTrajectory: function (json) {
             var url = "optimoveAppAddress/tlmapService/modelattributes/selectTrajectory.do";
             /*if(!json){
              alert('参数不能为空');
              return ;
              }
              if(!json.appId){
              alert('查询渠道不能为空');
              return ;
              }
              if(!json.deviceId){
              alert('查询轨迹设备号不能为空');
              return ;
              }   */
 
             this.runJsonp(json, url);
         },
 
         //---------------add by wangqy  2018.3.27----------------//
         /**
          * 路径规划
          */
         pathPlanning: function (json) {
             json.jsonParams.provider = "10001";//baidu provider
             var url = "optimoveAppAddress/tlmapService/modelattributes/pathPlanning.do";
             this.runJsonp(json, url);
         },
         /**
          * 等时圈分析
          *@param json 是json字符串
          *           appid          必填 系统编号 "CREDIT",必须要在地图平台配置
          *           policy         必填 出行策略  枚举值：LEAST_DISTANCE （路径最短）
          *                                      LEAST_TIME （时间最少）
          *           routeType      必填，出行方式  driving：驾车 walking：步行  riding：骑行
          *           centerPoint    必填  中心点、起点
          *           isochronalTime 选填，等时圈时间 ，单位秒；不传解析所有点的距离和耗时
          *           points         必填，至少一个点，使用对象
          *           orderBy        选填，排序方式 ASC/DESC
          *           top            选填，取结果集的条目数，不写返回全部
          *
          *@return   返回为josn字符串
          *           result   返回状态  ok：成功  fail：失败
          *           count    结果条数
          *           points   返回的点对象
          *                  distance   与中心点的距离
          *                  duration   与中心点的耗时，单位秒
          *                  lng        维度
          *                  lat        经度
          *
          *     请求示例：
          *
          *              var centerPoint = {};
          *                //经度
          *                centerPoint.lng = "121.5418";
          *                //维度
          *                centerPoint.lat = "29.80963";
          *                //点集合
          *                var points = new Array();
          *                points.push({"lng":"121.1234","lat":"29.0823"});
          *                points.push({"lng":"121.4567","lat":"29.2311"});
          *
          *                var json = {};
          *                json.appid = "CREDIT";
          *                json.centerPoint = centerPoint;
          *                json.policy = "LEAST_TIME";
          *                json.routeType = "driving";
          *                json.points = points;
          *                json.isochronalTime=1800;// 30分钟
          *                json.orderBy="ASC";
          *                json.top=20;
          *                var json1 = {};
          *                json1.jsonParams = JSON.stringify(json);
          *                //回调函数
          *                json1.callBackFun = isochronalAnaly_CallBack;
          *                map. isochronalAnaly (json1);
 
          *     返回报文示例：{"result":"ok","count":3,
          *                  "points":[
          *                   {"distance":2704,"duration":101,"lat":"29.847324","lng":"121.519333"},
          *                   {"distance":6015,"duration":225,"lat":"29.810562","lng":"121.542058"}
          *                   ]}
          *
          * @author k4321 20190114
          */
         isochronalAnaly: function (json) {
             var url = "optimoveAppAddress/tlmapService/spatialAnalysis/isochronalAnaly.do";
             json.crossType = true;
             this.runJsonp(json, url, function (data) {
                 console.log(data)
             });
         },
         /**
          * 毛毛虫规划：指点起点终点，在指定区域范围内查找点和规划路径
          * @author k4321 20190314
          */
         findBestRoute: function (json) {
             var url = "optimoveAppAddress/tlmapService/caterpillar/findBestRoute.do";
             json.crossType = true;
             this.runJsonp(json, url, function (data) {
                 console.log(data)
             });
         },
         //---------------add by wangqy  2016.7.25 start----------------//
         /**
          * 根据服务获取路径详情
          * @param data json对象，存储所需的service参数
          */
         getRoute: function (data) {
             $
                 .ajax({
                     async: false,
                     cache: false,
                     dataType: "json",
                     type: "post",
                     url: "optimoveAppAddress/tlmapService/modelattributes/getRoute.do",
                     data: {
                         origin: data.origin,
                         destination: data.destination,
                         mode: data.mode,
                         output: data.output,
                         coord_type: data.coord_type,
                         waypoints: "",
                         tactics: data.tactics,
                         origin_region: data.origin_region,
                         destination_region: data.destination_region,
                         tablename: data.tablename
                     },
                     success: function (json) {
                         if (json) {
                             //alert("success");
                             //json = JSON.parse(json);
                             //console.log("路径全长"+json.distance+"米，耗时"+json.duration+"秒");
                             var startendP = [];
 
                             for (var i = 0; i < json.steps.length; i++) {
                                 var path_Points = [];
                                 var per_path = json.steps[i].path.split(";");
                                 var per_path_startendP = [];
                                 for (var j = 0; j < per_path.length; j++) {
                                     var pt = new MapCore.Point([
                                         per_path[j].split(",")[0],
                                         per_path[j].split(",")[1]]);
                                     path_Points.push(pt);
                                     //记录每个路段的起点和终点
                                     if (j == 0 || j == per_path.length - 1) {
                                         per_path_startendP.push(pt);
                                     }
                                     //记录整路径起点和终点
                                     if ((i == 0 && j == 0)
                                         || (i == (json.steps.length - 1) && j == (per_path.length - 1))) {
                                         startendP.push(pt);
                                     }
                                 }
                                 //获取路段交通拥堵情况
                                 var render = null;
                                 var traffic = json.steps[i].distance
                                     / json.steps[0].duration;
                                 var perpath_traffic = JSON
                                     .parse(json.steps[i].traffic_condition);
                                 console.log(perpath_traffic + "," + traffic + ";");
                                 if (perpath_traffic == 1) {
                                     render = {
                                         strokeColor: 'green',
                                         strokeOpacity: 0.7,
                                         strokeWeight: 4
                                     };
                                 } else if (perpath_traffic == 2) {
                                     render = {
                                         strokeColor: 'orange',
                                         strokeOpacity: 0.7,
                                         strokeWeight: 4
                                     };
                                 } else if (perpath_traffic == 3) {
                                     render = {
                                         strokeColor: 'red',
                                         strokeOpacity: 0.7,
                                         strokeWeight: 4
                                     };
                                 } else {
                                     render = {
                                         strokeColor: 'green',
                                         strokeOpacity: 0.7,
                                         strokeWeight: 4
                                     };
                                 }
                                 var polyline = map.setPolyline(path_Points, render);
                                 map.addOverlay(polyline);
 
                                 //路段文本信息窗
                                 //设置点标记上的文本框信息
                                 var sContent = " <div>"
                                     + json.steps[i].instructions + "</div>";
                                 var marker = new MapCore.VMarker(
                                     per_path_startendP[0], {
                                         //圆形矢量图标
                                         icon: new BMap.Symbol(
                                             BMap_Symbol_SHAPE_CIRCLE, {
                                                 scale: 5,
                                                 strokeWeight: 1,
                                                 fillColor: 'pink',
                                                 fillOpacity: 0.8
                                             })
                                     });
                                 marker.setInfoWindow(sContent);
                                 map.addMarker(marker);
                             }
                             //设置显示范围
                             map.setViewport(startendP);
                             //绘制起点和终点
                             for (var k = 0; k < startendP.length; k++) {
                                 var marker = new MapCore.Marker(startendP[k]);
                                 if (k == 0) {
                                     map
                                         .setMarkerIcon(marker,
                                             "gateWayAddressnbcbimages/startMarker.png");
                                 } else if (k == startendP.length - 1) {
                                     map
                                         .setMarkerIcon(marker,
                                             "gateWayAddressnbcbimages/endMarker.png");
                                 }
                                 map.addMarker(marker);
                             }
                         }
                     },
                     error: function (e) {
                         alert("异常" + e.statusText);
                         console.log("异常" + e.statusText);
 
                     }
                 });
 
         },
 
         /**
          * 多点策略路径规划具体计算计算
          * @param driving 路径规划类型
          * @param stratPointIndex 起始点索引号
          * @param waypoints 起始点+拜访点集合
          * @return array 路径点顺序索引
          */
         //---------------add by wangqy 20160706  start----------------//
         calculateOptimalRoute: function (driving, stratPointIndex, waypoints) {
 
             //测试耗时变量
             var time1I = 0, time2I = 0, time3I = 0;
             //获取点的总数
             var n = waypoints.length;
             //初始化成本矩阵，二维数组
             var costArray = new Array();
             for (var i = 0; i < n; i++) {
                 costArray[i] = new Array(n);
                 for (var j = 0; j < n; j++) {
                     costArray[i][j] = 0;
                 }
             }
             //测试耗时：成本矩阵计算开始
             var time1 = new Date();
             //成本邻接矩阵
             var loopCount = 0;
             var costStr = '';
             for (var i = 0; i < n; i++) {
                 for (var j = 0; j < n; j++) {
                     //同一个点的路径不调用search，减少耗时
                     if (i == j)
                         continue;
                     driving.search(waypoints[i], waypoints[j]);
                     driving.setSearchCompleteCallback(function () {
                         var distance = 99999;
                         if (driving.getResults() != undefined) {
                             if (driving.getResults().getPlan(0) != undefined)
                                 distance = driving.getResults().getPlan(0)
                                     .getDistance(false);
                         }//实际测试中发现有无法到达的行车路径..
 
                         //因为是回调函数，无法通过i和j的索引给成本矩阵赋值，所以先用string记录，后面解析
                         costStr += (distance + ',');
                         //json=distance;
                         loopCount++;
                         if (loopCount == (Math.pow(n, 2) - n))//对应于search次数，以此来退出回调
                         {
                             //解析成本字符串，赋值成本矩阵
                             var costStrs = costStr.substring(0,
                                 costStr.length - 1).split(',');
                             var costStrIndex = 0;
                             for (var ii = 0; ii < n; ii++) {
                                 for (var jj = 0; jj < n; jj++) {
                                     if (ii == jj)
                                         costArray[ii][jj] = 0;
                                     else
                                         costArray[ii][jj] = costStrs[costStrIndex++];
                                 }
                             }
                             //销毁成本字符串变量
                             costStrs = null;
                             //测试耗时：成本矩阵计算结束，路径索引计算开始
                             var time2 = new Date();
                             //calculate start
                             var isChooseP = new Array(n);
                             var route1 = [];
                             var route2 = [];//记录每次循环最小cost的路径点索引
                             var routeTotalCost1 = 0;
                             var routeTotalCost2 = 999999;//初始化为最大值，记录每次循环最小的cost
                             for (var An = 0; An < n; An++) {
                                 //如果设置了起点，则记录该点为已选择1，不参与深度扩展；
                                 if (stratPointIndex != -1)
                                     An = stratPointIndex;
                                 route1 = [];//每次循环初始化route1数组，具体信息存储于route2
                                 routeTotalCost1 = 0;//每次循环初始化routeTotalCost1 ,具体信息存储于routeTotalCost2
                                 route1.push(An);
                                 isChooseP[An] = 1;//本次循环的起点已经被选择，不再参与深度扩展
                                 //A*算法
                                 var k = 0;
                                 while (k < (n - 1))//扩展次数
                                 {
                                     var i = route1[k];//扩展搜索从最新路径点开始
                                     var perMinCost = 99999;//有疑惑
                                     var perMinIndex = 0;
                                     for (var j = 0; j < n; j++) {
 
                                         if ((j == i) || (isChooseP[j] == 1))//已经被选择作为路径的点和当前点不列入判断范围
                                             continue;
                                         else {
                                             if (costArray[i][j] <= perMinCost)//不考虑cost相等情况，比较复杂
                                             {
                                                 perMinCost = parseInt(costArray[i][j]);
                                                 perMinIndex = j;
                                             }
                                         }
                                     }
                                     k++;
                                     route1[k] = perMinIndex;//记录当前扩展的点index
                                     isChooseP[perMinIndex] = 1; //设置当前扩展的点为已选择，不参与后续扩展
                                     routeTotalCost1 += perMinCost;//累加成本
                                 }
                                 //若设置了起点，则只循环一次，不再指定每个点为起点，进行一遍A×计算
                                 if (stratPointIndex != -1) {
                                     route2 = route1;//浅拷贝，route1、2都不再被修改
                                     break;
                                 } else {
                                     //若未设置起点，则需要进行n次循环，每一次记录以当前点为起点的路径索引和全路径耗时
                                     //每次取耗时小的路径信息，记录点索引信息
                                     if (routeTotalCost1 < routeTotalCost2) {
                                         for (var i = 0; i < route1.length; i++) {
                                             route2[i] = route1[i];//深拷贝，route1后续会被修改
                                         }
                                         routeTotalCost2 = routeTotalCost1;
                                     }
                                 }
                             }
 
                             //测试耗时：A×计算结束
                             var time3 = new Date();
                             var routeStr = '';
                             //输出计算后的路径点顺序索引
                             for (var i = 0; i < route2.length; i++) {
                                 routeStr += route2[i] + ',';
                             }
                             //获取途径点数组
                             var routeWaypoints = new Array();
                             for (var i = 1; i < n - 1; i++) {
                                 routeWaypoints.push(waypoints[route2[i]]);
                             }
                             //调用driving的search方法
                             driving.search(waypoints[route2[0]],
                                 waypoints[route2[n - 1]], {
                                     waypoints: routeWaypoints
                                 });
                             //测试所需耗时
                             time1I = time2.getTime() - time1.getTime();
                             time2I = time3.getTime() - time2.getTime();
                             alert("成本矩阵耗时：" + time1I + ',计算路径耗时：' + time2I);
                             alert(routeStr);
                             //销毁对象
                             isChooseP = null;
                             route1 = null;
                             routeWaypoints = null;
                             return route2;
                             //calculate end
                         }
                     });
                 }
             }
         },
 
         //---------------add by wangqy 20160706  end----------------//
 
         //---------------add by wangqy 20160729  start----------------//
         /**
          * 多点策略路径规划，必须传值
          * @param aStartPoint 起始点
          * @param aWayPoints 拜访点
          * @param aRouteType 规划类型：驾车0步行1公交2
          * @param aPolicy 路径规划策略：最少时间0最短路径1不走高速2
          * @return
          */
         optimalRoute: function (aStartPoint, aWayPoints, aRouteType, aPolicy) {
             if (aStartPoint == undefined || aStartPoint == null
                 || aStartPoint == "") {
                 alert("起点不能为空");
                 return;
             }
             if (aWayPoints == undefined || aWayPoints == null
                 || aWayPoints == "") {
                 alert("拜访点不能为空");
                 return;
             }
             if (aPolicy == undefined || aPolicy == null || aPolicy == "") {
                 alert("路径策略不能为空，已默认选择“最少时间”");
                 aPolicy = "LEAST_TIME";
             }
             var route;
             if (aRouteType == undefined || aRouteType == null
                 || aRouteType == "") {
                 alert("路径规划类型为空，已默认选择“驾车”");
                 aRouteType = "DRIVING";
             }
 
             if (aRouteType == "DRIVING") {
                 route = new BMap.DrivingRoute(this.map, {
                     renderOptions: {
                         map: this.map,
                         panel: "r-result",//路线面板
                         autoViewPort: true,
                         enableDragging: true
                         //路线可以鼠标拖拽
                     }
                 });
                 if (aPolicy == "LEAST_TIME") //最少时间
                 {
                     route.setPolicy(BMAP_DRIVING_POLICY_LEAST_TIME);
                 } else if (aPolicy == "LEAST_DISTANCE") //最短距离
                 {
                     driving.setPolicy(BMAP_DRIVING_POLICY_LEAST_DISTANCE);
                 } else if (aPolicy == "AVOID_HIGHWAYS")//避开高速
                 {
                     driving.setPolicy(BMAP_DRIVING_POLICY_AVOID_HIGHWAYS);
                 }
             } else if (aRouteType == "WALKING")//walking
             {
                 alert("未实现");
                 route = new BMap.WalkingRoute(this.map, {
                     renderOptions: {
                         map: this.map,
                         panel: "r-result",//路线面板
                         autoViewPort: true,
                         enableDragging: true
                         //路线可以鼠标拖拽
                     }
                 });
 
             } else if (aRouteType == "TRANSIT")//bus
             {
                 alert("未实现");
                 return;
 
             }
 
             //设置起点
             aWayPoints.push(aStartPoint);
             startIndex = aWayPoints.length - 1;
             //计算路径
             map.calculateOptimalRoute(route, startIndex, aWayPoints, function (routeIndex) {
                 if (routeIndex != undefined && routeIndex != null) {
                     //处理返回的所有点的顺 序索引数组
                     //试图new一个route实例，以避免在成本矩阵计算时候会绘制路线的情况，然而无效果，待研究
                     var routeWaypoints = new Array();
                     for (var i = 1; i < n - 1; i++) {
                         routeWaypoints.push(waypoints[route2[i]]);
                     }
                     route.clearResults();
                     /*route = new BMap.DrivingRoute(this.map,{
                      renderOptions:{
                      map:this.map,
                      panel:"r-result",//路线面板
                      autoViewPort:true,
                      enableDragging:true//路线可以鼠标拖拽
                      }
                      });	*/
                     route.search(waypoints[route2[0]],
                         waypoints[route2[n - 1]], {
                             waypoints: routeWaypoints
                         });
                     map.setViewport(waypoints);
                 }
             });
 
         },
         //---------------add by wanqy  20160729  end----------------//
 
         /**
          * 多点策略路径规划，通过右键菜单选择点（有向图，实际上A->B和B->A的路径不一定相同）
          */
         //---------------add by wqy  20160706  start----------------//
         optimalRouteByMenu: function () {
 
             var p1;
             var waypoints = [];
             var pCount = 0;
             var startIndex = -1;//记录起点在点数组里的位置
 
             var menu = new BMap.ContextMenu();
             var geoc = new BMap.Geocoder();
             var beginStr = '';
             var endStr = '';
             //设置路径策略
             var policy = "LEAST_TIME";
             var aRouteType = "driving";//默认driving，尚未扩展其他方式
             //文本框
             var opts = {
                 width: 200,
                 height: 100
             };
             $("#r-beginEnd").html(beginStr + "<br/>" + endStr + "<br/>");
 
             //设置右键菜单
             var txtMenuItem = [
                 {
                     text: '设为起点',
                     callback: function (e) {
                         aWayPoints = null;//清空传入的数据，改为点选模式
                         aStartPoint = e;
                         startIndex = pCount;
                         waypoints[pCount] = e;
                         pCount = pCount + 1;
 
                     }
                 },
                 {
                     text: '设为拜访点',
                     callback: function (e) {
                         waypoints[pCount] = e;
                         pCount = pCount + 1;
 
                     }
                 },
                 {
                     text: '清空点信息',
                     callback: function (e) {
                         waypoints = null;
                         startIndex = -1;
                         pCount = 0;
                         p1 = null;
                     }
                 },
                 {
                     text: '最少时间',
                     callback: function (e) {
                         policy = "LEAST_TIME";
                         driving.setPolicy(BMAP_DRIVING_POLICY_LEAST_TIME);
                     }
                 },
                 {
                     text: '最短路径',
                     callback: function (e) {
                         policy = "LEAST_DISTANCE";
                         driving
                             .setPolicy(BMAP_DRIVING_POLICY_LEAST_DISTANCE);
 
                     }
                 },
                 {
                     text: '避开高速',
                     callback: function (e) {
                         policy = "AVOID_HIGHWAYS";
                         driving
                             .setPolicy(BMAP_DRIVING_POLICY_AVOID_HIGHWAYS);
                     }
                 },
                 {
                     text: '计算最优路径',
                     callback: function (e) {
                         //alert(e.lng+","+e.lng);
                         map.calculateOptimalRoute(driving, startIndex,
                             waypoints, function (routeIndex) {
                                 if (routeIndex != undefined
                                     && routeIndex != null) {
                                     //返回路径点索引数组处理
                                 }
                             });
                     }
                 }];
 
             for (var i = 0; i < txtMenuItem.length; i++) {
                 menu.addItem(new BMap.MenuItem(txtMenuItem[i].text,
                     txtMenuItem[i].callback || function () {
                     }, {
                         width: 100
                     }));
             }
             map.addContextMenu(menu);
 
             var driving = new BMap.DrivingRoute(this.map, {
                 renderOptions: {
                     map: this.map,
                     panel: "r-result",//路线面板
                     autoViewPort: true,
                     enableDragging: true
                     //路线可以鼠标拖拽
                 }
             });
             //默认策略
             driving.setPolicy(BMAP_DRIVING_POLICY_LEAST_TIME);
 
         },
         //---------------add by wqy  20160705  end----------------//
 
         //---------------add by ltq  20151117  end----------------//
         //---------------add by zbs  20151117  start----------------//
         /**
          * 添加覆盖物
          * @param data
          */
         addOverlay: function (data) {
             //添加覆盖物
             this.map.addOverlay(data);
         },
         /**
          * 移除覆盖物
          */
         clearOverlays: function () {
             //移除覆盖物
             this.map.clearOverlays();
         },
         /**
          * 调整视野
          * @param pointArray
          */
         setViewport: function (pointArray, isFast) {
             //调整视野
             if (pointArray != null && pointArray != undefined) {
                 if (isFast) {
                     var vp = [];
                     if (pointArray.length > 1000) {
                         var a = Math.ceil(pointArray.length / 1000);
                         for (var j = 0; j < pointArray.length; j = j + a) {
                             vp.push(pointArray[j]);
                         }
                     } else {
                         vp = pointArray;
                     }
                     this.map.setViewport(vp);
                 } else {
                     this.map.setViewport(pointArray);
                 }
 
             } else {
                 this.map.setViewport(pointArray);
             }
         },
         /**
          *
          * @param json
          * json.eventType  事件类型
          * json.targetObj  目标对象
          * json.callBackFun回调方法
          * @return
          */
         addObjListener: function (json) {
             if (!json || !json.targetObj) {
                 return "参数不全";
             }
             if (!json.eventType) {
                 json.eventType = "click";
             }
             json.targetObj.addEventListener(json.eventType,
                 function (data) {
                     if (data.currentTarget && data.currentTarget.point) {
                         data.clickPoint = data.point;
                         data.point = data.currentTarget.point;
                     }
                     if (json.callBackFun
                         && typeof json.callBackFun === "function") {
                         json.callBackFun(data);
                     } else if (json.callBackFun) {
                         window[json.callBackFun](data);
                     }
                 });
         },
         /**
          * 添加自定义覆盖物
          */
         ComplexCustomOverlay: function (div) {
             this.map.getPanes().labelPane.appendChild(div);
         },
         //---------------add by zbs  20151117  end----------------//
         //---------------add by wangqianqian  20151117  start----------------//
         getPoint: function (data) {
             var point = new MapCore.Point(data);
             return point;
         },
         setMarker: function (point) { //添加标志
             var marker = new BMap.Marker(point);
             return marker;
         },
         setPointByProvider: function (point, provider) { //依据地图服务商和点添加标志
             if (provider == 'baidu') {
             } else if (provider == 'gaode') {
                 var baiduPoint = GPS.bd_encrypt(point.lat, point.lng);
                 point.lat = baiduPoint.lat;
                 point.lng = baiduPoint.lon;
             }
             var newPoint = new MapCore.Point([point.lng, point.lat]);
             return newPoint;
         },
         setMarkerByProvider: function (point, provider) { //依据地图服务商和点添加标志
             if (provider == 'baidu') {
             } else if (provider == 'gaode') {
                 var baiduPoint = GPS.bd_encrypt(point.lat, point.lng);
                 point.lat = baiduPoint.lat;
                 point.lng = baiduPoint.lon;
             }
             var newPoint = new MapCore.Point([point.lng, point.lat]);
             var marker = new MapCore.Marker(newPoint);
             return marker;
         },
         addTextInfoWindow: function (String, object) { //添加纯文字的信息窗口
             return new BMap.InfoWindow(String, object);
         },
         addTextImageInfoWindow: function (jsonObj, object) { //添加图文组合的信息窗口
             var text = jsonObj.text;
             var imgUrl = jsonObj.imgUrl;
             var height = jsonObj.height;
             var width = jsonObj.width;
             var title = jsonObj.title;
             var htmlStr = "<h style='font-size:12px;margin-top:15px;'>" + text
                 + "</h><br/>" + "<img alt='' src='" + imgUrl
                 + "' style='width:" + width + "px;height:" + height
                 + "px;'>";
             var infoWindow = new BMap.InfoWindow(htmlStr, object);
             return infoWindow;
         },
         addMultipointInfo: function (data_info, opts) { //为多个点增加信息窗
             var infoWindowArr = new Array();
             for (var i = 0; i < data_info.length; i++) {
                 var point = data_info[i][0];
                 var text = data_info[i][1];
                 var marker = new MapCore.Marker(point);
                 this.addMarker(marker);
                 marker.setInfoWindow(text);
                 //				var marker = this.setMarker(point);
                 //				this.addMarker(marker);
                 //				var infoWindow = new BMap.InfoWindow(text,opts);
                 //				infoWindowArr[i] = {"point":point,"marker":marker,"infoWindow":infoWindow};
             }
             //			return infoWindowArr;
         },
         //		openInfoWindow:function(infoWindow,point){                                      //打开信息窗口
         //			this.map.openInfoWindow(infoWindow,point);
         //		},
         openInfoWindow: function (infoWindow, point) { //打开信息窗口
             this.map.openInfoWindow(infoWindow, new BMap.Point(point.lng,
                 point.lat));
         },
 
         bestTimeDrivingRoute: function (p1, p2, waypoints) {
 
         },
 
         //---------------add by wangqy  start  ------------//
         drawPolyLineByMapv: function (json) {
             var path = json.path;
             var mapvdata = [];
             for (var i = 0; i < path.length - 1; i++) {
                 var obj1 = path[i];
                 var obj2 = path[i + 1];
                 mapvdata.push({
                     geometry: {
                         type: 'LineString',
                         coordinates: [[obj1.lng, obj1.lat],
                             [obj2.lng, obj2.lat]]
                     },
                     strokeStyle: 'rgba(255,50,50,0.8)',
                     count: 20
                 });
             }
 
             var dataSet = new mapv.DataSet(mapvdata);
             var directLineRender = json.directLine == undefined ? undefined
                 : json.directLine.render;//有向箭头样式
             if (directLineRender == undefined) {
                 directLineRender = { //默认有向箭头样式
                     strokeStyle: '#FFFF00',
                     lineWidth: 1,
                     lineCap: 'square'
                 }
             }
             var options = {
                 strokeStyle: 'rgba(255,50,50,0.3)',
                 lineWidth: 5,
                 draw: 'simple'
             }
             var mapvLayer = new mapv.baiduMapLayer(map.getMap(), dataSet,
                 options);
 
         },
 
         /**
          *
          *驾车路行规划
          *@param p1 起点
          *@param p1 终点
          *@param waypoints 途经点
          */
         drivingRoute: function (policy, p1, p2, waypoints, options) {
             var _this = this;
             var _map = this.map;
             var searchOptions = {};
 
             if (!(p1 && p2)) {
                 alert('起点、终点 不能为空!');
                 return;
             }
 
 
             //自定义：可以组合不要图标或者自定义线样式，目前适用于：线修改样式，图标用百度自己，为啥，因为百度的途径点不一定去掉啊，属性在变化
             if (options != undefined && options.autoComplete == true) {
 
                 var allPoints = [];
                 //自己绘制使用autoComplete 点和线都不能绘制 onMarkersSet和onPolylinesSet都无效
                 searchOptions.onSearchComplete = function (results) {
                     if (driving.getResults() != undefined) {
                         if (driving.getResults().getPlan(0) != undefined) {
                             var plan = driving.getResults().getPlan(0);
                             for (var i = 0; i < plan.getNumRoutes(); i++) {
                                 var path = plan.getRoute(i).getPath();
 
                                 var lineStyle = options.lineStyle;
                                 if (lineStyle == undefined) {
                                     lineStyle = {
                                         strokeColor: "blue",
                                         strokeWeight: 5,
                                         strokeOpacity: 0.5
                                     };
                                 }
                                 var polyline = new BMap.Polyline(path,
                                     lineStyle);
                                 _this.map.addOverlay(polyline);
                             }
                         }
 
                         if (options.autoMarker == true && (waypoints != undefined)
                             && (options.wayIcon != undefined)) {
                             allPoints = waypoints;
                             for (var i = 0; i < waypoints.length; i++) {
                                 //自定义图标
                                 var myIcon = new MapCore.Icon({
                                     iconUrl: options.wayIcon,
                                     size: new MapCore.Size(45, 45)
                                 });
                                 myIcon.setImageSize(new MapCore.Size(30, 45));
                                 marker2 = new MapCore.Marker({
                                     point: waypoints[i],
                                     options: {
                                         icon: myIcon
                                     }
                                 });
                                 _this.map.addOverlay(marker2);
 
                             }
 
                         }
                         //是否自定义起始和终点的marker
                         if (options.autoStartEndMarker) {
                             if (options.startIcon) {
                                 //自定义图标
                                 var myIconStart = new MapCore.Icon({
                                     iconUrl: options.startIcon
                                     , size: new MapCore.Size(45, 45)
                                 });
                                 var markerStart = new MapCore.Marker({
                                     point: p1,
                                     options: {
                                         icon: myIconStart
                                     }
                                 });
                                 _this.map.addOverlay(markerStart);
                             }
 
                             if (options.endIcon) {
                                 //自定义图标
                                 var myIconEnd = new MapCore.Icon({
                                     iconUrl: options.endIcon
                                     , size: new MapCore.Size(45, 45)
                                 });
                                 var markerEnd = new MapCore.Marker({
                                     point: p2,
                                     options: {
                                         icon: myIconEnd
                                     }
                                 });
                                 _this.map.addOverlay(markerEnd);
                             }
 
                             allPoints.push(p1);
                             allPoints.push(p2);
                         }
                         _this.map.setViewport(waypoints);
 
                     }
                 }
 
 
             } else {
                 searchOptions.renderOptions = {
                     map: _map,
                     autoViewport: true
                 };
                 if (options != undefined && options.autoLine == true) {
                     searchOptions.onPolylinesSet = function (results) {
                         var lineStyle = options.lineStyle;
                         if (lineStyle == undefined) {
                             lineStyle = {
                                 strokeColor: "blue",
                                 strokeWeight: 5,
                                 strokeOpacity: 0.5
                             };
                         }
                         for (var i = 0; i < results.length; i++) {
 
                             _this.map.removeOverlay(results[i].getPolyline());
                             var path = results[i].getPath();
                             var polyline = new BMap.Polyline(path, lineStyle);
                             _this.map.addOverlay(polyline);
 
                         }
                     }
                 }
             }
 
             //marker点设置的回调函数，去除起点和终点marker
             var driving = new BMap.DrivingRoute(_map, searchOptions);
             if (policy == "LEAST_TIME")//时间最少
             {
                 driving.setPolicy(BMAP_DRIVING_POLICY_LEAST_TIME);
             } else if (policy == "LEAST_DISTANCE")//路径最短
             {
                 driving.setPolicy(BMAP_DRIVING_POLICY_LEAST_DISTANCE);
             } else if (policy == "AVOID_HIGHWAYS")//避开高速
             {
                 driving.setPolicy(BMAP_DRIVING_POLICY_AVOID_HIGHWAYS);
             }
             driving.search(p1, p2, {waypoints: waypoints});
             return driving;
 
         },
 
         /**
          *
          *步行路行规划
          *@param p1 起点
          *@param p1 终点
          *@param waypoints 途经点
          */
         walkingRoute: function (p1, p2, waypoints, autoMarker) {
             //marker点设置的回调函数，去除起点和终点marker
             var markersSet = function (results) {
                 if (autoMarker == true) {
                     for (var i = 0; i < results.length; i++) {
                         map.removeAppiontOverlay(results[i].marker);
                     }
                 }
             };
 
             var walking = new BMap.WalkingRoute(this.map, {
                 renderOptions: {
                     map: this.map,
                     autoViewport: true
                 },
                 onMarkersSet: markersSet
             });
             //多顺序点路径规划
             walking.search(p1, p2, {
                 waypoints: waypoints
             });
             return walking;
         },
         //---------------add by wangqy  end  ------------//
 
         /**
          *
          *公交路行规划
          *@param p1 起点
          *@param p1 终点
          *@param policy 最少时间0、最少换乘1、最少步行2、不乘地铁3
          *@param waypoints 途经点
          */
         transitRoute: function (policy, p1, p2, waypoints, autoMarker) {
             //marker点设置的回调函数，去除起点和终点marker
             var markersSet = function (results) {
                 if (autoMarker == true) {
                     for (var i = 0; i < results.length; i++) {
                         map.removeAppiontOverlay(results[i].marker);
                     }
                 }
             };
             var transit = new BMap.TransitRoute(this.map, {
                 renderOptions: {
                     map: this.map,
                     autoViewport: true
                 },
                 onMarkersSet: markersSet
             });
             if (policy == "LEAST_TIME")//时间最少
             {
                 transit.setPolicy(BMAP_TRANSIT_POLICY_LEAST_TIME);
             } else if (policy == "LEAST_TRANSFER")//最少换乘
             {
                 transit.setPolicy(BMAP_TRANSIT_POLICY_LEAST_TRANSFER);
             } else if (policy == "LEAST_WALKING")//最少步行
             {
                 transit.setPolicy(BMAP_TRANSIT_POLICY_LEAST_WALKING);
             } else if (policy == "AVOID_SUBWAYS")//不乘地铁
             {
                 transit.setPolicy(BMAP_TRANSIT_POLICY_AVOID_SUBWAYS);
             }
             transit.search(p1, p2, {
                 waypoints: waypoints
             });
             return transit;
         },
         //---------------add by wangqy  end  ------------//
 
         //---------------add by wangqy start------------//
         /**
          *
          *驾车路行规划
          *@paran driving DrivingRoute对象，由外部传入，可以控制历史路线显示删除问题
          *@param render 驾车路线的渲染样式
          *@param p1 起点
          *@param p1 终点
          *@param waypoints 途经点
          */
         drivingRouteOfRender: function (driving, render, p1, p2, waypoints) { //多点路径规划   add by wangqianqian 20160323
             //search完成后回调函数
             var searchComplete = function (results) {
                 if (driving.getStatus() != BMAP_STATUS_SUCCESS) {
                     return;
                 }
                 //解析路径信息，自定义渲染
                 var plan = results.getPlan(0);
                 for (var i = 0; i < plan.getNumRoutes(); i++) {
                     var path = plan.getRoute(i).getPath();
                     //如果没有设置渲染方式，则启用默认样式
                     if (eval(render) == undefined) {
                         render = {
                             strokeColor: 'green',
                             strokeOpacity: 0.7,
                             strokeWeight: 4,
                             strokeStyle: 'dashed'
                         };
                     }
                     var polyline = new BMap.Polyline(path, render);
                     this.map.addOverlay(polyline);
 
                     //绘制起点终点marker,貌似没效果，待研究
                     var marker1 = new MapCore.Marker(p1);
                     var marker2 = new MapCore.Marker(p2);
                     map.setMarkerIcon(marker1,
                         "gateWayAddressnbcbimages/startMarker.png");
                     map.setMarkerIcon(marker2,
                         "gateWayAddressnbcbimages/endMarker.png");
 
                     map.addMarker(marker1);
                     map.addMarker(marker2);
                 }
             };
             //如果未传入driving对象，默认实例化
             if (eval(driving) == undefined) {
                 driving = new BMap.DrivingRoute(this.map, {
                     onSearchComplete: searchComplete
                 });
             }
             driving.search(p1, p2, {
                 waypoints: waypoints
             });
         },
         //---------------add by wangqy  start  ------------//
         /**
          *
          *步行路行规划
          *@paran walking WalkingRoute对象，由外部传入，可以控制历史路线显示删除问题
          *@param render 步行路线的渲染样式
          *@param p1 起点
          *@param p1 终点
          *@param waypoints 途经点
          */
         walkingRouteOfRender: function (walking, render, p1, p2, waypoints) {
             var searchComplete = function (results) {
                 if (walking.getStatus() != BMAP_STATUS_SUCCESS) {
                     return;
                 }
                 //解析路径信息，自定义渲染
                 var plan = results.getPlan(0);
                 for (var i = 0; i < plan.getNumRoutes(); i++) {
                     var path = plan.getRoute(i).getPath();
                     //如果没有设置渲染方式，则启用默认样式
                     var polyline = new BMap.Polyline(path, {
                         strokeColor: 'green',
                         strokeOpacity: 0.7,
                         strokeWeight: 4,
                         strokeStyle: 'dashed'
                     });
                     this.map.addOverlay(polyline);
                 }
             };
             if (walking == undefined || walking == null) {
                 walking = new BMap.WalkingRoute(this.map, {
                     onSearchComplete: searchComplete
                 });
             }
             walking.search(p1, p2, {
                 waypoints: waypoints
             });
         },
         //---------------add by wangqy  end  ------------//
         /**
          *
          *公交路行规划
          *@paran transit TransitRoute对象，由外部传入，可以控制历史路线显示删除问题
          *@param renderline 公交路线的渲染样式
          *@param renderroute 步行路线的渲染样式
          *@param p1 起点
          *@param p1 终点
          *@param waypoints 途经点
          */
         transitRouteOfRender: function (transit, renderline, renderroute, p1,
                                         p2, waypoints) {
             var searchComplete = function (results) {
                 if (transit.getStatus() != BMAP_STATUS_SUCCESS) {
                     return;
                 }
                 //解析路径信息，自定义渲染
                 var plan = results.getPlan(0);
                 //获取所有公交线路，线路distance>0,地图绘制
                 for (var i = 0; i < plan.getNumLines(); i++) {
                     var path = plan.getLine(i).getPath();
                     //如果没有设置渲染方式，则启用默认样式
                     if (eval(renderline) == undefined) {
                         renderline = {
                             strokeColor: 'blue',
                             strokeOpacity: 0.5,
                             strokeWeight: 4
                         };
                     }
                     var polyline = new BMap.Polyline(path, renderline);
                     this.map.addOverlay(polyline);
                 }
                 //获取所有步行线路，线路distance>0,地图绘制
                 for (var i = 0; i < plan.getNumRoutes(); i++) {
                     if (plan.getRoute(i).getDistance(false) > 0) {
                         var path = plan.getRoute(i).getPath();
                         if (eval(renderroute) == undefined) {
                             renderroute = {
                                 strokeColor: 'green',
                                 strokeOpacity: 0.7,
                                 strokeWeight: 4,
                                 strokeStyle: 'dashed'
                             };
                         }
                         var polyline = new BMap.Polyline(path, renderroute);
                         this.map.addOverlay(polyline);
                     }
                 }
             };
             if (transit == undefined || transit == null) {
                 transit = new BMap.TransitRoute(this.map, {
                     onSearchComplete: searchComplete
                 });
             }
             transit.search(p1, p2, {
                 waypoints: waypoints
             });
         },
         //---------------add by wangqy  end  ------------//
 
         //---------------add by wangqianqian  20151117  ------------//
         //---------------add by czh  20151117  begin------------//
         /**
          *
          *去除路网
          *
          */
         clearRoad: function () { //打开信息窗口
             this.map.setMapStyle({
                 styleJson: [{
                     "featureType": "road",
                     "elementType": "all",
                     "stylers": {
                         "visibility": "off"
                     }
                 }, {
                     "featureType": "water",
                     "elementType": "all",
                     "stylers": {
                         "visibility": "on"
                     }
                 }, {
                     "featureType": "boundary",
                     "elementType": "all",
                     "stylers": {
                         "visibility": "on"
                     }
                 }
 
                 ]
             });
         },
         /**
          * 获取简易行政区边界
          */
         getBoundary: function (options, callback) {
             callback = callback || function () {
             };
             var map = this.map;
             var bdary = new BMap.Boundary();
             var area = options.area;
             var point1;
             var style = options.style || {strokeWeight: 2, strokeColor: '#ff0000', fillColor: '', fillOpacity: '0'};
             bdary.get(area, function (rs) {
                 if (options.callBackFun && typeof options.callBackFun === "function") {
                     bdary.get(area, options.callBackFun(rs));
                     return;
                 }
                 var count = rs.boundaries.length;
                 if (count === 0) {
                     //console.log('未能获取当前输入的行政区域');
                     return;
                 }
                 var pointArray = [];
                 for (var i = 0; i < count; i++) {
                     var ply = new BMap.Polygon(rs.boundaries[i], style);
                     pointArray = pointArray.concat(ply.getPath());
                     map.addOverlay(ply);
                 }
                 //得到行政区的形状中心点 centerPoint
                 if (options.ifGetCenter) {
                     for (var i = 0; i < count; i++) {
                         var pt = rs.boundaries[i].split(";")
                         var lntSum = 0.00;
                         var latSum = 0.00;
                         var pointLength = pt.length;
                         for (var j = 0; j < pointLength; j++) {
                             lntSum += parseFloat(pt[j].split(",")[0]);
                             latSum += parseFloat(pt[j].split(",")[1]);
                         }
                         options.centerPoint = new MapCore.Point([lntSum / pointLength, latSum / pointLength]);
                         callback(options);
                     }
                 }
             })
         },
         setViewportOfDistrict: function (options) {
             var map = this.map;
             var bdary = new BMap.Boundary();
             var area = options.area;
             bdary.get(area, function (rs) {
                 var count = rs.boundaries.length;
                 if (count === 0) {
                     //alert('未能获取当前输入的行政区域');
                     return;
                 }
                 var pointArray = [];
                 for (var i = 0; i < count; i++) {
                     var ply = new BMap.Polygon(rs.boundaries[i], null);
                     pointArray = pointArray.concat(ply.getPath());
                 }
                 map.setViewport(pointArray);
             })
         },
         getBounds: function () { //返回地图的可视区域，以地理坐标标示
             return this.map.getBounds();
         },
         /**
          * 根据坐标获得，地址详细信息
          * @param point    坐标点
          * @param callback    回调函数，返回地址详细信息
          * @return
          */
         getLocation: function (point, callback) {
             var geoc = new BMap.Geocoder();
             var addComp;
             geoc.getLocation(point, function (rs) {
                 addComp = rs.addressComponents;
                 callback(addComp);
             });
             //			if (addComp == undefined ){
             //				//alert("根据坐标获取地址信息失败");
             //				return false;
             //			}
 
         },
         /**
          * 根据地址信息获取坐标点
          * @param addressName    地址信息
          * @param callback        返回坐标点的回调函数
          * @return
          */
         getPointByAddressName: function (data, callback) {
             var geoc = new BMap.Geocoder();
             geoc.getPoint(data.AddressName, function (point) {
                 if (point) {
                     //alert();
                     data.point = point;
                     callback(data);
                 } else {
                     alert("您选择的地址没有解析结果。");
                 }
             });
         },
         //add by wangqy
         getCopyrightControl: function (position) {
             if (eval(position) == undefined) {
                 position = {
                     anchor: BMAP_ANCHOR_BOTTOM_RIGHT
                 };
             }
             return new BMap.CopyrightControl(position);
         },
 
         getNavigationControl: function () {
             return new BMap.NavigationControl({
                 type: BMAP_NAVIGATION_CONTROL_SMALL
             });
         },
         addCopyright: function (control, id, legendText, bs) {
             control.addCopyright({
                 id: id,
                 content: legendText,
                 bounds: bs
             });
         },
         removeCopyright: function (control, id) {
             control.removeCopyright(id);
         },
         /**
          * 在行政区上添加颜色块覆盖物
          * @param name  行政区域名称
          * @param fillColor 要填充的颜色
          * @param text  提示信息框的文本HTML
          * @return
          */
         setBound: function (data, Mapfunction1, conditionString, Mapfunction2,
                             fillOpacityNum, isMouseout) {
             var type = data[0].type;
             for (var j = 0; j < data.length; j++) {
                 var bdname = data[j].area;
                 var gdname = data[j].GDarea;
                 var color = data[j].color;
                 var totalCount = data[j].totalCount;
                 var totalValue = data[j].totalValue;
                 var text = null;
                 if (type == "1" && totalCount != "0") {
                     text = bdname + "</br>" + conditionString + ":"
                         + format(Math.round(totalCount), 3, ',');
                     this.getBdaryData(bdname, color, text, Mapfunction1,
                         Mapfunction2, fillOpacityNum, isMouseout);
                 } else if (type == "2" && totalValue != "0") {
                     text = bdname + "</br>" + conditionString + ":"
                         + format(Math.round(totalValue), 3, ',');
                     this.getBdaryData(bdname, color, text, Mapfunction1,
                         Mapfunction2, fillOpacityNum, isMouseout);
                 } else if (type == "3" && totalValue != "0") {
                     text = bdname + "</br>" + conditionString + ":"
                         + (parseFloat(totalValue)).toFixed(2) + "%";
                     this.getBdaryData(bdname, color, text, Mapfunction1,
                         Mapfunction2, fillOpacityNum, isMouseout);
                 }
             }
         },
         getBdaryData: function (bdname, color, text, Mapfunction1,
                                 Mapfunction2, fillOpacityNum, isMouseout) { //setBound的内部调用方法，不作为单独的方法使用
             var bdary = new BMap.Boundary();
             bdary.get(bdname, function (rs) {
                 var count = rs.boundaries.length;
                 if (count == 0) {
                     if (typeof (Mapfunction2) == 'function') {
                         Mapfunction2(bdname, null);
                     }
                     return;
                 }
                 var pointArray = [];
                 for (var i = 0; i < count; i++) {
                     var ply = new BMap.Polygon(rs.boundaries[i], {
                         strokeWeight: 2,
                         strokeColor: "#000000"
                     });
                     ply.setFillColor(color);
                     if (typeof (fillOpacityNum) == 'number') {
                         ply.setFillOpacity(fillOpacityNum);
                     }
                     this.map.addOverlay(ply);
                     if (text != null || text != undefined) {
                         map.polygonAddMouse(text, ply, isMouseout);
                     }
                     pointArray = pointArray.concat(ply.getPath());
                     if (typeof (Mapfunction2) == 'function') {
                         Mapfunction2(bdname, pointArray);
                     }
                 }
             });
         },
         polygonAddMouse: function (text, polygon, isMouseout) { //setBound的内部调用方法，不作为单独的方法使用
             polygon.addEventListener("mouseover", function (e) {
                 console.log("########### polygonAddMouse  ----> ");
                 var opts1 = {
                     width: 120, // 信息窗口宽度
                     enableMessage: true
                     //设置允许信息窗发送短息
                 };
                 //开启信息窗口
                 var infoWindow = map.addTextInfoWindow(text, opts1);
                 this.map.openInfoWindow(infoWindow, e.point);
             });
             if (typeof (isMouseout) == 'boolean' && isMouseout) {
                 polygon.addEventListener("mouseout", function (e) {
                     this.map.closeInfoWindow();
                 });
             }
         },
         /**
          * 根据地区名划边框
          * @param name 行政区域名称
          * @param tzmap 地图对象
          * @return
          */
         setChineseMapBorder: function (name, Mapfunction1, Mapfunction2) {
             var bdary = new BMap.Boundary();
             bdary.get(name, function (rs) {
                 var count = rs.boundaries.length;
                 if (count == 0) {
                     return;
                 }
                 for (var i = 0; i < count; i++) {
                     var ply = new BMap.Polygon(rs.boundaries[i], {
                         strokeWeight: 2,
                         strokeColor: "#ff0000"
                     });
                     ply.setFillColor(null);
                     this.map.addOverlay(ply);
                     var pointArray = ply.getPath();
                     if (typeof (Mapfunction2) == 'function') {
                         Mapfunction2(name, pointArray, ((i + 1) == count));
                     }
                 }
             });
         },
         /**
          * 在行政区上添加颜色块覆盖物
          * @param name  行政区域名称
          * @param fillColor 要填充的颜色
          * @param text  提示信息框的文本HTML
          * @return
          */
         /** setBound:function(name,gdname, fillColor, text,tzmap,Mapfunction1) {
             var bdary = new BMap.Boundary();
             var Bounmap = '';
             var setX = 30;
             var opts1 = {
                     width : 120,     // 信息窗口宽度
                     enableMessage:true//设置允许信息窗发送短息
                 };
 
             bdary.get(name, function(rs) {
                 var count = rs.boundaries.length;
                 if (count == 0) {
                     return;
                 }
                 var pointArray = [];
                 for ( var i = 0; i < count; i++) {
                     var ply = new BMap.Polygon(rs.boundaries[i], {
                         strokeWeight : 2,
                         strokeColor : "#000000"
                     });
                     ply.setFillColor(fillColor);
                     tzmap.addOverlay(ply);
                     pointArray = pointArray.concat(ply.getPath());
                     if(text!=null||text!=undefined){
                         ply.addEventListener("mouseover", function(e) {
                             var infoWindow = map.addTextInfoWindow(text,opts1);
                             tzmap.openInfoWindow(infoWindow,e.point);
 
                         });
                     }
                 }
             });
         },**/
         /**
          * 根据地区名划边框
          * @param name 行政区域名称
          * @param tzmap 地图对象
          * @return
          */
         /** setChineseMapBorder:function(name,tzmap,Mapfunction1,text) {
             var bdary = new BMap.Boundary();
             var Bounmap = '';
             var setX = 30;
             bdary.get(name, function(rs) {
                 var count = rs.boundaries.length;
                 if (count == 0) {
                     return;
                 }
                 var pointArray = [];
                 for ( var i = 0; i < count; i++) {
                     var ply = new BMap.Polygon(rs.boundaries[i], {
                         strokeWeight : 2,
                         strokeColor : "#ff0000"
                     });
                     ply.setFillColor(null);
                     //ply.setFillColor(fillColor);
                     tzmap.addOverlay(ply);
                     pointArray = pointArray.concat(ply.getPath());
                 }
             });
         },    **/
         /**
          * 创建菜单控件
          * @param map 要加载菜单的地图对象
          * @param dom 菜单元素HTML
          * @return
          */
         createMenuControl: function (map, paradom, position) {
 
             //返回上一级按钮菜单，默认在右上角显示
             function ZoomControl() {
                 this.defaultAnchor = BMAP_ANCHOR_TOP_RIGHT;
                 this.defaultOffset = new BMap.Size();
             }
 
             ZoomControl.prototype = new BMap.Control();
             ZoomControl.prototype.initialize = function () {
                 map.getContainer().appendChild(paradom);
                 return paradom;
             };
             var myZoomCtrl = new ZoomControl();
             map.addControl(myZoomCtrl);
         },
 
         /**
          * 地图事件，目前仅提供返回Point
          * @param callbackName 事件名
          * @param callback  回调函数
          * @return
          */
         addEventListener: function (callbackName, callback) { //启用缩放
             var a;//
             if (typeof callbackName == "string") {
                 if (typeof callback == "function") {
                     this.map.addEventListener(callbackName, function (e) {
                         //alert(e.point.lng+","+e.point.lat);
                         if (e.point != undefined) {
                             a = MapCore
                                 .Point([e.point.lng, e.point.lat]);
                             callback(a);
                         } else {
                             callback(e);
                         }
                     });
 
                 } else {
                     alert("callback不是一个函数");
                 }
             } else {
                 alert("callbackName不是string类型");
             }
         },
         /**
          * 添加热力图
          * data 点坐标集合
          * var data = [
          {"lng":116.418267,"lat":39.921984,"count":50},
          {"lng":116.423332,"lat":39.916532,"count":51},
          {"lng":116.419787,"lat":39.930658,"count":15},
          {"lng":116.418455,"lat":39.920921,"count":40},
          {"lng":116.418277,"lat":39.921989,"count":50},
          {"lng":116.423432,"lat":39.916432,"count":51},
          {"lng":116.419587,"lat":39.930558,"count":15},
          {"lng":116.418655,"lat":39.920621,"count":40},
          {"lng":116.418767,"lat":39.921784,"count":50},
          {"lng":116.423832,"lat":39.916832,"count":51},
          {"lng":116.419987,"lat":39.930958,"count":15},
          {"lng":116.418055,"lat":39.920021,"count":40}
          *           ];
          *visible 热力图是否显示，默认true
          *opacity 热力的透明度，1-100
          *radius 实力图的每个点的半径大小
          *gradient {JSON}热力图的肩膀、渐变区间，gradient如下所示
          *{
              .2:'rgb(0,225,255)',
              .5:'rgb(0,110,255)',
              .8:'rgb(100,0,255)'
 
            }
          其中key表示插值的位置，0～1.
          value 为颜色值。
          *
          */
         addHeatmap: function (data, radius, max) {
             if (!max) {
                 max = 100;
             }
             var mymap = this.map;
             var heatmapOverlay = new BMapLib.HeatmapOverlay({
                 "radius": radius
             });
             mymap.addOverlay(heatmapOverlay);
             heatmapOverlay.setDataSet({
                 data: data,
                 max: max
             });
             return heatmapOverlay;
         },
         /*
          @参数说明
          typeof data  is Array;经纬度存储
          例 data = [
          {"lng":116.418267,"lat":39.921984,"count":50},
          ]
          typeof  style is object ;热力图样式属性配置
          style：{
          *visible 热力图是否显示，默认true
          *opacity 热力的透明度，1-100
          *radius 实力图的每个点的半径大小
          *gradient {JSON}热力图的肩膀、渐变区间，gradient如下所示
          }
          typeof max is Number ；热力图marker的权重值
          */
         addHeatMapStyle: function (data, style, max) {
             if (!max) {
                 max = 100;
             }
             var mymap = this.map;
             var heatmapOverlay = new BMapLib.HeatmapOverlay(style);
             mymap.addOverlay(heatmapOverlay);
             heatmapOverlay.setDataSet({
                 data: data,
                 max: max
             });
             return heatmapOverlay;
         },
 
         /**
          * 添加地图绘制工具
          * anchor
          * offset
          * @return
          */
         addDrawingManager: function (fn, styleOption, mapObj) {
             var map = this
             var jsonObj = {};
             if (typeof fn === 'function') {
                 jsonObj.drawingFun = fn;
             } else {
                 if (fn) {
                     jsonObj = fn;
                     console.log('jsonObj--->', jsonObj)
                 }
             }
             var drawOverlys = [];
             var meMap = this;
             var key = 'addDrawingManager';
             var overlaycomplete = function (e) {
                 var strpoint = "";
                 if (e.overlay == undefined) {
                     return;
                 }
                 drawOverlys.push(e.overlay);
                 var callBackFn = function (e) {
                     var json;
                     if (e.drawingMode == 'circle') {//画圆
                         json = {
                             "type": e.drawingMode,
                             "point": {
                                 "lat": getCircle.getCenter().lat,
                                 "lng": getCircle.getCenter().lng,
                                 "lon": getCircle.getCenter().lng,
                                 "radius": getCircle.getRadius(),
                                 "provider": "baidu"
                             }
                         };
                         meMap.setMeMapValue(key, json);
                     } else {
                         var paths = e.overlay.getPath();
                         for (var i = 0; i < paths.length; i++) {//循环打印所有标志性坐标
                             if (i > 0) {
                                 strpoint += ",";
                             }
                             strpoint += (paths[i].lng + " , " + paths[i].lat);
                         }
                         json = {
                             "type": e.drawingMode,
                             "point": strpoint
                         };
                         meMap.setMeMapValue(key, json);
                     }
                     //			    if(fn){
                     //					fn(json);
                     //				}
                     if (jsonObj.drawingFun) {
                         jsonObj.drawingFun(json);
                     }
                 }
                 callBackFn(e);
                 meMap.editEventParam = e;
                 // 添加图形编辑菜单
                 var openEdit = function (e, ee, plane) {
                     plane.enableEditing(); // 启用编辑
                 }
                 // 关闭图形编辑菜单
                 var closeEdit = function (e, ee, plane) {
                     console.log(e);
                     console.log(ee);
                     console.log(plane);
                     plane.disableEditing(); // 停用编辑
                     meMap.editEventParam.overlay = plane;
                     callBackFn(meMap.editEventParam);
                 }
                 var menu = new BMap.ContextMenu();
                 menu.addItem(new BMap.MenuItem("编辑", openEdit.bind(e.overlay)));
                 menu.addItem(new BMap.MenuItem("关闭", closeEdit.bind(e.overlay)))
                 e.overlay.addContextMenu(menu);
 
 
                 //$("#resultpoint").val(strpoint);
                 //meMap.setMeMapValue(key,json);
             };
 
             var styleOptions = {
                 fillColor: "blue",
                 strokeWeight: 1,
                 fillOpacity: 0.3,
                 strokeOpacity: 0.3
             };
             var drawingCover = jsonObj.drawingCover;
             var drawingMultiple = jsonObj.drawingMultiple;
             var drawingModes = jsonObj.drawingModes || [BMAP_DRAWING_CIRCLE, BMAP_DRAWING_POLYGON, BMAP_DRAWING_CIRCLEEX];
             var anchor = jsonObj.anchor || BMAP_ANCHOR_TOP_LEFT;
             //实例化鼠标绘制工具
 
             var drawingManager = new BMapLib.DrawingManager(this.map, {
                 isOpen: false, //是否开启绘制模式
                 enableDrawingTool: true, //是否显示工具栏
                 drawingToolOptions: {
                     drawingModes: [
                         // BMAP_DRAWING_CIRCLE,
                         BMAP_DRAWING_POLYGON,
                         BMAP_DRAWING_POLYLINE
                     ],
                     anchor:
                         styleOptions.anchor || styleOptions.anchor == 0
                             ? styleOptions.anchor
                             : BMAP_ANCHOR_TOP_RIGHT, //位置
                     offset:
                         styleOptions.offsetX || styleOptions.offsetY != 0
                             ? new BMap.Size(styleOptions.offsetX, styleOptions.offsetY)
                             : new BMap.Size(0, 0), //偏离值
                     scale: 0.6 //工具栏缩放比例
                 },
 
                 circleOptions: styleOptions, //圆的样式
                 polylineOptions: styleOptions, //线的样式
                 polygonOptions: styleOptions, //多边形的样式
                 rectangleOptions: styleOptions //矩形的样式
             })
             this.drawingManager_baidu = drawingManager;
             //添加鼠标绘制工具监听事件，用于获取绘制结果
             drawingManager.addEventListener('overlaycomplete', overlaycomplete);
 
             //"circlecomplete"绘制圆完成后，派发的事件接口
             drawingManager.addEventListener("circlecomplete", function (e, overlay) {
                 getCircle = overlay;
                 map.panTo(getCircle.getCenter());
                 //关闭
                 drawingManager.close();
             });
 
             //"polygoncomplete"画多边形
             drawingManager.addEventListener("polygoncomplete", function (e, overlay) {
                 if (overlay.getPath()) {
                     map.panTo(overlay.getPath()[0]);
                 }
                 //关闭
                 drawingManager.close();
             });
             //"polygoncomplete"画多边形
             drawingManager.addEventListener("polygoncomplete", function (e, overlay) {
                 if (overlay.getPath()) {
                     map.panTo(overlay.getPath()[0]);
                 }
                 //关闭
                 drawingManager.close();
             });
             //"polygoncomplete"画线
             drawingManager.addEventListener("polylinecomplete", function (e, overlay) {
                 if (overlay.getPath()) {
                     map.panTo(overlay.getPath()[0]);
                 }
                 //关闭
                 drawingManager.close();
             });
             //"polygoncomplete"画长方形
             drawingManager.addEventListener("rectanglecomplete", function (e, overlay) {
                 if (overlay.getPath()) {
                     map.panTo(overlay.getPath()[0]);
                 }
                 //关闭
                 drawingManager.close();
             });
 
             // 初始化一个圈
             drawingManager.initDrawCircle(jsonObj.initDrawOpts);
 
             //设置关闭按钮
             if (jsonObj.showClose == undefined || jsonObj.showClose == true) {
                 var closeDiv = document.createElement("div");
                 closeDiv.appendChild(document.createTextNode("关闭"));
                 //设置样式
                 closeDiv.style.position = 'absolute';
                 closeDiv.style.cursor = "pointer";
                 closeDiv.style.padding = '5 5 2 5';
                 closeDiv.style.right = 'auto';
                 closeDiv.style.width = '40px';
                 closeDiv.style.height = '30px';
                 closeDiv.style.color = '#0099FF';
                 closeDiv.fontSize = '5px';
                 closeDiv.style.fontWeight = 'bold';
                 closeDiv.style.backgroundColor = "#ffffff";
                 closeDiv.style.borderRadius = "5px";
                 closeDiv.style.border = "1px solid gray";
                 closeDiv.style.top = "0px";
                 closeDiv.style.left = "150px";
                 closeDiv.className = 'closeDiv';
                 /**
                  *
                  * border: 1px solid gray; z-index: 10; bottom: auto; top: 0px; left: 160px;
                  *
                  *
                  */
                 closeDiv.onclick = function (e) {
                     if (!jsonObj.isNoRunClose) {
                         map.clearOverlays();
                         drawingManager.close();
                     }
                     if (jsonObj.closeFun) {
                         jsonObj.closeFun(e);
                     }
                     meMap.meMapValue = {};
                 };
                 //创建菜单
                 map.createDivControl(map.map, closeDiv, 235, 8);
             }
 
             //设置清除按钮       ----renbw
             if (jsonObj.showClear != undefined && jsonObj.showClear == true) {
                 var clearDiv = document.createElement("div");
                 clearDiv.appendChild(document.createTextNode("清除"));
                 //设置样式
                 clearDiv.style.position = 'absolute';
                 clearDiv.style.cursor = "pointer";
                 clearDiv.style.padding = '5 5 2 5';
                 clearDiv.style.right = 'auto';
                 clearDiv.style.width = '40px';
                 clearDiv.style.height = '30px';
                 clearDiv.style.color = '#0099FF';
                 clearDiv.fontSize = '5px';
                 clearDiv.style.fontWeight = 'bold';
                 clearDiv.style.backgroundColor = "#ffffff";
                 clearDiv.style.borderRadius = "5px";
                 clearDiv.style.border = "1px solid gray";
                 clearDiv.style.top = "0px";
                 clearDiv.style.left = "150px";
                 clearDiv.className = 'clearDiv';
                 clearDiv.onclick = function (e) {
                     if (!jsonObj.isNoRunClose) {
                         // var array = map.getOverlays();
                         var array = drawOverlys;
                         for (var index in array) {
                             if (array[index]) {
                                 map.removeOverlay(array[index]);
                             }
                         }
                         drawingManager.close();
                     }
                     if (jsonObj.closeFun) {
                         jsonObj.closeFun(e);
                     }
                     meMap.meMapValue = {};
                 };
                 //创建菜单
                 map.createDivControl(map.map, clearDiv, 305, 8);
             }
             return drawingManager
         },
         // addDrawingManager: function (fn, styleOptions) {
         //     var jsonObj = {}
         //     if (typeof fn === 'function') {
         //         jsonObj.drawingFun = fn
         //     } else {
         //         if (fn) {
         //             jsonObj = fn
         //         }
         //     }
         //
         //     var meMap = this
         //     var key = 'addDrawingManager'
         //     var poly
         //
         //     var overlaycomplete = function (e, fnOverlay) {
         //         //e.overlay.enableEditing();
         //         poly = e.overlay
         //         //设置右键菜单
         //         var txtMenuItem = [
         //             /*{
         // 			text:'编辑',
         // 		  	callback:function(e,ee,pl){
         // 		  		poly.enableEditing();
         // 			}
         // 		}*/
         //         ]
         //         var markerMenu = new BMap.ContextMenu() //右击事件
         //         for (var i = 0; i < txtMenuItem.length; i++) {
         //             markerMenu.addItem(
         //                 new BMap.MenuItem(txtMenuItem[i].text, txtMenuItem[i].callback, {
         //                     width: 100
         //                 })
         //             )
         //         }
         //         e.overlay.addContextMenu(markerMenu)
         //
         //         var strpoint = ''
         //         if (e.overlay == undefined) {
         //             return
         //         }
         //         var json
         //         if (e.drawingMode == 'circle') {
         //             //画圆
         //             json = {
         //                 overlay: fnOverlay,
         //                 e: e,
         //                 type: e.drawingMode,
         //                 point: {
         //                     lat: getCircle.getCenter().lat,
         //                     lng: getCircle.getCenter().lng,
         //                     lon: getCircle.getCenter().lng,
         //                     radius: getCircle.getRadius(),
         //                     provider: 'baidu'
         //                 }
         //             }
         //             meMap.setMeMapValue(key, json)
         //         } else {
         //             var paths = overlay.getPath()
         //             for (var i = 0; i < paths.length; i++) {
         //                 //循环打印所有标志性坐标
         //                 if (i > 0) {
         //                     strpoint += ','
         //                 }
         //                 strpoint += paths[i].lng + ' , ' + paths[i].lat
         //             }
         //             json = {type: e.drawingMode, point: strpoint, overlay: fnOverlay}
         //             meMap.setMeMapValue(key, json)
         //         }
         //         //			    if(fn){
         //         //					fn(json);
         //         //				}
         //         if (jsonObj.drawingFun) {
         //             jsonObj.drawingFun(json)
         //         }
         //
         //         //$("#resultpoint").val(strpoint);
         //         meMap.setMeMapValue(key, json)
         //     }
         //
         //     if (!styleOptions) {
         //         styleOptions = {
         //             fillColor: 'blue',
         //             strokeWeight: 1,
         //             fillOpacity: 0.3,
         //             strokeOpacity: 0.3
         //         }
         //     }
         //     //实例化鼠标绘制工具
         //     var drawingManager = new BMapLib.DrawingManager(this.map, {
         //         isOpen: false, //是否开启绘制模式
         //         enableDrawingTool: true, //是否显示工具栏
         //         drawingToolOptions: {
         //             drawingModes: [
         //                 // BMAP_DRAWING_CIRCLE,
         //                 BMAP_DRAWING_POLYGON,
         //                 BMAP_DRAWING_POLYLINE
         //             ],
         //             anchor:
         //                 styleOptions.anchor || styleOptions.anchor == 0
         //                     ? styleOptions.anchor
         //                     : BMAP_ANCHOR_TOP_RIGHT, //位置
         //             offset:
         //                 styleOptions.offsetX || styleOptions.offsetY != 0
         //                     ? new BMap.Size(styleOptions.offsetX, styleOptions.offsetY)
         //                     : new BMap.Size(0, 0), //偏离值
         //             scale: 0.6 //工具栏缩放比例
         //         },
         //
         //         circleOptions: styleOptions, //圆的样式
         //         polylineOptions: styleOptions, //线的样式
         //         polygonOptions: styleOptions, //多边形的样式
         //         rectangleOptions: styleOptions //矩形的样式
         //     })
         //     //添加鼠标绘制工具监听事件，用于获取绘制结果
         //     drawingManager.addEventListener('overlaycomplete', overlaycomplete)
         //
         //     //"circlecomplete"绘制圆完成后，派发的事件接口
         //     drawingManager.addEventListener('circlecomplete', function (e, overlay) {
         //         getCircle = overlay
         //         map.panTo(getCircle.getCenter())
         //         //关闭
         //         drawingManager.close()
         //     })
         //
         //     //"polygoncomplete"画多边形
         //     drawingManager.addEventListener('polygoncomplete', function (e, overlay) {
         //         if (overlay.getPath()) {
         //             // this.map.panTo(overlay.getPath()[0]);
         //         }
         //         //关闭
         //         drawingManager.close()
         //     })
         //
         //     //"polygoncomplete"画线
         //     drawingManager.addEventListener('polylinecomplete', function (e, overlay) {
         //         if (overlay.getPath()) {
         //             // map.panTo(overlay.getPath()[0])
         //         }
         //         //关闭
         //         drawingManager.close()
         //     })
         //     //"polygoncomplete"画长方形
         //     drawingManager.addEventListener('rectanglecomplete', function (
         //         e,
         //         overlay
         //     ) {
         //         if (overlay.getPath()) {
         //             map.panTo(overlay.getPath()[0])
         //         }
         //         //关闭
         //         drawingManager.close()
         //     })
         //     //BMapLib_box  BMapLib_last
         //     var closeHtml =
         //         '<a id="_closeDivID" class=" closeMenuDiv" style="background:#999"  href=" " title="关闭">关闭</ a>'
         //     $('.BMapLib_Drawing_panel').append(closeHtml)
         //     $('#_closeDivID').click(function (e) {
         //         if (!jsonObj.isNoRunClose) {
         //             map.clearOverlays()
         //             drawingManager.close()
         //         }
         //         if (jsonObj.closeFun) {
         //             jsonObj.closeFun(e)
         //         }
         //         meMap.meMapValue = {}
         //     })
         //
         //     /* var closeDiv = document.createElement("div");
         //     closeDiv.appendChild(document.createTextNode("关闭"));
         //   //设置样式
         //     closeDiv.style.position = 'absolute';
         //     closeDiv.style.cursor = "pointer";
         // 	closeDiv.style.padding = '5 5 2 5';
         //     closeDiv.style.right = 'auto';
         //     closeDiv.style.width = '40px';
         //     closeDiv.style.height = '30px';
         //     closeDiv.style.color = '#0099FF';
         //     closeDiv.fontSize = '5px';
         // 	closeDiv.style.fontWeight = 'bold';
         // 	closeDiv.style.backgroundColor = "#ffffff";
         // 	closeDiv.style.borderRadius = "5px";
         // 	closeDiv.style.border = "1px solid gray";
         // 	closeDiv.style.top = "0px";
         // 	closeDiv.style.left = "150px";
         // 	closeDiv.className = 'closeDiv';
         // 	closeDiv.onclick = function(e) {
         // 		if(!jsonObj.isNoRunClose){
         // 			map.clearOverlays();
         // 			drawingManager.close();
         // 		}
         // 		if(jsonObj.closeFun){
         //         	jsonObj.closeFun(e);
         //         }
         // 		meMap.meMapValue={};
         //     };*/
         //     /* //创建菜单
         //      map.createDivControl(map.map,closeDiv,235,8);*/
         //     return drawingManager
         // },
         /**
          * 外部调用绘图工具
          */
         addDrawingManager_outer: function (fn) {
             var jsonObj = {};
             if (typeof fn === 'function') {
                 jsonObj.drawingFun = fn;
             } else {
                 if (fn) {
                     jsonObj = fn;
                 }
             }
             //var options = jsonObj;
             //var container = this.mapDivId;
             //var drawingManager_gaode = new DrawingManager_gaode(meMap, options, container);
             this.drawingManager_baidu._outerClickDrawing("CircleEx");
         },
         clearDrawingManager_outer: function () {
             this.drawingManager_baidu._outerCloseDrawing(); //_close;
         },
         /**
          * 添加地图绘制工具
          * @param inputId 检索框id
          */
         addDrawingCircle: function (inputId) {
             var myMap = this.map;
             var getCircle;
             var CircleObj = "";
             var overlays = [];
             var menu = new BMap.ContextMenu();
             //右键清除菜单
             var txtMenuItem = [{
                 text: '清除',
                 callback: function (e) {
                     //清空检索框id值
                     if (inputId != "") {
                         $("#" + inputId).val("");
                     }
                     //清除覆盖物
                     for (var i = 0; i < overlays.length; i++) {
                         map.removeAppiontOverlay(overlays[i]);
                     }
                     overlays.length = 0;
                     //关闭绘图工具
                     drawingManager.close();
                 }
             }];
             for (var i = 0; i < txtMenuItem.length; i++) {
                 menu.addItem(new BMap.MenuItem(txtMenuItem[i].text,
                     txtMenuItem[i].callback, 100));
             }
             //增加到地图右键菜单
             myMap.addContextMenu(menu);
             //设置画圆样式
             var styleOptions = {
                 fillColor: "blue",
                 strokeWeight: 1,
                 fillOpacity: 0.3,
                 strokeOpacity: 0.3
             };
             var closeDiv = document.createElement("div");
             closeDiv.appendChild(document.createTextNode("关闭"));
             //设置样式
             closeDiv.style.position = 'absolute';
             closeDiv.style.cursor = "pointer";
             //closeDiv.style.left = '120px';
             //closeDiv.style.margin = '0px 0px 0px 25px';
             closeDiv.style.padding = '5 5 2 5';
             closeDiv.style.right = 'auto';
             closeDiv.style.width = '40px';
             closeDiv.style.height = '30px';
             closeDiv.style.color = '#0099FF';
             closeDiv.fontSize = '7px';
             closeDiv.style.fontWeight = 'bold';
             closeDiv.style.backgroundColor = "#ffffff";
             closeDiv.style.borderRadius = "5px";
             closeDiv.style.border = "1px solid gray";
             closeDiv.className = 'closeDiv';
             closeDiv.onclick = function (e) {
                 //清空检索框id值
                 if (inputId != "") {
                     $("#" + inputId).val("");
                 }
                 //清除覆盖物
                 //map.clearOverlays();
                 for (var i = 0; i < overlays.length; i++) {
                     map.removeAppiontOverlay(overlays[i]);
                 }
                 overlays.length = 0;
                 //关闭绘图工具
                 drawingManager.close();
             };
             //创建菜单
             map.createDivControl(myMap, closeDiv);
             //实例化鼠标绘制工具
             var drawingManager = new BMapLib.DrawingManager(myMap, {
                 isOpen: false, //是否开启绘制模式
                 enableDrawingTool: true, //是否显示工具栏
                 drawingToolOptions: {
                     anchor: BMAP_ANCHOR_TOP_LEFT, //位置
                     offset: new BMap.Size(5, 5), //偏离值
                     drawingModes: [BMAP_DRAWING_CIRCLE],
                     scale: 0.6
                     //工具栏缩放比例
                 },
                 circleOptions: styleOptions
                 //圆的样式
             });
             //"circlecomplete"绘制圆完成后，派发的事件接口
             drawingManager.addEventListener("circlecomplete", function (e,
                                                                         overlay) {
                 /*for(var i = 0;i < overlays.length;i++){
                  map.removeAppiontOverlay(overlays[i]);
                  }*/
                 overlays.push(overlay);
                 //console.log("Radius:"+overlay.getRadius());
                 //console.log("Center:"+overlay.getCenter());
                 getCircle = overlay;
                 map.panTo(getCircle.getCenter());
                 //得到圆的中心点坐标(纬度)
                 CircleObj = "lat=" + getCircle.getCenter().lat + "&";
                 //得到圆的中心点坐标(经度)
                 CircleObj += "lng=" + getCircle.getCenter().lng + "&";
                 //得到圆的半径
                 CircleObj += "radius=" + getCircle.getRadius() + "&";
                 //地图服务商名
                 CircleObj += "provider=baidu";
                 if (inputId != "") {
                     var input = $("#" + inputId);
                     //把得到的圆的中心点坐标和半径赋予检索框值中，用来设置检索条件
                     input.val(CircleObj);
                     //console.log("inputValue:"+input.val());
                 }
                 //关闭
                 drawingManager.close();
             });
 
             //"polygoncomplete"绘制圆完成后，派发的事件接口
             drawingManager.addEventListener("polygoncomplete", function (e,
                                                                          overlay) {
                 getCircle = overlay;
                 map.panTo(getCircle.getCenter());
 
                 //关闭
                 drawingManager.close();
             });
         },
         /**
          * 添加地图绘制工具--为E销定制
          * @param inputId 检索框id
          * @param keepCircle 初始化圆信息，不删除
          */
         addDrawingCircleByExiao: function (inputId, keepCircle) {
             var myMap = this.map;
             var getCircle;
             var CircleObj = "";
             var overlays = [];
             //设置画圆样式
             var styleOptions = {
                 fillColor: "blue",
                 strokeWeight: 1,
                 fillOpacity: 0.3,
                 strokeOpacity: 0.3
             };
 
             //设置关闭按钮
             var closeDiv = document.createElement("div");
             closeDiv.appendChild(document.createTextNode("关闭"));
             //设置样式
             closeDiv.style.position = 'absolute';
             closeDiv.style.cursor = "pointer";
             //closeDiv.style.left = '120px';
             //closeDiv.style.margin = '0px 0px 0px 25px';
             closeDiv.style.padding = '2 5 2 5';
             closeDiv.style.right = 'auto';
             closeDiv.style.width = '35px';
             closeDiv.style.height = '24px';
             closeDiv.style.color = '#0099FF';
             closeDiv.fontSize = '7px';
             closeDiv.style.fontWeight = 'bold';
             closeDiv.style.backgroundColor = "#ffffff";
             closeDiv.style.borderRadius = "5px";
             closeDiv.style.border = "1px solid gray";
             closeDiv.className = 'closeDiv';
             closeDiv.onclick = function (e) {
                 //清空检索框id值
                 if (inputId != "") {
                     $("#" + inputId).val("");
                 }
                 //清除覆盖物
                 map.removeAppiontOverlay(keepCircle);
                 //关闭绘图工具
                 drawingManager.close();
                 map.addOverlay(keepCircle);
             };
             //创建菜单
             map.createDivControl(myMap, closeDiv);
 
             //实例化鼠标绘制工具
             var drawingManager = new BMapLib.DrawingManager(myMap, {
                 isOpen: false, //是否开启绘制模式
                 enableDrawingTool: true, //是否显示工具栏
                 drawingToolOptions: {
                     anchor: BMAP_ANCHOR_TOP_LEFT, //位置
                     offset: new BMap.Size(5, 5), //偏离值
                     drawingModes: [BMAP_DRAWING_CIRCLE],
                     scale: 0.6
                     //工具栏缩放比例
                 },
                 circleOptions: styleOptions
                 //圆的样式
             });
             //"circlecomplete"绘制圆完成后，派发的事件接口
             drawingManager.addEventListener("circlecomplete", function (e,
                                                                         overlay) {
                 /*for(var i = 0;i < overlays.length;i++){
                  map.removeAppiontOverlay(overlays[i]);
                  }*/
                 overlays.push(overlay);
                 //console.log("Radius:"+overlay.getRadius());
                 //console.log("Center:"+overlay.getCenter());
                 getCircle = overlay;
                 map.panTo(getCircle.getCenter());
                 //得到圆的中心点坐标(维度)
                 CircleObj = "lat=" + getCircle.getCenter().lat + "&";
                 //得到圆的中心点坐标(经度)
                 CircleObj += "lng=" + getCircle.getCenter().lng + "&";
                 //得到圆的半径
                 CircleObj += "radius=" + getCircle.getRadius() + "&";
                 //地图服务商名
                 CircleObj += "provider=baidu";
                 if (inputId != "") {
                     var input = $("#" + inputId);
                     //把得到的圆的中心点坐标和半径赋予检索框值中，用来设置检索条件
                     input.val(CircleObj);
                     //console.log("inputValue:"+input.val());
                 }
                 //关闭
                 drawingManager.close();
             });
         },
         /**
          * overlay 覆盖物
          * 删除指定覆盖物
          */
         removeAppiontOverlay: function (overlay) {
             if (overlay != undefined) {
                 this.map.removeOverlay(overlay);
             }
         },
 
         //wangqy
         /**
          * overlay 覆盖物
          * 获取覆盖物集合
          */
         getOverlays: function () {
             return this.map.getOverlays();
         },
 
         /**
          * 创建菜单控件
          * @param map 要加载菜单的地图对象
          * @param divDom 菜单元素HTML
          * @return
          */
         createDivControl: function (map, divDom, w, h) {
             //返回上一级按钮菜单，默认在右上角显示
             function ZoomControl() {
                 this.defaultAnchor = BMAP_ANCHOR_TOP_LEFT;
                 if (w && h) {
                     this.defaultOffset = new BMap.Size(w, h);
                 } else {
                     this.defaultOffset = new BMap.Size(120, 15);
                 }
             }
 
             ZoomControl.prototype = new BMap.Control();
             ZoomControl.prototype.initialize = function () {
                 map.getContainer().appendChild(divDom);
                 return divDom;
             };
             var myZoomCtrl = new ZoomControl();
             map.addControl(myZoomCtrl);
         },
         /**
          * 测试两点距离
          */
         getDistanceTool: function () {
             var myMap = this.map;
             var myDis = new BMapLib.DistanceTool(myMap);
             //开启鼠标测距
             myDis.open();
         },
         /**
          * 根据关键字检索
          * @param searchName 检索的关键字
          * @return
          */
         LocalSearch: function (searchName) {
             if (searchName == undefined || searchName == "") {
                 alert("检索的关键字不可为空！");
                 return;
             }
             var local = new BMap.LocalSearch(this.map, {
                 renderOptions: {
                     map: this.map
                 }
             });
             local.search(searchName);
         },
         /**
          * 根据关键字检索
          * @param searchName 检索的关键字
          * @return
          */
         LocalSearch2: function (searchName, json) {
             if (searchName == undefined || searchName == "") {
                 alert("检索的关键字不可为空！");
                 return;
             }
             json = $.extend({}, {
                 renderOptions: {map: this.map}
             }, json);
             var local = new BMap.LocalSearch(this.map, json);
             local.search(searchName);
         },
         getProvider: function () {//返回地图服务商
             return "baidu";
         },
         /**
          * 添加右键菜单
          * @param txtMenuItem 右键菜单子项对象数组，
          *                      形式如[{text:'String',callback：function(e)},{text:'String',callback：function(e)},......]
          *                      text为：子项菜单名String类型
          *                      callback为：点击该子项菜单时触发的回调函数，返回值为point坐标点（仅百度的有返回值）。
          * @return
          */
         addRightMenu: function (txtMenuItem) {
             //创建地图右键菜单对象
             var menu = new BMap.ContextMenu();
             //循环遍历右键菜单子项，并将子项添加到右键菜单对象中。
             for (var i = 0; i < txtMenuItem.length; i++) {
                 menu.addItem(new BMap.MenuItem(txtMenuItem[i].text,
                     txtMenuItem[i].callback || function () {
                     }, {
                         width: 100
                     }));
             }
             //将右键菜单加入地图中
             this.map.addContextMenu(menu);
         },
         setViewportByArea: function (Area) {
             var bdary = new BMap.Boundary();
             bdary.get(Area, function (rs) {
                 var count = rs.boundaries.length;
                 if (count == 0) {
                     return;
                 }
                 var pointArray = [];
                 for (var i = 0; i < count; i++) {
                     var ply = new BMap.Polygon(rs.boundaries[i], {
                         strokeWeight: 2,
                         strokeColor: "#ff0000"
                     });
                     pointArray = pointArray.concat(ply.getPath());
                 }
                 this.map.setViewport(pointArray);
                 map.setZoom(map.getZoom() + 1);
             });
         },
         setMassMarksStyles: function (MassMarks, styles) {
             if (MassMarks == undefined || styles == undefined) {
                 return;
             }
             MassMarks.setStyles(styles);
         },
         /**
          * 在地图中设置折线
          * @param pointArray 折线经过的点对象数组
          * @param lineOptions 折线初始化的可选参数，形式如{strokeColor:'blue',strokeOpacity:0.5,strokeWeight:2}
          * @return
          */
         setPolyline: function (pointArray, lineOptions) {
             //创建折线
             var polyline = new BMap.Polyline(pointArray, lineOptions);
             return polyline;
         },
         /**
          * 在地图中设置圆
          * @param center 圆心点 point对象类型
          * @param radius 半径 num类型 单位米
          * @param circleOptions 圆的初始化的可选参数，形式如
          * {	strokeColor:'blue',  //圆边线颜色
          * 		strokeOpacity:0.5,	//圆边线透明度，取值范围0-1
          * 		fillColor:'blue',  //填充颜色
          * 		fillOpacity:0.5,	//圆填充颜色明度，取值范围0-1
          * 		strokeWeight:2,		//边线宽度，以像素为单位
          * 		enableMassClear:false	//是否能被map.clearOverlays清除，默认true
          * 		}
          * @return
          */
         setCircle: function (center, radius, circleOptions) {
             //创建圆
             var circle = new BMap.Circle(center, radius, circleOptions);
             return circle;
         },
         /*路书*/
         /**
          * 路书，使某图形沿着某点数组移动到功能
          * @param
          * @param opts 路书的初始化可选参数
          * {
          *		landmarkPois:"",	//要在覆盖物移动过程中显示的特殊点。格式如[{lng:111,lat:39,html:'加油站',payseTime:3}]
          *		icon:"",			//覆盖物的icon
          *		speed:"",			//覆盖物移动速度，单位米/秒
          *		defaultContent:"",	//覆盖物中的内容
          *		autoView:"",		//是否自动调整路线视野，默认不调整
          *		enableRotation:""	//是否开启marker随路走向旋转，默认false
             }
          */
         LuShu: function (array, opts) {
             lushu = new MapCoreLib.LuShu(this.map, array, opts);
             return lushu;
         },
         LuShuStart: function (lushu) {
             lushu.start();
         },
         LuShuPause: function (lushu) {
             lushu.pause();
         },
         LuShuStop: function (lushu) {
             lushu.stop();
         },
         /*路书*/
 
         /**
          * 动态点标记
          * @param point
          * @returns {AMap.Marker}
          */
 
         markerMove: function (point) {
             var myIcon = new BMap.Icon("gateWayAddressnbcbimages/car_03.png",
                 new BMap.Size(32, 70), {
                     imageOffset: new BMap.Size(0, 0)
                 });
             var marker = new BMap.Marker(point, {
                 icon: myIcon
             });
             return marker;
         },
         /**
          * 设置路径轨迹
          * @param pointArray 点几个
          * @param lineOptions 线设置
          * @param isBegin 是否显示起终点
          * @param isMove 是否显示移动标记
          * @returns {AMap.Polyline}
          */
         setTrack: function (pointArray, lineOptions, isBegin, isMove) {
             for (var i = 0; i < pointArray.length; i++) {
                 var marker = new MapCore.Marker(pointArray[i]);
                 if (isBegin) {
                     //设置开始和结束的图标
                     if (i == 0) {
                         map.setMarkerIcon(marker,
                             "gateWayAddressnbcbimages/startMarker.png");
                     } else if (i == pointArray.length - 1) {
                         map.setMarkerIcon(marker,
                             "gateWayAddressnbcbimages/endMarker.png");
                     } else {
                         map.setMarkerIcon(marker,
                             "gateWayAddressnbcbimages/middleMarker.png");
                     }
                 }
                 map.addMarker(marker);
             }
 
             //创建折线
             var polyline = map.setPolyline(pointArray, lineOptions);
             map.addOverlay(polyline);
 
             //自适应地图
             map.setViewport(pointArray);
 
             if (isMove) {
                 //显示动态点标记
                 var myIcon = new BMap.Icon(
                     "gateWayAddressnbcbimages/Mario.png", {
                         imageOffset: new BMap.Size(0, 0)
                     });
                 var lushu = new BMapLib.LuShu(this.map, pointArray, {
                     defaultContent: "",
                     landmarkPois: [],
                     icon: myIcon,
                     speed: 2000
                 });
                 map.LuShuStart(lushu);
             }
             return polyline;
         },
         /**
          * 地图加载完成事件
          * @param callBack
          * @return
          */
         tilesloaded: function (callBack) {
             if (typeof callBack == 'function') {
                 this.map.addEventListener("tilesloaded", callBack);
             }
         },
         /**
          * 文字覆盖物
          * @param text    显示的文字
          * @param opts    文本信息的可选参数
          *            {
          * 				position : point, //指定文本标注所在的地理位置
          * 				offset	: size	//文本的偏移量
          * 			}
          * @param labelStyle
          *            {
          * 				color:"red",			//字体颜色
          * 				fontSize:"16px",		//字体大小
          * 				fontFamily:"微软雅黑",	//字体族
          * 				backgroundColor:"0",	//背景色
          * 				border:"0",				//边框大小
          * 				fontWeight:"bold"		//字体粗细
          * 			}
          * @return
          */
         label: function (text, opts, labelStyle) {
             var label = new BMap.Label(text, opts);
             label.setStyle(labelStyle);
             this.map.addOverlay(label);
             return label;
         },
         /**
          * 添加自定义覆盖物
          * @param point    覆盖物所在的坐标位置
          * @param symbolType    覆盖物的类型
          *                BMap_Symbol_SHAPE_CIRCLE    圆形，默认半径为1px
          *                BMap_Symbol_SHAPE_RECTANGLE 矩形，默认宽4px,高2px
          *                BMap_Symbol_SHAPE_RHOMBUS    菱形    ，默认外接圆半径为10px
          *                BMap_Symbol_SHAPE_STAR        五角星，默认外接圆半径为10px
          * @param symbolOpts    覆盖物的可选参数
          *            {
          * 				scale:45,					//缩放比例
          * 				strokeColor:'green',		//边框颜色
          * 				strokeWeight:1,				//边框粗细
          * 				strokeOpacity:0.6,			//边框透明度
          * 				fillColor:'green',			//填充颜色
          * 				fillOpacity:'0.6'			//填充透明度
          * 			}
          * @return
          */
         symbol: function (point, symbolType, symbolOpts) {
             var mySymbol = new BMap.Marker(point, {
                 icon: new BMap.Symbol(symbolType, symbolOpts)
             });
             map.addOverlay(mySymbol);
             return mySymbol;
         },
         //===================================new行政区域==========================================
         /**
          * 在行政区上添加颜色块覆盖物
          * @param name  行政区域名称
          * @param fillColor 要填充的颜色
          * @param text  提示信息框的文本HTML
          * @return
          */
         setAddressFillColor: function (data, Mapfunction1, Mapfunction2,
                                        fillOpacityNum) {
             var type = data[0].type;
             for (var j = 0; j < data.length; j++) {
                 var bdname = data[j].area;
                 var gdname = data[j].GDarea;
                 var color = data[j].color;
                 var totalCount = data[j].totalCount;
                 var totalValue = data[j].totalValue;
                 var text = null;
                 if (type == "1") {
                     this.getBdaryAddressData(bdname, color, Mapfunction2,
                         fillOpacityNum);
                 } else if (type == "2") {
                     this.getBdaryAddressData(bdname, color, Mapfunction2,
                         fillOpacityNum);
                 } else if (type == "3") {
                     this.getBdaryAddressData(bdname, color, Mapfunction2,
                         fillOpacityNum);
                 }
             }
         },
         getBdaryAddressData: function (bdname, color, Mapfunction2,
                                        fillOpacityNum) { //setBound的内部调用方法，不作为单独的方法使用
             var bdary = new BMap.Boundary();
             bdary.get(bdname, function (rs) {
                 var count = rs.boundaries.length;
                 if (count == 0) {
                     if (typeof (Mapfunction2) == 'function') {
                         Mapfunction2(bdname, null);
                     }
                     return;
                 }
                 var pointArray = [];
                 for (var i = 0; i < count; i++) {
                     var ply = new BMap.Polygon(rs.boundaries[i], {
                         strokeWeight: 2,
                         strokeColor: "#000000"
                     });
                     ply.setFillColor(color);
                     if (typeof (fillOpacityNum) == 'number') {
                         ply.setFillOpacity(fillOpacityNum);
                     }
                     this.map.addOverlay(ply);
                     pointArray = pointArray.concat(ply.getPath());
                     if (typeof (Mapfunction2) == 'function') {
                         Mapfunction2(bdname, pointArray);
                     }
                 }
             });
         },
         //================================================================================================
 
         //===============================以下待定=======================================
         /**
          * 根据城市名设置地图中心点
          * @param cityName 城市名
          * @param zoom 地图显示级别
          */
         setCenterByCity: function (cityName, zoom) {
             if ((typeof cityName == 'string') && (typeof zoom == 'number')) {
                 this.map.centerAndZoom(cityName, zoom);
             } else {
                 alert("所传参数类型错误或者参数值为空");
             }
         },
         /**
          * 添加城市列表控件
          * @return
          */
         setCityListControl: function () {
             var size = new BMap.Size(10, 20);
             map.addControl(new BMap.CityListControl({
                 anchor: BMAP_ANCHOR_TOP_LEFT,
                 offset: size
             }));
         },
         /**
          * 创建地面叠加层
          * @param swPoint
          * @param nePoint
          * @param Options
          * @return
          */
         groundOverlay: function (swPoint, nePoint, imgUrl, Options) {
             var GOlay = new BMap.GroundOverlay(
                 new BMap.Bounds(swPoint, nePoint), Options);
             GOlay.setImageURL(imgUrl);
             return GOlay;
         },
         /**
          * 带检索功能的信息窗口
          * @param content 信息窗的文本内容
          * @param options 信息窗的可选参数
          *                {
          * 					placeSearch:true,		是否开启周边检索
          * 					asOrigin:true,			是否开启路径规划起点检索
          * 					asDestination:true		是否开启路径规划终点检索
          * 				}
          * @return
          */
         searchInfoWindow: function (content, options) {
             //options.searchTypes = [BMAOLI_TAB_SEARCH,BMAOLI_TAB_TO_HERE];
             //是否开启周边检索
             if ((typeof options.placeSearch) == 'boolean'
                 && options.placeSearch == true) {
                 //options.searchTypes.push(BMAOLI_TAB_SEARCH);
             }
             //是否开启路径规划起点检索
             if ((typeof options.asOrigin) == 'boolean'
                 && options.asOrigin == true) {
                 //options.searchTypes.push(BMAOLI_TAB_TO_HERE);
             }
             //是否开启路径规划终点检索
             if ((typeof options.asDestination) == 'boolean'
                 && options.asDestination == true) {
                 //options.searchTypes.push(BMAOLI_TAB_FROM_HERE);
             }
             var searchInfo = new BMapLib.SearchInfoWindow(this.map, content,
                 options);
             searchInfo.open = searchInfo.open;
             return searchInfo;
         },
         /**
          * 根据浏览器定位
          */
         Geolocation: function (onSuccess) {
             var geolocation = new BMap.Geolocation();
             var This = this;
             geolocation.getCurrentPosition(function (r) {
                 if (this.getStatus() == BMAP_STATUS_SUCCESS) {
                     var mk = new BMap.Marker(r.point);
                     This.addOverlay(mk);
                     This.panTo(r.point);
                     if (onSuccess) {
                         var result = {
                             "info": "定位成功",
                             "lng": r.point.lng,
                             "lat": r.point.lat,
                             "accuracy": "",
                             "isConverted": ""
                         };
                         onSuccess(result);
                     }
                     //alert('您的位置：'+r.point.lng+','+r.point.lat);
                 } else {
                     alert('failed' + this.getStatus());
                 }
             }, {
                 enableHighAccuracy: true
             })
             //关于状态码
             //BMAP_STATUS_SUCCESS	检索成功。对应数值“0”。
             //BMAP_STATUS_CITY_LIST	城市列表。对应数值“1”。
             //BMAP_STATUS_UNKNOWN_LOCATION	位置结果未知。对应数值“2”。
             //BMAP_STATUS_UNKNOWN_ROUTE	导航结果未知。对应数值“3”。
             //BMAP_STATUS_INVALID_KEY	非法密钥。对应数值“4”。
             //BMAP_STATUS_INVALID_REQUEST	非法请求。对应数值“5”。
             //BMAP_STATUS_PERMISSION_DENIED	没有权限。对应数值“6”。(自 1.1 新增)
             //BMAP_STATUS_SERVICE_UNAVAILABLE	服务不可用。对应数值“7”。(自 1.1 新增)
             //BMAP_STATUS_TIMEOUT	超时。对应数值“8”。(自 1.1 新增)
         },
         /**
          * 根据ip获取城市名。
          */
         getLocationByIP: function (onSuccess) {
             function myFun(result) {
                 var cityName = result.name;
                 this.map.setCenter(cityName);
                 if (onSuccess) {
                     var result = {
                         "info": "OK",
                         "city": cityName
                     };
                     onSuccess(result);
                 }
             }
 
             var myCity = new BMap.LocalCity();
             myCity.get(myFun);
         },
         /**
          * 获取地图显示范围
          */
         getMapBounds: function () {
             var bs = map.getBounds(); //获取可视区域
             var bssw = bs.getSouthWest(); //可视区域左下角
             var bsne = bs.getNorthEast(); //可视区域右上角
             alert("当前地图可视范围是：" + bssw.lng + "," + bssw.lat + "到" + bsne.lng
                 + "," + bsne.lat);
         },
         /**
          * 设置地图显示范围
          * @param {Object} pointLeft 左上角的点坐标 地图的Point类型
          * @param {Object} pointRight 右下角的点坐标 地图的point类型
          */
         setMapBounds: function (pointLeft, pointRight) {
             var b = new BMap.Bounds(pointLeft, pointRight);
             try {
                 BMapLib.AreaRestriction.setBounds(this.map, b);
             } catch (e) {
                 alert(e);
             }
         },
         /*
          *清除区域限制
          */
         clearLimitBounds: function () {
             try {
                 BMapLib.AreaRestriction.clearBounds();
             } catch (e) {
                 alert(e.message);
             }
 
         },
         /**
          * 多关键字检索
          * @param {Object} myKeys 关键字数组 [string,string,....]
          */
         searchInBounds: function (myKeys) {
             var map = this.map;
             if (typeof local == "undefined") {
                 local = new BMap.LocalSearch(map, {
                     renderOptions: {
                         map: map
                     }
                 });
             }
             local.clearResults();
             local.searchInBounds(myKeys, this.map.getBounds());
         },
         /**
          * 矩形区域检索
          * @param {Object} pointLeft 左上角的点坐标 地图的Point类型
          * @param {Object} pointRight 右下角的点坐标 地图的point类型
          * @param {Object} key 检索的条件 string类型
          */
         searchInRectangle: function (pointLeft, pointRight, key) {
             if (typeof rectLoacl == "undefined") {
                 rectLoacl = new BMap.LocalSearch(this.map, {
                     renderOptions: {
                         map: this.map
                     }
                 });
             }
             var bs = new BMap.Bounds(pointLeft, pointRight); //自己规定范围
             rectLoacl.searchInBounds(key, bs);
 
             var polygon = new BMap.Polygon([
                 new BMap.Point(pointLeft.lng, pointLeft.lat),
                 new BMap.Point(pointRight.lng, pointLeft.lat),
                 new BMap.Point(pointRight.lng, pointRight.lat),
                 new BMap.Point(pointLeft.lng, pointRight.lat)], {
                 strokeColor: "blue",
                 strokeWeight: 6,
                 strokeOpacity: 0.5
             });
             map.addOverlay(polygon);
         },
         /**
          * 圆内区域检索
          * @param {Object} myKeys 检索的条件 string类型
          * @param {Object} centrePoint
          * @param {Object} radius
          */
         searchInCircle: function (myKeys, centrePoint, radius) {
             if (typeof circleLoacl == "undefined") {
                 circleLoacl = new BMap.LocalSearch(this.map, {
                     renderOptions: {
                         map: this.map,
                         autoViewport: false
                     }
                 });
             }
             var circle = new BMap.Circle(centrePoint, radius, {
                 fillColor: "blue",
                 strokeWeight: 1,
                 fillOpacity: 0.3,
                 strokeOpacity: 0.3
             });
             map.addOverlay(circle);
             circleLoacl.searchNearby(myKeys, centrePoint, radius);
         },
         /**
          * 显示路况信息
          * param isVisible 是否显示路况
          */
         TrafficControl: function (isVisible) {
             if (typeof trafCtrl == "undefined") {
                 trafCtrl = new BMapLib.TrafficControl({
                     showPanel: true
                     //是否显示路况提示面板
                 });
             }
             if (isVisible) {
                 this.map.addControl(trafCtrl);
                 trafCtrl.showTraffic();
             } else {
                 this.map.removeControl(trafCtrl);
             }
         },
         /**
          * 获取信息窗内容
          * @param {Object} infoWindow 信息窗对象
          */
         getWindowContent: function (infoWindow) {
             return infoWindow.getContent();
         },
         /**
          * 获得方法存放值
          * @param 方法名称
          * @return
          */
         getMeMapValue: function (key) {
             return this.meMapValue[key];
         },
         /**
          * 设置方法存放值
          * @param 方法名称
          * @return
          */
         setMeMapValue: function (key, value) {
             this.meMapValue[key] = value;
         },
         /**
          * 清空方法存放值
          * @param 方法名称
          * @return
          */
         removeMeMapValue: function (key) {
             $(this.meMapValue).remove(key);
         },
         /**
          * 画多边形
          */
         drawPolygon2: function (json, isEdit, initCall) {
             var meMap = this;
             if (!json) {
                 alert('参数不能为空');
                 return;
             }
             var points = json.points;
             if (!points || points.length == 0) {
                 alert('坐标点不能为空');
                 return;
             }
             var polygons = new Array();
             for (var i = 0; i < points.length; i++) {
                 var lon = points[i].lon;//经度
                 var lat = points[i].lat;//纬度
                 if (!lon || !lat) {
                     alert('数据有误，存在经纬度为空[' + lon + "," + lat + ']');
                     return;
                 }
                 polygons.push(new BMap.Point(lon, lat));
             }
 
             var polygon = new BMap.Polygon(polygons, {
                 strokeWeight: json.strokeWeight ? json.strokeWeight : 1,
                 fillOpacity: json.fillOpacity ? json.fillOpacity : 0.4,
                 fillColor: json.fillColor ? json.fillColor : 'rgb(30,144,255)',
                 strokeOpacity: json.strokeOpacity ? json.strokeOpacity : 0.3,
                 strokeColor: json.strokeColor ? json.strokeColor : '#4990e2',
                 strokeStyle: json.strokeStyle ? json.strokeStyle : 'solid'
             });
             // 只有可编辑的polygon才需要push，根据id判断是否可编辑
             if (isEdit) {
                 meMap.drawOverlys.push(polygon);
             }
 
 
             var paths = polygon.getPath();
             // console.log(paths);
             if (initCall) {
                 initCall.initFun(paths);
             }
 
             var strpoint = "";
             for (var i = 0; i < paths.length; i++) {//循环打印所有标志性坐标
                 if (i > 0) {
                     strpoint += ",";
                 }
                 strpoint += (paths[i].lng + "," + paths[i].lat);
             }
             json = {"type": "polygon", "point": strpoint, "provider": "baidu", "e": polygon};
             // 只有可编辑的polygon才需要push，根据id判断是否可编辑
             if (isEdit) {
                 meMap.resultJson.push(json);
                 console.log(meMap.resultJson);
 
                 // 添加图形编辑菜单
                 var openEdit = function (e, ee, plane) {
                     plane.enableEditing(); // 启用编辑
                     var paths = plane.getPath();
                     // console.log(paths);
                     if (initCall) {
                         initCall.initFun(paths);
                     }
                     var strpoint = "";
                     for (var i = 0; i < paths.length; i++) {//循环打印所有标志性坐标
                         if (i > 0) {
                             strpoint += ",";
                         }
                         strpoint += (paths[i].lng + "," + paths[i].lat);
                     }
                     json = {"type": "polygon", "point": strpoint, "provider": "baidu", "e": polygon};
                     meMap.resultJson.push(json);
                 }
                 // 关闭图形编辑菜单
                 var closeEdit = function (e, ee, plane) {
                     console.log(e);
                     console.log(ee);
                     console.log(plane);
                     plane.disableEditing(); // 停用编辑
                     var paths = plane.getPath();
                     // console.log(paths);
                     if (initCall) {
                         initCall.initFun(paths);
                     }
                     var strpoint = "";
                     for (var i = 0; i < paths.length; i++) {//循环打印所有标志性坐标
                         if (i > 0) {
                             strpoint += ",";
                         }
                         strpoint += (paths[i].lng + "," + paths[i].lat);
                     }
                     json = {"type": "polygon", "point": strpoint, "provider": "baidu", "e": polygon};
                     meMap.resultJson.push(json);
                 }
                 // var menu = new BMap.ContextMenu();
                 // menu.addItem(new BMap.MenuItem("编辑", openEdit.bind(polygon)));
                 // menu.addItem(new BMap.MenuItem("关闭", closeEdit.bind(polygon)));
                 // polygon.addContextMenu(menu);
                 // polygon.closeEdit = function(){
                 //     closeEdit.bind(polygon)
                 // }
                 // closeEdit.bind(polygon)
             }
 
             // polygon.addEventListener("click", function (e) {
             //
             //     this.enableEditing();
             // });
             // polygon.addEventListener("dblclick", function (e) {
             //
             //     this.disableEditing();
             //     this.getPath();
             // });
 
             // if (json.comType === '01') {
             //     polygon.setZIndex(1);
             // } else if (json.comType === '02') {
             //     polygon.setZIndex(2);
             // } else {
             //     polygon.setZIndex(3);
             // }
 
             this.map.addOverlay(polygon);
             polygon.disableMassClear();
             this.setMeMapValue('drawPolygon', {points: points});
             return polygon;
         },
         openEdit: function (polygon) {
             polygon.enableEditing()
 
         },
         closeEdit: function (polygon) {
             polygon.disableEditing(); // 停用编辑
             var paths = polygon.getPath();
             // console.log(paths);
             var strpoint = "";
             for (var i = 0; i < paths.length; i++) {//循环打印所有标志性坐标
                 if (i > 0) {
                     strpoint += ",";
                 }
                 strpoint += (paths[i].lng + "," + paths[i].lat);
             }
             json = {"type": "polygon", "point": strpoint, "provider": "baidu", "e": polygon};
             return json
         },
         drawPolygon: function (json) {
             if (!json) {
                 alert('参数不能为空');
                 return;
             }
             var points = json.points;
             if (!points || points.length == 0) {
                 alert('坐标点不能为空');
                 return;
             }
             var polygons = new Array();
             for (var i = 0; i < points.length; i++) {
                 var lon = points[i].lon;//经度
                 var lat = points[i].lat;//纬度
                 if (!lon || !lat) {
                     alert('数据有误，存在经纬度为空[' + lon + "," + lat + ']');
                     return;
                 }
                 polygons.push(new BMap.Point(lon, lat));
             }
 
             var polygon = new BMap.Polygon(polygons, {
                 strokeWeight: json.strokeWeight ? json.strokeWeight : 2,
                 fillOpacity: json.fillOpacity ? json.fillOpacity : 0.1,
                 fillColor: json.fillColor ? json.fillColor : '#FFF',
                 strokeColor: json.strokeColor ? json.strokeColor : '#ff0000'
             });
             this.map.addOverlay(polygon);
             this.setMeMapValue('drawPolygon', {
                 points: points
             });
             return polygon;
         },
         /**
          * 画圆
          */
         drawCircle: function (json) {
             if (!json) {
                 alert('参数不能为空');
                 return;
             }
             json = map.convertJson(json);
             if (!json.lon || !json.lat || !json.radius) {
                 alert('数据格式有误');
                 return;
             }
             var circle = new BMap.Circle(
                 new BMap.Point(json.lon, json.lat),
                 json.radius,
                 {
                     strokeWeight: json.strokeWeight ? json.strokeWeight
                         : 2,
                     fillOpacity: json.fillOpacity ? json.fillOpacity : 0.1,
                     fillColor: json.fillColor ? json.fillColor : '#FFF',
                     strokeColor: json.strokeColor ? json.strokeColor
                         : '#ff0000'
                 });
             this.map.addOverlay(circle);
             this.setMeMapValue('drawPolygon', {
                 point: json
             });
         },
         /**
          * 删除Marker点
          * @return
          */
         removeOverlay: function (overlay) {
             if (overlay instanceof Array) {
                 for (var i = 0; i < overlay.length; i++) {
                     this.map.removeOverlay(overlay[i]);
                 }
             } else {
                 this.map.removeOverlay(overlay);
             }
 
         },
         /**
          * 根据地区名划边框
          * @param name 行政区域名称
          * @param tzmap 地图对象
          * @return
          */
         showMapBorder: function (json) {
             if (!json.city) {
                 alert('城市不能为空');
                 return;
             }
             var bdary = new BMap.Boundary();
             var style = {
                 strokeWeight: 2,
                 strokeColor: "#ff0000"
             };
             if (json.style) {
                 var temp = json.style;
                 for (var key in temp) {
                     style[key] = temp[key];
                 }
             }
             this.getBoderData(json.city, function (data) {
                 if (data.result == 'ok') {
                     var rs = data.data;
                     var count = rs.boundaries.length;
                     if (count == 0) {
                         return;
                     }
                     for (var i = 0; i < count; i++) {
                         var ply = new BMap.Polygon(rs.boundaries[i], style);
                         this.map.addOverlay(ply);
                         var pointArray = ply.getPath();
                         this.map.doCallBackFun(json.callBackFun, {
                             polygon: ply,
                             path: pointArray
                         });
                         if (json.regionalShowType
                             && json.regionalShowType == '1' && json.text) {
                             var isMouseout = json.isMouseout ? json.isMouseout
                                 : true;
                             map.polygonAddMouse(json.text, ply, isMouseout);
                         }
                     }
                 } else {
                     // /**
                     // bdary.get(json.city, function(rs) {
                     // 	var count = rs.boundaries.length;
                     // 	console.info(rs);
                     // 	if (count == 0) {
                     // 		return;
                     // 	}
                     // 	for ( var i = 0; i < count; i++) {
                     // 		var ply = new BMap.Polygon(rs.boundaries[i], style);
                     // 		this.map.addOverlay(ply);
                     // 		var pointArray = ply.getPath();
                     // 		this.map.doCallBackFun(json.callBackFun,{polygon:ply,path:pointArray});
                     // 		if(json.regionalShowType&&json.regionalShowType=='1'&&json.text){
                     // 			var isMouseout = json.isMouseout?json.isMouseout:true;
                     // 			map.polygonAddMouse(json.text,ply,isMouseout);
                     // 		}
                     // 	}
                     // 	var value = JSON.stringify(rs);
                     // 	map.uploadMapData(json.city,value);
                     // });
                     // **/
                 }
 
             });
             // /**
             // bdary.get(json.city, function(rs) {
             // 	console.info(rs);
             //
             // 	var count = rs.boundaries.length;
             // 	if (count == 0) {
             // 		return;
             // 	}
             // 	for ( var i = 0; i < count; i++) {
             // 		var ply = new BMap.Polygon(rs.boundaries[i], style);
             // 		this.map.addOverlay(ply);
             // 		var pointArray = ply.getPath();
             // 		this.map.doCallBackFun(json.callBackFun,{polygon:ply,path:pointArray});
             // 		if(json.regionalShowType&&json.regionalShowType=='1'&&json.text){
             // 			var isMouseout = json.isMouseout?json.isMouseout:true;
             // 			map.polygonAddMouse(json.text,ply,isMouseout);
             // 		}
             // 	}
             // });
             // **/
         },
         /**
          * 将边界数据上传到后台数据库
          * @return
          */
         uploadMapData: function (name, value, fn) {
             var map = this;
             //上传数据
             var url = this.prejoctUrl + '/tlmapService/modelattributes/baiduMap/insertDistrict.do';
             if (!(typeof value === 'string')) {
                 value = JSON.stringify(value);
             }
             $.post(url, {
                 jsonStr: value,
                 name: name
             }, function (data) {
                 if (fn) {
                     data = map.convertJson(data);
                     fn(data);
                 }
             });
 
         },
         /**
          * geoserver热力图
          * @param json
          */
         getHeatMap: function (json) {
             var map = this;
             var geoServerMap = new MapCoreLib.GeoServerMap(map, json);
             return geoServerMap;
         },
         /**
          *  活动轨迹图
          * @author ccg
          * @param map 地图对象
          * @param options 配置对象
          * @returns {*}
          */
         createAnimationTrack: function (map, options) {
             var _this = this;
             var opt = options || {}
             var originList = opt.path || [
                 {lng: 116.297611, lat: 40.047363, payseTime: 3000},
                 {lng: 116.302839, lat: 40.048219, payseTime: 3000},
                 {lng: 116.308301, lat: 40.050566, payseTime: 3000},
                 {lng: 116.305732, lat: 40.054957, payseTime: 300},
                 {lng: 116.304754, lat: 40.057953, payseTime: 5000},
                 {lng: 116.306487, lat: 40.058312, payseTime: 1000},
                 {lng: 116.307223, lat: 40.056379, payseTime: 3},
             ]
             // 点数密度
             var pointDensity = opt.pointDensity || 50
             //用来画线的列表
             var points = new Array();
             // 默认的间隔时间
             var defaultTime = opt.defaultTime || 10;
             var strokeWeight = opt.strokeWeight || 3  //路线宽度
             var lineColor = opt.colors || 'black' //线颜色
             var fly = opt.icon;
 
 
             const lineList = []
             for (var i = 0; i < originList.length; i++) {
                 lineList.push([originList[i].lng, originList[i].lat])
             }
 
 
             // 基础点数
             function basePoint(callBack) {
                 // var options = {size: BMAP_POINT_SIZE_BIG, shape: BMAP_POINT_SHAPE_STAR, color: 'red'};
                 var options = {}
                 var massMarkers = _this.dataToMassMarksByEXOptions(lineList, options, null);
                 points = massMarkers[1];
                 callBack();
             }
 
             // 画基础线
             function drawBaseLine() {
                 var lineStyles = {     //画线 画当前点  和起点的线
                     strokeColor: 'black',   //线的 颜色
                     strokeOpacity: .3,   //线的透明度
                     strokeWeight: 4
                 };
                 var massMarkers = _this.dataToMassMarksByEXOptions(lineList, options, null);
                 points = massMarkers[1];
                 var polyline = _this.setPolyline(points, lineStyles);
                 _this.addOverlay(polyline); //添加覆盖物(线)
                 randomPoints()
             }
 
             basePoint(drawBaseLine);
 
             //生成随机点的方法
             //模拟生成随机点,同时以海量点进行绘制，作为底图参考
             function randomPoints() {
                 points = []
                 for (var i = 0; i < lineList.length; i++) {
                     if (lineList[i + 1]) { //如果下一个点存在，为当前点与下个点之间添加密度点数
                         var nList = getPoints(
                             {lng: +lineList[i][0], lat: +lineList[i][1]},
                             {
                                 lng: +lineList[i + 1][0],
                                 lat: +lineList[i + 1][1]
                             }, pointDensity)
                         points = points.concat(nList)
 
                     }
                 }
             }
 
             //延时打点
             return function drawLine() {
                 var lineStyles = {     //画线 画当前点  和起点的线
                     strokeColor: lineColor,   //线的 颜色
                     strokeOpacity: 1,   //线的透明度
                     strokeWeight: strokeWeight
                 };
                 // 添加图标
                 var point1 = new MapCore.Point([points[0].lng, points[0].lat]);
 
                 if(fly){
                     var myIcon = new BMap.Icon(fly, new BMap.Size(50, 50), {
                         offset: new BMap.Size(0, 0), // 指定定位位置
                         imageOffset: new BMap.Size(10, 0),// 设置图片偏移
                     })
 
                     var marker = new BMap.Marker(point1,{icon:myIcon});	// 创建标注
                     // _this.setMarkerIcon(marker, fly);  //添加标记的图标
                     marker.setIcon(myIcon)
                     _this.addOverlay(marker)
                 }
                 // _this.addMarker(marker); //添加marker 标志
                 //画线，返回线对象
                 points.shift() // 删除第一个元素
 
                 if (points[1]) { //如果长度大于1让其继续递归
                     setTimeout(() => {
                         var polyline = _this.setPolyline([points[0], points[1]], lineStyles);
                         _this.addOverlay(polyline); //添加覆盖物(线)
                         _this.removeAppiontOverlay(marker); //删除旧的图标
                         drawLine()
                     }, getStayTime(points[0].lng || '', points[0].lat || ''))
                 }
             }
 
             function getStayTime(lng, lat) {
                 for (var i = 0; i < originList.length; i++) {
                     if (originList[i].lng === lng && originList[i].lat === lat) {
                         return originList[i].payseTime
                     }
                 }
                 return defaultTime
             }
 
 
             /**
              *获取prvePoint和newPoint之间的num个点
              *@param prvePoint 起点
              *@param newPoint 终点
              *@param num 取两中间的点个数
              *@return points 两点之间的num个点的数组
              */
             function getPoints(prvePoint, newPoint, num) {
                 var lat;
                 var lng;
                 var points = [];
                 if (prvePoint.lng > newPoint.lng && prvePoint.lat > newPoint.lat) {
                     lat = Math.abs(prvePoint.lat - newPoint.lat) / num;
                     lng = Math.abs(prvePoint.lng - newPoint.lng) / num;
                     points[0] = prvePoint;
                     for (var i = 1; i < num - 1; i++) {
                         points[i] = new BMap.Point(prvePoint.lng - lng * (i + 1), prvePoint.lat - lat * (i + 1));
                     }
                 }
                 if (prvePoint.lng > newPoint.lng && prvePoint.lat < newPoint.lat) {
                     lat = Math.abs(prvePoint.lat - newPoint.lat) / num;
                     lng = Math.abs(prvePoint.lng - newPoint.lng) / num;
                     points[0] = prvePoint;
                     for (var i = 1; i < num - 1; i++) {
                         points[i] = new BMap.Point(prvePoint.lng - lng * (i + 1), prvePoint.lat + lat * (i + 1));
                     }
                 }
                 if (prvePoint.lng < newPoint.lng && prvePoint.lat > newPoint.lat) {
                     lat = Math.abs(prvePoint.lat - newPoint.lat) / num;
                     lng = Math.abs(prvePoint.lng - newPoint.lng) / num;
                     points[0] = prvePoint;
                     for (var i = 1; i < num - 1; i++) {
                         points[i] = new BMap.Point(prvePoint.lng + lng * (i + 1), prvePoint.lat - lat * (i + 1));
                     }
                 }
                 if (prvePoint.lng < newPoint.lng && prvePoint.lat < newPoint.lat) {
                     lat = Math.abs(prvePoint.lat - newPoint.lat) / num;
                     lng = Math.abs(prvePoint.lng - newPoint.lng) / num;
                     points[0] = prvePoint;
                     for (var i = 1; i < num - 1; i++) {
                         points[i] = new BMap.Point(prvePoint.lng + lng * (i + 1), prvePoint.lat + lat * (i + 1));
                     }
                 }
 
                 return points;
             }
         },
 
 
         /**
          * 创建geoserver图层
          * @param json
          */
         createGeoTileLayer: function (json) {
             var that = this;
             if (!json.layers) {
                 alert("layers图层名称不能为空！");
             }
             var displayOnMinLevel = json.displayOnMinLevel || 15 //图层显示最小层级
             var displayOnMaxLevel = json.displayOnMaxLevel || 22   //图层显示最大层级
             var layers = json.layers;
             var date = json.date;
             var cql = json.cql;
             var cqlFilter = '';
             if (cql || date) {
                 var dateData = ''
                 if (date) {
                     var ds = date.split(",");
                     dateData += '(';
                     for (var i = 0; i < ds.length; i++) {
                         dateData += "time DURING "
                         dateData += ds[i]
                         if (i != ds.length - 1) {
                             dateData += " or ";
                         }
                         if (i == ds.length - 1) {
                             dateData += ")";
                         }
                     }
                     cqlFilter = dateData
                     if (cql) {
                         cqlFilter += " and " + cql
                     }
                 } else {
                     if (cql) {
                         cqlFilter = cql
                     }
                 }
                 var cqlF = ''
                 if (cqlFilter) {
                     var cqlF = '&CQL_FILTER=' + cqlFilter;
                 }
             }
             console.log(cqlF);
             var tileLayer = new BMap.TileLayer({isTransparentPng: true});
             tileLayer.status = false
             tileLayer.getTilesUrl = function (tileCoord, zoom) {
                 if (zoom >= displayOnMinLevel && zoom <= displayOnMaxLevel) {
                     tileLayer.status = true
                     var x = tileCoord.x;
                     var y = tileCoord.y;
                     //方法一，通过baiduMap API提供的方法将平面坐标转成经纬度坐标
                     //var PointConvert = that.BaiduPointConvert.(map);
                     var lonlat_0 = that.BaiduPointConvert(tileCoord);//瓦片左下角坐标；
                     var tileCoord2 = new Object();
                     tileCoord2.x = x + 1;
                     tileCoord2.y = y + 1;
                     var lonlat2_0 = that.BaiduPointConvert(tileCoord2);//瓦片右上角坐标；
                     var bbox = [lonlat_0.lng, lonlat_0.lat, lonlat2_0.lng, lonlat2_0.lat,];//左下角与右上角坐标构成一个bbox；
                     var url = _geoserverUrl + '?service=WMS&version=1.1.0&request=GetMap&width=256&height=256&srs=EPSG%3A4326&TRANSPARENT=true&format=image%2Fpng&bbox='
                         + bbox.join(',') + '&layers=' + layers;
                     if (cqlF) {
                         url += cqlF.replace(/%/g, "%25").replace(/ /g, "%20")
                     }
                     console.log(url);
                     return url;
                 }
             }
             return tileLayer;
         },
         /**
          * 百度地图坐标转换
          * @param map
          */
         //百度地图坐标转换
         BaiduPointConvert: function (pixel) {
             //瓦片xy计算出经纬度坐标
             var pixel1 = new BMap.Pixel(pixel.x * 256, pixel.y * 256);
             var zoom = this.map.getZoom();
             var pixelToWorld = new BMap.Pixel(pixel1.x / Math.pow(2, zoom - 18), pixel1.y / Math.pow(2, zoom - 18))
             var projection = this.map.getMapType().getProjection();
             return projection.pointToLngLat(pixelToWorld)
         },
         /**
          * 叠加geoserver图层
          * @param json
          */
         addGeoTileLayer: function (tileLayer) {
             this.map.addTileLayer(tileLayer);
         },
         /**
          *
          * @param name
          * @param fn
          */
         getBoderData: function (name, fn) {
             var map = this;
             var str;
             var storage = window.localStorage;
             var key = map.getBaiduCacheKey(name);
             if (storage) {
                 try {
                     str = storage.getItem(key);
                 } catch (e) {
                 }
             }
             if (str) {//先获取浏览器是否缓存
                 if (str.indexOf('_') < 0) {//说明格式数据不正确，version_[[坐标]]
                     str = '';
                     storage.removeItem(key);
                 } else {
                     var size = str.substr(0, str.indexOf('_'));
                     if (size != map.getDistrictVersion()) {
                         str = '';
                         storage.removeItem(key);
                     } else {
                         str = str.substr(str.indexOf('_') + 1);
                     }
                 }
             }
             if (!str) {
                 //获得边界数据
                 var url = this.prejoctUrl + '/tlmapService/modelattributes/baiduMap/searchDistrict.do';
                 $.post(url, {
                     name: name
                 }, function (data) {//从系统缓存取
 
                     data = map.convertJson(data);
                     if (data.result == 'ok') {
                         var value = data.data;
                         data.data = map.convertJson(data.data);
                         if (fn) {
                             fn(data);
                         }
                         if (storage) {
                             try {
                                 str = storage.setItem(key, map
                                         .getDistrictVersion()
                                     + "_" + value);
                             } catch (e) {
                             }
                         }
                         //console.info('后台。。。。。。。');
                     } else {//从百度获取
                         var bdary = new BMap.Boundary();
                         bdary.get(name, function (rs) {
                             var count = rs.boundaries.length;
                             if (count == 0) {
                                 return;
                             }
                             var result = {
                                 result: 'ok',
                                 data: rs
                             };
                             if (fn) {
                                 fn(result);
                             }
                             var value = JSON.stringify(rs);
                             map.uploadMapData(name, value);
                             //保存浏览器
                             var key = map.getBaiduCacheKey(name);
                             var storage = window.localStorage;
                             if (storage) {
                                 try {
                                     //console.info('保存浏览器');
                                     str = storage.setItem(key, map
                                             .getDistrictVersion()
                                         + "_" + value);
                                 } catch (e) {
                                 }
                             }
                             //console.info('百度。。。。。。。');
                         });
                     }
 
                 });
             } else {
                 var data = {
                     result: 'ok',
                     data: map.convertJson(str)
                 };
                 //console.info('浏览器。。。。。。。');
                 if (fn) {
                     fn(data);
                 }
             }
 
         }
         ,
         /**
          * 获取百度地图边界版本号
          */
         getDistrictVersion: function () {
             if (!bd_data_version) {
                 $
                     .ajax({
                         url: this.prejoctUrl
                             + "/tlmapService/modelattributes/baiduMap/getDistrictVersion.do",
                         async: false,
                         cache: false,
                         //dataType : "jsonp",
                         type: "post",
                         data: {},
                         success: function (_data) {
                             var storage = window.localStorage;
                             if (storage) {
                                 //	storage.clear();
                             }
                             if (typeof _data === 'string') {
                                 _data = jQuery.parseJSON(_data);
                             }
                             if (_data.result == 'ok') {
                                 bd_data_version = _data.data;
                                 var storage = window.localStorage;
                                 if (storage) {
                                     var oldVersion = storage
                                         .getItem('bd_data_version');
                                     if (!oldVersion
                                         || bd_data_version != oldVersion) {
                                         storage.clear();
                                         storage.setItem('bd_data_version',
                                             bd_data_version);
                                     }
                                 }
                             } else {
                                 alert("获得百度边界数据版本出错[" + _data.errorMsg + "]");
                             }
                         },
                         error: function (XMLHttpRequest, textStatus, errorThrown) {
                             alert("异常:获得百度边界数据版本出错" + textStatus);
                         }
                     });
             }
             return bd_data_version;
         }
         ,
         getBaiduCacheKey: function (key) {
             return "baidu_" + key;
         }
         ,
         /**
          * 将边界数据上传到后台数据库
          * @return
          */
         uploadMapData: function (name, value) {
             //上传数据
             var url = this.prejoctUrl + '/tlmapService/modelattributes/baiduMap/insertDistrict.do';
             $.post(url, {
                 jsonStr: value,
                 name: name
             }, function (data) {
             });
         }
         ,
         disableDoubleClickZoom: function () {
             this.map.disableDoubleClickZoom();
         }
         ,
         /**
          *显示闪烁点
          *data 坐标点的二维数组
          */
         showFlashingPoint: function (data) {
             if (!data || !data.length) {
                 alert("请传递有效的点集合！");
                 return;
             }
             /**
              *设置地图样式
              */
             var mapStyle = {
                 //features:["road","building","water","land"],//隐藏地图上的POI
                 style: "dark"//设置地图风格为高端黑
             }
             this.map.setMapStyle(mapStyle);
             /**
              *添加自定义覆盖物
              */
             this.addCustomerOverlay();
             var myCompOverlay = new ComplexCustomOverlay(new BMap.Point(
                 116.407845, 39.914101), this);
             this.map.addOverlay(myCompOverlay);
 
             rs = data;
             stars.length = 0;
             for (var i = 0, len = rs.length; i < len; i++) {
                 rs[i][2] = Math.max(2, Math.floor(Math.random() * 10));//可以根据业务需求传递每个点的大小
             }
             canvas.style.left = py.x + "px";
             canvas.style.top = py.y + "px";
             this.renderAction();
         }
         ,
         /**
          * 内部方法,供闪烁点调用
          */
         renderAction: function () {
             ctx.clearRect(0, 0, BW, BH);
             ctx.globalCompositeOperation = "lighter";
             stars.length = 0;
             for (var i = 0; i < rs.length; i++) {
                 var item = rs[i];
                 var point = new BMap.Point(item[0], item[1]);
                 var px = this.map.pointToOverlayPixel(point);
                 var s = new Star({
                     x: px.x - py.x,
                     y: px.y - py.y,
                     size: item[2]
                 });
                 stars.push(s);
             }
             for (var i = 0, len = stars.length; i < len; i++) {
                 if (stars[i]) {
                     stars[i].render(i);
                 }
             }
             canvas.style.left = py.x + "px";
             canvas.style.top = py.y + "px";
         }
         ,
         /**
          * 内部方法,供闪烁点调用
          */
         render: function (mapCore) {
             mapCore.renderAction();
             setTimeout(function () {
                 mapCore.render(mapCore);
             }, 180);
         }
         ,
         /**
          * 添加自定义覆盖物，内部方法，仅供闪烁点使用
          */
         addCustomerOverlay: function () {
             delete a.ComplexCustomOverlay;
             (function () {
                 //复杂的自定义覆盖物
                 function ComplexCustomOverlay(point, mapCore) {
                     this._point = point;
                     this._mapCore = mapCore;
                 }
 
                 ComplexCustomOverlay.prototype = new BMap.Overlay();
                 ComplexCustomOverlay.prototype.initialize = function (map) {
                     this._map = map;
                     canvas = this.canvas = document.createElement('canvas');
                     canvas.style.cssText = "position:absolute;left:0;top:0;";
                     ctx = canvas.getContext('2d');
                     var size = map.getSize();
                     canvas.width = BW = size.width;
                     canvas.height = BH = size.height;
                     map.getPanes().labelPane.appendChild(canvas);
                     return this.canvas;
                 }
                 ComplexCustomOverlay.prototype.draw = function () {
                     var map = this._map;
                     var bounds = map.getBounds();
                     var sw = bounds.getSouthWest();
                     var ne = bounds.getNorthEast();
                     var pixel = map.pointToOverlayPixel(new BMap.Point(sw.lng, ne.lat));
                     py = pixel;
                     if (rs.length > 0) {
                         this._mapCore.renderAction(rs);
                     }
                     if (!started) {
                         this._mapCore.render(this._mapCore);
                         started = true;
                     }
                 }
                 a.ComplexCustomOverlay = ComplexCustomOverlay;
             })();
         }
         ,
         /**
          * 坐标转为百度坐标
          * @param points
          * @param from
          * @param callback
          */
         transformXY: function (options, callback) {
             var points = options.points;
             var from = options.from || 3;
             var to = options.to || 5;
             setTimeout(function () {
                 var convertor = new BMap.Convertor();
                 var pointArr = [];
                 pointArr.push(points);
                 convertor.translate(pointArr, from, to, callback);
             }, 1000);
 
         }
         ,
         /**
          * json.input  输入框id
          * json.onSearchComplete 查询结果回调方法
          * json.clickSelect 点击列表方法回调
          * json.isLocalSearch 是否创建localsearch
          * json.localSearchFun localsearch 回调方法
          * @param json
          * @return
          */
         autoComplete: function (json) {
             json = json ? json : {};
             if (!json.input) {
                 return;
             }
             var clickSelect = json.clickSelect;
             var isLocalSearch = json.isLocalSearch;
             var localSearchFun = json.localSearchFun;
             delete json.clickSelect;
             delete json.isLocalSearch;
             delete json.localSearchFun;
             if (!json.location) {
                 json.location = this.map;
             }
 
             var ac = new BMap.Autocomplete(json);
 
             if (clickSelect) {
                 ac.addEventListener("onconfirm", function (e) { //鼠标点击下拉列表后的事件
                     clickSelect(e);
                 });
             }
 
             var resultPoi;
             var resultPois;
             //poi检索
             var map = this;
             if (isLocalSearch) {
                 var local = new BMap.LocalSearch(this.map, {
                     onSearchComplete: function (data) {
                         var num = data.getNumPois();
                         var autoCompletePois = [];
                         var poins = [];
                         for (var i = 0; i < num; i++) {
                             var poi = data.getPoi(i);
                             if (!poi) {
                                 continue;
                             }
                             var address = poi.address ? poi.address : '';
                             if (address.indexOf(poi.district) < 0) {
                                 address = (poi.district ? poi.district : '')
                                     + address;
                             }
                             if (address.indexOf(poi.city) < 0) {
                                 address = (poi.city ? poi.city : '') + address;
                             }
                             if (address.indexOf(poi.province) < 0) {
                                 address = (poi.province ? poi.province : '')
                                     + address;
                             }
                             poi.address = address;
 
                             if (i == 0) {
                                 resultPoi = poi;
                             }
                             autoCompletePois.push(poi);
                         }
                         if (localSearchFun) {
                             localSearchFun(autoCompletePois, data);
                         }
 
                     }
                 });
                 map.autoCompleteLocal = local;
             }
 
             return ac;
         }
         ,
         //自动检索查询
         autoCompleteLocalSearch: function (name) {
             if (this.autoCompleteLocal) {
                 this.autoCompleteLocal.search(name);
             }
         }
         ,
         /**
          * 计算两点间距离  单位：米
          * @param startPoint
          * @param endPoint
          * @return
          */
         getDistance: function (startPoint, endPoint) {
             var value = this.map.getDistance(startPoint, endPoint);
             if (value != 0) {
                 value = value.toFixed(2);
             }
             return value;
         }
         ,
         //全景
         setPov: function (json) {
             var panorama = new BMap.Panorama('' + json.mapId);
             //全景坐标点
             var _point = json.Point;
             if (_point == undefined) {
                 alert('全景图的坐标[json.Point]不能为空');
                 return;
             }
             //全景可配置参数
             var _options = json.options;
             if (_options == undefined) {
                 _options = {
                     navigatorControl: false,//隐藏导航控件  true 或者false
                     linksControl: false
                     //隐藏道路指示控件    true 或者false
                 };
             }
             //全景视角
             var _pov = json.pov;
             if (_pov == undefined) {
                 _pov = {
                     heading: -40,
                     pitch: 6
                 };
             }
 
             panorama.setOptions(_options);
             panorama.setPov(_pov);
             panorama.setPosition(_point) //根据经纬度坐标展示全景图
         },
         //关闭信息框
         closeInfoWindow: function () {
             this.map.closeInfoWindow();
         },
 
     }
     ;
 
     //addby wangqy
     MapCore.Label = function (json) {
         //增加了配置设置
         if (json != undefined && json.options != undefined) {
             return new BMap.Label(json.text, json.options);
         } else {
             //适应老方法
             return new BMap.Label(json);
         }
     };
 
     MapCore.MyLabel = function (thml, options) {
         return new BMap.Label(thml, options);
     },
 
         //addby wangqy
         MapCore.Convertor = function () {
             return new BMap.Convertor();
         };
 
     /**
      * 地图子类
      */
     MapCore.Point = function (arr) { //点类
         return new BMap.Point(arr[0], arr[1]);
     };
 
     /**
      * 地图子类
      */
     MapCore.Icon = function (json) { //Icon图标类
         return new BMap.Icon(json.iconUrl, json.size);
     };
 
     /**
      * 此类以像素表示一个矩形区域的大小
      * @param width        水平方向的数值
      * @param height    竖直方向的数值
      * @return
      */
     MapCore.Size = function (width, height) { //size类
         return new BMap.Size(width, height);
     };
 
     MapCore.Circle = function (center, radius, circleOptions) { //点类
         return new BMap.Circle(center, radius, circleOptions);
     };
     MapCore.Marker = function (json) { //标志类
         //适应老方法
         var marker;
         if (json != undefined && json.options != undefined) {
             marker = new BMap.Marker(json.point, json.options);
         } else {
             marker = new BMap.Marker(json);
         }
 
         marker.addEvent = marker.addEventListener; //marker事件
         marker.setInfoWindow = function (content) {
             this.addEventListener("click", function () {
                 this.getMap().openInfoWindow(new BMap.InfoWindow(content),
                     this.point); //marker聚合
             });
         };
         return marker;
     };
 
     //wangqyaddCopyrightaddCopyright
     MapCore.VMarker = function (point, opts) { //标志类
         var marker = new BMap.Marker(new BMap.Point(point.lng, point.lat), opts);
         marker.addEvent = marker.addEventListener; //marker事件
         marker.setInfoWindow = function (content) {
             this.addEventListener("click", function () {
                 this.getMap().openInfoWindow(new BMap.InfoWindow(content),
                     this.point); //marker聚合
             });
         };
         return marker;
     };
     //add by wangqy
     MapCore.GeolocationControl = function () {
         return new BMap.GeolocationControl();
     },
 
         MapCore.NavigationControl = function (tzmap) { //自定义控件
             return new BMap.NavigationControl({
                 type: BMAP_NAVIGATION_CONTROL_SMALL
             });
         };
     MapCore.CopyrightControl = function () { //第三方版权控件
         this.CopyrightControl = new BMap.CopyrightControl({
             anchor: BMAP_ANCHOR_BOTTOM_RIGHT
         });
     };
     MapCore.getMapType = function () {
         return new BMap.getMapType();
     };
     var BW = 0, /*canvas.width*/BH, /*canvas.height*/ctx = null, stars = [], /*存储所有星星对象的数组*/rs = [], /*最新的结果*/py = null, /*偏移*/
         canvas = null, started;
 
     function Star(options) {
         this.init(options);
     }
 
     Star.prototype.init = function (options) {
         this.x = ~~(options.x);
         this.y = ~~(options.y);
         this.initSize(options.size);
         if (~~(0.5 + Math.random() * 7) == 1) {
             this.size = 0;
         } else {
             this.size = this.maxSize;
         }
     }
     Star.prototype.initSize = function (size) {
         var size = ~~(size);
         this.maxSize = size > 6 ? 6 : size;
     }
     Star.prototype.render = function () {
         var p = this;
 
         if (p.x < 0 || p.y < 0 || p.x > BW || p.y > BH) {
             return;
         }
 
         ctx.beginPath();
         var gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
         gradient.addColorStop(0, "rgba(7,120,249,1)");
         gradient.addColorStop(1, "rgba(7,120,249,0.3)");
         ctx.fillStyle = gradient;
         ctx.arc(p.x, p.y, p.size, Math.PI * 2, false);
         ctx.fill();
         if (~~(0.5 + Math.random() * 7) == 1) {
             p.size = 0;
         } else {
             p.size = p.maxSize;
         }
     }
     a.Star = Star;
 
     a.MapCore = MapCore; //完成类库封装
 
 })(window);


document.write('<script type="text/javascript" src="./public/mapCore/MapCore_comm.js"></script>');
document.write('<link rel="stylesheet" href="./public/mapCore/MapCore_style.css"></link>');

document.write('<script type="text/javascript" src="./public/mapCore/StatisticsMap.js"></script>');

document.write('<script type="text/javascript" src="./public/mapCore/DrawClusterOverlay.js"></script>');

document.write('<script type="text/javascript" src="./public/mapCore/MarkerClusterer.js"></script>');

document.write('<script type="text/javascript" src="./public/mapCore/mapv.js"></script>');

document.write('<script type="text/javascript" src="./public/mapCore/DrawingManager.js"></script>');
document.write('<link rel="stylesheet" href="./public/mapCore/DrawingManagerEx.css"/>');

document.write('<script type="text/javascript" src="./public/mapCore/TextIconOverlay.js"></script>');

document.write('<script type="text/javascript" src="./public/mapCore/quitimeControlsjs.js"></script>');
document.write('<link rel="stylesheet" href="./public/mapCore/quitimeControlcss.css"/>');

document.write('<script type="text/javascript" src="./public/mapCore/pathProject.js"></script>');
document.write('<link rel="stylesheet" href="./public/mapCore/pathControl.css"/>');

document.write('<script type="text/javascript" src="./public/mapCore/CREDIT_baidu.js"></script>');

document.write('<script type="text/javascript" src="./public/mapCore/GeoServerMap.js"></script>');

document.write('<script type="text/javascript" src="./public/mapCore/BoundaryMap.js"></script>');
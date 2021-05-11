/**
 * @fileoverview MarkerClusterer标记聚合器用来解决加载大量点要素到地图上产生覆盖现象的问题，并提高性能。
 * 主入口类是<a href="symbols/MapCoreLib.MarkerClusterer.html">MarkerClusterer</a>，
 * 基于Baidu Map API 1.2。
 *
 * @author Baidu Map Api Group -bnb modify
 * @version 1.2
 */

/**
 * @namespace BMap的所有library类均放在MapCoreLib命名空间下
 */
var MapCoreLib = window.MapCoreLib = MapCoreLib || {};
(function(){

    /**
     *@exports MarkerClusterer as MapCoreLib.MarkerClusterer
     */
    var StatisticsMap =
        /**
         * StatisticsMapGD
         * @class 用来解决加载大量点要素到地图上产生覆盖现象的问题，并提高性能
         * @constructor
         * @param {Map} map 地图的一个实例。
         * @param {Json Object} data 绘制饼图的数据。
         * @param {Json Object} options 可选参数，可选项包括：<br />

         * type:'pie' 统计图类型，pie、column
         * minChartWidth:50
         * minChartHeight:50
         * maxChartWidth:200
         * maxChartHeight:200
         * maxDataTotal: 500
         * minDataTotal: 80
         * chartOption
         *   itemStyle
         *     emphasis
         *        shadowBlur: 10,
         *        shadowOffsetX: 0,
         *        shadowColor: 'rgba(0, 0, 0, 0.5)'

         */
        MapCoreLib.StatisticsMap = function(map, data, options){

            //如果前台穿过来的map实例无效则就return
            if (!map){
                return;
            }
            //将map实例赋值给this._map
            this._map = map;

            //this._clearCharts();

            //构建一个_markers容器
            this._data = data;

            this._options = options || {};

            this._maxTotal = this._options.maxDataTotal || 1000;
            this._minTotal = this._options.minDataTotal || 100;

            this._maxWidth = this._options.maxChartWidth || 200;
            this._maxHeight = this._options.maxChartHeight || 200;

            this._minWidth = this._options.minChartWidth || 50;
            this._minHeight = this._options.minChartHeight || 50;

            this.divIndex = 0;

            this._chartsOverlay = [];
            this._markers = [];

            this._showType =  this._options.showType;

            if( 'gaode' == this._map.provider){
                //console.log(11)
                this._createChartsGaode();
            }else {
                //console.log(22)
                this._createCharts();
            }

        };

    //创建图表
    StatisticsMap.prototype._createChartsGaode = function(){
        //行政区 先转经纬度
        //this.__getCenterOfDistrict();
        var perWidthOfTotal = 1.0*(this._maxWidth-this._minWidth)/(this._maxTotal - this._minTotal);

        for(var i = 0; i < this._data.length; i++){
            //生成所有图表
            //1.按照total计算画布大小
            //2.create charts
            //如果是饼图
            var myWidth = this._minWidth+(this._data[i].total - this._minTotal)*perWidthOfTotal;
            var myHeight = myWidth;

            //所有都不显示
            if(this._showType.length <= 0){
                return;
            }

            //根据图例的选择过滤数据
            var myChartData = this._filterData(this._data[i].data);
            if(myChartData.length <= 0){
                return;
            }

            var chart = {width:myWidth,height:myHeight};
            chart.type = this._options.type;
            // chart.type = this._data.type;
            chart.options = this._options.chartOption || {};
            chart.id = this._data[i].id;
            chart.layPoint = this._data[i].point;//this._data[i].point
            chart.data = myChartData;
            chart.total = this._data[i].total;
            //生成自定义的图表
            var myCompOverlay = new MapCoreLib.ChartOverlayGaode(this._map,chart);
            //3.添加到地图
            this._map.addOverlay(myCompOverlay);
            this._markers.push(myCompOverlay);
        }
    };

    StatisticsMap.prototype._createCharts = function () {
        //行政区 先转经纬度
        //this.__getCenterOfDistrict();
        var perWidthOfTotal = 1.0 * (this._maxWidth - this._minWidth) / (this._maxTotal - this._minTotal);

        for (var i = 0; i < this._data.length; i++) {
            //生成所有图表
            //1.按照total计算画布大小
            //2.create charts
            //如果是饼图
            var myWidth = this._minWidth + (this._data[i].total - this._minTotal) * perWidthOfTotal;
            var myHeight = myWidth;


            //所有都不显示
            if (this._showType.length <= 0) {
                return;
            }
            //根据图例的选择过滤数据
            myChartData = [];
            var myChartData = this._filterData(this._data[i].data);
            if (myChartData.length <= 0) {
                return;
            }
            var chart = {width: myWidth, height: myHeight};
            chart.type = this._options.type;
            //chart.type = this._data.type;
            chart.options = this._options.chartOption || {};
            chart.id = this._data[i].id;
            chart.xData = this._data[i].xData;
            chart.layPoint = this._data[i].point;//this._data[i].point
            chart.data = myChartData;
            chart.total = this._data[i].total;
            chart._index=i;
            chart.divIndex = this.divIndex;
            //生成自定义的图表
            var myCompOverlay = new MapCoreLib.ChartOverlay(this._map, chart);

            //3.添加到地图
            this._map.addOverlay(myCompOverlay);
            this._chartsOverlay.push(myCompOverlay);
            //this._markers.push(myCompOverlay);
        }


    };
    StatisticsMap.prototype.divIndex = function(){
        return this.divIndex;
    }
    StatisticsMap.prototype._clearCharts = function(){
        if(this._chartsOverlay && this._chartsOverlay.length > 0){
            this._map.removeOverlay(this._chartsOverlay);
            for(var i=0;i<this._chartsOverlay.length;i++){
                this._chartsOverlay[i].remove();
            }
        }
        if(this._markers && this._markers.length > 0){
            this._map.removeOverlay(this._markers);
        }
    };

    //根据图例选择的类型过滤数据
    StatisticsMap.prototype._filterData = function (chartData) {
        var fiterChartData = [];

        var typeMap = new MapCoreLib.HashMap();

        for (var i = 0; i < this._showType.length; i++) {
            typeMap.put(this._showType[i], "1");
        }
        if ('linePie' != this._options.type) {
            for (var i = 0; i < chartData.length; i++) {
                if (typeMap.get(chartData[i].name) == "1") {
                    fiterChartData.push(chartData[i]);
                }
            }
        }else{
            for (var i = 0; i < chartData.length; i++) {
                if (typeMap.get(chartData[i][0]) == "1") {
                    fiterChartData.push(chartData[i]);
                }
            }
        }

        return fiterChartData;
    };

    var num = 1;

    if(this.gaodeProvider =='gaode'){
        var ChartOverlayGaode = MapCoreLib.ChartOverlayGaode = function ChartOverlay(map,chart){

            this._map = map.map;//供应商map
            this._chart = chart;
            return this.initialize(this._map);
        };

        ChartOverlayGaode.prototype.initialize = function(map){
            //生成div
            var div = this._div = document.createElement("div");
            //赋id
            div.id = this._chart.id;
            // 可以根据参数设置元素外观
            div.style.width = this._chart.width + "px";
            div.style.height = this._chart.height + "px";
            div.setAttribute('name','pie')
            //this.draw();

            //这里必须是绝对定位，不然会影响经纬度定位，然中偏离原来位置
            div.style.position='absolute';
            div.style.zIndex ='-6000000';
            //将该覆盖物添加到标签覆盖物列表
            this._map.getContainer().appendChild(div);

            this._drawEcharts();

            var divText=this._divText=document.createElement("div");
            divText.className = "divText";
            div.appendChild(divText);
            var marker = new AMap.Marker({
                position: new AMap.LngLat(this._chart.layPoint.lng,this._chart.layPoint.lat),
                offset: new AMap.Pixel(this._chart.width / -2 , this._chart.height / -2),
                zoom: 13,
                topWhenClick: true,
                content: div
            });

            return marker;
        };

        ChartOverlayGaode.prototype._drawBarAndLine = function() {
            var legend = [];
            var barData = [];
            for (var i = 0; i < this._chart.data.length; i++) {
                legend.push(this._chart.data[i].name);
                barData.push(this._chart.data[i].value);
            }
            var option = {
                tooltip: this._chart.options.tooltip || {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'line'
                    }
                },
                grid: {
                    x: '0',
                    x2: '0',
                    y: '0',
                    y2: '0',
                    width: '100%',
                    height: '100%',
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        axisLine: {
                            show: true
                        },
                        data: legend
                    }
                ],
                yAxis: [{
                    show: true,
                    type: 'value'
                }],
                series: [{
                    type: this._chart.type,
                    data: barData,
                    itemStyle: this._chart.options.itemStyle || {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }]
            };

            return option;
        }

        ChartOverlayGaode.prototype._drawEcharts = function(){

            //echarts图表配置，下面只是一个示例，可以配置各种图表
            var myChart=echarts.init(document.getElementById(this._chart.id));
            var option;
            if('pie' == this._chart.type){
                option = {
                    tooltip : {
                        trigger: 'item',
                        formatter:this._chart.options.formatter|| "{a} <br/>{b} : {c} ({d}%)"
                    },
                    series : [
                        {
                            name: '',
                            type: 'pie',
                            radius : ['0%', '100%'],
                            //radius : ['12%', '80%'],
                            hoverAnimation: false,
                            label:false,
                            data:this._chart.data,
                            itemStyle: this._chart.options.itemStyle || {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                };
            }  else if ('bar' == this._chart.type) { //柱形图
                option = this._drawBarAndLine();
            } else if ('line' == this._chart.type) { //折线图
                option = this._drawBarAndLine();
            }
            myChart.setOption(option);
            var me = this;
            if(this._chart.options && this._chart.options.itemClickFun){
                myChart.on('click',function(e) {
                    me._chart.options.itemClickFun(me._chart);
                });
            }
        };

    }else{  //百度绘制饼状图
        //console.log(77)
        //百度绘制饼状图
        var ChartOverlay =
            MapCoreLib.ChartOverlay = function ChartOverlay(map, chart) {
                this._map = map.map;//供应商map
                this._chart = chart;
            };
        ChartOverlay.prototype = new BMap.Overlay();

        ChartOverlay.prototype._drawBarAndLine = function() {
            var legend = [];
            var barData = [];
            for (var i = 0; i < this._chart.data.length; i++) {
                legend.push(this._chart.data[i].name);
                barData.push(this._chart.data[i].value);
            }
            var option = {
                tooltip: this._chart.options.tooltip || {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'line'
                    }
                },
                grid: {
                    x: '0',
                    x2: '0',
                    y: '0',
                    y2: '0',
                    width: '100%',
                    height: '100%',
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        axisLine: {
                            show: true
                        },
                        data: legend
                    }
                ],
                yAxis: [{
                    show: true,
                    type: 'value'
                }],
                series: [{
                    type: this._chart.type,
                    data: barData,
                    itemStyle: this._chart.options.itemStyle || {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }]
            };

            return option;
        }

        ChartOverlay.prototype.initialize = function (map) {
            //生成div
            var div = this._div = document.createElement("div");
            //赋id
            div.id = this._chart.id;

            div.style.zIndex = BMap.Overlay.getZIndex(30);

            // 可以根据参数设置元素外观
            div.style.width = this._chart.width + "px";
            div.style.height = this._chart.height + "px";
            // console.log(div.style.zIndex)
            //这里必须是绝对定位，不然会影响经纬度定位，然中偏离原来位置
            div.style.position = 'absolute';
            //将该覆盖物添加到标签覆盖物列表
            //this._map.getPanes().labelPane.appendChild(div);
            this._map.getPanes().labelPane.appendChild(div);
            this._drawEcharts();

            var divText = this._divText = document.createElement("div");
            divText.className = "divText";
            div.appendChild(divText)
            return div;
        };

        ChartOverlay.prototype._drawEcharts = function () {
            //echarts图表配置，下面只是一个示例，可以配置各种图表
            var myChart = echarts.init(document.getElementById(this._chart.id));
            var option;
            if ('pie' == this._chart.type) {//饼图
                option = {
                    tooltip: {
                        trigger: 'item',
                        formatter: this._chart.options.formatter ||"{a} <br/>{b} : {c} ({d}%)"
                    },
                    series: [
                        {
                            name: '',
                            type: 'pie',
                            radius: ['0%', '100%'],
                            label:false,
                            hoverAnimation: false,
                            data: this._chart.data,
                            itemStyle: this._chart.options.itemStyle || {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                };
            } else if ('bar' == this._chart.type) { //柱形图
                option = this._drawBarAndLine();
            } else if ('line' == this._chart.type) { //折线图
                option = this._drawBarAndLine();
            }
            myChart.setOption(option);
            var me = this;

            if (this._chart.options && this._chart.options.itemClickFun) {
                myChart.on('click',function (e) {
                    indexChange.call(this, me._chart);
                    me._chart.options.itemClickFun(me._chart);
                });
            }
            function indexChange(e) {
                num = num + 1;
                var selDiv = $('#'+e.id);
                selDiv.css('z-index',num );
            }
        };

        // 实现绘制方法
        ChartOverlay.prototype.draw = function () {
            // 根据地理坐标转换为像素坐标，并设置给容器
            var pixel = this._map.pointToOverlayPixel(this._chart.layPoint);
            this._div.style.left = pixel.x - this._chart.width / 2 + "px";
            this._div.style.top = pixel.y - this._chart.height / 2 + "px";
        };
    }

    var HashMap =
        MapCoreLib.HashMap = function HashMap(){
            this.object={};
            HashMap.prototype.put=function (key,value){
                this.object[key]=value;
            }
            HashMap.prototype.get = function(key){
                return this.object[key];
            }
        }

})();

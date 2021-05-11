var MapCoreLib = window.MapCoreLib = MapCoreLib || {};
(function () {
    var GeoServerMap = MapCoreLib.GeoServerMap = function (map, json) {
        this._map = map;
        //加载热力图
        this.overlayHeatmap;
        this.json = json;
        if (!this.json.layers) {
            alert('图层名称不能为空');
            return;
        }
        if (!this.json.date) {
            alert('查询语句不能为空');
            return;
        }

        this.layers = this.json.layers;
        this.poolLayers = this.json.poolLayers;
        this.appId = json.appId;
        this.radius = this.json.radius || 100;//热力图点详情，搜索点半径（单位：米）
        this.cql = null;
        this.cql2 = json.cql;//后台查询使用
        if (this.json.cql) {
            this.cql = json.cql.replace(/%/g, "%25").replace(/ /g, "%20")
        }
        this.date = this.json.date;
        this.opacity = this.json.opacity || 1;
        //this._map.prejoctUrl = "http://12.99.33.161:8080/";//临时
        this.url = this._map.prejoctUrl + '/optimove/heatmapConv/heatMap.do';
        this.queryUrl = this._map.prejoctUrl + '/optimove/heatmapConv/queryHeatmap.do';
        this.displayOnMinLevel = this.json.displayOnMinLevel || 6;
        this.displayOnMinLevel = this.displayOnMinLevel < 6 ? 6 : this.displayOnMinLevel;
        this.displayOnMaxLevel = this.json.displayOnMaxLevel || 15;
        this._map.removeOverlay(this.overlayHeatmap);
        if (this._map.getZoom() >= this.displayOnMinLevel && this._map.getZoom() <= this.displayOnMaxLevel) {
            this.addGroundOverlay(this._map, this);
        }
        var that = this;
        this.dragedOvery = function () {
            that._map.removeOverlay(that.overlayHeatmap);
            if (that._map.getZoom() >= that.displayOnMinLevel && that._map.getZoom() <= that.displayOnMaxLevel) {
                that.addGroundOverlay(that._map, that);
            }
        };
        this.zoomedOvery = function () {
            that._map.removeOverlay(that.overlayHeatmap);
            if (that._map.getZoom() >= that.displayOnMinLevel && that._map.getZoom() <= that.displayOnMaxLevel) {
                that.addGroundOverlay(that._map, that);
            }
        };

        this.addGeoServerEvent();
    };

    //查询热力图点数据
    GeoServerMap.prototype.queryHeatmapPoint = function (e, fn) {
        var that = this;
        $.ajax({
            url: that.queryUrl,
            async: false,
            cache: false,
            dataType: "json",
            type: "get",
            data: {
                lat: e.lng,
                lon: e.lat,
                date: that.date,
                cql: that.cql2,
                radius: that.radius
            },
            success: function (data) {
                if (data.retCode == '9999') {
                    alert(data.retMsg);
                    return;
                } else {
                    if (fn) {
                        fn(data.data);
                    }
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert("异常:" + XMLHttpRequest.status + ";"
                    + XMLHttpRequest.readyStatus + ";" + textStatus);
            }
        })
    };

    GeoServerMap.prototype.addGeoServerEvent = function () {
        //添加地图监听事件
        var that = this;
        that._map.map.addEventListener("dragend", that.dragedOvery);
        that._map.map.addEventListener("zoomend", that.zoomedOvery);
    };
    GeoServerMap.prototype.removeGeoServerEvent = function () {
        var that = this;
        that._map.map.removeEventListener("dragend", that.dragedOvery);
        that._map.map.removeEventListener("zoomend", that.zoomedOvery);
    };
    GeoServerMap.prototype.addGroundOverlay = function (map, that) {
        //判断如果是全量查询，使用汇总数据表
        var layer = that.layers;
        if (that.poolLayers && map.getZoom() <= 11) {
            layer = that.poolLayers
        } else {
            layer = that.layers;
        }
        console.log(layer);
        var bound = map.getBounds();
        var southWest = bound.getSouthWest();
        var northEast = bound.getNorthEast();
        // 西南角和东北角
        var SW = new MapCore.Point([southWest.lng, southWest.lat]);
        var NE = new MapCore.Point([northEast.lng, northEast.lat]);
        //热力图图层
        groundOverlayOptions = {
            opacity: that.opacity,
            displayOnMinLevel: this.displayOnMinLevel,
            displayOnMaxLevel: this.displayOnMaxLevel
        };
        //访问后台
        //this.prejoctUrl
        var bbox = window.screen.width + "," + window.screen.height + "," + southWest.lng + "," + southWest.lat + "," + northEast.lng + "," + northEast.lat;
        var getUrl = that.url + "?cql=" + that.cql + "&appId=" + that.appId + "&layers=" + layer + "&date=" + that.date + "&param=" + bbox + "," + false
        var groundOverlay = null;
        //先进行参数和并发次数是否超限校验
        //获得热力图
        $.ajax({
            url: that.url,
            async: false,
            cache: false,
            dataType: "json",
            type: "get",
            data: {
                cql: that.cql,
                appId: that.appId,
                layers: layer,
                date: that.date,
                param: bbox + "," + true
            },
            success: function (data) {
                if (data.result == 'fail') {
                    alert(data.retMsg);
                    return;
                } else {
                    groundOverlay = map.groundOverlay(SW, NE, getUrl, groundOverlayOptions);
                    map.addOverlay(groundOverlay);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert("异常:" + XMLHttpRequest.status + ";"
                    + XMLHttpRequest.readyStatus + ";" + textStatus);
            }
        });
        that.overlayHeatmap = groundOverlay;

    }


})();

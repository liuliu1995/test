
/**
 * 地图行政区划边界分级显示
 * @author k3795
 * @version 1.0
 */
var BoundaryMap = function(mapCore, opts) {
	if (!mapCore){
		return;
	}
	this._mapCore = mapCore;
	
	this.interPoint = null;
	
	this.initZoomSize = 11;
	
	// 地图对象
	this.map = mapCore.map;
	
	this.options = opts || {};
	
	this.lastOverlyLine = null;
	
	this.hisOverlyLine = [];
	
	this.hisOverlyPolygon = [];
	
	this.initialize(mapCore, opts);
	
}

BoundaryMap.prototype.initialize = function (map, options) {
	this._createQueryDom (options);
	this._loadBoundariesData(options);
	
}

/**
 * 创建区域查询dom
 */
BoundaryMap.prototype._createQueryDom = function(options) {
	var me = this;
	var domId = options.domId;
	var queryDom = "<h4>地图网格面板</h4>" +
					"<div class='input-item'>" +
					"<label>区县：</label><select id='district' style='width:100px;'>"+
					"<option value='-1'>请选择...</option>" + 
					"</select>" +
					"</div>" +
					"<div class='input-item'>" +
					"<label>街道：</label><select id='street' style='width:100px;'>" + 
					"<option value='-1'>请选择...</option>" +
					"</select>" +
					"</div>";
	$("#" + domId).append(queryDom);
	
	$("#district").change(function() {
		me.districtHandler();
	});
	$("#street").change(function() {
		me.streetHandler();
	});
}

/**
 * 加载行政区边界数据
 */
BoundaryMap.prototype._loadBoundariesData = function(options) {
	var option = {
		sDomArr: ["district"] 
	}
	this.queryDivisions(options.city.id, "district", this.initZoomSize, option)
	
	this.searchSubBoundary(options.city.id);
}

BoundaryMap.prototype.searchSubBoundary = function (id) {
	var me = this;
	
	var colorPanel = new ColorPanel(me._mapCore, me.options);
	$.ajax({
		url : me._mapCore.prejoctUrl + "/optimove/stmap/queryDivisionsAll.do",
		async :false,
		cache:false,
		type : "post",
		dataType: "json",
		data: {pid: id},
		success : function(_data) {
				if(_data.retCode=='0000'){
					var sRegionals = _data.sRegionals;
					
					// 将边界数据绘制成边界
					if( 'gaode' == me._mapCore.provider){
						// 清楚之前的边界
						//me.clearBoundary_gd();
						for(var i=0; i < sRegionals.length; i++) {
							//  下级边界
							var divisions = sRegionals[i].divisions;
							for(var j = 0; j < divisions.length; j++) {
								var color = colorPanel.randomColorPanel();
								me.drawBoundary_gd(divisions[j], color);
							}
						}
					}else {
						// 清楚之前的边界
						// me.clearBoundary_bd();
						for(var i=0; i < sRegionals.length; i++) {
							//  下级边界
							var divisions = sRegionals[i].divisions;
							for(var j = 0; j < divisions.length; j++) {
								var color = colorPanel.randomColorPanel();
								me.drawBoundary_bd(divisions[j], color);
							}
						}
					}
				}else{
					alert("获得行政数据出错-");
				}
			},
			error:function(XMLHttpRequest, textStatus, errorThrown){
				alert("异常:获得边界数据出错"+textStatus);
			}
	})
}

/**
 * 区县查询事件
 */
BoundaryMap.prototype.districtHandler = function () {
		var zoomSize = 11;
		var id = $("#district").find("option:selected").val();
		if(id == "-1") {
			this.cityHandler();
			return;
		}
		var option = {
			color: "#1de7e8", // 蓝色 #e4a30c 红色 #962916 黄色 #e4a30c 橙色 #e45f0e
			sColor: "#962916",
			sDomArr: ["street"],
			doCallback: true
		}
		this.queryDivisions(id, "street", zoomSize, option);
	}

/**
 * 街道查询事件
 */
BoundaryMap.prototype.streetHandler = function () {
		var zoomSize = 13;
		var id = $("#street").find("option:selected").val();
		if(id == "-1") {
			this.districtHandler();
			return;
		}
		var option = {
			color: "#962916", // 蓝色 #2f8de0 红色 #962916 黄色 #e4a30c 绿色 #70d85e
			sColor: "#962916",
			sDomArr: [],
			doCallback: true
		}
		this.queryDivisions(id, "street", zoomSize, option);
	}

/**
 * 查询行政区数据
 */
BoundaryMap.prototype.queryDivisions = function (id, domId, zoomSize, option) {
	var me = this;
	$.ajax({
		url : me._mapCore.prejoctUrl + "/optimove/stmap/queryDivisions.do",
		async :false,
		cache:false,
		type : "post",
		dataType: "json",
		data: {pid: id},
		success : function(_data) {
				if(_data.retCode=='0000'){
					var divisions = _data.divisions;
					var boundaries = _data.boundaries;
					var interPoint = _data.interPoint;
					var point = new MapCore.Point(interPoint);
					me.interPoint = point;
					
					if(option.doCallback) {
						
						if(option.sDomArr.length > 0) {
							me.options.queryParams.districtSelectCallback(boundaries)
						} else {
							me.options.queryParams.streetSelectCallback(boundaries)
						}
						if( 'gaode' == me._mapCore.provider){
							if(me.lastOverlyLine != null) {
								me.map.remove(me.lastOverlyLine);
							}
							me.drawBoundaryLine_gd(boundaries, me.options.queryParams.highLightLineColor);
						} else {
							if(me.lastOverlyLine != null) {
								me.map.removeOverlay(me.lastOverlyLine);
							}
							me.drawBoundaryLine_bd(boundaries, me.options.queryParams.highLightLineColor);
						}
					}
					// 将边界数据绘制成边界
					if( 'gaode' == me._mapCore.provider){
						// 清楚之前的边界
						//me.clearBoundary_gd();
						//console.log(11)
						
						//me.drawBoundary_gd(division, option.color);
						me.resetDom(option.sDomArr);
						for(var i=0; i < divisions.length; i++) {
							$("#" + domId).append('<option value="' + divisions[i].id + '">'+ divisions[i].name +'</option>');
							// 下级边界

							//me.drawBoundary_gd(divisions[i].boundary, divisions[i].name, option.sColor);
						}
					}else {
						// 清楚之前的边界
						//me.clearBoundary_bd();
						//me.drawBoundary_bd(division, option.color);
						me.resetDom(option.sDomArr);
						for(var i=0; i < divisions.length; i++) {
							$("#" + domId).append('<option value="' + divisions[i].id + '">'+ divisions[i].name +'</option>');
							// 下级边界
							//me.drawBoundary_bd(divisions[i].boundary, divisions[i].name, option.sColor);
						}
					}
				}else{
					alert("获得省级行政数据出错-");
				}
			},
			error:function(XMLHttpRequest, textStatus, errorThrown){
				alert("异常:获得边界数据出错"+textStatus);
			}
	});
}

/**
 * 高德绘制行政区边界
 */
BoundaryMap.prototype.drawBoundary_gd = function (division, color) {
	var me = this;
	var polyArray = division.boundary;
	var name = division.name;
	// 判断是否绘制边界线
	if(me.options.drawParms.DrawLine || me.options.drawParms.DrawLine == true) {
		// 绘制边界线
		var polylineOverlay = new AMap.Polyline({
			path: polyArray,
			strokeColor: color || '#f16851',
			strokeOpacity: 0.3,
			enableClicking: false
		});
		//添加新的画线到地图上
		
		//map.addOverlay(polylineOverlay);
		polylineOverlay.setMap(this.map)
		this.hisOverlyLine.push(polylineOverlay);
	}
	
	// 判断是否绘制面
	if(me.options.drawParms.DrawPolygon || me.options.drawParms.DrawPolygon == true) {
		// 绘制面
		var polygon = new AMap.Polygon({
			path: polyArray,
			strokeColor: color,
			strokeOpacity: 0.5,
			fillColor: color,
			fillOpacity: 0.7,
			enableClicking: false
		});
		polygon.setMap(this.map);
		this.hisOverlyPolygon.push(polygon);
		
		//this._mapCore.polygonAddMouse(name, polygon)
		if(this.options.isRegionalEdit) {
			this.enableEditMode_gd(division, polygon,this.options.editCloseCallBack);
			
		}
	}
}

/**
 * 百度绘制行政区边界
 */
BoundaryMap.prototype.drawBoundary_bd = function (division, color) {
	var me = this;
	var path ="";
	var polyArray = division.boundary;
	var name = division.name;
	var id = division.id;
	
	for (var i = 0; i < polyArray.length; i++) {
		if (i == polyArray.length - 1) {
			path += polyArray[i][0] + ", " + polyArray[i][1];
		} else {
			path += polyArray[i][0] + ", " + polyArray[i][1] +";";
		}
	}
	// 判断是否绘制边界线
	if(me.options.drawParms.DrawLine || me.options.drawParms.DrawLine == true) {
		// 绘制边界线
		var polylineOverlay = new BMap.Polyline(path, {
			strokeColor: color || '#f16851',
			strokeOpacity: 0.3,
			enableClicking: false
		});
		//添加新的画线到地图上
		
		this.map.addOverlay(polylineOverlay);
		this.hisOverlyLine.push(polylineOverlay);
	}
	
	// 判断是否绘制面
	if(me.options.drawParms.DrawPolygon || me.options.drawParms.DrawPolygon == true) {
		// 绘制面
		var polygon = new BMap.Polygon(path,{
			strokeColor: color,
			strokeOpacity: 0.1,
			fillColor: color,
			fillOpacity: 0.7,
			enableClicking: true
		});
		this.map.addOverlay(polygon);
		this.hisOverlyPolygon.push(polygon);

		if(this.options.isRegionalEdit) {
			this.enableEditMode_bd(division, polygon,this.options.editCloseCallBack);
		}
	}
}

/**
 * 高德绘制行政区边界
 */
BoundaryMap.prototype.drawBoundaryLine_gd = function (polyArray, color) {
	var me = this;
	// var polyArray = division.boundary;
	// var name = division.name;
	// 绘制边界线
	var polylineOverlay = new AMap.Polyline({
		path: polyArray,
		strokeColor: me.options.lineColor || '#f16851',
		strokeOpacity: 0.3,
		enableClicking: false
	});
	//添加新的画线到地图上
	
	polylineOverlay.setMap(this.map)
	this.lastOverlyLine = polylineOverlay;
	this.hisOverlyLine.push(polylineOverlay);
}

/**
 * 百度绘制行政区边界
 */
BoundaryMap.prototype.drawBoundaryLine_bd = function (polyArray, color) {
	var me = this;
	var path ="";
	//var polyArray = division.boundary;
	
	for (var i = 0; i < polyArray.length; i++) {
		if (i == polyArray.length - 1) {
			path += polyArray[i][0] + ", " + polyArray[i][1];
		} else {
			path += polyArray[i][0] + ", " + polyArray[i][1] +";";
		}
	}
	// 绘制边界线
	var polylineOverlay = new BMap.Polyline(path, {
		strokeColor: color || '#132dbf',
		strokeOpacity: 0.5,
		enableClicking: false
	});
	//添加新的画线到地图上
	
	this.map.addOverlay(polylineOverlay);
	
	this.lastOverlyLine = polylineOverlay;
	this.hisOverlyLine.push(polylineOverlay);
}

/**
 * 高德启用图形编辑菜单
 */
BoundaryMap.prototype.enableEditMode_gd = function (division, polygon,callback) {
	var me = this;
	
	var editor = null;
	
	this.map.plugin(["AMap.PolyEditor"], function() {
		editor = new AMap.PolyEditor(me.map, polygon);
		
		
		var menu = new AMap.ContextMenu();
		
		editor.on("end", function(event) {
			console.log(event.target);
			
			// 将新的行政区边界信息保存到数据库中
			me.saveDivision(division, polygon, event.target);
		});
		
		menu.addItem("编辑", function(){
			editor.open();
		}, 0);
		
		menu.addItem("关闭", function(){
			editor.close();
		}, 1);
		
		polygon.on("rightclick", function(e){
			menu.open(me.map, e.lnglat);
		});
	});
	
}

/**
 * 百度启用图形编辑菜单
 */
BoundaryMap.prototype.enableEditMode_bd = function (division, polygon,callback) {
	var me = this;
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
			//meMap.editEventParam.overlay = plane;
			//callback(division, plane); // 返回新编辑行政区边界
			
			// 将新的行政区边界信息保存到数据库中
			me.saveDivision(division, polygon, plane);
		}
		var menu = new BMap.ContextMenu();
		menu.addItem(new BMap.MenuItem("编辑", openEdit.bind(polygon)));
		menu.addItem(new BMap.MenuItem("关闭", closeEdit.bind(polygon)))
		polygon.addContextMenu(menu);
}

/**
 * 保存行政区
 */
BoundaryMap.prototype.saveDivision = function (division, oldPolygon, newPolygon) {
	var me = this;
	//var curZoomSize = me._mapCore.getZoom();
	console.log(newPolygon.getPath());
	var colorPanel = new ColorPanel(me._mapCore, me.options);
	$.ajax({
		url : me._mapCore.prejoctUrl + "/optimove/stmap/saveDivision.do",
		async :false,
		cache:false,
		type : "post",
		dataType: "json",
		data: {id: division.id, data: newPolygon.getPath()},
		success : function(_data) {
				if(_data.retCode=='0000'){
					// var sRegionals = _data.sRegionals;
					// 清除旧的行政区边界，加载新的行政区边界
					me._mapCore.removeOverlay(oldPolygon);
					//division.boundary = newPolygon.getPath();
					var boundary = [];
					for(var i = 0; i < newPolygon.getPath().length; i++) {
						boundary.push([newPolygon.getPath()[i].lng, newPolygon.getPath()[i].lat]);
					}
					division.boundary = boundary;
					//me._mapCore.addOverlay(newPolygon);
					// 将边界数据绘制成边界
					var color = colorPanel.randomColorPanel();
					if( 'gaode' == me._mapCore.provider){
						// // 清楚之前的边界
						// me.clearBoundary_gd();
						// for(var i=0; i < sRegionals.length; i++) {
							// //  下级边界
							// var divisions = sRegionals[i].divisions;
							// for(var j = 0; j < divisions.length; j++) {
								var color = colorPanel.randomColorPanel();
								me.drawBoundary_gd(division, color);
							// }
						// }
					}else {
						// // 清楚之前的边界
						 // me.clearBoundary_bd();
						// for(var i=0; i < sRegionals.length; i++) {
							// //  下级边界
							// var divisions = sRegionals[i].divisions;
							// for(var j = 0; j < divisions.length; j++) {
								me.drawBoundary_bd(division, color);
							// }
						// }
					}
				}else{
					alert("获得行政数据出错-");
				}
			},
			error:function(XMLHttpRequest, textStatus, errorThrown){
				alert("异常:获得边界数据出错"+textStatus);
			}
	})
}

BoundaryMap.prototype.setMarkerInColor = function (marker, color) {
	if("red" == color) {
		this._mapCore.setMarkerIcon(marker, this._mapCore.nginxImage + "/upload/262a79f4-af81-45a8-b824-f489b06d15bd.png")
	} else if("blue" == color) {
		this._mapCore.setMarkerIcon(marker, this._mapCore.nginxImage + "/upload/f84cf1cd-e2e3-493e-a44c-90008bbf3068.png")
	} else if("yellow" == color) {
		this._mapCore.setMarkerIcon(marker, this._mapCore.nginxImage + "/upload/e10283e6-d9bf-41a0-96e1-ef3efbaf1a45.png")
	} else if("green" == color) {
		this._mapCore.setMarkerIcon(marker, this._mapCore.nginxImage + "/upload/ffb5dcb2-0ada-4aaf-a09b-af7f4a5b45a0.png")
	} else {
		alert("未知的颜色，color=" + color)
		this._mapCore.setMarker(marker);
	}
}

BoundaryMap.prototype.clearBoundary_gd = function (map) {
	for(var i = 0; i < this.hisOverlyLine.length; i++) {
		this.map.remove(this.hisOverlyLine[i]);
	}
	
	for(var i = 0; i < this.hisOverlyPolygon.length; i++) {
		this.map.remove(this.hisOverlyPolygon[i]);
	}
}

BoundaryMap.prototype.clearBoundary_bd = function (map) {
	for(var i = 0; i < this.hisOverlyLine.length; i++) {
		this.map.remove(this.hisOverlyLine[i]);
	}
	
	for(var i = 0; i < this.hisOverlyPolygon.length; i++) {
		this.map.remove(this.hisOverlyPolygon[i]);
	}
}
	
BoundaryMap.prototype.resetDom = function (sDomArr) {
	for(var i = 0; i < sDomArr.length; i++) {
		$("#" + sDomArr[i]).empty();
		$("#" + sDomArr[i]).append('<option value="-1">请选择...</option>');
	}
}

/**
 * 取色板原型
 */
var ColorPanel = function(mapCore, opts) {
	this.mainPanel = ['#ffff00', '#ff4500']; // 取色板主颜色基调
	this.colorNum = 64; // 初始随机颜色梯度
	
	this.useColorLib = opts.useColorLib || true;
	this.colorLib = opts.colorLib || ["#03A9F4" , "#8BC34A", "#FF5722", "#de2719", "#E91E63", "#4CAF50"];
}
/**
 * 随机取色板
 */
ColorPanel.prototype.randomColorPanel = function () {
	
	if(this.colorLib.length > 0 && this.useColorLib) {
		var randomNum = Math.floor(Math.random() * this.colorLib.length);
		return this.colorLib[randomNum];
	}
	
	// 取色板主颜色转换为10进制rgb格式
	var sColorRgb = this.colorRgb(this.mainPanel[0]);
	var eColorRgb = this.colorRgb(this.mainPanel[1]);
	
	var sR = (eColorRgb[0] - sColorRgb[0]) / this.colorNum;
	var sG = (eColorRgb[1] - sColorRgb[1]) / this.colorNum;
	var sB = (eColorRgb[2] - sColorRgb[2]) / this.colorNum;
	
	// 获取随机梯度数
	var randomNum = Math.ceil(Math.random() * this.colorNum);
	var regionalColor = [parseInt(sR * randomNum  + sColorRgb[0]) , parseInt(sG * randomNum + sColorRgb[1]), parseInt(sB * randomNum + sColorRgb[2])];
	var color = this.colorHex(regionalColor);
	return color;
}

/**
 * 16进制颜色转换成rgb格式的十进制模式
 */
ColorPanel.prototype.colorRgb = function (hexColor) {
	var reg = /^#[0-9a-fA-F]{3}|[0-9a-fA-F]{6}$/;
	hexColor = hexColor.toLowerCase();
	if (reg.test(hexColor)) {
		if (hexColor.length == 4) {
			var newColor = "#";
			for (var i = 1; i < 4; i++) {
				newColor += hexColor.slice(i, i+1).concat(hexColor.slice(i, i+1));
			}
			hexColor = newColor;
		}
		var colorChange = [];
		for (var i = 1; i < 7; i+=2) {
			colorChange.push(parseInt("0x" + hexColor.slice(i, i+2)));
		}
		return colorChange;
	}
}

/**
 * 10进制颜色转换成的16进制字符串
 */
ColorPanel.prototype.colorHex = function (rgbColor) {
		var colorArr = rgbColor;
		var hexStr = "#";
		for (var i = 0; i < colorArr.length; i++) {
			var hex = Number(colorArr[i]).toString(16);
			if (hex === "0") {
				hex += hex;
			}
			hexStr += hex;
		}
		return hexStr;
}


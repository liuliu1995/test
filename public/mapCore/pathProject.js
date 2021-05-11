﻿/**
 * ## 孙小强  ---2019---01---14---
 * @param {map} 百度地图实例object 
 */
var MapCordLib = window.MapCoreLib = MapCoreLib || {};
(function(){
    var PathProject =  MapCoreLib.PathProject = function(map,Dom,Data,provider,appid,panel){
        //楔入的参数不能为false || 不能为空
        if(map && Dom && Data && appid){
            this.map = map;
            //起点
            this.Doms = Dom;
            //模拟数据
            this.Data = Data;
            //动画效果
            var animates;
            //等时圈功 出行类型（最短时间，最短路程）
            var policy;
            //第三方地图供应商
            this.provider = provider;
            //appid
            this.appid = appid;
            //左侧工具面板的展示控制
            this.panel = panel;
            //公共变量
            this.adrAll;
            this.values;
            //更改this指向
            var _this = this;
          
            //-------------start---------------处理data数据使用的公共容器及参数的配置-----------------------
            window.Templates_arrays = new Array();
            //window.Templates_status = "";
            window.Templates_start = "-1";
            window.Templates_end = "-1";
            window.Templates_json = new Object();
            window.Templates_PointArray = new Array();
            window.Templates_DataContainer = new Object();
            //添加时间标记
            uniqueNumber.previous = 0;
			//添加坐标点的name属性  -->renbw
			//window.Templates_PointNames = new Array();
			//添加坐标点的id属性
			//window.Templates_PointIds = new Array();
            window.poiIcon = "";
            //规划顺序
            window.ant_tour ="";
            //startPoint
            window.startPoint = {};
            //endPoint
            window.endPoint = {};
			//新的起始点   -->renbw
			window.NewStartPoint = new Array(2);
			//新的终止点   -->renbw
			window.NewEndPoint = new Array(2);
            //途径点对象
            window.way_points = new Array();
			//存储所有的点的属性
			window.Templates_PointAll = new Array();
			//此数组中存储不需要点的序号
			window.Templates_OrderNum = new Array();
			//右侧工具栏删除添加点的坐标
			window.Templates_DelPoints = new Array();
			//设置回调函数
            window.pathProjectCallBackFun = Data.callBackFun;
            //-------------End------------------处理data数据使用的公共容器及参数的配置-----------------------
            //poiIcon 
            if(this.Data.poiIcon){
            	window.poiIcon = this.Data.poiIcon==undefined ? "":this.Data.poiIcon;
            }

            //----------------Start------------------工具栏HTML元素---------------------------------------
            var TemplateList ="<div class='searchContainer'>";
            TemplateList+="<div class='searchContainer_div' style='padding: 10px'>";
            TemplateList+="<select class='origin' id='selectBox' onchange='_origins()'>";
            TemplateList+="<option selected='selected'>选择起点</option>";
            TemplateList+="<option id='2' value='当前定位'>当前定位</option>";
            TemplateList+="<option id='3' value='当前搜索'>当前搜索</option>";
            TemplateList+="</select>";
            TemplateList+="<input class='selectInpt' id='originInt' type='text'>";
            TemplateList+="<select  class='addressStarts' id='selectBoxs' onchange='_destinationQuery()'>";
            TemplateList+="<option selected='selected'>选择终点</option>";
            TemplateList+="<option id='1' value='当前定位'>当前定位</option>";
            TemplateList+="<option id='2' value='当前搜索'>当前搜索</option>";
            TemplateList+="</select>";
            TemplateList+="<input id='destination' class='selectInpt' type='text'>";
            TemplateList+="<select class='terminusS' name='' id='selectBoxs'>";
            TemplateList+="<option selected='selected'>选点搜索</option>";
            TemplateList+="</select>";
            TemplateList+="<input class='selectInpt' id='addressStart' type='text' onfocus='_terminus()'>";
            TemplateList+="<select class='terminusS' id='go_way' style='text-align: center;' onchange='_tripWay()'>";
            TemplateList+="<option selected='selected'>出行方式</option>";
            TemplateList+="<option>驾车</option>";
            TemplateList+="<option>骑行</option>";
            TemplateList+="<option>步行</option>";
            TemplateList+="</select>";
            TemplateList+="<button class='Start_go' onclick='_pathProject()'>GO</button>";
            TemplateList+="</div>";
            TemplateList+="</div>";
            TemplateList+="<div class='NavOrigins' style='border-radius: 5px;right: 10px;'>";
            TemplateList+="<p style='height:20px;line-height: 20px;text-align: center;background: #cccccc;padding:5px;border-top-left-radius: 5px;border-top-right-radius: 5px;font-size: 14px;'>路径规划候选点</p>";		
            TemplateList+="<p class='public_sty' style='text-align: center;color: blue;'>起点</p>";
            TemplateList+="<p class='public_sty'>";
            TemplateList+="<span class='public_sty_span'>起:</span>";
            TemplateList+="<input id='addrStart' class='public_sty_input' type='text'/>";
            TemplateList+="</p>" ;
            TemplateList+="<p class='public_sty' style='text-align: center;color: blue;'>终点</p>";
            TemplateList+="<p class='public_sty'>";
            TemplateList+="<span class='public_sty_span'>终:</span>";
            TemplateList+="<input id='addrStarts' onchange='terminuAll()' class='public_sty_input' type='text'/>";
            TemplateList+="</p>";
            TemplateList+="<p class='public_sty' style='text-align: center;color: blue;'>出行策略</p>";
            TemplateList+="<p class='public_sty'><span>出行方式:</span><span id='tripWay' class='c'></span></p>";
            TemplateList+="<p id='bfd' class='public_sty' style='text-align: center;color: blue;'>拜访点</p>";
            TemplateList+="<div style='height:400px;overflow-y: scroll;border-bottom: 1px solid #ccc;border-top: 1px solid #ccc;' id='serverContent'></div>";
            TemplateList+="<div style='height:400px;display:none;overflow-y:scroll;' id='serverText'>";
            TemplateList+="<p id='bfd' class='public_sty' style='text-align: center;color: blue;'>规划结果</p>";
            TemplateList+="<div id='start'><p class='sort'>";
            TemplateList+="<span class='sortIcon'>起</span>";
            TemplateList+="<span class='userStarts'></span></br><span class='sortContent' id='qi'></span></span>";
            TemplateList+="</p></div>";
            TemplateList+="<div id='visitDian'>";
            TemplateList+="</div>";
            TemplateList+="<div id='end'><p class='sort'>";
            TemplateList+="<span class='sortIcon_c'>终</span>";
            TemplateList+="<span class='userStart'></span></br><span class='sortContent' id='terminus'></span>";
            TemplateList+="</p></div>";
            TemplateList+="</div>";
            TemplateList+="</div>";
			TemplateList+="<div class='nav-toggle nav-open '><span >&lt;&lt;</span></div>";
            TemplateList+="<div class='results' style='display: none;'>";
            TemplateList+="<p class='resTitle'>驾车路线规划</p>";
            TemplateList+="<p class='rescontent'>总耗时：<span style='color: red' id='costDuration'></span></p>";
            TemplateList+="<p class='rescontent'>序列号：<span style='olor: red' id='ant_tour'></span></p>";
            TemplateList+="<p class='rescontent' style='border-bottom: none;'>总距离：<span id='ant_tourCost' style='color: red'></span></p>";
            TemplateList+="</div>";
            TemplateList+="<div class='zgObj' id='zgObjs'>";
            TemplateList+="<div class='jdt'>";
			TemplateList+="<span class='colorJdt'></span>";
            TemplateList+="</div>";
            TemplateList+="</div>";
            //----------------End------------------工具栏HTML元素-------------------------------------------


            //将Dom元素渲染至Element
            $(Dom).append(TemplateList);

            if(_this.panel !=true ){
                $(".NavOrigins").hide();
            }else{
                $(".NavOrigins").show();
            };
            //----------------Start-----------------将使用的方法挂载到window对象下----------------------------
		    //右侧滑块 k4321 20190327
		    $(".nav-toggle").click(function(){
			    if($(this).hasClass('nav-open')){
					$(this).removeClass('nav-open');
					$(".nav-toggle").html("&gt;&gt;");
					$(".NavOrigins").animate({
						right:'-260'
					},500);
					$(".nav-toggle").animate({
						right:'0'
					},500);
					setTimeout(function(){
						$(".NavOrigins").css('display','none');
					})
				}else{
					$(this).addClass('nav-open');
					$(".nav-toggle").html("&lt;&lt;");
					$(".NavOrigins").css('display','block');
					$(".NavOrigins").animate({
						right:'10'
					},500);
					$(".nav-toggle").animate({
						right:'260'
					},500);
				}
			})
			//默认加载起点地址的展示
            window._simulation = function(){
                $("#addrStart").val(_this.Data.centerPoint.address);
                $("#originInt").val(_this.Data.centerPoint.address);
                //window.Templates_arrays[0] = _this.Data.centerPoint.address;
                //window.Templates_PointArray[0] = new MapCore.Point([_this.Data.centerPoint.lng,_this.Data.centerPoint.lat]);
                //window.Templates_PointIds.push(" ");
                window.NewStartPoint[0] =  _this.Data.centerPoint.address;
                window.NewStartPoint[1] = new MapCore.Point([_this.Data.centerPoint.lng,_this.Data.centerPoint.lat]) ;
            };
            //出行方式
            window._tripWay = function () {
                $("#tripWay").html("");
                $("#tripWay").append($('#go_way').val());
            };
            //路径规划dom赋值
            window.pathProjects = function () {
                $("#pathProjects").html("");
                $("#pathProjects").append($('#go_ways').val());
            };
            //生成唯一数字
            function uniqueNumber(){
            	var date = Date.now();
            	if(date <= uniqueNumber.previous){
            		date = ++uniqueNumber.previous;
            	}else{
            		uniqueNumber.previous = date;
            	}
            	return date;
            }
            //起点
            window._origins = function () {
                switch ($('.origin').val()) {
                    case "当前定位":
                        this.map.clearOverlays();
                        this.map.getLocationByExplore(function (r) {
                            //window.Templates_PointArray[0] = r;
							window.NewStartPoint[1]= r;  //-->renbw
                            this.map.getLocation(r, function (data) {
                                $("#addrStart").val(data.city + data.district + data.street + data.streetNumber);
                            });
                        });
                    break;
                    case "当前搜索":
                        this.map.clearOverlays();
                        window.Templates_status = 0;
                        window._init();
                    break;
                };
            };
            //终点
            window._destinationQuery = function () {
                switch ($('.addressStarts').val()) {
                    case "当前定位":
                        this.map.clearOverlays();
                        this.map.getLocationByExplore(function (r) {
                            //window.Templates_PointArray[1] = r;
							window.NewStartPoint[0] = r;  //-->renbw
                            this.map.getLocation(r, function (data) {
                                $("#addrStarts").val(data.city + data.district + data.street + data.streetNumber);
                            });
                        });
                    break;
                    case "当前搜索":
                        this.map.clearOverlays();
                        window.Templates_status = 2;
                        window._init();
                    break;
                }
            };
            //拜访点
            window._terminus = function () {
                this.map.clearOverlays();
                window.Templates_status = 1;
                window._init();
            };
            //POI初始化	搜索框
            window._init = function (){
                var HtmlDom = '';
                if (window.Templates_status == 0) {
                    HtmlDom = "originInt";
                } else if (window.Templates_status == 1) {
                    HtmlDom = "addressStart";
                } else if (window.Templates_status == 2) {
                    HtmlDom = "destination";
                };
                ac = this.map.autoComplete({
                    "input": HtmlDom, //建立一个自动完成的对象
                    onSearchComplete: function (data) { },
                    clickSelect: function (e) {
                        var _value = e.item.value;
                        var myValue = _value.province + _value.city + _value.district + _value.street + _value.business;
                        this.map.autoCompleteLocalSearch(myValue);
                    },
                    isLocalSearch: true,
                    localSearchFun: function (pois, searchResult) {
                        var num = searchResult.getNumPois();
                        if (num > 0) {
                            var poi = searchResult.getPoi(0);
                            var address = poi.address ? poi.address : '';
                            if (address.indexOf(poi.city) < 0) {
                                address = (poi.city ? poi.city : '') + address;
                            };
                            if (address.indexOf(poi.province) < 0) {
                                address = (poi.province ? poi.province : '') + address;
                            };
                            if (address.indexOf(poi.province) < 0) {
                                address = (poi.province ? poi.province : '') + address;
                            };
                            poi.address = address;
                            ac.dispose();
                            if (window.Templates_status == 0) {
                                //起点存储point
                                $("#addrStart").val(address);
                                $(".origin").val("选择起点");
                                if(address != "" ||address != null ||address != undefined){
									window.NewStartPoint[0]=address;
                                }
                                if(poi.point.lng != "" && poi.point.lat != ""){
									window.NewStartPoint[1]=poi.point;
                                }
                            } else if (window.Templates_status == 1) {	
                                //拜访点存储
								$("#addressStart").val(address);
								tempPoint = {"address":address,"lat":poi.point.lat,"lng":poi.point.lng,"name":" ","id":uniqueNumber()};
								//路径规划时需要的坐标点（只需要坐标）
								//window.Templates_PointArray.push(poi.point);
								window.Templates_PointAll.push(tempPoint);
                                window._showMarker(poi.point.lng, poi.point.lat, address);
                            } else if (window.Templates_status == 2) {   //
								$("#addrStarts").val(address);
                                $(".addressStarts").val("选择终点");
                                //终点存储point
								if(address != "" ||address != null ||address != undefined){
									window.NewEndPoint[0]=address;
                                }
                                if(poi.point.lng != "" && poi.point.lat != ""){
									window.NewEndPoint[1]=poi.point;
                                }
                            };
                            $("#address").val(address);
                            title = poi.title;
                            ac = null;
                            $("#business").blur();
                            $("#address").focus();
                            window._showMarker(poi.point.lng, poi.point.lat);
                        };
                    }
                });
            };
            //去重复工具
            window._unique = function (array) {
                var r = [];
                for (var i = 0, l = array.length; i < l; i++) {
                    for (var j = i + l; j < l; j++) {
                        if (array[i] == array[j]) j == ++i;
                        r.push(array[i]);
                    };
                };
                return r;
            };
            //point字符串拼接工具
            window._joint = function (array) {
                if(array){
                    var pointString = "";
                    for (var i = 0; i < array.length; i++) {
                    	if(array[i] == undefined){//k4321 delete操作后会产生undefiend 
                    		continue;
                    	}
                    		
                        if (i > 0 && pointString.length >0) {
                            pointString += "|";
                        }
                        pointString += (array[i].lat + "," + array[i].lng);
                    };
                    return pointString;
                };
            };
            //POI初始化并且地址解析
            window._showMarker = function (vlng, vlat, address) {
                var markerPoint = new MapCore.Point([vlng, vlat]);
                //var vIcon = "http://12.99.109.53:9080/optimove/img/marker_sprite.png";
                
                var marker = new MapCore.Marker(markerPoint);
                if(window.poiIcon != undefined || window.poiIcon != ''){
                	this.map.setMarkerIcon(marker, window.poiIcon);
                }
                this.map.addMarker(marker);
                this.map.setCenterAndZoom(markerPoint, 17);
                marker.setAnimation(BMAP_ANIMATION_BOUNCE);
                if (window.Templates_status == 1) {
                    window._bloatedData(address);
                };
            };
            //拜访点数据列表渲染
            window._bloatedData = function (data,index) {
                if (data) { 
                    var p1 = "<p class='public_stys'>";
                    //modify k4321 为兼容ie等其他浏览器使用 id代替event
                    // var p2 = "<span onclick='showstyle(event)' style='font-size:18px;background:red;margin-right:10px;width:20px;height:20px;line-height:20px;border-radius: 50%;display:inline-block;text-align:center;color:#fff;font-weight: bold;' class='public_sty_radio'>-</span>";
                    var target_span_html_id = "target_span_html_"+index;
                    var target_span_img_id = "target_span_img_"+index;
                    var p2 = "<span id='"+target_span_img_id+"' onclick='showstyle(\""+index+"\")' style='font-size:18px;background:red;margin-right:10px;width:20px;height:20px;line-height:20px;border-radius: 50%;display:inline-block;text-align:center;color:#fff;font-weight: bold;' class='public_sty_radio'>-</span>";
                    var name = '<span>姓名 ：';
                    var names = '</span></br>';
                    //modify k4321 为兼容ie等其他浏览器使用 id标记
                    //var p3 = "<span>地址:";
                    var p3 = "<span id='"+target_span_html_id+"'>地址:";
                    var p4 = "<span class='addressTitle'>";
                    var p5 = "</span>";
                    var p6 = "</p>";
                    if(typeof(data.address) == "undefined"){ //data的值有两种可能，一种是获取到得数据，还有一种是自定义添加的数据。   ---renbw
                    	$("#serverContent").append(p1 +p2 + p4 +name+" "+names+ p3+data + p5+ p6);
                    }else{
                    	$("#serverContent").append(p1 +p2 + p4 +name+data.name+names+ p3+data.address + p5+ p6);
                    }
                    $("#dt").show();
                }
            };
            //获取路线策略
            window._address = function () {
                switch ($("#go_way").val()) {
                    case "步行":
                        return "walking";
                        break;
                    case "驾车":
                        return "driving";
                        break;
                    case "骑行":
                        return "riding";
                        break;
                    default:
                        break;
                }
            };
            //-------------------
            //window.showstyle = function(event){
            window.showstyle = function(index){
                //window.Templates_DelPoints = window.Templates_PointArray;
                var target_span_html = $("#target_span_html_"+index);
                var target_span_img  = $("#target_span_img_"+index);
                var add = new Array();
                var itemId = index;
                var itemAddress = target_span_html.html().split("地址:").join("");
                //判断右侧工具栏+/-按钮点击的是+还是-
                if(target_span_img.html() =="-"){//是“-”,说明是要将该店移除，我们这里移除就将   需要移除的点的id存储进数组（window.Templates_DelPoints）中
                	
                	for(var i = 0 ; i < window.Templates_PointAll.length ; i++){
                		if(itemId === window.Templates_PointAll[i].id){
                			window.Templates_DelPoints.push(window.Templates_PointAll[i]);
                		}
                	}
                	//更换+/-按钮
                	target_span_img.css({
                        color:"#999",
                        background:"#f0f0f0"
                    });
                    target_span_img.css({
                        background:"#1ab394"
                    });
                    target_span_img.html("");
                    target_span_img.html("+");
                    
                }else{//是+,说明要将移除的点回复
                	for(var i = 0 ; i < window.Templates_DelPoints.length ; i++){
                		if(index === window.Templates_DelPoints[i].id){
                			window.Templates_DelPoints.splice(i,1);
                		}
                		target_span_html.css({
                            color:"#000",
                            background:"#fff"
                        });
                        target_span_img.css({
                            background:"red"
                        });
                        target_span_img.html("");
                        target_span_img.html("-");
                	}
                }
            };
            //路径规划成功后的回调
            window.pathPlanning_CallBack = function(data){
                if(data.result !="ok"){
                    //alert("路线规划失败，请更换KEY之后再试");
                	//关闭进度条
                	window.setTimeoutEdn();
                	alert(data.errorMsg);
                    return; 
                };
                    _this.values = true;
                    //路线规划类型
                    var policy;
                    //拜访点(point)
                    var bfdAll = new Array();
                    //耗时 单位分
                    var costDuration = Math.ceil(data.costDuration/60);
                    //总距离 单位/km
                    var ant_tourCost = data.cost /1000;
                    //规划顺序
                    var ant_tour = data.path;
                    $(".results").show();
                    $(".results").animate({
                        'opacity': '1',
                        'right': '17%'
                    }, 1000);
                    $("#costDuration").html(costDuration +"分钟");
                    $("#ant_tour").html(ant_tour);
                    $("#ant_tourCost").html(ant_tourCost+"km");
                    $("#serverContent").hide();
                    $("#bfd").hide();
                    $("#dt").hide();
                    $("#serverText").show();
                    var options = data.path.split(" ");
					
                    var optionList = new Array();
                    options.forEach(function(item,index){
                        var it = options.indexOf("");
                        if(it > -1){
                            options.splice(it,1);
                        };
                        if (item != "") {
                            optionList.push(window.Templates_arrays[index]);
                        };
                    });
                    
                    
                    //window.ant_tour_points = optionList;
                    var StartPoint;
                    var endPoint;
					//var PointName;//-->renbw
                    //var indexs = optionList.length-1;
                    
					//起/终点 DOM赋值
                    /*if(options){
                    	options.forEach(function(item,index){
                    		if(index == options.length-1){
                    			$("#destination").val(window.Templates_PointAll[item].address);
                                $("#addrStarts").val(window.Templates_PointAll[item].address);
                                $(".userStart").html(window.Templates_PointAll[item].name);
                    		}
                    	})
                    	var op = options[options.length-1].split(",");
                    	
                    }*/
                    var as = [];
						
					//遍历后台返回的路径规划次序数组，依次按照数组中的次序作为下标得到相应数据，将数据一次存储相应容器(数组)
					options.forEach(function(item,index){
						var temp = item.split(",");   //切割item，并判断item是否是多个用“，”分割的点。   ---->renbw
						if(index==0){//当下标为0时，表示当前item是起始点								 ---->renbw
							if(temp.length > 1){//判断当前item是否是一个数组，大于1则代表是多个点，将切割后的点显示在右侧工具栏   ---->renbw
								temp.forEach(function(item1,index1){
									if(index1 == 0){
										$("#qi").html(window.Templates_PointAll[item1].address);
										$(".userStarts").html(window.Templates_PointAll[item1].name);
									}else{
										$("#start").append("<p class='sort'><span class='sortIcon'>起</span><span class='userStarts1'>"+window.Templates_PointAll[item1].name+"</span></br><span class='sortContent' id='qi'>"+window.Templates_PointAll[item1].address+"</span></p>");
									}
								});
								item = temp[0];
							}else{
								$("#qi").html(window.Templates_PointAll[item].address);
								$(".userStarts").html(window.Templates_PointAll[item].name);
							}
							StartPoint = window.Templates_PointArray[item];
							window.startPoint = window.Templates_PointAll[item];
						}else if(index==options.length-1){//当下标为options.length-1时，表示当前坐标是终止点
							if(temp.length > 1){
								temp.forEach(function(item1,index1){
									if(index1 == 0){
										$("#terminus").html(window.Templates_PointAll[item1].address);
										$(".userStart").html(window.Templates_PointAll[item1].name);
									}else{
										$("#end").append("<p class='sort'><span class='sortIcon_c'>终</span><span class='userStart1'>"+window.Templates_PointAll[item1].name+"</span></br><span class='sortContent' id='terminus'>"+window.Templates_PointAll[item1].address+"</span></span></p>");
									}
								});
								item = temp[0];
							}else{
								$("#terminus").html(window.Templates_PointAll[item].address);
								$(".userStart").html(window.Templates_PointAll[item].name);
							}
							endPoint = window.Templates_PointArray[item];
							window.endPoint = window.Templates_PointAll[item];
						}else{   //代表途经点
							var TempPoint = {};
							if(temp.length > 1){
								temp.forEach(function(item1,index1){
									TempPoint = window.Templates_PointAll[item1];
									$("#visitDian").append("<div class='sort'><span class='sortIcon_b'>拜</span><span class='userStart2'>"+TempPoint.name+"</span></br><span class='sortContent'>"+TempPoint.address+"</span></span></div>");
								});
								item = temp[0];
							}else{
								TempPoint = window.Templates_PointAll[item];
								$("#visitDian").append("<div class='sort'><span class='sortIcon_b'>拜</span><span class='userStart2'>"+TempPoint.name+"</span></br><span class='sortContent'>"+TempPoint.address+"</span></span></div>");
							}
							bfdAll.push(window.Templates_PointArray[item]);
							window.way_points.push(TempPoint);
						}
					});
                    if ($("#go_way").val() == "驾车") {
                        if(_this.Data.policy){
                            policy =_this.Data.policy;
                        }else{
                            policy = "LEAST_DUSTANCE";
                        };
                        //顺序
                        window.ant_tour = ant_tour;
                        
						 /*var resultData = {};
                        resultData.policy = policy;
                        resultData.startPoint = startPoint;
                        resultData.endPoint = endPoint;
                        resultData.wayPoints = bfdAll;
						//使用回调函数，让业务系统自己实现marker绘制 k4321
                        if(window.pathProjectCallBackFun&&typeof window.pathProjectCallBackFun === "function"){
                        	window.pathProjectCallBackFun(resultData);
    					}else if(window.pathProjectCallBackFun){
    						window[window.pathProjectCallBackFun](resultData);
    					}*/
                        
						
						var pathOptions = {};
						if(_this.Data.options &&_this.Data.options.pathOptions){
							pathOptions = _this.Data.options.pathOptions;
						}
						
						/*pathOptions = {
							autoComplete:true,//所有展示自定义
							
							autoLine:true, //自定义路线
							lineStyle:{     //自定义样式
								strokeColor:"green",
								strokeWeight:5,
								strokeOpacity:0.6
							} 
						} ;
						*/
						this.map.drivingRoute(policy, StartPoint, endPoint, bfdAll,pathOptions);
						
						/*map.drivingRoute($scope.policy.id,$scope.startPoint,inQuitimesPoints[end],pathPoints,{
							autoComplete:true,//所有展示自定义
							autoLine:true, //自定义路线
							lineStyle:{     //自定义样式
								strokeColor:"green",
								strokeWeight:5,
								strokeOpacity:0.6
							} 
						});)*/
						
                        //k4321 增加规划自定义 start
                       /* var options = {};
                        options.autoMarker = true;
                        //途经点图片
                        options.wayIcon = "http://12.99.98.9:8082/nbcbimages/upload/94eb4e8c-a994-4246-b2f9-a55d2b535093.png";
                        options.startIcon = "http://12.99.98.9:8082/nbcbimages/upload/49ba1d8f-b6bf-41ad-94cd-225c9bce317b.png";
                        //终止点图片， 前提 autoStartEndMarker = true
                        options.endIcon = "http://12.99.98.9:8082/nbcbimages/upload/fb86daaf-849e-4055-88f7-a5fa142d7852.png";
                       
                        this.map.drivingRoute(policy, StartPoint, endPoint, bfdAll,options);
						*/
                    };
                    //关闭进度条
                    window.setTimeoutEdn();
                    setTimeout(function () {
                        $(".results").animate({
                            'right': '0',
                            'opacity': '0'
                        }, 1000);
                    }, 15000);
                
            };
            
            //开始进度条动画效果
            window.animate = function(){
            	var funAn =  function(){
                    $(".colorJdt").animate({
                        width:"100%"
                    },3500,function(){
                         $(".colorJdt").css({width:"0%"});
                         funAn();
                    });
                 };
                $(".zgObj").show(funAn());
            };
            //结束进度条动画效果
            window.setTimeoutEdn = function(){
                $(".zgObj").hide();
                $("#zgObjs").hide();
                clearInterval(_this.animates);
            };
            //路线开始规划
            window._pathProject = function () {
                if(_this.values !=true){
                    if ($("#tripWay").val() == "" || $("#tripWay").val() == null || $("#tripWay").val() == undefined) {
                        this.map.clearOverlays();
                        var json1 = new Object();
                        var pt1, pt2;
                        
                        //在路径规划之前删除右侧工具栏删掉的点的数据
                        window.Templates_DelPoints.forEach(function(item,index){
                        	var temp = window.Templates_PointAll.indexOf(item);
                        	if(temp != -1){
                        		window.Templates_PointAll.splice(temp,1);
                        	}
                        })
                        
                        
						//添加坐标点
						if(window.NewStartPoint[1]){//起始点
							tempPoint = {
								"address":window.NewStartPoint[0],
								"lat":window.NewStartPoint[1].lat,
								"lng":window.NewStartPoint[1].lng,
								"name":" ",
								"id":" "
							};
							window.Templates_PointAll.unshift(tempPoint);
							window.Templates_start = "0";
						}
						if(window.NewEndPoint[1]){//终止点
							tempPoint = {
								"address":window.NewEndPoint[0],
								"lat":window.NewEndPoint[1].lat,
								"lng":window.NewEndPoint[1].lng,
								"name":" ",
								"id":" "
							};
							window.Templates_PointAll.push(tempPoint);
							window.Templates_end = ""+(window.Templates_PointAll.length-1);
						}
						//将坐标点存入window.Templates_PointArray数组，以便进行路径规划
						window.Templates_PointAll.forEach(function(item,index){
                        	window.Templates_PointArray.push(new MapCore.Point([item.lng,item.lat]));
                        })
						
                        if(_this.appid){
                            window.Templates_json.appId=_this.appid;
                        }else{
                            alert("AppId 不可为空");
                            return;
                        };
                        window.Templates_json.policy = _this.Data.policy;
                        window.Templates_json.routeType = _this.Data.routeType||window._address();
                        if(_this.provider){
                            window.Templates_json.provider = _this.provider;
                        }else{
                            window.Templates_json.provider = "10001";
                        };
                        //window.Templates_json = _this.Data;
                        window.Templates_json.delRepeatType = _this.Data.delRepeatType;
                        window.Templates_json.start = window.Templates_start;
                        window.Templates_json.end = window.Templates_end;
                        window.Templates_json.wayPoints = window._joint(window.Templates_PointArray);
                        json1.jsonParams = JSON.stringify(window.Templates_json);
                        json1.callBackFun = "pathPlanning_CallBack";
                        window.Templates_DataContainer = json1;
                        //开启进度条
                        window.animate();
                        if(_this.Data.routeType =="driving"){
                           this.map.pathPlanning(json1);
                        }else{
                            this.map.pathPlanning(json1);
                            alert("路径规划路线绘制目前只支持驾车模式，步行、骑车只有结果展示");
                        }
                    };
                }else{
                    alert("请勿重复绘制");
                    return;
                };
            };
            //对携入的参数进行过滤
            if(_this.Data){
                
                if(_this.Data.centerPoint.address){
                    _simulation();
                };
                if(_this.Data.points){
                    if(_this.Data.points.length !=0){
                        for(var i =0;i<_this.Data.points.length;i++){
                            var pt = new MapCore.Point([_this.Data.points[i].lng,_this.Data.points[i].lat]);
                            //window._bloatedData(_this.Data.points[i],i);
                            window._bloatedData(_this.Data.points[i],_this.Data.points[i].id);
                            //window.Templates_arrays.push(_this.Data.points[i].address);
                            //window.Templates_PointArray.push(pt);
							//window.Templates_PointNames.push(_this.Data.points[i].name); //  -->renbw
							//window.Templates_PointIds.push(_this.Data.points[i].id);
							window.Templates_PointAll.push(_this.Data.points[i]);
                        }
                        _this.adrAll = window.Templates_PointArray;
                    }
                };
                if(_this.Data.routeType =="driving"){
                    $("#go_way").val("驾车");
                    $("#tripWay").html("驾车");
                }else if(_this.Data.routeType =="walking"){
                    $("#go_way").val("步行");
                    $("#tripWay").html("步行");
                }else if(_this.Data.routeType =="riding"){
                    $("#go_way").val("骑行");
                    $("#tripWay").html("骑行");
                }
            };
            //----------------End-----------------将使用的方法挂载到window对象下----------------------------
        }else{
            //若参数不对，既会报此错误
            alert("请传入相应的参数");
            return;
        };
    };
    //-----------Start-----当案例成功绘制后，取参数则通过此方法来查询------------------------------------------------
    //获取出行方式
    PathProject.prototype._tripWay = function(callback){
        var _this =this
        var tripWayValue = _this.Doms[0].children[0].children[0].children[6];
        var tripWay= _this.Doms[0].children[1].children[6].children[1];
        $(tripWayValue).change(function(){
            if($(tripWayValue).val()!="出行方式"){
                var obj ={name:"出行方式",result:$(tripWayValue).val()};
                callback(obj);
            };
        });
    };
    //获取起点
    PathProject.prototype._origins = function(callBack){
        var _this = this
        var startDom = _this.Doms[0].children[0].children[0].children[0];
        $(startDom).change(function(){
            switch($(startDom).val()){
                case "当前定位":
                    _this.map.getLocationByExplore(function (r) {
                        _this.map.getLocation(r, function (data) {
                            if(data){
                                var obj ={name:"起点",pathStart:data.city + data.district + data.street + data.streetNumber};
                                callBack(obj);
                            }
                        });
                    });
                break;
            }
        })
    };
    //获取起点
    PathProject.prototype.getPathStart=function(){
        if(window.Templates_json.start = window.Templates_start){
            return  window.Templates_json.start = window.Templates_start;
        }else{
            alert("参数为空");
        }
    };
    //获取终点
    PathProject.prototype.getPathDestination = function(){
        if(window.Templates_json.end = window.Templates_end){
            return window.Templates_json.end = window.Templates_end;
        }else{
            alert("参数为空");
        };
    };
    //获取拜访点
    PathProject.prototype.getWayPoints=function(){
        if(window.Templates_json.wayPoints = window._joint(window.Templates_PointArray)){
            return window.Templates_json.wayPoints = window._joint(window.Templates_PointArray);
        }else{
            alert("参数为空");
        };
    };
    //获取筛选参数
    PathProject.prototype.getQueryParams=function(){
        if(window.Templates_json){
            return window.Templates_json;
        }else{
            alert("参数不正确");
        }
    };
    //获取规划顺序	K4321
    PathProject.prototype.getPathOrder=function(){
        return window.ant_tour;
    };
  //获取规划顺序	K4321
    PathProject.prototype.getStartPoint=function(){
        return window.startPoint;
    };
  //获取规划顺序	K4321
    PathProject.prototype.getEndPoint=function(){
        return window.endPoint;
    };
  //获取规划顺序	K4321
    PathProject.prototype.getWayPoints=function(){
        return window.way_points;
    };
	
	 //控件查询栏对象
    PathProject.prototype.getSearchContainerObj=function(){
       return $(".searchContainer");
    }
    //控件右边信息栏对象
    PathProject.prototype.getVisitorToolsObj = function() {  
		return $(".NavOrigins") ;
    }
	//隐藏查询输入工具条
    PathProject.prototype.hiddenSearchContainer = function() {  
		$(".searchContainer").css("display","none");
    }
    //显示查询输入工具条
    PathProject.prototype.showSearchContainer = function() {  
		$(".searchContainer").css("display","block");
    }
    //隐藏右侧信息栏
    PathProject.prototype.hiddenVisitorTools = function() {  
		$(".NavOrigins").css("display","none");
		
    }
    //显示右侧信息栏
    PathProject.prototype.showVisitorTools = function() {  
		$(".NavOrigins").css("display","block");
    }
    
	
    //-----------End-----当案例成功绘制后，取参数则通过此方法来查询---------------------------------------------------
})();
/** 
 * @namespace MapCore的所有library类均放在MapCoreLib命名空间下
 */
var MapCoreLib = window.MapCoreLib = MapCoreLib || {};
(function(){
    var EquitimeControl =  
    MapCoreLib.EquitimeControl = function(jsonData){
        // points传入点集合（最多传入500个点）,
        // top返回数量最多500个点,
        // appcode系统编号 "CREDIT",在业务系统设置中管理
        // orderBy排序方式 ASC升序DESC 降序,
        // policy出行策略LEAST_DISTANCE 路径最短 LEAST_TIME 时间最少
        //var json={mapdom:document.getElementById("mapDiv"),map:map,w:1,h:1,top:20,appcode:"CREDIT",orderBy:"ASC",policy:"LEAST_TIME"};
        if(!jsonData){
            alert('参数不能为空');
            return ;
        }
        //要是没有callBackFun提示 k4321
        if(!jsonData.callBackFun){
			alert("请先设置回调函数callBackFun ！");
			return ;
		}
        if(!jsonData.delPointsMarker){
        	window.delPointsMarker = true;
		}else{
			window.delPointsMarker = jsonData.delPointsMarker;
		}
        //设置默认参数
        if(!jsonData.policy){
        	jsonData.policy="LEAST_TIME";
		}
		if(jsonData.orderBy){
			jsonData.orderBy="ASC";
		}
		//设置分析成功后的回调函数
		window.analyEndCallBackFun = jsonData.analyEndCallBackFun;
		
        window.jsonQuitimeData =jsonData;
        window.urlStartQuitimes = jsonData.url;
        this.map = jsonData.map;
        this.mapdom = jsonData.mapdom; 
        this.result= 'error' ; //成功状态 error是失败 ok 是成功
		this.address = "";  //起点地址的值
		window.resultQuitimes=this.result;
		window.callBackFun = jsonData.callBackFun;
		//
		window.delPointsMarker = jsonData.delPointsMarker;
		
	}
	
	//自定义的工具条控件结构***start*****     
    EquitimeControl.prototype.addTimeTool = function() {                               
        var myQTDom = "<div class=\"contorldata\" >"+
            "<div class=\"locationstyle\">"+
                "<span class=\"marginrad\">选择起点：</span>"+
                "<select style=\"outline: none\" name=\"请选择\" id=\"locationMode\" onchange=\"locationModeQuitimes()\" >"+
                    "<option value=\"\">请选择</option>"+
                    "<option value=\"location\">定位当前位置</option>"+
                    "<option value=\"poi\">自定义</option>"+
                "</select>"+
                "<div class=\"searchbtn poilocation\" style=\"display:none;\">"+
                    "<input  type=\"text\" id=\'business\'  style=\'color:gray\' placeholder=\"请输入单位名称\"/>"+
                "</div>"+
            "</div>"+
            "<div style=\"padding: 3px; \">"+
                "<span class=\"marginrad\">出行方式：</span>"+
                "<select style=\"outline: none\" name=\"请选择\" id=\"tripMode\" onchange=\"tripModeQuitimes()\" >"+
                    "<option value=\"driving\">驾车</option>"+
                    "<option value=\"riding\">骑行</option>"+
                    "<option value=\"walking\">步行</option>"+
                "</select>"+
            "</div>"+
	            "<div style=\"padding: 3px; \">"+
	            "<span class=\"marginrad\">拜访客户：</span>"+
	            "<input type=\"text\" id=\"top\" style=\"width:30px;\" value=\"2\" ></input>"+
	        "</div>"+	        
            "<div class=\"marginrad\" >"+
                "<span>时间圈半径：</span>"+
                "<select style=\"outline: none\" name=\"请选择\" class=\"timerad\"  onchange=\"customTimeQuitimes()\" >"+
                    "<option value=\"0.5\">0.5小时</option>"+
                    "<option value=\"1\">1小时</option>"+
                    "<option value=\"1.5\">1.5小时</option>"+
                    "<option value=\"2\">2小时</option>"+
                    "<option value=\"custom\">自定义时间</option>"+
                "</select>"+
                "<div class=\"customstyle\" style=\"display:none;\">"+
                    "<input  type=\"number\" id=\'custom\'  style=\'color:gray\' placeholder=\"请输入时间\" min=\'0.1\'/>小时"+
                "</div>"+
            "</div>"+
            "<span class=\"btnstyle\"  onclick=\"resultFunQuitimes()\">开始分析</span>"+
            "<span class=\"btnstyle\"  onclick = \"clearAllPointQuitimes()\">清除X</span>"+
		"</div>"+
			"<div class=\"shadeelement\">"+
			"<p class=\"progressBar\"><p id=\"bar\"></p></p>"+
		"</div>"+
		"<div class=\"visitorlist\" >"+
			"<div class=\"bodytitle\" >待访客列表</div>"+
			"<div id=\"visitor\"></div>"+
		"</div>";	   
        var div=document.createElement("div"); 
        div.innerHTML = myQTDom;
        this.mapdom.appendChild(div);//添加Dom元素到地图中
        return div;//将dom元素返回
    }
    //增加侧栏访客信息   k4321
    //jsonData 包含访客姓名和地址
    EquitimeControl.prototype.addVisitorInfo = function(jsonData) {  
    	var div1='<div class="childerend">';
		var div2='</div>';
		$("#visitor").append(div1+" "+(i+1)+":"+arrEnd[i].name+" "+arrEnd[i].address+div2);
    },
    EquitimeControl.prototype.getVisitorToolsObj = function() {  
		return $("#visitor") ;
    },
    //起点的值
    EquitimeControl.prototype.getStartMarker = function() {
        var data = window.addressDataQuitimes;
        data.point=positionDataQuitimes;
    	//var data = positionDataQuitimes;
        if(data){
          return data;
        }else{
          alert('请选择起点！');
          return ;
        }
	}
	//等时圈计算后返回的结果***start****
    EquitimeControl.prototype.operator = function(callback) {
		this.result=window.resultQuitimes;
		//console.log(this.result)
		if(window.operatorDataQuitimes){
		  callback(window.operatorDataQuitimes);
		  this.result='error';
		}else{
		  alert("未传入点计算，请传入点再获取计算结果！")
		}

    }
    //add on by yp 20190115 封装等时圈逻辑 
    //新增方法***start*********************************************************************************************************************
	window.modeDataQuitimes="driving";//默认出行方式
    window.positionDataQuitimes='';//定位经纬度或者poi结果
    window.addressDataQuitimes = "";//地址详情
    window.operatorDataQuitimes = "";//等时圈计算后返回的结果
    window.urlStartQuitimes = "";//等时圈起点图标
	//POI检索，显示标记点，设置标记点属性***********start
	window.acQuitimes=''; //poi检索对象
    window.titleQuitimes='';//poi标题
    window.resultQuitimes ='';//是否已经绘制完成
	window.initQuitimes=function (){
		//初始化	搜索框
		acQuitimes = map.autoComplete( {
			"input" : "business", //建立一个自动完成的对象
			onSearchComplete:function(data){},
			clickSelect:function(e){
				var _value = e.item.value;
				var myValue = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;

				map.autoCompleteLocalSearch(myValue);
			},
			isLocalSearch:true,
			localSearchFun:function(pois,searchResult){
				var num = searchResult.getNumPois();
				if(num > 0){
					var poi = searchResult.getPoi(0);
					var address = poi.address?poi.address:'';
					if(address.indexOf(poi.city)<0){
						address = (poi.city?poi.city:'')+address;
					}
					if(address.indexOf(poi.province)<0){
						address = (poi.province?poi.province:'')+address;
					}
					if(address.indexOf(poi.province)<0){
						address = (poi.province?poi.province:'')+address;
					}						
					poi.address = address;	
					//console.dir(poi,"poi")					
					acQuitimes.dispose();

					$("#business").val(poi.title);
					$("#address").val(poi.address);
					titleQuitimes=poi.title;
					acQuitimes = null;
					//$("#business").blur();
					$("#address").focus();
					//add on by yp 20190107渲染数据**start****
					$(".childers").remove();//先删除再绘制
					$(".childerend").remove();//先删除带访客再绘制
					var div1='<div class="childers">';
					var div2='</div>';
					var s='起点：';
					//将关键信息展示到列表中，展示多少是否分页等形式由业务系统自行处理
					//案例只展示三条
                    $("#visitor").append(div1+s+poi.address+div2);
                    this.result="ok";
                    this.address = poi.address;
                    window.addressDataQuitimes=poi.address;
                    
                    //console.log(this.address,"this.address")
					//渲染数据add on by yp 20190107渲染数据**end****
					addMenuQuitimes(poi.point.lng, poi.point.lat);//展示结果点添加菜单删除maker点功能
				}
			}
		});		
	}
	//add on by yp 20181224添加右键菜单并可以删除
	window.addMenuQuitimes=function (vlng, vlat){ 
		if(window.delPointsMarker == true){//k4321 20190305
			map.clearOverlays()        
		}
		var markerPoint = new MapCore.Point([vlng, vlat]);  
		var vIcon = window.urlStartQuitimes;// "http://12.99.109.53:8082/nbcbimages/upload/f51622f4-1b57-480d-897b-44b97c342a75.png";
		var marker =new MapCore.Marker(markerPoint);	// 创建标注
		map.setMarkerIcon(marker,vIcon);       
		var removeMarker=function(e,ee,marker){map.removeAppiontOverlay(marker)}
		var txtMenuItem = [ {
			text : '删除当前起点',
			callback : function(e) {
				map.removeAppiontOverlay(marker)
				positionDataQuitimes=''//定位经纬度或者poi结果
		}}]
		map.addRightMenu(txtMenuItem);
		map.addMarker(marker);
		marker.enableDragging()//add on by yp 20181224 可以拖拽
        //拖拽事件监听
		marker.addEventListener("dragend",function(e){
			//拖拽后的maker点
			//console.log(e.point.lng,e.point.lat,"POIend")
			var H={lat:e.point.lat,lng:e.point.lng}
		    positionDataQuitimes=H   //定位经纬度或者poi结果
		});

		map.setCenterAndZoom(markerPoint, 10);
		
		var H={lat:vlat,lng:vlng}
		positionDataQuitimes=H   //定位经纬度或者poi结果	
		//设置默认address为当前起点
		positionDataQuitimes.address = "当前起点";
	}
	//add on by yp 定位当前地址**start****
	window.getMyPositionQuitimes=function (position){
		if(position&&position.status=='ok'){            
			MarkerStyleQuitimes(position)             
		}else{
			map.getLocationByExplore(MarkerStyleQuitimes)
			// if(position&&position.lng!=0&&position.lat!=0){	
			// }else{
			//     alert("定位失败");
			// } 
		}
	}
	//定位起点样式
	window.MarkerStyleQuitimes=function (position){ 
		if(window.delPointsMarker == true){//k4321 20190305
			map.clearOverlays()        
		}
		var vIcon = window.urlStartQuitimes;//"http://12.99.109.53:8082/nbcbimages/upload/f51622f4-1b57-480d-897b-44b97c342a75.png";
		var marker =new MapCore.Marker(position);	// 创建标注
		map.setMarkerIcon(marker,vIcon);   
		var removeMarker=function(e,ee,marker){map.removeAppiontOverlay(marker)}
		var txtMenuItem = [ {
			text : '删除当前起点',
			callback : function(e) {
				map.removeAppiontOverlay(marker)
				positionDataQuitimes=''//定位经纬度或者poi结果 
		}}];
		map.addRightMenu(txtMenuItem);
		map.addOverlay(marker);
		var H={lat:position.lat,lng:position.lng}
		positionDataQuitimes=H   //定位经纬度或者poi结果
		//add on by yp 20190107根据经纬度转换地址******start******
		 //map.getLocation({lat:32.052849,lng:112.16786},function(point){
        //     console.dir(point,"解析地址")
		 //});
		//add on by yp 20190107根据经纬度转换地址******end******
		//add on by yp 20190107渲染数据**start****
		//console.log(position,"position定位当前点")
		$(".childers").remove();//先删除再绘制
		$(".childerend").remove();//先删除待访客再绘制
		var div1='<div class="childers">';
		var div2='</div>';
		var s='起点：当前位置';
		//将关键信息展示到列表中，展示多少是否分页等形式由业务系统自行处理
		//案例只展示三条
        //$("#visitor").append(div1+s+div2); //修改前
        this.result="ok";
        this.address = s;
        positionDataQuitimes.address = '当前位置';
        //modify k4321 
        this.point=positionDataQuitimes;
        //window.addressDataQuitimes=s;//修改前
        window.addressDataQuitimes = this ;
        
      //案例只展示三条
        $("#visitor").append(div1+s+div2);
        
        //console.log(this.address,"s this.address")

		//渲染数据add on by yp 20190107渲染数据**end****
		marker.enableDragging()//add on by yp 20181224 可以拖拽
		//拖拽事件监听
		marker.addEventListener("dragend",function(e){
			//拖拽后的maker点
			//console.log(e.point.lng,e.point.lat,"location end")
			var H={lat:e.point.lat,lng:e.point.lng}
            positionDataQuitimes=H   //定位经纬度或者poi结果
		});
	}
	
	//起点方式***start*****
	window.locationModeQuitimes=function (){
		var locationMode= $("#locationMode").val();
		if(locationMode=='location'){          
			map.getLocationByBrower(getMyPositionQuitimes); 
			$(".poilocation").css("display","none");
		}else if(locationMode=='poi'){
			$(".poilocation").css("display","block");
			$("#business").mousedown(function(){
				if(!acQuitimes){
					initQuitimes();
					if(titleQuitimes){
						$('#business').val(titleQuitimes);
					}
				}
			});
			initQuitimes();
		}else{
			$(".poilocation").css("display","none");
        }
	}
	//起点方式***end*****
	//出行方式*****start*****
	window.tripModeQuitimes=function (){
		modeDataQuitimes= $("#tripMode").val();
		//console.log(modeDataQuitimes)
	}
	//出行方式*****end*****
	//等时圈时间半径***start*****
	window.customTimeQuitimes=function (){
		var locationMode= $(".timerad").val();
		if(locationMode=='custom'){
			$(".customstyle").css("display","block");
		}else{
			$(".customstyle").css("display","none");
		}
    }
	//等时圈时间半径***end*****
    //进度条****start***progressBar
	window.progressBarQuitimes=function (){
		$("#bar").css("width","0");
		var speed=20;
		var bar;
		bar=setInterval(function(){
			var nowWidth;
			var barWidth;
			nowWidth=parseInt($("#bar").width());
			if(nowWidth<=270){
				barWidth=(nowWidth+1)+"px";
				$("#bar").css("width",barWidth);
			}else{
				$("#bar").css("width","0");
				barWidth="0px";
				//clearInterval(bar);
				//console.log("进度条")
				if(window.resultQuitimes=='ok'){
					clearInterval(bar);
				}
			}
		},speed)
	}
	//进度条****end****
	window.resultFunQuitimes=function (){
		//初始化获取时间
		var timerad =  $('.timerad').val()
		if(timerad=="custom"){ 
			timerad =  $('#custom').val()
		}
		if(positionDataQuitimes==""||timerad==undefined){
			alert('起点不能为空');
			return false ;
		}else if(timerad==""||timerad==undefined){
			alert('时间圈半径不能为空');
			return false ;
		}else if(Number(timerad)<=0){
			alert('时间圈半径不能为小于等于0');
			return false ;
        }
		//获取top 
		var top = $("#top").val();
		
        timerad=String(Number(timerad)*60*60);  
		//console.dir(positionDataQuitimes,"起点经纬度")
		//console.log(modeDataQuitimes,"出行方式")
		//console.log(timerad,"时间圈半径数值")
		$(".progressBar").css("display","block");
		$(".shadeelement").css("display","block")// 遮罩层********
		progressBarQuitimes();
        //调用多点连接
        var jsonDatas=window.jsonQuitimeData; //传入的值放入
        //modify k4321  centerPoint中增加address，没有address路径规划无法获取到这个点
		var json={
            timerad:timerad,
            modeDataQuitimes:modeDataQuitimes,
            appid : jsonDatas.appid,
            centerPoint :{"lng":positionDataQuitimes.lng,"lat":positionDataQuitimes.lat,"address":positionDataQuitimes.address},    //{"lng":"121.516013","lat":"29.830612"}
            policy : jsonDatas.policy, 	
            routeType : modeDataQuitimes, //"driving"; 		
            points : jsonDatas.points,
            isochronalTime:timerad,
            orderBy:jsonDatas.orderBy,
            top:top
		}
		lineallQuitimes(json)

	}
	//add on by yp 20181224删除当前起点****start***
	window.removeMarkerQuitimes=function (e,ee,marker){
		map.removeAppiontOverlay(marker)
	}	//add on by yp 20181224删除当前起点****end****	
	//POI检索，显示标记点，设置标记点属性***********end
	window.pointArrayQuitimes = [];//用于的point数组	 
	//add on by yp 20190107起点到各个拜访点连线********start*****
	window.lineallQuitimes=function (jsonData){
		window.resultQuitimes='error';
        var json1 = {};   
        json1.jsonParams = JSON.stringify(jsonData);
        //回调函数
        json1.callBackFun = quitime_CallBack;
        map.isochronalAnaly(json1);  
        function  quitime_CallBack(data){
            window.operatorDataQuitimes = data;
            var datas=data.data;
            //console.log(datas,"")
            if(data.result=="ok"){
                if(datas.points.length<=0){
					window.resultQuitimes='ok';
                    $(".shadeelement").css("display","none")// 遮罩层********
                    alert("没有符合条件的点，请重新设置条件再进行计算！")
                }else{
					//console.log(datas.points)
					$(".childerend").remove();//先删除再绘制
					if(window.delPointsMarker == true ){
						map.clearOverlays();//add on by yp 20190110116重绘清空页面元素
					}
                    pointArrayQuitimes=[]; //add on by yp 20190110116重绘清空页面元素
                    
                    
                    
                    var arrStart=jsonData.centerPoint;
                    //add on by yp 20190110116重绘清空页面元素*****start***
                    var pointStart= new MapCore.Point([arrStart.lng,arrStart.lat]);
                    var vIcon = window.urlStartQuitimes;//"http://12.99.109.53:8082/nbcbimages/upload/f51622f4-1b57-480d-897b-44b97c342a75.png";
                    var markerStart =new MapCore.Marker(pointStart);	// 创建标注
                    map.setMarkerIcon(markerStart,vIcon);       
                    map.addMarker(markerStart);
                    pointArrayQuitimes.push(pointStart)
                    
                    //使用回调函数，让业务系统自己实现marker绘制 k4321
                    if(window.callBackFun&&typeof window.callBackFun === "function"){
                    	window.callBackFun(data);
					}else if(window.callBackFun){
						window[window.callBackFun](data);
					}
                    /*//add on by yp 20190110116重绘清空页面元素*****end***
                    var arrEnd=datas.points;
                    for(var i=0; i<arrEnd.length;i++){
                        //var pointStart= new MapCore.Point([arrStart.lng,arrStart.lat]);
                        var pointEnd = new MapCore.Point([arrEnd[i].lng,arrEnd[i].lat]);
                        polyline = map.setPolyline([pointStart,pointEnd],{
                            strokeColor:'red',
                            strokeOpacity:0.3,
                            strokeWeight:1.5});
                            map.addOverlay(polyline);
                        //var dis = map.getDistance(pointStart,pointEnd);
                        var dis = arrEnd[i].distance;//距离
                        var duration = arrEnd[i].duration;//秒
                        //$('#result').val(dis);
                        //----------------------------------------------
                        var mark = new MapCore.Marker(pointEnd);
                        var opts ={position:mark,offset:new MapCore.Size(20,3)} //label 偏移调节
                        var number ="待访客户"+(i+1)+":"+'距离起点'+dis+'米，'+'耗时'+duration+'秒';
                        var html =["<span class=\"numberst\">",number,"</span>"]; //label的html结构
                        var style={         //label 的样式
							color:"blue",
							border:"none"
                        }
                        var label =map.label(html.join(""),opts,style); //整个tabel拼接
                        mark.setLabel(label);
                        map.addMarker(mark);
                        //add on by yp 20190110116重绘清空页面元素*****start***
                        pointArrayQuitimes.push(pointEnd)
                        map.setViewport(pointArrayQuitimes);	//自适应	
						//add on by yp 20190110116重绘清空页面元素*****end***
						//在侧栏添加结果**start**add on by yp20190118
						var div1='<div class="childerend">';
						var div2='</div>';
						$("#visitor").append(div1+" "+(i+1)+":"+arrEnd[i].name+" "+arrEnd[i].address+div2);
						//在侧栏添加结果**end**add on by yp20190118
					}*/
                    
                    
					window.resultQuitimes='ok';
                    $(".shadeelement").css("display","none")// 遮罩层********
					
					//使用回调函数 k4321
					if(window.analyEndCallBackFun){
						if(window.analyEndCallBackFun&&typeof window.analyEndCallBackFun === "function"){
							window.analyEndCallBackFun(data);
						}else if(window.analyEndCallBackFun){
							window[window.analyEndCallBackFun](data);
						}
					}
                }    
            }else{
				window.resultQuitimes='ok';
                $(".shadeelement").css("display","none")// 遮罩层********
                    alert(data.errorMsg);
                }
			}         
	}
		//add on by yp 20190107起点到各个拜访点连线********start******
		//清空
	window.clearAllPointQuitimes=function (){
		map.clearOverlays();
	}
	
	 //隐藏查询输入工具条
	EquitimeControl.prototype.hiddenSearchContainer = function() {  
		$(".contorldata").css("display","none");
    }
    //显示查询输入工具条
	EquitimeControl.prototype.showSearchContainer = function() {  
		$(".contorldata").css("display","block");
    }
    
    //隐藏右侧信息栏
	EquitimeControl.prototype.hiddenVisitorTools = function() {  
		$(".visitorlist").css("display","none");
    }
    //显示右侧信息栏
    EquitimeControl.prototype.showVisitorTools = function() {  
		$(".visitorlist").css("display","block");
    }


    //新增方法***end**************************************************************************************************************** 
})();

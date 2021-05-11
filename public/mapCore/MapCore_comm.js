/**
 * 地图平台公共库
 * @author 
 * @date 2015-05-22
 */
/**
 * 获得项目路径
 * @return
 */
(function(a){
	var commPrototype = {
			/**
			 * callBackFun  		请求正常回调函数
			 * data 	
			 */
			doCallBackFun:function(callBackFun,data){
				if(callBackFun&&typeof callBackFun === "function"){
					callBackFun(data);
				}else if(callBackFun){
					window[callBackFun](data);
				}
			},
			convertJson:function (data) {
				if (typeof data === 'string') {
					data = jQuery.parseJSON(data);
				}
				return data;
			},
			/**
			 * 结束ajax后台查询时，参数json对象穿入的时存在function时
			 */
			handleSearchJson:function(json){
				var pareJson = $.extend({},json);
				for(var key in pareJson){
					if(typeof pareJson[key] === "function"){
						pareJson[key]=null;
					}
				}
				this.deleteNull(pareJson);
				return pareJson;
			},
			/**
			 * json.callBackFun  		请求正常回调函数
			 * json.errorCallBackFun 	请求异常回调函数
			 * json.isColseDefError     是否关闭异常提示
			 */
			runJsonp:function(json,reqUrl){
				var searchJson = "";
				if(!reqUrl){
					reqUrl = json.reqUrl;
				}
				if(!reqUrl){
					alert('请求地址[reqUrl或json.reqUrl]不能为空');
					return ;
				}
				if(!json.isReqUrl){//要将reqUrl传递给后台
					json.reqUrl = null;
				}
				json.dtType=this.mapType;
				if(json.remove_dtType){
					delete json.remove_dtType;
					delete json.dtType;
				}
				
				if(json.crossType){
					searchJson = {
							url : reqUrl,
							async :true,
							cache:false,
							dataType : "json",
							//jsonp:"jsonpcallback",
							//jsonpCallback:json.callBackFunName,				//jsonp的回调函数名
							type : "post",
							data: this.handleSearchJson(json),
							success : function(data) {
								if(json.callBackFun&&typeof json.callBackFun === "function"){
									json.callBackFun(data);
								}else if(json.callBackFun){
									window[json.callBackFun](data);
								}
							},
							error:function(XMLHttpRequest, textStatus, errorThrown){
								if(json.errorCallBackFun&&typeof json.errorCallBackFun === "function"){
									json.errorCallBackFun(data);
								}else if(json.errorCallBackFun){
									window[json.errorCallBackFun](data);
								}else{
									if(!json.isColseDefError){
										alert("异常:"+XMLHttpRequest.status+";"+XMLHttpRequest.readyStatus+";"+textStatus);
									}
								}
							}
					};
				}else{
					searchJson = {
							url : reqUrl,
							async :true,
							cache:false,
							dataType : "jsonp",
							jsonp:"jsonpcallback",
							//jsonpCallback:json.callBackFunName,				//jsonp的回调函数名
							type : "get",
							data: this.handleSearchJson(json),
							success : function(data) {
								if(json.callBackFun&&typeof json.callBackFun === "function"){
									json.callBackFun(data);
								}else if(json.callBackFun){
									window[json.callBackFun](data);
								}
							},
							error:function(XMLHttpRequest, textStatus, errorThrown){
								if(json.errorCallBackFun&&typeof json.errorCallBackFun === "function"){
									json.errorCallBackFun(data);
								}else if(json.errorCallBackFun){
									window[json.errorCallBackFun](data);
								}else{
									if(!json.isColseDefError){
										alert("异常:"+XMLHttpRequest.status+";"+XMLHttpRequest.readyStatus+";"+textStatus);
									}
								}
							}
					};
				}
				if(json.callBackFunName){
					searchJson.jsonpCallback=json.callBackFunName;
				}
				//k4321 兼容IE大数据跨域
				if(json.crossType){
					jQuery.support.cors=true;
				}
				$.ajax(searchJson);
			},
			
			/**
			 * 通用数据检索服务
			 * json.queryType	   必输 	检索类型   	 QUERY_POLYGON 多边形检索 ， QUERY_RADIUS 半径检索 ， QUERY_NEAREST 附近点检索 ，QUERY_TABLE 通用表检索
			 * json.tableName		   必输	表名		     表名与模型代码二选一 
			 * json.modelcode		   必输	模型代码      表名与模型代码二选一 
			 * json.queryStr			        查询条件		 格式：start=0
			 * json.orderBy			        排序         格式：order by id
			 * json.points			        坐标点		 多边形检索和半径检索 该值必输  格式：多边形检索：112.2352,23.5642,25.12245,25,56624,255.4556,235.45566 半径检索中心112.2352,23.5642
			 * json.num			            附近返回条数  附近点检索 必输
			 * json.radius			        半径         半径检索 必输
			 * json.isOnlyLocation			是否只返回坐标 x,y 如果只需要x,y推荐将该值设置为true
			 * json.page			            分页查询      当前页码:pageNo  每页记录数:pageSize  总记录数:totalRecord  分页类型:pageType 空或者0 查询分页countSql和查询数据sql 1 只是查询分页信息 2 查询统计信息 countSql  
			 * json.json.callBackFunName必输 回调函数名称
			 * json.callBackFun
			 */
			searchBaseModelData: function(json){											
				var fnUrl = this.prejoctUrl+"/optimove/modelattributes/searchBaseModelData.do";
				if(!json){
					alert('参数不能为空');
					return ;
				}
				if(!json.queryType){
					alert('查询类型不能为空');
					return ;
				}
				if(!json.tableName&&!json.modelcode){
					alert('表名和模型代码不能同时为空');
					return ;
				}
				json.dtType=this.mapType;
				if(json.page){
					json.pageJson=JSON.stringify(json.page);
					delete json['page'];
				}
				this.runJsonp(json,fnUrl);
			},
			/**
			 * 通用数据检索服务
			 * json.queryType	   必输 	检索类型   	 QUERY_POLYGON 多边形检索 ， QUERY_RADIUS 半径检索 ， QUERY_NEAREST 附近点检索 ，QUERY_TABLE 通用表检索
			 * json.tableName		   必输	表名		     表名与模型代码二选一 
			 * json.modelcode		   必输	模型代码      表名与模型代码二选一 
			 * json.queryStr			        查询条件		 格式：start=0
			 * json.orderBy			        排序         格式：order by id
			 * json.points			        坐标点		 多边形检索和半径检索 该值必输  格式：多边形检索：112.2352,23.5642,25.12245,25,56624,255.4556,235.45566 半径检索中心112.2352,23.5642
			 * json.num			            附近返回条数  附近点检索 必输
			 * json.radius			        半径         半径检索 必输
			 * json.isOnlyLocation			是否只返回坐标 x,y 如果只需要x,y推荐将该值设置为true
			 * json.page			            分页查询      当前页码:pageNo  每页记录数:pageSize  总记录数:totalRecord  分页类型:pageType 空或者0 查询分页countSql和查询数据sql 1 只是查询分页信息 2 查询统计信息 countSql  
			 * json.callBackFunName必输 回调函数名称
			 * json.callBackFun
			 */
			searchBaseModelDataPage: function(json){	
				var map = this;
				var fnUrl = this.prejoctUrl+"/optimove/modelattributes/searchBaseModelData.do";
				if(!json){
					alert('参数不能为空');
					return ;
				}
				if(!json.queryType){
					alert('查询类型不能为空');
					return ;
				}
				if(!json.tableName&&!json.modelcode){
					alert('表名和模型代码不能同时为空');
					return ;
				}
				if(!json.page){
					json.page = {pageNo:1,pageSize:1000};
				}
				json.dtType=this.mapType;
				
				if(json.page){
					json.pageJson=JSON.stringify(json.page);
					delete json['page'];
					//$(json).remove('page');
				}
				$.ajax({
					url : fnUrl,
					async :true,
					cache:false,
					dataType : "jsonp",
					jsonp:"jsonpcallback",
					jsonpCallback:json.callBackFunName,				//jsonp的回调函数名
					type : "get",
					data: this.handleSearchJson(json),
					success : function(data) {
						if(json.callBackFun&&typeof json.callBackFun === "function"){
							json.callBackFun(data,json);
						}else if(json.callBackFun){
							window[json.callBackFun](data,json);
						}
						if(data.result='ok'){
							if(data.page&&data.page.pageNo==1&&data.page.totalPage>1){
								for(var i=2;i<=data.page.totalPage;i++){
									json.page = map.convertJson(json.pageJson);
									json.page.pageNo = i;
									json.page.pageType='1';//只查询数据
									map.searchBaseModelDataPage(json);
								}
							}
						}
					},
					error:function(XMLHttpRequest, textStatus, errorThrown){
							alert("异常:"+XMLHttpRequest.status+";"+XMLHttpRequest.readyStatus+";"+textStatus);
						}
					});
			},
			
			/**
			 * 根据geohash的base32编码获取地理格网信息
			 * json.queryType	   必输 	检索类型   	QUERY_GEOHASHBOX 地理格网
			 * json.geoHashs		   必输	base32集合，以“,”分隔 
			 * json.callBackFunName 回调函数名称
			 * json.callBackFun
			 */
			getBoundingBoxByGeoHash: function(json){
				var fnUrl = this.prejoctUrl+"/optimove/modelattributes/getBoundingBoxByGeoHash.do";
				if(!json){
					alert('参数不能为空');
					return ;
				}
				if(!json.geoHashs){
					alert('待转换的geohash不能为空');
					return ;
				}				
				this.runJsonp(json,fnUrl);
			},
			/**
			 * 保存多边形范围
			 * json.callBackFunName 回调函数名称
			 * json.callBackFun
			 * json.id        id             必输
			 * json.shape     图形类型  多边形 polygon  圆形circle
			 * json.rangeName 自定义范围名称  必输
			 * json.type 	  类型  			 必输  0 公有 1 专有 
			 * json.powerType 数据权限范围	 不必输  0全行 1本机构 2 下级机构
			 * json.businessType 业务分类	 不必输
			 * json.sysId 业务系统			 必输 
			 * json.ponly 多边形坐标点,圆形对象 必输  如果是多边形格式:11.2255,255.44,225.55,54.64  如果圆形则是json对象  {lon:11.22,lat:55.44,radius:10}
			 * json.userId创建人id			 必输 
			 */
			saveRetrievalRanges: function(json){											//根据模型表代码获得对应的表内容头
				var fnUrl = this.prejoctUrl+"/optimove/modelattributes/retrievalRanges/insert.do";
				if(!json){
					alert('参数不能为空');
					return ;
				}
				if(!json.rangeName){
					alert('自定义范围名称不能为空');
					return ;
				}
				if(!json.type){
					alert('类型不能为空');
					return ;
				}
				if(!json.sysId){
					alert('业务系统不能为空');
					return ;
				}
				if(!json.userId){
					alert('创建人id不能为空');
					return ;
				}
				if(!json.ponly){
					alert('图形对象[ponly]不能为空');
					return ;
				}
				if(json.shape&&json.shape=='polygon'&&(json.ponly.lon||json.ponly.lat||json.ponly.radius)){
					alert('图形类型与图形对象不一致');
					return ;
				}
				if(json.shape&&json.shape=='circle'&&(!json.ponly.lon||!json.ponly.lat||!json.ponly.radius)){
					alert('图形类型与图形对象不一致');
					return ;
				}
				
				if(json.ponly.lon){
					if(!json.shape){
						json.shape='circle';
					}
					json.ponly = JQuery.stringify(json.ponly);
				}else if(json.ponly.indexOf('lat')>=0){
					if(!json.shape){
						json.shape='circle';
					}
				}else{
					if(!json.shape){
						json.shape='polygon';
					}
				}
				$(json).remove('circle');
				if(json.shape=='circle'){
					var temp = jQuery.parseJSON(json.ponly);
					if(!temp.lon||!temp.lat||!temp.radius){
						alert('图形对象不正确['+json.ponly+"]");
						return ;
					}
				}
				
				if(!json.callBackFunName){
					json.callBackFunName="saveRetrievalRanges_CallBack";
				}
				json.dtType=this.mapType;
				$.ajax({
					url : fnUrl,
					async :true,
					cache:false,
					dataType : "jsonp",
					jsonp:"jsonpcallback",
					jsonpCallback:json.callBackFunName,				//jsonp的回调函数名
					type : "get",
					data: json,
					success : function(data) {
						if(json.callBackFun&&typeof json.callBackFun === "function"){
							json.callBackFun(data);
						}else if(json.callBackFun){
							window[json.callBackFun](data);
						}
					},
					error:function(XMLHttpRequest, textStatus, errorThrown){
							alert("异常:"+XMLHttpRequest.status+";"+XMLHttpRequest.readyStatus+";"+textStatus);
						}
					});
			},
			/**
			 * 更新多边形范围
			 * json.callBackFunName 回调函数名称
			 * json.callBackFun
			 * json.id		  记录id
			 * json.rangeName 自定义范围名称  必输
			 * json.type 	  类型  			 必输  0 公有 1 专有 
			 * json.powerType 数据权限范围	 不必输  0全行 1本机构 2 下级机构
			 * json.businessType 业务分类
			 * json.sysId 业务系统			 必输 
			 * json.ponly 多边形坐标点		 必输 
			 * json.userId创建人id			 必输 
			 */
			updateRetrievalRanges: function(json){											
				var fnUrl = this.prejoctUrl+"/optimove/modelattributes/retrievalRanges/update.do";
				if(!json){
					alert('参数不能为空');
					return ;
				}
				if(!json.rangeName){
					alert('自定义范围名称不能为空');
					return ;
				}
				if(!json.type){
					alert('类型不能为空');
					return ;
				}
				if(!json.sysId){
					alert('业务系统不能为空');
					return ;
				}
				if(!json.userId){
					alert('创建人id不能为空');
					return ;
				}
				if(!json.callBackFunName){
					json.callBackFunName="updateRetrievalRanges_CallBack";
				}
				$(json).remove('circle');
				json.dtType=this.mapType;
				$.ajax({
					url : fnUrl,
					async :true,
					cache:false,
					dataType : "jsonp",
					jsonp:"jsonpcallback",
					jsonpCallback:json.callBackFunName,				//jsonp的回调函数名
					type : "get",
					data: json,
					success : function(data) {
						if(json.callBackFun&&typeof json.callBackFun === "function"){
							json.callBackFun(data);
						}else if(json.callBackFun){
							window[json.callBackFun](data);
						}
					},
					error:function(XMLHttpRequest, textStatus, errorThrown){
							alert("异常:"+XMLHttpRequest.status+";"+XMLHttpRequest.readyStatus+";"+textStatus);
						}
					});
			},
			/**
			 * 更新多边形范围
			 * json.callBackFunName 回调函数名称
			 * json.callBackFun
			 * json.id		  记录id			 必输
			 */
			deleteRetrievalRanges: function(json){											
				var fnUrl = this.prejoctUrl+"/optimove/modelattributes/retrievalRanges/delete.do";
				if(!json){
					alert('参数不能为空');
					return ;
				}
				if(!json.id){
					alert('记录id不能为空');
					return ;
				}
				json.ids=json.id;
				if(!json.callBackFunName){
					json.callBackFunName="deleteRetrievalRanges_CallBack";
				}
				json.dtType=this.mapType;
				$.ajax({
					url : fnUrl,
					async :true,
					cache:false,
					dataType : "jsonp",
					jsonp:"jsonpcallback",
					jsonpCallback:json.callBackFunName,				//jsonp的回调函数名
					type : "get",
					data: json,
					success : function(data) {
						if(json.callBackFun&&typeof json.callBackFun === "function"){
							json.callBackFun(data);
						}else if(json.callBackFun){
							window[json.callBackFun](data);
						}
					},
					error:function(XMLHttpRequest, textStatus, errorThrown){
							alert("异常:"+XMLHttpRequest.status+";"+XMLHttpRequest.readyStatus+";"+textStatus);
						}
					});
			},
			/**
			 * 查询多边形范围
			 * json.callBackFunName 回调函数名称
			 * json.callBackFun
			 * json.id		  记录id			 必输
			 */
			searchRetrievalRanges: function(json){											
				var fnUrl = this.prejoctUrl+"/optimove/modelattributes/retrievalRanges/searchRetrievalRange.do";
				if(!json){
					alert('参数不能为空');
					return ;
				}
				if(!json.callBackFunName){
					json.callBackFunName="searchRetrievalRanges_CallBack";
				}
				json.dtType=this.mapType;
				$.ajax({
					url : fnUrl,
					async :true,
					cache:false,
					dataType : "jsonp",
					jsonp:"jsonpcallback",
					jsonpCallback:json.callBackFunName,				//jsonp的回调函数名
					type : "get",
					data: json,
					success : function(data) {
						if(json.callBackFun&&typeof json.callBackFun === "function"){
							json.callBackFun(data);
						}else if(json.callBackFun){
							window[json.callBackFun](data);
						}
					},
					error:function(XMLHttpRequest, textStatus, errorThrown){
							alert("异常:"+XMLHttpRequest.status+";"+XMLHttpRequest.readyStatus+";"+textStatus);
						}
					});
			},
			/**
			 * 查询多边形范围
			 * json.callBackFunName 回调函数名称
			 * json.callBackFun
			 * json.id		  记录id			 必输
			 */
			getRetrievalRanges: function(json){											
				var fnUrl = this.prejoctUrl+"/optimove/modelattributes/retrievalRanges/searchRetrievalRange.do";
				if(!json){
					alert('参数不能为空');
					return ;
				}
				if(!json.id){
					alert('记录id	不能为空');
					return ;
				}
				if(!json.callBackFunName){
					json.callBackFunName="getRetrievalRanges_CallBack";
				}
				json.dtType=this.mapType;
				$.ajax({
					url : fnUrl,
					async :true,
					cache:false,
					dataType : "jsonp",
					jsonp:"jsonpcallback",
					jsonpCallback:json.callBackFunName,				//jsonp的回调函数名
					type : "get",
					data: json,
					success : function(data) {
						if(json.callBackFun&&typeof json.callBackFun === "function"){
							json.callBackFun(data);
						}else if(json.callBackFun){
							window[json.callBackFun](data);
						}
					},
					error:function(XMLHttpRequest, textStatus, errorThrown){
							alert("异常:"+XMLHttpRequest.status+";"+XMLHttpRequest.readyStatus+";"+textStatus);
						}
					});
			},
			/**
			 * 依据模型表名获取模型表代码
			 * @param modelName 模型表名
			 * @return 模型表代码
			 */
			getModelCodeByModelName: function(modelName){							
				if(modelName== undefined){
					alert("参数不可为空！");
					return;
				}
				jQuery.support.cors = true;
				var getModelCodeByModelNameURL = this.prejoctUrl+"/optimove/modelattributes/getModelCodeByModelName.do";
				var arrayList;
				$.ajax({
					url : getModelCodeByModelNameURL,
					async :false,
					cache:false,
					dataType : "text",
					type : "post",
					data: {
						modelName : modelName
					},
					success : function(_data) {
						arrayList = _data;
						},
					error:function(e){
							alert("异常"+e.statusText);
						}
					});
				return arrayList;
			},
			searchByScope: function(modelcode,address,scope,header){							//根据地址范围检索
				if(modelcode== undefined||address== undefined||scope== undefined){
					alert("参数不可为空！");
					return;
				}
				jQuery.support.cors = true;
				var getSearchScopeModelDataUrl = this.prejoctUrl+"/optimove/modelattributes/searchScopeModelData.do";
				var arrayList;
				$.ajax({
					url : getSearchScopeModelDataUrl,
					async :false,
					cache:false,
					dataType : "jsonp",
					jsonp:"jsonpcallback",
					//jsonpCallback:"searchByS_CallBack",					//jsonp的回调函数名
					type : "get",
					data: {
					    modelcode : modelcode,
						address : address,
						scope : scope,
						header : header
					},
					success : function(_data) {
						if(window['searchByS_CallBack']){
							window['searchByS_CallBack'](_data);
						    }
						},
						error:function(XMLHttpRequest, textStatus, errorThrown){
							alert("异常:"+XMLHttpRequest.status+";"+XMLHttpRequest.readyStatus+";"+textStatus);
						}
					});
				return arrayList;
			},
			searchByCenterPointScope: function(modelcode,centerPointX,centerPointY,provider,scope,queryConditions,header,pareJson){
				//根据模型代码、中心点，半径及其他查询条件检索私有云图数据， 此方法供 其他系统通过JS调用
				if(modelcode== undefined||header== undefined){
					alert("modelcode和header参数不可为空！");
					return;
				}
				if (centerPointX !=undefined && centerPointY != undefined && (provider ==undefined || scope ==undefined)){
					alert("根据中心坐标查询时，provider和scope不能为空");
				}
				jQuery.support.cors = true;
				var getSearchScopeModelDataUrl = this.prejoctUrl+"/optimove/modelattributes/searchByCenterPointModelData.do";
				var arrayList;
				var json = {
					    modelcode : modelcode,
					    centerPointX : centerPointX,
					    centerPointY : centerPointY,
					    provider : provider,
					    queryConditions : queryConditions,
						scope : scope,
						header : header
				};
				if(pareJson){
					for(var key in pareJson){
						if(!json[key]){
							json[key]=pareJson[key];
						} 
					}
				}
				$.ajax({
					url : getSearchScopeModelDataUrl,
					async :false,
					cache:false,
					dataType : "jsonp",
					jsonp:"jsonpcallback",						
					//jsonpCallback:"searchByCPS_CallBack",					//jsonp的回调函数名
					type : "get",
					data: json,
					success : function(_data) {
					if(window['searchByCPS_CallBack']){
						window['searchByCPS_CallBack'](_data);
					    }
					},
					error:function(XMLHttpRequest, textStatus, errorThrown){
							alert("异常:"+XMLHttpRequest.status+";"+XMLHttpRequest.readyStatus+";"+textStatus);
						}
					});
				return arrayList;
			},	
			//应用场景，开始查询点聚合形式，只返回经纬度坐标数据用于展示点
			//鼠标点击（事件最好能换掉，免得反复点击查询数据库），查询容差范围内点数据，返回指定指定数据，不指定返回×？,以点marker显示
			searchDataByCondition:function(json){
				if(json.modelcode== undefined||json.queryConditions== undefined){
					alert("参数不可为空！");
					return;
				}
				var searchByAttributes = this.prejoctUrl+"/optimove/modelattributes/searchDataByCondition.do";
				var arrayList;
				
				$.ajax({
					url : searchByAttributes,
					async :true,
					cache:false,
					dataType : "jsonp",
					jsonp:"jsonpcallback",
					//jsonpCallback:"searchDataByCondition_CallBack",			//jsonp的回调函数名
					type : "get",
					data: {
						modelcode : json.modelcode,
						queryConditions : json.queryConditions,
						header : json.header,
						p_isOnlyLocation:json.p_isOnlyLocation,
						fields:json.fields
					},
					success : function(data) {
						if(json.callBackFun&&typeof json.callBackFun === "function"){
							json.callBackFun(data);
						}else if(json.callBackFun){
							window[json.callBackFun](data);
						}
					},
					error:function(XMLHttpRequest, textStatus, errorThrown){
							alert("异常:"+XMLHttpRequest.status+";"+XMLHttpRequest.readyStatus+";"+textStatus);
						}
					});			
			},
			searchNearestPoint: function(modelcode,centerPointX,centerPointY,provider,num,queryConditions,header){
				//根据模型代码、中心点及其他查询条件检索私有云图数据，查询离中心点最近的n个点， 此方法供 其他系统通过JS调用
				if(modelcode== undefined||header== undefined){
					alert("modelcode和header参数不可为空！");
					return;
				}
				if (centerPointX !=undefined && centerPointY != undefined && (provider ==undefined)){
					alert("根据中心坐标查询时，provider不能为空");
				}
				jQuery.support.cors = true;
				var getSearchNearestPointModelDataUrl = this.prejoctUrl+"/optimove/modelattributes/searchNearestDetailByPoint.do";
				var arrayList;
				$.ajax({
					url : getSearchNearestPointModelDataUrl,
					async :false,
					cache:false,
					dataType : "jsonp",
					jsonp:"jsonpcallback",						
					//jsonpCallback:"searchNP_CallBack",					//jsonp的回调函数名
					type : "get",
					data: {
					    modelcode : modelcode,
					    centerPointX : centerPointX,
					    centerPointY : centerPointY,
					    provider : provider,
					    queryConditions : queryConditions,
					    num : num,
						header : header
					},
					success : function(_data) {
						if(window['searchNP_CallBack']){
							window['searchNP_CallBack'](_data);
						}
					},
					error:function(XMLHttpRequest, textStatus, errorThrown){
							alert("异常:"+XMLHttpRequest.status+";"+XMLHttpRequest.readyStatus+";"+textStatus);
						}
					});
				return arrayList;
			},
			searchPrivateData: function(modelcode,resultpoint,queryConditions,header){							//在地图上画圈条件检索
				if(modelcode== undefined||queryConditions== undefined){
					alert("参数不可为空！");
					return;
				}
				jQuery.support.cors = true;
				var searchByAnyModelData = this.prejoctUrl+"/optimove/modelattributes/searchByAnyModelData.do";
				var arrayList;
				$.ajax({
					url : searchByAnyModelData,
					async :false,
					cache:false,
					dataType : "jsonp",
					jsonp:"jsonpcallback",
					//jsonpCallback:"searchByPD_CallBack",				//jsonp的回调函数名
					type : "get",
					data: {
					    modelcode : modelcode,
						resultpoint:resultpoint,
						queryConditions : queryConditions,
						header : header
					},
					success : function(_data) {
						if(window['searchByPD_CallBack']){
							window['searchByPD_CallBack'](_data);
						}
					},
					error:function(XMLHttpRequest, textStatus, errorThrown){
							alert("异常:"+XMLHttpRequest.status+";"+XMLHttpRequest.readyStatus+";"+textStatus);
						}
					});
				return arrayList;
			},
			searchPrivateDataAtZZDT: function(modelcode,resultpoint,queryConditions,header,CallbankName){							//在地图上画圈条件检索
				if(modelcode== undefined||queryConditions== undefined){
					alert("参数不可为空！");
					return;
				}
				jQuery.support.cors = true;
				var searchByAnyModelData = this.prejoctUrl+"/optimove/modelattributes/searchByAnyModelDataZZDT.do";
				var arrayList;
				$.ajax({
					url : searchByAnyModelData,
					async :false,
					cache:false,
					dataType : "jsonp",
					jsonp:"jsonpcallback",
					jsonpCallback:CallbankName,				//jsonp的回调函数名
					type : "get",
					data: {
					    modelcode : modelcode,
						resultpoint:resultpoint,
						queryConditions : queryConditions,
						header : header
					},
					success : function(_data) {

						},
					error:function(XMLHttpRequest, textStatus, errorThrown){
							alert("异常:"+XMLHttpRequest.status+";"+XMLHttpRequest.readyStatus+";"+textStatus);
						}
					});
				return arrayList;
			},

			superSearchData: function(modelcode,resultpoint,queryConditions,address,scope,header,pareJson){							//最全私有云图数据检索
				if(modelcode== undefined||queryConditions== undefined){
					alert("参数不可为空！");
					return;
				}
				jQuery.support.cors = true;
				var superSearchDataUrl = this.prejoctUrl+"/optimove/modelattributes/superSearchData.do";
				var arrayList;
				var json = {
					    modelcode : modelcode,
						resultpoint:resultpoint,
						queryConditions : queryConditions,
						address : address,
						scope : scope,
						header : header
				};
				if(pareJson){
					for(var key in pareJson){
						if(!json[key]){
							json[key]=pareJson[key];
						} 
					}
				}
				$.ajax({
					url : superSearchDataUrl,
					async :false,
					cache:false,
					dataType : "jsonp",
					jsonp:"jsonpcallback",
					//jsonpCallback:"searchByD_CallBack",				//jsonp的回调函数名
					type : "get",
					data: json,
					success : function(_data) {
					if(window['searchByD_CallBack']){
						window['searchByD_CallBack'](_data);
					    }
					},
					error:function(XMLHttpRequest, textStatus, errorThrown){
							alert("异常:"+XMLHttpRequest.status+";"+XMLHttpRequest.readyStatus+";"+textStatus);
						}
					});
				return arrayList;
			},	
			/**
			 * 查询有多个多边形组成的图形的数据
			 * json.modelcode		   必输	模型代码     
			 * json.queryConditions			        查询条件		 格式：start=0
			 * json.resultpoint		多边形的点集合，逗号分隔
			 * json.callBackFun     回调函数，查出数据后的处理函数
			 * json.header   必须 如"{'appid':'YXDT','transcode':'1001','transchannel':'01'}";
			 * json.provider biadu或gaode
			 * json.p_isOnlyLocation 是否只返回经纬度
			 */
			multiPolygonSuperSearchData: function(json){						
				if(json.modelcode== undefined||json.queryConditions== undefined||json.header==undefined){
					alert("参数不可为空！");
					return;
				}

				var fnUrl = this.prejoctUrl+"/optimove/modelattributes/multiPolygonSuperSearchData.do";
				
				this.runJsonp(json,fnUrl);
				
			},	
			//将一个复杂多边形解析成多个规则多边形
			//返回相邻点为边的点的数组
			parseComplexPolygonToSeperatedPolygon:function(resultpoint,callback){
				$.ajax({
					url :this.prejoctUrl+"/optimove/modelattributes/parseMultiPolygonToSeperatedPolygon.do",
					async :false,
					cache:false,
					dataType : "jsonp",
					jsonp:"jsonpcallback",		
					type : "post",
					data: {
						resultpoint:resultpoint
						},
					success : function(_data) {
						if(callback&&typeof callback === "function"){
							callback(_data);
						}else if(callback){
							window[callback](_data);
					   }
					},
					error:function(XMLHttpRequest, textStatus, errorThrown){
							alert("异常wwwww:"+XMLHttpRequest.status+";"+XMLHttpRequest.readyStatus+";"+textStatus);
						}
					});
			},	
			searchPolygonMarkersPointsData:function(modelcode,resultpoint,queryConditions,address,scope,header,pareJson,callback){							//最全私有云图数据检索
				if(modelcode== undefined||queryConditions== undefined){
					alert("参数不可为空！");
					return;
				}
				jQuery.support.cors = true;
				var searchMarkersPointsDataUrl = this.prejoctUrl+"/optimove/modelattributes/superSearchData.do";
				var arrayList;
				var json = {
					    modelcode : modelcode,
					    resultpoint:resultpoint,
						queryConditions : queryConditions,
						address : address,
						scope : scope,
						header : header
				};
				if(pareJson){
					for(var key in pareJson){
						if(!json[key]){
							json[key]=pareJson[key];
						} 
					}
				}
				$.ajax({
					url : searchMarkersPointsDataUrl,
					async :false,
					cache:false,
					dataType : "jsonp",
					jsonp:"jsonpcallback",		
					type : "post",
					data: json,
					success : function(_data) {
					 if(callback&&typeof callback === "function"){
						callback(_data);
					    }else if(callback){
						window[callback](_data);
					    }
					},
					error:function(XMLHttpRequest, textStatus, errorThrown){
							alert("异常wwwww:"+XMLHttpRequest.status+";"+XMLHttpRequest.readyStatus+";"+textStatus);
						}
					});
			},
			//getSearchPramits的jsonp回调函数模板
			//getSearchPramits_CallBack: function(fieldName) {								
			//	ThisfieldName = fieldName;
			//},
			//返回json形如： [{modelattribute:'LONGITUDE',modelattributename:'经度'},{modelattribute:'LATITUDE',modelattributename:'纬度'}];
			getSearchPramits: function(modelcode,header){											//根据模型表代码获得对应的表内容头
				var getAttributes4DisplayUrl = this.prejoctUrl+"/optimove/modelattributes/searchModelattribute4DisplayList.do";
				$.ajax({
					url : getAttributes4DisplayUrl,
					async :false,
					cache:false,
					dataType : "jsonp",
					jsonp:"jsonpcallback",
					jsonpCallback:"getSearchPramits_CallBack",				//jsonp的回调函数名
					type : "get",
					data: {
					  modelcode : modelcode,
					  header : header
					},
					success : function(fieldName) {
						ThisfieldName = fieldName;
						},
					error:function(XMLHttpRequest, textStatus, errorThrown){
							alert("异常:"+XMLHttpRequest.status+";"+XMLHttpRequest.readyStatus+";"+textStatus);
						}
					});
			},
			/**
			 * 根据经纬度获取表中详细信息
			 * @param modelcode  模型代码
			 * @param longitude  经度
			 * @param latitude   维度
			 * @param header     报文头
			 */
			searchDetailByPoint: function(modelcode, longitude, latitude, header){
				if(modelcode ==  undefined || longitude == undefined || latitude == undefined || header == undefined){
					alert("参数不可为空！");
					return;
				}
				jQuery.support.cors = true;
				var searchDetailByPointURL = this.prejoctUrl+"/optimove/modelattributes/searchDetailByPoint.do";
				var arrayList;
				$.ajax({
					url : searchDetailByPointURL,
					async :false,
					cache:false,
					dataType : "jsonp",
					crossDomain:true,
					jsonp:"jsonpcallback",
					//jsonpCallback:"searchDetailByP_CallBack",				//jsonp的回调函数名
					type : "get",
					data: {
						modelcode : modelcode,
						longitude: longitude,
						latitude: latitude,
						header : header
					},
					success : function(_data) {
						if(window['searchDetailByP_CallBack']){
							window['searchDetailByP_CallBack'](_data);
						}
					},
					error:function(XMLHttpRequest, textStatus, errorThrown){
						alert("异常:"+XMLHttpRequest.status+";"+XMLHttpRequest.readyStatus+";"+textStatus);
					}
				});
			},
			/**
			 * 根据业务系统id查询业务系统所使用的地图服务商API
			 * @param appid 业务系统id
			 * @return String
			 */
			getdescContent: function(appid){							//根据地址范围检索
				if(appid == null || appid == ""){
					alert("业务系统id不可为空！");
					return;
				}
				jQuery.support.cors = true;
				var getdescContentUrl = this.prejoctUrl+"/optimove/applicationmags/getdescContentAPI.do";
				var descContent;
				$.ajax({
					url : getdescContentUrl,
					async :false,
					cache :false,
					dataType : "json",
					type : "post",
					data: {
						appid : appid
					},
					success : function(_data) {
						descContent = _data.descContent;
						if(descContent ==""||descContent ==null){
							alert("没有查到该数据，请重新输入查询条件");
							return;
						}
					},
					error:function(e){
							alert("异常"+e.statusText);
					}
				});
				return descContent;
			},
			/**
			 * 查询行政区域统计数据
			 */
			searchRegionalCountData: function(json){							//根据地址范围检索
				if(json.reqUrl){
					var reqUrl = json.reqUrl;
					var tmpJson = {
							level:json.level,
							province:json.province,
							city:json.city,
							district:json.district,
							callBackFun:json.callBackFun
					};
					if(json.wbJson){
						for(var key in wbJson){
							tmpJson[key] = wbJson[key];
						}
					}
					if(json.protocol=='http'){
						tmpJson.url = reqUrl;
						reqUrl = this.prejoctUrl+"/optimove/regionalCount/getOutData.do";
						this.runJsonp(tmpJson,reqUrl);
					}else{
						tmpJson.remove_dtType=true;
						this.runJsonp(tmpJson,reqUrl);
					}
					
					
					
					
				}else{
					var fnUrl = this.prejoctUrl+"/optimove/regionalCount/searchRegionalCountData.do";
					json.dtType=this.mapType;
					this.deleteNull(json);
					this.runJsonp(json,fnUrl);
				}
				
			},
			/**
			 * 查询行政区域内的marker
			 */
			searchRegionalCountMarkers: function(json){							//根据地址范围检索
				if(json.reqUrl){
					var reqUrl = json.reqUrl;
					var tmpJson = {
							level:json.level,
							province:json.province,
							city:json.city,
							district:json.district,
							dataType:json.dataType,
							callBackFun:json.callBackFun
					};
					
					var isPage = false;
					if(json.page){
						isPage = true;
						if(!json.page.pageNo){
							json.page.pageNo = 1;
						}
						if(json.page.pageSize){
							json.page.pageSize = parseInt(json.page.pageSize);
							//tmpJson['pageJson/pageSize']=json.page.pageSize;
						}
						tmpJson.pageJson=JSON.stringify(json.page);
						//tmpJson['pageJson/pageNo']=json.page.pageNo;
					}
					//delete tmpJson.pageJson;
					if(json.wbJson){
						for(var key in wbJson){
							tmpJson[key] = wbJson[key];
						}
					}
					if(json.protocol=='http'){
						tmpJson.url = reqUrl;
						reqUrl = this.prejoctUrl+"/optimove/regionalCount/getOutData.do";
					}else{
						tmpJson.remove_dtType=true;
					}
					if(isPage){
						delete tmpJson.remove_dtType;
						$.ajax({
							url : reqUrl,
							async :true,
							cache:false,
							dataType : "jsonp",
							jsonp:"jsonpcallback",
							jsonpCallback:json.callBackFunName,				//jsonp的回调函数名
							type : "get",
							data: this.handleSearchJson(tmpJson),
							success : function(data) {
								data = map.convertJson(data);
								if(json.callBackFun&&typeof json.callBackFun === "function"){
									json.callBackFun(data,json);
								}else if(json.callBackFun){
									window[json.callBackFun](data,json);
								}
								if(data.result='ok'){
									if(data.page&&data.page.pageNo==1&&data.page.totalPage>1){
										for(var i=2;i<=data.page.totalPage;i++){
											if(!json.page){
												json.page = map.convertJson(json.pageJson);
											}
											json.page.pageNo = i;
											//json.page.pageType='1';//只查询数据
											map.searchRegionalCountMarkers(json);
										}
									}
								}
							},
							error:function(XMLHttpRequest, textStatus, errorThrown){
									alert("异常:"+XMLHttpRequest.status+";"+XMLHttpRequest.readyStatus+";"+textStatus);
								}
							});
					}else{
						this.runJsonp(tmpJson,reqUrl);
					}
					
				}else{
					if(json.dataType&&'array'==json.dataType){
						json.arrayKeys ='LONGITUDE,LATITUDE,MAPTYPE,MARKERTYPE,ID';
					}
					if(json.page){
						this.searchBaseModelDataPage(json);
					}else{
						this.searchBaseModelData(json);
					}
					
				}
				
			},
			/**
			 * 根据经纬度或id查询marker详细信息
			 */
			searchMarkerInfo: function(json){							//根据地址范围检索
				if(json.reqUrl){
					var reqUrl = json.reqUrl;
					var tmpJson = {
							id:json.id,
							longitude:json.longitude,
							latitude:json.latitude,
							callBackFun:json.callBackFun
					};
					if(tmpJson.id){
						delete tmpJson.longitude;
						delete tmpJson.latitude;
					}
					if(json.wbJson){
						for(var key in wbJson){
							tmpJson[key] = wbJson[key];
						}
					}
					if(json.protocol=='http'){
						tmpJson.url = reqUrl;
						reqUrl = this.prejoctUrl+"/optimove/regionalCount/getOutData.do";
						this.runJsonp(tmpJson,reqUrl);
					}else{
						tmpJson.remove_dtType=true;
						this.runJsonp(tmpJson,reqUrl);
					}
				}else{
					this.searchBaseModelData(json);
				}
				
			},
			dataKeyToUp:function(data){
				if(data.result=='ok'&&data.data){
					for(var key in data.data[i]){
						data.data[i][key.toUpperCase()]= data.data[i][key];
					}
				}
			},
			
			/**
			 * 查询自定义样式
			 */
			searchMapCustomHtml: function(json){							//根据地址范围检索
				var fnUrl = this.prejoctUrl+"/optimove/regionalCount/searchMapCustomHtml.do";
				json.dtType=this.mapType;
				this.deleteNull(json);
				this.runJsonp(json,fnUrl);
			},
			/**
			 * 查询图标
			 */
			searchRegionalCountIcon: function(json){							//根据地址范围检索
				var fnUrl = this.prejoctUrl+"/optimove/regionalCount/searchRegionalCountIcon.do";
				json.dtType=this.mapType;
				this.deleteNull(json);
				this.runJsonp(json,fnUrl);
			},
			/**
			 * 通用查询
			 */
			commSearch: function(json){		
				if(!json.url){
					alert('url不能为空');
					return ;
				}
				var fnUrl = this.prejoctUrl+json.url;
				json.dtType=this.mapType;
				this.deleteNull(json);
				delete json['url'];
				this.runJsonp(json,fnUrl);
			},
			replaceKey:function (tmp,row){
				for(var key in row){
					var str = '[\$]'+key+'[\$]';
					var reg = new RegExp(str,'ig');
					var value = row[key]||row[key]==0?row[key]:'';
					tmp = tmp.replace(reg,value);
				}
				//去掉不存在变量
				var str = '[\$][A-Z0-9_]+[\$]';
				var reg = new RegExp(str,'ig');
				tmp = tmp.replace(reg,'');
				return tmp;
			},
			deleteNull:function(json){
				for(var key in json){
					if(!json[key]&&json[key]!=0){
						delete json[key];
					}
				}
				return json;
			},
			//add on by yp 20190115 封装等时圈逻辑
			createQuitimeControl: function(jsonData){//封装等时圈逻辑
				map.quiTimeMap = new MapCoreLib.EquitimeControl(jsonData);
				return map.quiTimeMap;
			}
	}
	
	for(var key in commPrototype){
		MapCore.prototype[key]=commPrototype[key];
	}
})(window);
/**
 * 处理回调函数
 * @param resData  回调结果
 * @param desData  目标结果
 * @return
 */
function dealCallBackData(resData,desData){
	if(resData){
		if(resData.errorMsg||!(resData.errorMsg===undefined)){
			alert(resData.errorMsg);
			return;
		}else if(resData[0]!=null&&resData[0].error){
			alert(resData[0].error);
			return;
		}else{
			desData = resData;
		}
	}
	return desData;
}

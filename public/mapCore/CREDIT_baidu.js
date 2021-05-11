/**
 * 信贷类库
 * @author 陈浩
 * @date 2015-05-22
 */
(function(m){
	
	/**
	 * 信贷影像地图名片
	 */
	var markers = [];
	m.prototype.loadMapCard = function(json){													
		//console.log("正在加载信贷影像地图名片...");
		markers = [];
		var type = json["type"];
		var data = json["data"];
		if(type == "mobile"){
			//移动端展示
			for(var i = 0; i < data.length; i++){
				var files = data[i].split("-")[0].split(",");
				var LngLatX = data[i].split("-")[1].split(",")[0];
				var LngLatY = data[i].split("-")[1].split(",")[1];
				var point = new MapCore.Point([LngLatX, LngLatY]);
				var marker = new MapCore.Marker(point);
				this.addMarker(marker);
				(function(f){
					marker.addEvent("click", function(){
						checkImg(f);
					});
				})(files);
				markers.push(marker);
			}
			this.setCluster(markers);
		}else if(type == "webBrowser"){
			//浏览器端展示
			for(var i = 0; i < data.length; i++){
				var point = new MapCore.Point([data[i]["LngLatX"], data[i]["LngLatY"]]);
				var marker = new MapCore.Marker(point);
				this.addMarker(marker);
				var imgs = "<h>" + data[i]["Place"] + "</h><div id='imgdiv' style='height: 120px; width: 100%; overflow-y: scroll'>";
				var files = data[i].FileIds.split(',');
				var srcs = [];
				for(var j = 0; j < files.length; j++){
					var src = data[i].DownloadUrl.replace('{0}',files[j]);
					if(j < 10){
						if(j%5 == 0){
							imgs += "<div style='height: 5px; width: 100%; '></div>";
						}
						imgs += "<img onclick='showImg(this)' style='width: 50px; height: 50px; margin-left: 5px; cursor: pointer; display: inline;' src='" + src + "'/>";
					}
					srcs.push(src);
				}
				imgs += "<input id='srcs' style='display: none' value=" + srcs + ">";
				imgs += "</div><select id='oneNum' style='margin-top:10px;' ><option value='1'>1</option><option value='5' selected>5</option><option value='10' >10</option></select><button style='float: right; margin-top:10px' onclick=showMore(this)><a href='javascript:;'>更多</a></button>";
				marker.setInfoWindow(imgs);
				(function(f){
					marker.addEvent("click", function(){
						//console.log(f);
						//checkImg(f);
					});
				})(files);
				markers.push(marker);
			}
			this.setCluster(markers);
		}
	};
})(MapCore);

/**
 * 展示图片
 * @param obj
 * @return
 */
function showImg(obj){
	var showImgDiv = document.getElementById("showImgDiv");
	if(showImgDiv){
		document.body.removeChild(showImgDiv);
	}
	showImgDiv = document.createElement("img");
	showImgDiv.id = "showImgDiv";
	document.body.appendChild(showImgDiv);
	showImgDiv.onload = function(){
		var windowW = document.documentElement.clientWidth;
		var windowH = document.documentElement.clientHeight;
		var diffW = this.width - windowW * 0.8;
		var diffH = this.height - windowH * 0.8;
		if(this.width > this.height){
			while(diffW > 0){
				this.width = this.width * 0.8;
				diffW = this.width - windowW * 0.8;
			}
		}else if(this.height > this.width){
			while(diffH > 0){
				this.height = this.height * 0.8;
				diffH = this.height - windowH * 0.8;
			}
		}
		this.style.left = (windowW - this.width) / 2 + 'px';
		this.style.top = (windowH - this.height) / 2 + 'px';
	};
	showImgDiv.src = obj.src; 
	showImgDiv.style.display = "block";
	showImgDiv.style.zIndex = 1000;
	showImgDiv.style.position = "fixed";
	showImgDiv.style.cursor = "pointer";
	showImgDiv.onclick = function(e){
		var e = e || window.event;
		(e.srcElement ? e.srcElement : e.target).style.display = "none";
	};
}

function showMore(obj){
	var html = "";
	var srcs = document.getElementById("srcs").value.split(",");
	var oneNum = document.getElementById("oneNum").value;
	var num = obj.parentNode.getElementsByTagName("img").length;
	for(var j = num; j < srcs.length && j - num < oneNum; j++){
		if(j%5 == 0){
			html += "<div style='height: 5px; width: 100%; '></div>";
		}
		html += "<img onclick='showImg(this)' style='width: 50px; height: 50px; margin-left: 5px; cursor: pointer; display: inline;' src='" + srcs[j] + "'/>";
	}
	document.getElementById("imgdiv").innerHTML += html;
	obj.parentNode.getElementsByTagName("div")[0].scrollTop = obj.parentNode.getElementsByTagName("div")[0].scrollHeight;
}
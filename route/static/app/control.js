setTimeout(function(){
	Wday(0,'getload');
},500);
setTimeout(function(){
	Wday(0,'cpu');
},500);
setTimeout(function(){
	Wday(0,'mem');
},1000);
setTimeout(function(){
	Wday(0,'disk');
},1500);
setTimeout(function(){
	Wday(0,'network');
},2000);

$(".st").hover(function(){
	$(this).next().show();
},function(){
	$(this).next().hide();
	$(this).next().hover(function(){
		$(this).show();
	},function(){
		$(this).hide();
	})
})
$(".searcTime .gt").click(function(){
	$(this).addClass("on").siblings().removeClass("on");
})
$(".loadbtn").click(function(){
	$(this).parents(".searcTime").find("span").removeClass("on");
	$(this).parents(".searcTime").find(".st").addClass("on");
	var b = (new Date($(this).parent().find(".btime").val()).getTime())/1000;
	var e = (new Date($(this).parent().find(".etime").val()).getTime())/1000;
	b = Math.round(b);
	e = Math.round(e);
	getload(b,e)
})
$(".cpubtn").click(function(){
	$(this).parents(".searcTime").find("span").removeClass("on");
	$(this).parents(".searcTime").find(".st").addClass("on");
	var b = (new Date($(this).parent().find(".btime").val()).getTime())/1000;
	var e = (new Date($(this).parent().find(".etime").val()).getTime())/1000;
	b = Math.round(b);
	e = Math.round(e);
	cpu(b,e)
})
$(".membtn").click(function(){
	$(this).parents(".searcTime").find("span").removeClass("on");
	$(this).parents(".searcTime").find(".st").addClass("on");
	var b = (new Date($(this).parent().find(".btime").val()).getTime())/1000;
	var e = (new Date($(this).parent().find(".etime").val()).getTime())/1000;
	b = Math.round(b);
	e = Math.round(e);
	mem(b,e)
})
$(".diskbtn").click(function(){
	$(this).parents(".searcTime").find("span").removeClass("on");
	$(this).parents(".searcTime").find(".st").addClass("on");
	var b = (new Date($(this).parent().find(".btime").val()).getTime())/1000;
	var e = (new Date($(this).parent().find(".etime").val()).getTime())/1000;
	b = Math.round(b);
	e = Math.round(e);
	disk(b,e)
})
$(".networkbtn").click(function(){
	$(this).parents(".searcTime").find("span").removeClass("on");
	$(this).parents(".searcTime").find(".st").addClass("on");
	var b = (new Date($(this).parent().find(".btime").val()).getTime())/1000;
	var e = (new Date($(this).parent().find(".etime").val()).getTime())/1000;
	b = Math.round(b);
	e = Math.round(e);
	network(b,e)
})

function Wday(day,name){
	var now = (new Date().getTime())/1000;
	if(day==0){
		var b = (new Date(getToday() + " 00:00:01").getTime())/1000;
			b = Math.round(b);
		var e = Math.round(now);
	}
	if(day==1){
		var b = (new Date(getBeforeDate(day) + " 00:00:01").getTime())/1000;
		var e = (new Date(getBeforeDate(day) + " 23:59:59").getTime())/1000;
		b = Math.round(b);
		e = Math.round(e);
	}
	else{
		var b = (new Date(getBeforeDate(day) + " 00:00:01").getTime())/1000;
			b = Math.round(b);
		var e = Math.round(now);
	}
	switch (name){
		case "cpu":
			cpu(b,e);
			break;
		case "mem":
			mem(b,e);
			break;
		case "disk":
			disk(b,e);
			break;
		case "network":
			network(b,e);
			break;
		case "getload":
			getload(b,e);
			break;
	}
}

function getToday(){
   var mydate = new Date();
   var str = "" + mydate.getFullYear() + "/";
   str += (mydate.getMonth()+1) + "/";
   str += mydate.getDate();
   return str;
}

function getStatus(){
	loadT = layer.msg('Reading, please wait...',{icon:16,time:0})
	$.post('/system/set_control','type=-1',function(rdata){
		layer.close(loadT);

		if(rdata.status){
			$("#openJK").html("<input class='btswitch btswitch-ios' id='ctswitch' type='checkbox' checked><label class='btswitch-btn' for='ctswitch' onclick='setControl(\"openjk\", true)'></label>");
		} else {
			$("#openJK").html("<input class='btswitch btswitch-ios' id='ctswitch' type='checkbox'><label class='btswitch-btn' for='ctswitch' onclick='setControl(\"openjk\",false)'></label>");
		}

		if(rdata.stat_all_status){
			$("#statAll").html("<input class='btswitch btswitch-ios' id='stat_witch' type='checkbox' checked><label class='btswitch-btn' for='stat_witch' onclick='setControl(\"stat\",true)'></label>");
		} else{
			$("#statAll").html("<input class='btswitch btswitch-ios' id='stat_witch' type='checkbox'><label class='btswitch-btn' for='stat_witch' onclick='setControl(\"stat\",false)'></label>");
		}

		$("#save_day").val(rdata.day);

	},'json');
}
getStatus();

function setControl(act, value=false){

	if (act == 'openjk'){
		var type = $("#ctswitch").prop('checked')?'0':'1';
		var day = $("#save_day").val();
		if(day < 1){
			layer.msg('The number of storage days is invalid!',{icon:2});
			return;
		}
	} else if (act == 'stat'){
		var type = $("#stat_witch").prop('checked')?'2':'3';
	} else if (act == 'save_day'){
		var type = $("#ctswitch").prop('checked')?'1':'0';
		var day = $("#save_day").val();

		if(type == 0){
			layer.msg('Start monitoring first!',{icon:2});
			return;
		}

		if(day < 1){
			layer.msg('The number of storage days is invalid!',{icon:2});
			return;
		}
	}

	loadT = layer.msg('Processing, please wait...',{icon:16,time:0})
	$.post('/system/set_control','type='+type+'&day='+day,function(rdata){
		layer.close(loadT);
		layer.msg(rdata.msg,{icon:rdata.status?1:2});
	},'json');
}


function closeControl(){
	layer.confirm('Do you really clear all monitoring records?',{title:'Clear record',icon:3,closeBtn:1}, function() {
		loadT = layer.msg('Processing, please wait...',{icon:16,time:0})
		$.post('/system/set_control','type=del',function(rdata){
			layer.close(loadT);
			layer.msg(rdata.msg,{icon:rdata.status?1:2});
		},'json');
	});
}

function getBeforeDate(n){
    var n = n;
    var d = new Date();
    var year = d.getFullYear();
    var mon=d.getMonth()+1;
    var day=d.getDate();
    if(day <= n){
		if(mon>1) {
		   mon=mon-1;
		}
		else {
		 year = year-1;
		 mon = 12;
		}
	}
	d.setDate(d.getDate()-n);
	year = d.getFullYear();
	mon=d.getMonth()+1;
	day=d.getDate();
    s = year+"/"+(mon<10?('0'+mon):mon)+"/"+(day<10?('0'+day):day);
    return s;
}
//cpu
function cpu(b,e){
	$.get('/system/get_cpu_io?start='+b+'&end='+e,function(rdata){
		var myChartCpu = echarts.init(document.getElementById('cupview'));
		var xData = [];
		var yData = [];
		//var zData = [];

		for(var i = 0; i < rdata.length; i++){
			xData.push(rdata[i].addtime);
			yData.push(rdata[i].pro);
			//zData.push(rdata[i].mem);
		}
		option = {
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					type: 'cross'
				},
				formatter: '{b}<br />{a}: {c}%'
			},
			xAxis: {
				type: 'category',
				boundaryGap: false,
				data: xData,
				axisLine:{
					lineStyle:{
						color:"#666"
					}
				}
			},
			yAxis: {
				type: 'value',
				name: lan.public.pre,
				boundaryGap: [0, '100%'],
				min:0,
				max: 100,
				splitLine:{
					lineStyle:{
						color:"#ddd"
					}
				},
				axisLine:{
					lineStyle:{
						color:"#666"
					}
				}
			},
			dataZoom: [{
				type: 'inside',
				start: 0,
				end: 100,
				zoomLock:true
			}, {
				start: 0,
				end: 100,
				handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
				handleSize: '80%',
				handleStyle: {
					color: '#fff',
					shadowBlur: 3,
					shadowColor: 'rgba(0, 0, 0, 0.6)',
					shadowOffsetX: 2,
					shadowOffsetY: 2
				}
			}],
			series: [
				{
					name:'CPU',
					type:'line',
					smooth:true,
					symbol: 'none',
					sampling: 'average',
					itemStyle: {
						normal: {
							color: 'rgb(0, 153, 238)'
						}
					},
					data: yData
				}
			]
		};
		myChartCpu.setOption(option);
	    window.addEventListener("resize",function(){
			myChartCpu.resize();
		});
	},'json');
}

function mem(b,e){
	$.get('/system/get_cpu_io?start='+b+'&end='+e,function(rdata){
		var myChartMen = echarts.init(document.getElementById('memview'));
		var xData = [];
		//var yData = [];
		var zData = [];

		for(var i = 0; i < rdata.length; i++){
			xData.push(rdata[i].addtime);
			//yData.push(rdata[i].pro);
			zData.push(rdata[i].mem);
		}
		option = {
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					type: 'cross'
				},
				formatter: '{b}<br />{a}: {c}%'
			},
			xAxis: {
				type: 'category',
				boundaryGap: false,
				data: xData,
				axisLine:{
					lineStyle:{
						color:"#666"
					}
				}
			},
			yAxis: {
				type: 'value',
				name: lan.public.pre,
				boundaryGap: [0, '100%'],
				min:0,
				max: 100,
				splitLine:{
					lineStyle:{
						color:"#ddd"
					}
				},
				axisLine:{
					lineStyle:{
						color:"#666"
					}
				}
			},
			dataZoom: [{
				type: 'inside',
				start: 0,
				end: 100,
				zoomLock:true
			}, {
				start: 0,
				end: 100,
				handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
				handleSize: '80%',
				handleStyle: {
					color: '#fff',
					shadowBlur: 3,
					shadowColor: 'rgba(0, 0, 0, 0.6)',
					shadowOffsetX: 2,
					shadowOffsetY: 2
				}
			}],
			series: [
				{
					name:lan.index.process_mem,
					type:'line',
					smooth:true,
					symbol: 'none',
					sampling: 'average',
					itemStyle: {
						normal: {
							color: 'rgb(0, 153, 238)'
						}
					},
					data: zData
				}
			]
		};
		myChartMen.setOption(option);
		window.addEventListener("resize",function(){
			myChartMen.resize();
		});
	},'json');
}

function disk(b,e){
	$.get('/system/get_disk_io?start='+b+'&end='+e,function(rdata){
		var myChartDisk = echarts.init(document.getElementById('diskview'));
		var rData = [];
		var wData = [];
		var xData = [];
		//var yData = [];
		//var zData = [];

		for(var i = 0; i < rdata.length; i++){
			rData.push((rdata[i].read_bytes/1024/60).toFixed(3));
			wData.push((rdata[i].write_bytes/1024/60).toFixed(3));
			xData.push(rdata[i].addtime);
			//yData.push(rdata[i].read_count);
			//zData.push(rdata[i].write_count);
		}
		option = {
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					type: 'cross'
				},
				formatter:"time：{b0}<br />{a0}: {c0} Kb/s<br />{a1}: {c1} Kb/s",
			},
			legend: {
				data:['read bytes','write bytes']
			},
			xAxis: {
				type: 'category',
				boundaryGap: false,
				data: xData,
				axisLine:{
					lineStyle:{
						color:"#666"
					}
				}
			},
			yAxis: {
				type: 'value',
				name: 'unit:KB/s',
				boundaryGap: [0, '100%'],
				splitLine:{
					lineStyle:{
						color:"#ddd"
					}
				},
				axisLine:{
					lineStyle:{
						color:"#666"
					}
				}
			},
			dataZoom: [{
				type: 'inside',
				start: 0,
				end: 100,
				zoomLock:true
			}, {
				start: 0,
				end: 100,
				handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
				handleSize: '80%',
				handleStyle: {
					color: '#fff',
					shadowBlur: 3,
					shadowColor: 'rgba(0, 0, 0, 0.6)',
					shadowOffsetX: 2,
					shadowOffsetY: 2
				}
			}],
			series: [
				{
					name:'read bytes',
					type:'line',
					smooth:true,
					symbol: 'none',
					sampling: 'average',
					itemStyle: {
						normal: {
							color: 'rgb(255, 70, 131)'
						}
					},
					data: rData
				},
				{
					name:'write bytes',
					type:'line',
					smooth:true,
					symbol: 'none',
					sampling: 'average',
					itemStyle: {
						normal: {
							color: 'rgba(46, 165, 186, .7)'
						}
					},
					data: wData
				}
			]
		};
		myChartDisk.setOption(option);
		window.addEventListener("resize",function(){
			myChartDisk.resize();
		});
	},'json');
}

function network(b,e){
	$.get('/system/get_network_io?start='+b+'&end='+e,function(rdata){
		var myChartNetwork = echarts.init(document.getElementById('network'));
		var aData = [];
		var bData = [];
		var cData = [];
		var dData = [];
		var xData = [];
		var yData = [];
		var zData = [];

		for(var i = 0; i < rdata.length; i++){
			aData.push(rdata[i].total_up);
			bData.push(rdata[i].total_down);
			cData.push(rdata[i].down_packets);
			dData.push(rdata[i].up_packets);
			xData.push(rdata[i].addtime);
			yData.push(rdata[i].up);
			zData.push(rdata[i].down);
		}
		option = {
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					type: 'cross'
				}
			},
			legend: {
				data:[lan.index.net_up,lan.index.net_down]
			},
			xAxis: {
				type: 'category',
				boundaryGap: false,
				data: xData,
				axisLine:{
					lineStyle:{
						color:"#666"
					}
				}
			},
			yAxis: {
				type: 'value',
				name: lan.index.unit+':KB/s',
				boundaryGap: [0, '100%'],
				splitLine:{
					lineStyle:{
						color:"#ddd"
					}
				},
				axisLine:{
					lineStyle:{
						color:"#666"
					}
				}
			},
			dataZoom: [{
				type: 'inside',
				start: 0,
				end: 100,
				zoomLock:true
			}, {
				start: 0,
				end: 100,
				handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
				handleSize: '80%',
				handleStyle: {
					color: '#fff',
					shadowBlur: 3,
					shadowColor: 'rgba(0, 0, 0, 0.6)',
					shadowOffsetX: 2,
					shadowOffsetY: 2
				}
			}],
			series: [
				{
					name:lan.index.net_up,
					type:'line',
					smooth:true,
					symbol: 'none',
					sampling: 'average',
					itemStyle: {
						normal: {
							color: 'rgb(255, 140, 0)'
						}
					},
					data: yData
				},
				{
					name:lan.index.net_down,
					type:'line',
					smooth:true,
					symbol: 'none',
					sampling: 'average',
					itemStyle: {
						normal: {
							color: 'rgb(30, 144, 255)'
						}
					},
					data: zData
				}
			]
		};
		myChartNetwork.setOption(option);
		window.addEventListener("resize",function(){
			myChartNetwork.resize();
		});
	},'json');
}

function getload_old(b,e){
	$.get('/system/get_load_average?start='+b+'&end='+e,function(rdata){
		var myChartgetload = echarts.init(document.getElementById('getloadview'));
		var aData = [];
		var bData = [];
		var xData = [];
		var yData = [];
		var zData = [];

		for(var i = 0; i < rdata.length; i++){
			xData.push(rdata[i].addtime);
			yData.push(rdata[i].pro);
			zData.push(rdata[i].one);
			aData.push(rdata[i].five);
			bData.push(rdata[i].fifteen);
		}
		option = {
			tooltip: {
				trigger: 'axis'
			},
			calculable: true,
			legend: {
				data:['System resource usage','1 minute','5 minutes','15 minutes'],
				selectedMode: 'single',
			},
			xAxis: {
				type: 'category',
				boundaryGap: false,
				data: xData,
				axisLine:{
					lineStyle:{
						color:"#666"
					}
				}
			},
			yAxis: {
				type: 'value',
				name: '',
				boundaryGap: [0, '100%'],
				splitLine:{
					lineStyle:{
						color:"#ddd"
					}
				},
				axisLine:{
					lineStyle:{
						color:"#666"
					}
				}
			},
			dataZoom: [{
				type: 'inside',
				start: 0,
				end: 100,
				zoomLock:true
			}, {
				start: 0,
				end: 100,
				handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
				handleSize: '80%',
				handleStyle: {
					color: '#fff',
					shadowBlur: 3,
					shadowColor: 'rgba(0, 0, 0, 0.6)',
					shadowOffsetX: 2,
					shadowOffsetY: 2
				}
			}],
			series: [
				{
					name:'System resource usage',
					type:'line',
					smooth:true,
					symbol: 'none',
					sampling: 'average',
					itemStyle: {
						normal: {
							color: 'rgb(255, 140, 0)'
						}
					},
					data: yData
				},
				{
					name:'1 minute',
					type:'line',
					smooth:true,
					symbol: 'none',
					sampling: 'average',
					itemStyle: {
						normal: {
							color: 'rgb(30, 144, 255)'
						}
					},
					data: zData
				},
				{
					name:'5 minute',
					type:'line',
					smooth:true,
					symbol: 'none',
					sampling: 'average',
					itemStyle: {
						normal: {
							color: 'rgb(0, 178, 45)'
						}
					},
					data: aData
				},
				{
					name:'15 minute',
					type:'line',
					smooth:true,
					symbol: 'none',
					sampling: 'average',
					itemStyle: {
						normal: {
							color: 'rgb(147, 38, 255)'
						}
					},
					data: bData
				}
			]
		};
		myChartgetload.setOption(option);
		window.addEventListener("resize",function(){
			myChartgetload.resize();
		});
	},'json');
}

function getload(b,e){
	$.get('/system/get_load_average?start='+b+'&end='+e,function(rdata){
		var myChartgetload = echarts.init(document.getElementById('getloadview'));
		var aData = [];
		var bData = [];
		var xData = [];
		var yData = [];
		var zData = [];

		for(var i = 0; i < rdata.length; i++){
			xData.push(rdata[i].addtime);
			yData.push(rdata[i].pro);
			zData.push(rdata[i].one);
			aData.push(rdata[i].five);
			bData.push(rdata[i].fifteen);
		}
		option = {
			animation: false,
			tooltip: {
				trigger: 'axis',
				axisPointer: {
	                type: 'cross'
	            }
			},
			legend: {
				data:['1 minute','5 minute','15 minute'],
				right:'16%',
				top:'10px'
			},
			axisPointer: {
				link: {xAxisIndex: 'all'},
				lineStyle: {
					color: '#aaaa',
					width: 1
				}
			},
			grid: [{
					top: '60px',
					left: '5%',
					right: '55%',
					width: '40%',
					height: 'auto'
				},
				{
					top: '60px',
					left: '55%',
					width: '40%',
					height: 'auto'
				}
			],
			xAxis: [

				{
					type: 'category',
					axisLine: {
						lineStyle: {
							color: '#666'
						}
					},
					data: xData
				},
				{
					type: 'category',
					gridIndex: 1,
					axisLine: {
						lineStyle: {
							color: '#666'
						}
					},
					data: xData
				},
			],
			yAxis: [{
					scale: true,
					name: 'resource usage %',
					splitLine: {
						show: true,
						lineStyle:{
							color:"#ddd"
						}
					},
					nameTextStyle: {
						color: '#666',
						fontSize: 12,
						align: 'left'
					},
					axisLine:{
						lineStyle:{
							color: '#666',
						}
					}
				},
				{
					scale: true,
					name: 'load details',
					gridIndex: 1,
					splitLine: {
						show: true,
						lineStyle:{
							color:"#ddd"
						}
					},
					nameTextStyle: {
						color: '#666',
						fontSize: 12,
						align: 'left'
					},
					axisLine:{
						lineStyle:{
							color: '#666',
						}
					}
				},
			],
			dataZoom: [{
				type: 'inside',
				start: 0,
				end: 100,
				xAxisIndex:[0,1],
				zoomLock:true
			}, {
				xAxisIndex: [0, 1],
	            type: 'slider',
				start: 0,
				end: 100,
				handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
				handleSize: '80%',
				handleStyle: {
					color: '#fff',
					shadowBlur: 3,
					shadowColor: 'rgba(0, 0, 0, 0.6)',
					shadowOffsetX: 2,
					shadowOffsetY: 2
				},
				left:'5%',
				right:'5%'
			}],
			series: [
				{
					name: 'resource usage %',
					type: 'line',
					lineStyle: {
						normal: {
							width: 2,
							color: 'rgb(255, 140, 0)'
						}
					},
					itemStyle: {
						normal: {
							color: 'rgb(255, 140, 0)'
						}
					},
					data: yData
				},
				{
					xAxisIndex: 1,
					yAxisIndex: 1,
					name: '1 minute',
					type: 'line',
					lineStyle: {
						normal: {
							width: 2,
							color: 'rgb(30, 144, 255)'
						}
					},
					itemStyle: {
						normal: {
							color: 'rgb(30, 144, 255)'
						}
					},
					data: zData
				},
				{
					xAxisIndex: 1,
					yAxisIndex: 1,
					name: '5 minute',
					type: 'line',
					lineStyle: {
						normal: {
							width: 2,
							color: 'rgb(0, 178, 45)'
						}
					},
					itemStyle: {
						normal: {
							color: 'rgb(0, 178, 45)'
						}
					},
					data: aData
				},
				{
					xAxisIndex: 1,
					yAxisIndex: 1,
					name: '15 minute',
					type: 'line',
					lineStyle: {
						normal: {
							width: 2,
							color: 'rgb(147, 38, 255)'
						}
					},
					itemStyle: {
						normal: {
							color: 'rgb(147, 38, 255)'
						}
					},
					data: bData
				}
			],
			textStyle: {
				color: '#666',
				fontSize: 12
			}
		}
		myChartgetload.setOption(option);
		window.addEventListener("resize",function(){
			myChartgetload.resize();
		})
	},'json')
}

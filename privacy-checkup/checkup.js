var Main = {
	// Helper functions
	isNumeric:function(n){
		return !isNaN(parseFloat(n)) && isFinite(n);
	},
	getPercent:function(n,t){
		return Math.round(Math.floor((n/t)*100));
	},
	
	// Backend URLs
	urlFirst:"checkup-helper.php",
	urlThird:"https://projects.absolutedouble.co.uk/checkup-helper.php",
	
	// Functions to update the user interface
	ui:{
		init:function(){
			$("#test").empty();
			
			$("#test").append(
				$("<table/>").append(
					$("<thead/>").append(
						$("<th/>").text("Test Name"),
						$("<th/>").text("Description"),
						$("<th/>").text("Estimated Run Time"),
						$("<th/>").text("Options")
					),
					$("<tbody/>",{"id":"test_table"})
				)
			);
			
			var keys = Object.keys(Main.tests);
			for (var i = 0, l = keys.length;i<l;i++){
				console.log(keys[i]);
				Main.ui.addRow(
					keys[i],
					Main.tests[keys[i]].name,
					Main.tests[keys[i]].desc,
					Main.tests[keys[i]].time
				);
			}
		},
		addRow:function(internal,name,desc,time){
			$("#test_table").append(
				$("<tr/>",{"data-name":internal}).append(
					$("<td/>",{"class":"rowname"}).text(name || "???"),
					$("<td/>",{"class":"rowdesc"}).text(desc || ""),
					$("<td/>",{"class":"rowtime"}).text(time || "0 Seconds"),
					$("<td/>",{"class":"rowrun"}).append(
						$("<button/>",{"data-name":internal}).on("click enter",function(){
							Main.runTest($(this).data("name"));
						}).text("Run Test")
					)
				)
			);
		},
		update:function(internal,column,value){
			$("tr[data-name='" + internal + "'] td.row" + column).text(value);
		},
		markProgress:function(internal,data){
			if (Main.isNumeric(data)){
				return;
			}
			if (data){
				$("tr[data-name='" + internal + "']").css({
					"background-color":"rgba(0, 168, 61, 0.92)",
					"color":"#fff"
				});
			} else {
				$("tr[data-name='" + internal + "']").css({
					"background-color":"rgba(168, 0, 0, 0.92)",
					"color":"#fff"
				});
			}
		}
	},
	
	// Information about tests
	tests:{
		"CanvasFingerprinting":{
			"name":"Canvas Fingerprinting Test",
			"desc":"Uses a library to try and give you a unique fingerprint and then sees when it changes.",
			"time":"1 Minute",
			"run":true
		},
		"AudioFingerprinting":{
			"name":"Audio Fingerprinting Test",
			"desc":"Trys to use the Web Audio API.",
			"time":"3 Seconds",
			"run":true
		},
		"UserAgent":{
			"name":"User-Agent Randomiser Test",
			"desc":"Makes multiple requests and records the user agent header to see when it changes.",
			"time":"1 Minute",
			"run":true
		},
		"RefererHeader":{
			"name":"HTTP Referer Header Test",
			"desc":"Sends multiple requests to see when the HTTP 'Referer' Header is set",
			"time":"30 Seconds",
			"run":true
		},
		"WebRTC":{
			"name":"WebRTC Leak Test",
			"desc":"Checks if WebRTC can scan your local network to find your local IP",
			"time":"3 Seconds",
			"run":true
		},
		"HyperlinkAudit":{
			"name":"Hyperlink Auditing Test",
			"desc":"Simulates a link click to send a ping request, then checks if the request was sent.",
			"time":"15 Seconds",
			"run":true
		},
		"GoogleHeaders":{
			"name":"Google Header Test",
			"desc":"Attempts to send a request with 4 Google Headers to see if they are removed.",
			"time":"20 Seconds",
			"run":true
		},
		"BrowserPlugins":{
			"name":"Browser Plugin Fingerprinting",
			"desc":"Trys to load a list of browser plugins",
			"time":"10 Seconds",
			"run":true
		},
		"TrackingDomains":{
			"name":"Web Tracking Domains",
			"desc":"Trys to load tracking scripts from a number of domains",
			"time":"30 Seconds",
			"run":true
		},
	},
	runTest:function(internal){
		console.log("Called[runTest]:",internal);
		Main.ui.update(internal,"time","Started...");
		if (typeof suite[internal] !== "undefined"){
			suite[internal]["run"](Main.updateTest);
		} else {
			Main.ui.update(internal,"time","Not Implemented");
		}
	},
	updateTest:function(evt,data,internal){
		if (evt === "complete"){
			Main.ui.update(internal,"time","Finished!");
			Main.ui.markProgress(internal,data);
		} else if (evt === "score") {
			Main.ui.update(internal,"time",(data*100) + "%");
		}
	}
};

var suite = {
	AudioFingerprinting:{
		run:function(cb){
			try {
				var x = new(window.OfflineAudioContext || window.webkitOfflineAudioContext)(1, 44100, 44100);
				var y = x.createOscillator();
				var z = (window.AudioContext || window.webkitAudioContext)();
				if (z !== false){
					if (x && y && z) {
						cb("complete",false,"AudioFingerprinting");
					}
				} else {
					cb("complete",true,"AudioFingerprinting");
				}
			} catch (e){
				cb("complete",true,"AudioFingerprinting");
			}
		}
	},
	WebRTC:{
		run:function(cb){
			var ip_dups = {};
			var RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
			var useWebKit = !!window.webkitRTCPeerConnection;
			
			if(!RTCPeerConnection){
				cb("complete",true,"WebRTC");
			} else {
				var mediaConstraints = {
					optional: [{RtpDataChannels: true}]
				};
				var servers = {iceServers: [{urls: "stun:stun.services.mozilla.com"}]};
				var connect = new RTCPeerConnection(servers, mediaConstraints);
				
				function handle(candidate){
					console.info(candidate);
					var ip_regex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/
					var ip_addr = ip_regex.exec(candidate)[1];
					if(ip_dups[ip_addr] === undefined){
						if (ip_addr.match(/^(192\.168\.|169\.254\.|10\.|172\.(1[6-9]|2\d|3[01]))/)){	
							cb("complete",false,"WebRTC");
						} else {
							cb("complete",true,"WebRTC");
						}
					}
					ip_dups[ip_addr] = true;
				}
				connect.onicecandidate = function(ice){
					if(ice.candidate)
						handle(ice.candidate.candidate);
				};
				connect.createDataChannel("");
				connect.createOffer(function(result){connect.setLocalDescription(result,function(){},function(){});},function(){});
				setTimeout(function(){
					var lines = connect.localDescription.sdp.split('\n');
					lines.forEach(function(line){
						if(line.indexOf('a=candidate:') === 0){
							handle(line);
						} else {
							cb("complete",true,"WebRTC");
						}
					});
				},3000);
			}
		}
	},
	GoogleHeaders:{
		run:function(cb){
			var badHeaders = {
				"X-Client-Data":"FakeHead1",
				"X-Chrome-UMA-Enabled":"FakeHead2",
				"X-Chrome-Variations":"FakeHead3",
				"X-Chrome-Connected":"FakeHead4",
			};
			
			cb("progress",50,"GoogleHeaders");
			
			$.ajax({
				cache:false,
				url:Main.urlFirst + "?testname=GoogleHeader",
				headers:badHeaders,
				timeout:15000,
				success:function(l){
					var resp = {};
					try {
						resp = JSON.parse(l);
					} catch(e){}
					
					var score = 0;
					score += (resp["chromeConnected"] === true ? 0.25 : 0)
					score += (resp["chromeUma"] === true ? 0.25 : 0)
					score += (resp["chromeVariations"] === true ? 0.25 : 0)
					score += (resp["clientData"] === true ? 0.25 : 0)
					
					cb("score",score,"GoogleHeaders");
				},
				error:function(e){
					$("#test_res_gah").text("Error");
				}
			});
		}
	},
	HyperlinkAudit:{
		run:function(cb){
			console.info(document.cookie);
			if (document.cookie.length !== 0){
				document.cookie = "";
			}
			
			var tester = document.createElement("a");
			tester.href = Main.urlFirst + "?testname=HyperlinkAudit";
			tester.title = "Test element for Hyperlink Audit";
			tester.ping = Main.urlFirst;
			tester.target = "_blank";
			tester.id = "hyperlinkaudit_el";
			document.body.appendChild(tester);
			tester.click();
			window.focus();
			
			setTimeout(function(){
				if (Cookies) {
					console.info(Cookies.get("TraceCheckHyperlinkAudit"));
					if (typeof(Cookies.get("TraceCheckHyperlinkAudit")) != "undefined"){
						cb("complete",false,"HyperlinkAudit");
					} else {
						cb("complete",true,"HyperlinkAudit");
					}
				} else {
					cb("error","Cookie support required for this test","HyperlinkAudit");
				}
			},5000);
		}
	},
	UserAgent:{
		previous:[],
		run:function(cb){
			suite.UserAgent.previous = [];
			
			for (var i = 0; i < 6;i++){
				setTimeout(suite.UserAgent.sendRequest,5000*i);
				//suite.UserAgent.checkPrevious(cb);
			}
			cb("complete",false,"UserAgent");
		},
		checkPrevious:function(cb){
			var last = suite.UserAgent.previous.length-1;
			for (var i = 0;i<last;i++){
				console.log(i,last);
				if (suite.UserAgent.previous[i] !== suite.UserAgent.previous[last]){
					cb("complete",true,"UserAgent");
					break;
				}
			}
		},
		sendRequest:function(){
			$.ajax({
				cache:false,
				url:Main.urlFirst + "?testname=UserAgent",
				timeout:10000,
				success:function(x){
					suite.UserAgent.previous.push(x);
				},
				error:function(e){
					console.error(e);
				}
			});
		}
	},
	TrackingDomains:{
		links:[
			"https://"
		]
	}
};

Main.ui.init();
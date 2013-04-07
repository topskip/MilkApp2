

 	var pushNotification;
 	var imei;	
	var pincode;
	var regid;
 	var country;
	var st;
	
	// Cordova is ready
    //
    function onDeviceReady() {
   		
   		// Handle the pause event
 		
    	// alert("Send register");
    	
    	// * pushNotification = window.plugins.pushNotification;
    	// * pushNotification.register(successHandler, errorHandler,{"senderID":"598429447813","ecb":"onNotificationGCM"});	
		
    	
    	//if (device.platform == 'android' || device.platform == 'Android') {
 			//pushNotification.register(successHandler, errorHandler,{"senderID":"598429447813","ecb":"onNotificationGCM"});
		//} else {
    	//	pushNotification.register(tokenHandler, errorHandler {"badge":"true","sound":"true","alert":"true","ecb":"onNotificationAPN"});
		//}
 		
    	alert("onDeviceReady");
 		document.addEventListener("resume", onResume, false);
		document.addEventListener("pause", onPause, false);  
		document.addEventListener("destroy", onDestroy, false); 
        window.addEventListener("orientationchange", orientationChange, false);		
        
        localStorage.setItem("state",2);
               
    	
        /**
         * Übergabeparameter von JAVA 
         */
        imei = getIMEI();
        alert("Vor ParseInt(getNotifystart)");
        var V=parseInt(getNotifystart());
        
        /**
         * Was wir nun zu tun haben, ist abhängig vom Status des Programms
         * "installiert","registriert" 
         */
        
        switch(V){
			case 0:
				//execute code block 1
				break;
			case 1:
				// Alles aktuell. Wir wurden durch notify gestartet, 
				// also mal die Daten updaten
				//updateData();
			break;
			
			default:
				//undefined 
		}
		
		
        st = parseInt(localStorage.getItem("state"));
        alert("vor parseInt(st)"+st);
		country = parseInt(localStorage.getItem("country"));
		
		$('header').html(texte[country]["company"]);
		if (st==null){st=0};

		//alert("st = "+st+" country="+country);
		
		switch(st){
			case 0:
				country = localStorage.getItem("country");
				if (country ==null){country=1};
				if (country!==null){
					//alert("Country ist gesetzt "+country);
					$("#input_div").show();
				} else {
					$("#flaggen").show();
				}

				break;
			case 1:
				$("#input_div").show();
				//$('header').html("Anmeldung");
				$(".input").show();
				break;
			case 2:
				$("ul").show();
				if (V==1){
					updateData();
				}
				break;
			default:
		
		}
		
		if (st==null) {
			// Menu wegschalten;
			$('ul').hide();
		}
		
		
    }
	function anmelden() {
		pincode = $(".input").val();
		//alert("Anmelden mit "+pincode+" regid:"+regid);
		if(regid==null){regid=""};
		
		if (regid==""){
			pushNotification = window.plugins.pushNotification;
			pushNotification.register(successHandler, errorHandler,{"senderID":"598429447813","ecb":"onNotificationGCM"});
		}else{
			//serverRegis();
		}
		
			
	}
	function onResume() {}
    
	function onPause() {}
		
	function onDestroy() {}
		        
    // handle GCM notifications for Android
    function onNotificationGCM(e) {
	    //alert("onNotification");
    	switch( e.event ){
    	    case 'registered':
				if ( e.regid.length > 0) {
					regid = e.regid;
					//alert("regid received");
				}
            break;
                    
            case 'message':
				//alert("Message:"+e.message);
				updateData();

            break;
                    
            case 'error':
				alert("Err:"+e.msg);
            break;
                    
            default:
				alert("Unknown Message");                   
			break;
        }
	}

    /**
     * Wenn die GCM registrierung ok ist, also eine regId vorliegt müssen wir uns bei 
     * Joshuas Server anmelden 
     */
    
    function serverRegis(){
		alert("reg:"+regid);
    	$.ajax({
				url:"http://mpr.srv1-14119.srv-net.de/query.php",
				type:"POST",
				data:{
					"action":"registerDevice",
					"serviceId":"2",
					"organisationId":"1",
					"deviceType":"gcm",	
					"deviceRegId":regid,
					"active":"on",
					"pin":pincode,
					"imei":imei
			},
				success:function(resp) {
				alert("Anmeldung:"+resp);
				}
		});
    	    	
    }
    
   
	// iOS
	function onNotificationAPN(event) {
    	if (event.alert) {
        	navigator.notification.alert(event.alert);
    	}

    	if (event.sound) {
        	var snd = new Media(event.sound);
        	snd.play();
    	}

    	if (event.badge) {
        	pushNotification.setApplicationIconBadgeNumber(successHandler, event.badge);
    	}
	}            
        
	function tokenHandler (result) {
		alert("token:"+result);
		// Your iOS push server needs to know the token before it can push to this device
			// here is where you might want to send it the token for later use.
	}
		
	function successHandler (result) {
		//alert("success:"+result);
	}
		
	function errorHandler (error) {
		//alert("error:"+error);
	}
	function orientationChange(e){
		
		//alert("Orientation");
		var orientation="portrait";
		if(window.orientation == -90 || window.orientation == 90) orientation = "landscape";
		//$('#status').html("It's:"+orientation+" "+$(window).width()+"  "+$(window).height());
	};
	   

	// Aktuelle Daten vom server abholen
    function updateData() {
    	//showActivityIndicator();
    	navigator.notification.activityStart("", "Proben werden geladen...");
    	// sollte doch gehen.... wo ist das problem?
    	$('#tab-area').html("");
    	
    	//$('header').html('Country:'+country);
    	//alert(""+texte[country]["gCap"]);
    	$('header').html(texte[country]["gCap"]);
    	//$('header').html('Vorl&auml;ufige G&uuml;tedaten');
    	$('#tab-area').show();
		$.ajax({
  			url:"http://mpr.srv1-14119.srv-net.de/query.php",
  			type:"POST",
  			data:{
  				"action":"pullDataFromServer",
  				"serviceId":"2",
  				"organisationId":"1",
  				"pin":"100000"
			},
  			success:function(resp) {
    			//playBeep();
				//alert("resp:"+resp);
  				navigator.notification.activityStop();
  				
				$('#tab-area').html(makeStartHeader());			
				var myData = JSON.parse(resp,translate);
				var today = new Date();
				
				for (var i = 0, len = myData.data.length; i < len; i++) { 
    				if(deltaDays(myData.data[i].dateInsert,today)< 130) {
    					$('#tab-area').append(makeZeile(myData.data[i]));	
    				}    				
    			}
    			$('#tab-area').append(old+makeEndHeader());
    			//alert("resp: "+resp);
  			}
						
  		});
		//alert("ajax ended");
		
    }
	function translate(key,value) {
		return (key == "hemmstoffe") ? ["negativ","positiv"][value] : value;
	}
	
	
	function makeStartHeader() {
    	//	<th>Bezeichnung</th>
  		//	</tr>";
		var country = localStorage.getItem("country");
		//alert("Land:"+country);
		start = "<tr><th>"+texte[country]["dat"]+"</th><th>"+texte[country]["menge"]+" [l]</th><th>"+texte[country]["fett"]+" [%]</th><th>"+texte[country]["eiweis"]+" [%]</th><th>"+texte[country]["zellen"]+" [Tsd]</th><th>"+texte[country]["keime"]+" [Tsd]</th><th class=expand>"+texte[country]["gefr"]+" [C]</th><th>"+texte[country]["laktose"]+" [%]</th><th class=expand>"+texte[country]["harn"]+" [mg/l]</th><th>"+texte[country]["hemm"]+"</th></tr>";
		//start = "<tr><th>Datum</th><th>Milchmenge</th><th>Fett</th><th>eiweiß</th><th>Gefr</th><th>keime</th><th>gefr</th><th>Laktose</th><th>harn</th><th>hemm</th></tr>";
		
		
  		return (start);
	}   
	
	function makeZeile(d) {
		dd = d.dateInsert;
		
		dat = dd.substring(8,10)+"."+dd.substring(5,7)+"."+dd.substring(2,4);
		zeile = "<th>"+d.milchmenge+"</th><th class=data>"+getVal(d.fett)+"</th><th class=data>"+getVal(d.fett)+"</th><th class=data>"+getVal(d.zellen)+"</th><th class=data>"+getVal(d.keime)+"</th><th>"+getVal(d.gefrierpunkt)+"</th><th class=data>"+getVal(d.laktose)+"</th><th class=data>"+getVal(d.harnstoff)+"</th>";
		if (d.hemmstoffe == "positiv") {
		   zeile = "<tr><th class=red>"+dat+"</th>"+zeile;
		   zeile = zeile + "<th class=red>"+d.hemmstoffe+"</th></tr>";
		} else {
		   zeile = "<tr><th>"+dat+"</th>"+zeile;
		   zeile = zeile + "<th class=green>"+d.hemmstoffe+"</th></tr>";
		}
		return (zeile);
	}   
	function getVal(v) {
		if (v!==null) {
			return (v);
		} else {
			return ("");
		}
	}
	function makeEndHeader() {
		ende = "</table>";
		return (ende);
	}   
	function deltaDays(dateAsString, dateAsDate) {
		// Parametertypes sind mit String und Date vorgegeben, wie machen keine Detektion,
		// es wäre zwar sauberer, aber brauchen wir gerade nicht
		var DateAsStringParts = dateAsString.split(' ')[0].split('-');
		// DateAsStringParts ist nun ein array mit den folgenden Werten an den folgenden Indizies:
		// 0 = Year
		// 1 = Month (VORSICHT!)
		// 2 = Day
		var year = parseInt(DateAsStringParts[0]); // parseInt = Umwandlung eines Strings in eien Integer
		var month = parseInt(DateAsStringParts[1])-1; // month-1 = weil skala von 0 bis 11
		var day = parseInt(DateAsStringParts[2]);
	    var check1 = new Date(year, month, day);
	    var check2 = new Date(dateAsDate.getFullYear(), dateAsDate.getMonth(), dateAsDate.getDate());
	    
	    return Math.round(Math.abs(check1 - check2) / (1000 * 60 * 60 * 24 ));
	}
	function changeHeader() {
		$('header').html('Meldungen');
		$('ul li').hide;
	}   
	function changeText() {
		//$('header').html('Sonder');
		//$('#tab-area').html('<H1>Neuer texte</H1>');
		$('#tab-area').hide("");
	}   
	// Show a custom alert
    //
    function showAlert() {
        navigator.notification.alert(
            'You are the winner!',  // message
            'Game Over',            // title
            'Done'                  // buttonName
        );
    }

	function isNumberKey(evt){
		//alert(evt);
	}


    // Beep mit standard 
    //
    function playBeep() {
        navigator.notification.beep(1);
    }

    // Vibrate for 1 seconds
    //
    function vibrate() {
        navigator.notification.vibrate(1000);
    }
    function changeLanguage(){
    	$('header').html('');
    	$("#tab-area").hide();
    	$('#flaggen').show();
    }
    function languageChange(c){
    	//alert("country: "+country);
    	country = c;
    	localStorage.setItem("country",country);
    	$('#flaggen').hide();
    	$("ul").show();
    }
    
    function reset() {
    	
    }
    
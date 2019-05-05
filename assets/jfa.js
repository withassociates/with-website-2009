var i=0;

document.observe("dom:loaded", function() {
  externalNewWindow();
  googleMap();
	formLabels();
	jobsText();
  //getTweets();
  //tweetInterval=setInterval('showTweet('+i+')', 3000);
});

function externalNewWindow(){
  $$('a[href^=http://]:not(a[href^=http://withassociates.tumblr.com])').each(function(link){
    link.writeAttribute({target:"_blank", title:"Javascript will open this external link in a new window."});
    return false;
  });
}

function googleMap(){
  if (document.getElementById('map_canvas')){
    
    var latlng = new google.maps.LatLng(51.542530, -0.080100);
    var myOptions = {
      zoom: 15,
      center: latlng,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      mapTypeControl: false
    };
    var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
    var infowindow = new google.maps.InfoWindow({ 
      content: '<p>With Associates<br/>100 De Beauvoir Road<br/>London, N1 4EN</p><p><a href="http://maps.google.com/maps?f=q&hl=en&geocode=&q=n1%204en&mrt=all" target="_blank">Get directions at Google Maps</a></p>'
    });
		//var infosize = new GSize({600, 600})
		//infowindow.reset(latlng, infowindow.getTabs(), infosize) 
    var marker = new google.maps.Marker({
        position: latlng, 
        map: map 
    });
    google.maps.event.addListener(marker, 'click', function() {
      infowindow.open(map,marker);
    });
  }
}

function formLabels(){
	$$('.nolabel').each(function(li){
		var thelabel=li.select('label')[0];
		var theinput=li.select('input')[0];
		thelabel.addClassName('hide');
		theinput.addClassName('withlabel');
		theinput.writeAttribute({"value":thelabel.innerHTML})
		theinput.observe('focus', function(clicked){
			theinput.writeAttribute({"value":""})
		})
		theinput.observe('blur', function(clicked){
			if (theinput.readAttribute("value") == '') theinput.writeAttribute({"value":thelabel.innerHTML})
		})
	})
}

function jobsText(){
  $$('.icons li:first-child')[0].addClassName('first');
  $$('.icons li').each(function(li){
    var a = li.down('a')
    var text = '<span>'+a.innerHTML+'</span>';
    a.insert({bottom:text});
    li.observe('mouseover', function(){
      li.down('span').addClassName('hover');
    })
    li.observe('mouseout', function(){
      li.down('span').removeClassName('hover');
    })
  })
}

function getTweets(max_id){
  var url;
  var url = "http://twitter.com/status/user_timeline/withassociates.json?count=10&callback=?";
  var monthArray =['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var tweets = "<ul>";
  getJSON(
    url,
    function(data){
      data.each(function(item){
        var tweetDateArray=item.created_at.split(' ');
        var tweetDate = new Date(tweetDateArray[5], monthArray.indexOf(tweetDateArray[1]), tweetDateArray[2], tweetDateArray[3].split(':')[0], tweetDateArray[3].split(':')[1]);
        console.log(tweetDate);
        tweets += '<li><a href="http://www.twitter.com/'+item.user.screen_name+'#status_'+item.id+'">'+item.text+' '+item.created_at+' from '+item.source;
        tweets +=  (item.in_reply_to_screen_name)?' in reply to '+item.in_reply_to_screen_name:'';
        tweets +='</a></li>';
      });
      tweets += "</ul>";
      $('twitter').insert(tweets);
      showTweet(i);
    }
  );
}

function showTweet(show_no){
  if(show_no < 10){
    $$('#twitter li').invoke('hide');
    $$('#twitter li')[show_no].show();
    i++;
  }else{
    clearInterval(tweetInterval)
  }
}
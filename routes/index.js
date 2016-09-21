var PubNub = require('pubnub');
var request = require('request');
var config = require("../config");

exports.init = function (req, res) {
    res.render('index',{sub:config.subscribe_key});
};
exports.getdata = function (req, res) {
	pubnub = new PubNub({
        publishKey : config.publish_key,
        subscribeKey : config.subscribe_key
    })
    pubnub.subscribe({
    channels: ['mapdata']
	})
    var key = config.apikey;
    var lat = req.body.lat;
    var long = req.body.log;
   request('http://www.airnowapi.org/aq/observation/latLong/current/?format=application/json&latitude='+lat+'&longitude='+long+'&distance=30&API_KEY='+key+'', function (error, response, body) {
  if (!error && response.statusCode == 200) {
    if(body == "[]")
    {return;}
    var re_obj ={};
    var par_body = JSON.parse(body);
    re_obj.ReportingArea = par_body[0].ReportingArea;
    re_obj.ozone = par_body[0].Category["Name"];
    re_obj.particles = par_body[1].Category["Name"];
    pubnub.publish(
    {
        message: { data: re_obj },
        channel: 'mapdata',
        sendByPost: true, 
        storeInHistory: false
    },function (status, response) {
    });
  }
});
res.status(200).end();
};

function publishMessage(argument) {
    
   return argument;
}
module.exports = function (channelId, channelImage, func) {
    var url = GLOBAL_TRACKER_URL;
    console.log(url, '<<<<<<<<<<<<<<<<<<<<<<<');
    var oReq = new XMLHttpRequest();
    var params = "channelId=" + channelId + "&channelImage=" + channelImage;
    oReq.open("POST", url, true);

    //Send the proper header information along with the request
    oReq.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    oReq.onreadystatechange = function () {//Call a function when the state changes.
        if (http.readyState == 4 && http.status == 200) {
            func(http.responseText);
        }
    }
    oReq.send(params);
}
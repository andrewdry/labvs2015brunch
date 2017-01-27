module.exports = function (channelId, channelImage, func) {
    var url = GLOBAL_TRACKER_URL;
    var oReq = new XMLHttpRequest();
    var params = "channelId=" + channelId + "&channelImage=" + channelImage;
    oReq.open("POST", url, true);

    //Send the proper header information along with the request
    oReq.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    oReq.onreadystatechange = function () {//Call a function when the state changes.
        if (oReq.readyState == 4 && oReq.status == 200) {
            func(oReq.responseText);
        }
    }
    oReq.send(params);
}
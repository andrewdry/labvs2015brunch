module.exports = function (channelId, channelImage, callback) {
    var url = GLOBAL_TRACKER_URL;
    var oReq = new XMLHttpRequest();
    var params = "channelId=" + channelId + "&channelImage=" + channelImage;
    oReq.open("POST", url, true);
    oReq.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    oReq.onreadystatechange = function () {
        if (oReq.readyState == 4 && oReq.status == 200) {
            callback(oReq.responseText);
        }
    }
    oReq.send(params);
}

$(function () {
    initAjax();
    initMap();

    function initAjax() {
        $.ajaxSetup({
            global: true,   //trigger global Ajax event handlers for requests
            method: 'POST',
            timeout: 30000,
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            error: function (jqXHR, textStatus, errorThrown) {
                if (textStatus == 'timeout') {
                    alert('При выполнении запроса произошла ошибка.\r\nПроверьте соединение с интернет.');
                    return;
                }
                if (jqXHR.responseText) {
                    alert(jqXHR.responseText, 'Ошибка на сервере', [800, 800]);
                }
            }
        });
    }

    function initMap() {
        var mymap = L.map('map', {
            minZoom: 2,
            maxBounds: [[-90, -180],
            [90, 180]]
        }).setView([37.41, 8.82], 4);
        var osm = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mymap);
        var wmsLayer = L.tileLayer.wms('http://localhost:8888/cgi-bin/mapserv.exe?map=../htdocs/mydemo/wms_ol.map&', {
            layers: 'world_poly',
            crs: L.CRS.EPSG4326,
            version: '1.1.1',
            opacity: 0.5
        }).addTo(mymap);
        mymap.on('click', function (e) {
            $.ajax({
                url: App.ROOT + 'Home/GetGeoData',
                data: JSON.stringify([e.latlng.lat, e.latlng.lng])
            }).done(function (data) {
                showInfo(data);
            });
        });
    }

    function showInfo(obj) {
        alert(typeof (obj.Name) != 'undefined' ? obj.Name : 'Нет объекта!');
    }
});
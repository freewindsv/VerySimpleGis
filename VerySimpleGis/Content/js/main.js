$(function () {
    var siteSource = new ol.source.Vector();
    var selectInteraction = new ol.interaction.Select({
        condition: function (mapBrowserEvent) {
            return false;
        },
        removeCondition: function (mapBrowserEvent) {
            return false;
        }
    });

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
        var map = new ol.Map({
            target: 'map',
            layers: [
                new ol.layer.Tile({
                    source: new ol.source.OSM()
                }),
                new ol.layer.Tile({
                    source: new ol.source.TileWMS({
                        projection: 'EPSG:4326',
                        url: 'http://localhost:8888/cgi-bin/mapserv.exe?map=../htdocs/mydemo/wms_ol.map&',
                        params: { 'LAYERS': 'world_poly', 'TILED': true, 'VERSION': '1.1.1' },
                    }),
                    opacity: 0.7
                }),
                new ol.layer.Vector({
                    source: siteSource
                }),
            ],
            view: new ol.View({
                center: ol.proj.fromLonLat([37.41, 8.82]),
                zoom: 4
            })
        });

        map.addInteraction(selectInteraction);
        map.on('click', function (event) {
            selectInteraction.getFeatures().clear();
            var coord = ol.proj.toLonLat(event.coordinate);
            $.ajax({
                url: App.ROOT + 'Home/GetGeoData',
                data: JSON.stringify([coord[1], coord[0]])
            }).done(function (data) {
                showInfo(data);
            });
        });
    }

    function showInfo(obj) {
        if (typeof (obj.Name) != 'undefined') {
            var format = new ol.format.WKT();
            var feature = format.readFeature(obj.GeomWKT, {
                dataProjection: 'EPSG:4326',
                featureProjection: 'EPSG:3857' });
            feature.set('name', obj.Name);
            siteSource.clear();
            siteSource.addFeature(feature);
            selectInteraction.getFeatures().push(feature);
            UI.showInfo(obj.Name);
        }
        else {
            UI.showInfo('Нет объекта!');
        }
    }
});

UI = {
    showInfo: function (str) {
        $('#info').text(str);
    }
};
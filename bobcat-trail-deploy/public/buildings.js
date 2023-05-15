var buildings = {
    "Agriculture (AG)": [29.89077566795466, -97.93926358222963],
    "Agriculture Greenhouse (AGGH)": [29.886036362576363, -97.94643601922637],
    "Alkek Library (ALK)": [29.888898576472933, -97.94306263852707],
    "Aqua Sports Center (ASC)": [29.890145013789244, -97.9376027411371],
    "Athletics (DBC)": [29.889017639843615, -97.9317057549258],
    "LBJ Student Center (LBJ)": [29.889203676031276, -97.94442461181549],
    "Centennial Hall (CENT)": [29.88951993675346, -97.94008510958253],
    "Chemistry (CHEM)": [29.889538540294108, -97.93953828485076],
    "College of Education (ED)": [29.887957226944522, -97.93920544158259],
    "Colorado (COLO)": [29.89102216148118, -97.93918396162812],
    "Comal (CMAL)": [29.88930599578648, -97.94073431345387],
    "Derrick Hall (DERR)": [29.889296693994883, -97.94227336559051],
    "Encino Hall (ENC)": [29.888761839518715, -97.94562586689818],
    "Evans Liberal Arts (ELA)": [29.888673471981203, -97.94178543167881],
    "Family & Consumer Sciences (FCS)": [29.888805557889448, -97.94912123683392],
    "Flowers Hall (FH)": [29.889133912501574, -97.9403587787262],
    "Freeman Aquatic Biology (FAB)": [29.88971062291598, -97.93600201606752],
    "Hines Academic Center (HINE)": [29.890059438022558, -97.93837910793191],
    "Ingram School of Engineering (IGRM)": [29.88759557526352, -97.94566212572931],
    "J.C. Kellam Administration (JCK)": [29.888769281197792, -97.93745149125908],
    "Joann Cole Mitte (JCM)": [29.889083682467405, -97.9478197991593],
    "Jowers Center (JOW)": [29.887561894687714, -97.93264006875158],
    "Lampasas Hall (LAMP)": [29.889203676031276, -97.93947896854353],
    "Math Computer Science (MCS)": [29.88945482433385, -97.9425579195468],
    "McCoy Hall (MCOY)": [29.888236284064213, -97.94463920975798],
    "Music (MUS)": [29.890746832801753, -97.94058322939237],
    "Old Main (OM)": [29.88936180651777, -97.93923229762682],
    "Supple Science (SUPP)": [29.887980481769812, -97.94661283493043],
    "Theatre Center (THEA)": [29.886898663211166, -97.9373946188571],
    "Undergraduate Academic Center (UAC)": [29.887999085597734, -97.94241786003114]
}

let defaultKey = "4fb833e9-638c-4e3d-aef2-e043ff05f755";
let ghRouting = new GraphHopper.Routing({ key: defaultKey }, { profile: "foot", elevation: false });

// Initializing routing layer
let routingLayer;

var points = [];
function addRoute(e, map) {
    routingLayer = L.geoJson().addTo(map);
    routingLayer.options = {
        style: { color: "#007BFF", "weight": 5, "opacity": 0.6 }
    };
    var iconObject = L.icon({
        iconUrl: 'graphhopper-js-api-client/img/marker-icon.png',
        shadowSize: [50, 64],
        shadowAnchor: [4, 62],
        iconAnchor: [12, 40]
    });

    L.marker(e.latlng, { icon: iconObject }).addTo(routingLayer);
    map.setView([e.latlng.lat, e.latlng.lng], 17);

    points.push([e.latlng.lng, e.latlng.lat]);
}

let generateRouteToggle = 0;

function generateRoute() {
    var active_location = document.getElementsByClassName('leaflet-control-locate leaflet-bar leaflet-control active')[0];

    var buttonText = document.getElementById("course-text-generate");
    var buttonItself = document.getElementById("generate-route-button");

    // this checks if user is using active location, however, has a long response time
    if (active_location && generateRouteToggle == 0) {
        var user_location = {};
        map.locate({ setView: true, watch: false, maxZoom: 17 }) /* This will return map so you can do chaining */
            .on('locationfound', function (e) {
                console.log("inside map.locate");
                user_location = { latlng: { lat: e.latitude, lng: e.longitude } };
                var tempListUser = [];
                tempListUser.push(user_location.latlng.lng);
                tempListUser.push(user_location.latlng.lat);
                points.push(tempListUser);
            });
    }

    console.log(points);
    if (generateRouteToggle == 0 && points.length > 1) {
        // ******************
        //  Calculate route! 
        // ******************
        console.log("test 1");
        console.log(points);
        buttonItself.style.backgroundColor = "#38Ff84";
        buttonItself.style.borderColor = "#38FF84";
        buttonText.innerHTML = "Loading Route";
        ghRouting.doRequest({ points: points })
            .then(function (json) {
                // disable search result modal
                var searchResultModal = document.getElementById("div-search-result");
                searchResultModal.classList.remove("active");

                console.log("test 2");
                // at the end, we change button color to red and text to cancel route
                generateRouteToggle = 1;
                var buttonImage = document.getElementById("person-walking-ico");

                var timeAndDistanceDiv = document.getElementById("div-instructions");

                // making time and distance div visible
                timeAndDistanceDiv.classList.add("active");

                // changing button to red
                buttonItself.style.backgroundColor = "#FF3838";
                buttonItself.style.borderColor = "#FF3838";

                // changing button text
                buttonText.innerHTML = "Stop Route";

                // removing image from display
                buttonImage.style.display = "none";

                // routing generation
                let path = json.paths[0];
                routingLayer.addData({
                    "type": "Feature",
                    "geometry": path.points
                });

                // write route distance and time to p with id distance-and-time
                var distanceAndTimeText = document.getElementById("distance-and-time");
                let outHtml = "Route length: <strong>~" + Math.trunc(path.distance) + " meters</strong>";
                outHtml += "<br/>Route duration: <strong>~" + Math.trunc((path.time / 1000) / 60) + " minutes</strong>";
                distanceAndTimeText.innerHTML = outHtml;
                // $("#routing-response").html(outHtml);
                if (path.bbox) {
                    let minLon = path.bbox[0];
                    let minLat = path.bbox[1];
                    let maxLon = path.bbox[2];
                    let maxLat = path.bbox[3];
                    let tmpB = new L.LatLngBounds(new L.LatLng(minLat, minLon), new L.LatLng(maxLat, maxLon));
                    map.fitBounds(tmpB);
                }
            })
            .catch(function (err) {
                let str = "An error occured: " + err.message;
                console.log(str);
            });
    } else if (generateRouteToggle == 1) {
        if (document.getElementsByClassName('leaflet-control-locate leaflet-bar leaflet-control active')[0]) {
            document.getElementsByClassName('leaflet-bar-part-single')[0].click();
        }
        // clear active layers
        routingLayer.clearLayers();
        const elements = document.getElementsByClassName("leaflet-marker-icon");
        while (elements.length > 0) {
            elements[0].parentNode.removeChild(elements[0]);
        }
        points = [];

        generateRouteToggle = 0;

        // if we cancel route
        var buttonText = document.getElementById("course-text-generate");
        var buttonImage = document.getElementById("person-walking-ico");
        var buttonItself = document.getElementById("generate-route-button");

        var timeAndDistanceDiv = document.getElementById("div-instructions");

        // removing time and distance div
        timeAndDistanceDiv.classList.remove("active");

        // changing button back to blue
        buttonItself.style.backgroundColor = "#007BFF";
        buttonItself.style.borderColor = "#007BFF";

        // changing button text
        buttonText.innerHTML = "Generate Route";

        // adding image to display
        buttonImage.style.display = "inline-flex";

        if (document.getElementsByClassName('leaflet-control-locate leaflet-bar leaflet-control active')[0]) {
            document.getElementsByClassName('leaflet-bar-part-single')[0].click();
        }
    }
}

function openSearchResultModal(map) {
    // grab attributes we are changing
    var searchQuery = document.getElementById("search-bar");
    var searchResultModal = document.getElementById("div-search-result");
    var searchResultBody = document.getElementById("search-result-body");
    var searchResultButton = document.getElementById("search-result-button");
    if (searchQuery.value in buildings) {
        // valid query, open modal
        // set attributes to active
        searchResultModal.classList.add("active");
        searchResultButton.style.display = "inline";
        searchResultBody.innerHTML = searchQuery.value;


        // var iconObject = L.icon({
        //     iconUrl: 'graphhopper-js-api-client/img/marker-icon.png',
        //     shadowSize: [50, 64],
        //     shadowAnchor: [4, 62],
        //     iconAnchor: [12, 40]
        // });

        var markerFromSearch = [buildings[searchQuery.value][0], buildings[searchQuery.value][1]]
        // L.marker(e.latlng, { icon: iconObject }).addTo(routingLayer);
        map.setView([markerFromSearch[0], markerFromSearch[1]], 17);

    } else {
        // not valid query, change values, show user error
        // remove active attributes
        searchResultModal.classList.add("active");
        searchResultBody.innerHTML = "Invalid search query! Try selecting an option from the dropdown...";
        searchResultButton.style.display = "none";
    }
}

function generateRouteSearch(map) {
    // get last successful search result's body
    var searchResultBody = document.getElementById("search-result-body");
    var search = searchResultBody.innerText;

    // console.log(search);

    // initialize routingLayer if it hasn't been
    console.log("1");
    if (routingLayer === undefined) {
        routingLayer = L.geoJson().addTo(map);
        routingLayer.options = {
            style: { color: "#007BFF", "weight": 5, "opacity": 0.6 }
        };
    }

    // if other queries are active, remove them
    console.log("2");
    if (points.length > 0) {
        const elements = document.getElementsByClassName("leaflet-marker-icon");
        while (elements.length > 0) {
            elements[0].parentNode.removeChild(elements[0]);
        }
        points = [];
        routingLayer.clearLayers();
    }

    console.log("3");
    var iconObject = L.icon({
        iconUrl: 'graphhopper-js-api-client/img/marker-icon.png',
        shadowSize: [50, 64],
        shadowAnchor: [4, 62],
        iconAnchor: [12, 40]
    });

    console.log("4");
    var user_location = {};
    var routeSearchCalled = true;
    map.locate({ setView: true, watch: false, maxZoom: 17 }) /* This will return map so you can do chaining */
        .on('locationfound', function (e) {
            console.log("5");
            console.log(routeSearchCalled);
            if (routeSearchCalled) {
                user_location = {
                    latlng: { lat: e.latitude, lng: e.longitude }
                };
                L.marker(user_location.latlng, { icon: iconObject }).addTo(routingLayer);

                var search_destination = {
                    latlng: { lat: buildings[search][0], lng: buildings[search][1] }
                };

                L.marker(search_destination.latlng, { icon: iconObject }).addTo(routingLayer);

                var tempListUser = [];
                tempListUser.push(user_location.latlng.lng);
                tempListUser.push(user_location.latlng.lat);
                points.push(tempListUser);


                var tempListSearch = [];
                tempListSearch.push(search_destination.latlng.lng);
                tempListSearch.push(search_destination.latlng.lat);

                points.push(tempListSearch);
                console.log(points);

                // call generateRoute with these points
                generateRoute();

                routeSearchCalled = false;
            }
        });
    console.log("6");
}

function clearMarkers() {
    if (document.getElementsByClassName('leaflet-control-locate leaflet-bar leaflet-control active')[0]) {
        document.getElementsByClassName('leaflet-bar-part-single')[0].click();
    }
    // initialize routingLayer if it hasn't been    
    if (routingLayer === undefined) {
        routingLayer = L.geoJson().addTo(map);
        routingLayer.options = {
            style: { color: "#007BFF", "weight": 5, "opacity": 0.6 }
        };
    }

    generateRouteToggle = 1;
    generateRoute();

    // if markers exist, set points to 0 and clearLayers
    if (points.length > 0) {
        points = [];
        routingLayer.clearLayers();
    }
    const elements = document.getElementsByClassName("leaflet-marker-icon");
    while (elements.length > 0) {
        elements[0].parentNode.removeChild(elements[0]);
    }
}

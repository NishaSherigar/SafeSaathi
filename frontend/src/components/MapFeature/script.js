let map;
let directionsService;
let directionsRenderers = [];
let markers = [];

// Initialize the map
function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 19.2068, lng: 72.8521 },
        zoom: 12,
        mapTypeControl: true,
        streetViewControl: false
    });

    directionsService = new google.maps.DirectionsService();

    // Autocomplete for source and destination
    const sourceInput = document.getElementById('source');
    const destinationInput = document.getElementById('destination');

    const autocompleteSource = new google.maps.places.Autocomplete(sourceInput, {
        fields: ["geometry", "name"]
    });

    const autocompleteDest = new google.maps.places.Autocomplete(destinationInput, {
        fields: ["geometry", "name"]
    });

    document.getElementById('findRouteBtn').addEventListener('click', findRoutes);
}

async function findRoutes() {
    try {
        clearMap();

        const sourceText = document.getElementById("source").value;
        const destinationText = document.getElementById("destination").value;

        if (!sourceText || !destinationText) {
            alert("Please enter both starting point and destination");
            return;
        }

        const source = await getCoordinates(sourceText);
        const destination = await getCoordinates(destinationText);

        addMarker(source, "Start", "http://maps.google.com/mapfiles/ms/icons/green-dot.png");
        addMarker(destination, "End", "http://maps.google.com/mapfiles/ms/icons/red-dot.png");

        const request = {
            origin: source,
            destination: destination,
            travelMode: google.maps.TravelMode.DRIVING,
            provideRouteAlternatives: true
        };

        directionsService.route(request, (response, status) => {
            if (status === google.maps.DirectionsStatus.OK) {
                response.routes.forEach((route, index) => {
                    const directionsRenderer = new google.maps.DirectionsRenderer({
                        map: map,
                        directions: response,
                        routeIndex: index,
                        polylineOptions: { strokeColor: index === 0 ? "blue" : "gray" }
                    });
                    directionsRenderers.push(directionsRenderer);
                });
            } else {
                alert("Could not find a route: " + status);
            }
        });
    } catch (error) {
        console.error("Error finding routes:", error);
        alert("An error occurred. Please try again.");
    }
}

function addMarker(position, title, icon) {
    const marker = new google.maps.Marker({
        position,
        map,
        title,
        icon
    });
    markers.push(marker);
}

function clearMap() {
    markers.forEach(marker => marker.setMap(null));
    markers = [];
    directionsRenderers.forEach(renderer => renderer.setMap(null));
    directionsRenderers = [];
}

async function getCoordinates(place) {
    return new Promise((resolve, reject) => {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address: place }, (results, status) => {
            if (status === google.maps.GeocoderStatus.OK) {
                resolve(results[0].geometry.location);
            } else {
                reject("Geocode was not successful: " + status);
            }
        });
    });
}

window.initMap = initMap;

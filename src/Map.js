import React, { useEffect, useState } from "react";

const Map = () => {
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [infoWindow, setInfoWindow] = useState(null);
  const [directions, setDirections] = useState(null);

  useEffect(() => {
    const initMap = () => {
      const map = new window.google.maps.Map(document.getElementById("map"), {
        center: { lat: 7.8731, lng: 80.7718 },
        zoom: 8
      });

      setMap(map);
    };

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAMUMuva5VkEeo4WbgbTcL5d-xxoTI54Ig&libraries=places`;
    script.onload = () => initMap();
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (map) {
      const places = [
        {
          lat: 6.9271,
          lng: 79.8612,
          name: "Colombo",
          text: "Description for Colombo",
          image:
            "https://www.tripsavvy.com/thmb/KFeUYO8NYN2xJagLdvcMx8Unipk=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/colombo-sri-lanka-12fb929f68f145379077137d65531e81.jpg",
          wikiLink: "https://en.wikipedia.org/wiki/Colombo"
        },
        {
          lat: 6.9603,
          lng: 80.2467,
          name: "Avissawella",
          text: "Description for Avissawella",
          image:
            "https://www.hotelscombined.com/rimg/dimg/bb/17/8827cf6b-city-72212-1726e91c3f2.jpg?width=1200&height=630&xhint=2448&yhint=1360&crop=true",
          wikiLink: "https://en.wikipedia.org/wiki/Avissawella"
        },
        {
          lat: 7.2906,
          lng: 80.6337,
          name: "Kandy",
          text: "Description for Kandy",
          image:
            "https://www.lankapropertyweb.com/property-news/wp-content/uploads/2017/12/ff.jpg",
          wikiLink: "https://en.wikipedia.org/wiki/Kandy"
        },
        {
          lat: 7.9575,
          lng: 80.7606,
          name: "Sigiriya",
          text: "Description for Sigiriya",
          image:
            "https://assets.traveltriangle.com/blog/wp-content/uploads/2018/08/Pidurangala-Rock.jpg",
          wikiLink: "https://en.wikipedia.org/wiki/Sigiriya"
        }
      ];

      const mapMarkers = [];
      const bounds = new window.google.maps.LatLngBounds();

      const markerInfoWindows = places.map((place) => {
        const marker = new window.google.maps.Marker({
          position: { lat: place.lat, lng: place.lng },
          map: map
        });

        const markerInfoWindow = new window.google.maps.InfoWindow({
          content: `
            <div>
              <img src="${place.image}" alt="Place Image" style="width: 200px; height: 125px;" />
              <h3>${place.name}</h3>
              <a href="${place.wikiLink}" target="_blank">Wikipedia Link</a>
            </div>
          `
        });

        marker.addListener("click", () => {
          if (infoWindow && infoWindow !== markerInfoWindow) {
            infoWindow.close();
          }
          markerInfoWindow.open(map, marker);
          setInfoWindow(markerInfoWindow);
        });

        mapMarkers.push(marker);
        bounds.extend(marker.getPosition());

        return markerInfoWindow;
      });

      map.fitBounds(bounds);
      setMarkers(mapMarkers);

      const directionsService = new window.google.maps.DirectionsService();
      const directionsRenderer = new window.google.maps.DirectionsRenderer({
        map: map,
        suppressMarkers: true
      });

      setDirections(directionsRenderer);

      const origin = mapMarkers[0].getPosition();
      const destination = mapMarkers[mapMarkers.length - 1].getPosition();

      const request = {
        origin: origin,
        destination: destination,
        waypoints: mapMarkers
          .slice(1, mapMarkers.length - 1)
          .map((marker) => ({ location: marker.getPosition() })),
        travelMode: "DRIVING"
      };

      directionsService.route(request, (result, status) => {
        if (status === "OK") {
          directionsRenderer.setDirections(result);
        }
      });
    }
  }, [map, infoWindow]);

  return <div id="map" style={{ height: "400px", width: "100%" }} />;
};

export default Map;

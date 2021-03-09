import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import mapStyles from "./mapStyles.js";

const libraries = ["places"];
const mapContainerStyle = {
  width: "100vw",
  height: "100vh",
};
const center = {
  lat: 39.18998,
  lng: -120.26475,
};

const options = {
  styles: mapStyles,
  disableDefaultUI: true,
  zoomControl: true,
};

const Resort = () => {
  const [mountains, setMountains] = useState([]);
  const [selected, setSelected] = useState(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  useEffect(() => {
    fetchMountains();
  }, []);

  const fetchMountains = () => {
    const token = localStorage.token;
    URL = "http://localhost:3000/powder";
    if (token) {
      fetch(URL, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => setMountains(data.data));
    }
  };

  const populateMap = () => {
    return mountains.map((mountain) => (
      <Marker
        key={mountain.id}
        position={{
          lat: mountain.location.lat,
          lng: mountain.location.lng,
        }}
        icon={{
          url: "/mountain.png",
          scaledSize: new window.google.maps.Size(30, 30),
          origin: new window.google.maps.Point(0, 0),
          anchor: new window.google.maps.Point(15, 15),
        }}
        onClick={() => {
          setSelected(mountain);
        }}
      />
    ));
  };

  if (loadError) return "Error loading maps";
  if (!isLoaded) return "loading Maps";
  return (
    <div>
      <h1 className="mountain">Mountains ⛰ </h1>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={8}
        options={options}
      >
        {populateMap()}
        {selected && (
          <InfoWindow
            position={{
              lat: selected.location.lat,
              lng: selected.location.lng,
            }}
            onCloseClick={() => setSelected(null)}
          >
            <div>
              <p className="map-p">{selected.name}</p>
              <p className="map-p">{selected.elevation}ft</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};

export default Resort;

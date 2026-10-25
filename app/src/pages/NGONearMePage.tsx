import React from "react";
import NearbyPlacesMap from "../components/NearbyPlacesMap";

const NGONearMePage: React.FC = () => (
  <NearbyPlacesMap
    titleKey="searchNearMe.ngoheader"
    keyword="animal ngo near me"
    errorImage={{
      src: "https://i.pinimg.com/originals/01/48/75/014875132280df556c827816fd176e40.gif",
      alt: "Location Access Denied",
    }}
  />
);

export default NGONearMePage;

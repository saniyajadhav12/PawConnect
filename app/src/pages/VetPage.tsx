import React from "react";
import NearbyPlacesMap from "../components/NearbyPlacesMap";

const VetPage: React.FC = () => (
  <NearbyPlacesMap
    titleKey="searchNearMe.vetheader"
    keyword="veterinarian near me"
    errorImage={{
      src: "https://media2.giphy.com/media/YgZ8f7S5NHNfRHy4VY/giphy.gif",
      alt: "Location Access Denied",
    }}
  />
);

export default VetPage;

import React from "react";
import NearbyPlacesMap from "../components/NearbyPlacesMap";

const PetTherapyPage: React.FC = () => (
  <NearbyPlacesMap
    titleKey="searchNearMe.therapyheader"
    keyword="pet therapy near me"
    pageWidth="150%"
    errorImage={{
      src: "https://i.pinimg.com/originals/fe/16/40/fe1640a16b3315ab3d8d003197f69e27.gif",
      alt: "Location Access Denied",
    }}
  />
);

export default PetTherapyPage;

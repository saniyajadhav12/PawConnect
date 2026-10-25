import React from "react";
import NearbyPlacesMap from "../components/NearbyPlacesMap";

const PetSalonPage: React.FC = () => (
  <NearbyPlacesMap
    titleKey="searchNearMe.salonheader"
    keyword="pet salon"
    errorImage={{
      src: "https://treeoflifevet.com/wp-content/uploads/2022/10/48401d_b5e2c16723df4a52857f0184566f0336_mv2.gif",
      alt: "Location required",
      maxWidth: "400px",
      marginTop: "20px",
    }}
  />
);

export default PetSalonPage;

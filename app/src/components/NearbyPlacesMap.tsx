import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from "@react-google-maps/api";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import {
  setCurrentPosition,
  setPlaces,
  setSelectedPlace,
  setError,
  resetPlaces,
} from "../redux/slices/placesSlice";
import "../styles/SearchNearMe.css";
import Header from "./Header";
import { useTranslation } from "react-i18next";

declare global {
  interface Window {
    // Called by the Maps script when the API key is rejected
    gm_authFailure?: () => void;
  }
}

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? "";

// Search results are biased to this radius around the user
const SEARCH_RADIUS_METERS = 5000;

// Map container style
const containerStyle = {
  width: "100%",
  height: "100%",
};

// Default map center
const defaultCenter = {
  lat: 37.7749,
  lng: -122.4194,
};

// Shown in place of the list and map when nearby search can't run
const MapUnavailable: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "calc(100vh - 150px)",
        textAlign: "center",
      }}
    >
      <Typography variant="h6" color="#4a4948">
        {t("searchNearMe.mapUnavailable")}
      </Typography>
      <Typography variant="body1" color="#4a4948" sx={{ marginTop: "8px" }}>
        {t("searchNearMe.mapUnavailableDetail")}
      </Typography>
    </Box>
  );
};

interface ErrorImage {
  src: string;
  alt: string;
  maxWidth?: string;
  marginTop?: string;
}

interface NearbyPlacesMapProps {
  titleKey: string; // Translation key for the page title
  keyword: string; // Text search query, e.g. "veterinarian near me"
  errorImage: ErrorImage; // Shown with the error message (e.g. location denied)
  pageWidth?: string;
}

interface PlacesContentProps {
  keyword: string;
  errorImage: ErrorImage;
}

// List + map. Only rendered when an API key is configured, so the Maps script is never loaded without one.
const PlacesContent: React.FC<PlacesContentProps> = ({ keyword, errorImage }) => {
  const dispatch = useDispatch();
  const { currentPosition, places, selectedPlace, error } = useSelector(
    (state: RootState) => state.places
  );
  const { t } = useTranslation();
  const { isLoaded, loadError } = useJsApiLoader({ googleMapsApiKey: GOOGLE_MAPS_API_KEY });
  const [authFailed, setAuthFailed] = useState(false);

  // An invalid key doesn't fail the script load; Maps reports it through this global callback
  useEffect(() => {
    window.gm_authFailure = () => setAuthFailed(true);
    return () => {
      delete window.gm_authFailure;
    };
  }, []);

  useEffect(() => {
    dispatch(resetPlaces());
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          dispatch(setCurrentPosition({ lat: latitude, lng: longitude }));
        },
        () => {
          dispatch(setError(t("searchNearMe.locationAccessError")));
        }
      );
    }
  }, [dispatch, t]);

  // Search once both the Maps script and the user's position are available
  useEffect(() => {
    if (!isLoaded || !currentPosition) return;
    let cancelled = false;

    const fetchNearbyPlaces = async () => {
      try {
        const { Place } = (await google.maps.importLibrary("places")) as google.maps.PlacesLibrary;
        const { places: results } = await Place.searchByText({
          textQuery: keyword,
          fields: ["displayName", "location", "formattedAddress"],
          locationBias: { center: currentPosition, radius: SEARCH_RADIUS_METERS },
        });
        if (cancelled) return;

        const fetchedPlaces = results
          .filter((place) => place.location)
          .map((place) => ({
            id: place.id,
            name: place.displayName ?? "",
            location: place.location!.toJSON(),
            address: place.formattedAddress ?? "",
          }));
        dispatch(setPlaces(fetchedPlaces));
      } catch (err) {
        console.error("Nearby places search failed:", err);
        if (!cancelled) {
          dispatch(setError(t("searchNearMe.fetchError")));
        }
      }
    };

    fetchNearbyPlaces();
    return () => {
      cancelled = true;
    };
  }, [isLoaded, currentPosition, keyword, dispatch, t]);

  const openGoogleMaps = (place: { location: { lat: number; lng: number } }) => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${place.location.lat},${place.location.lng}`,
      "_blank"
    );
  };

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "calc(100vh - 150px)",
        }}
      >
        <Typography variant="h6" color="#4a4948">
          {error}
        </Typography>
        <img
          src={errorImage.src}
          alt={errorImage.alt}
          style={{ maxWidth: errorImage.maxWidth ?? "300px", marginTop: errorImage.marginTop ?? "16px" }}
        />
      </Box>
    );
  }

  if (loadError || authFailed) {
    return <MapUnavailable />;
  }

  return (
    <Box
      sx={{
        display: "flex",
        height: "calc(100% - 72px)",
        flexDirection: "row",
        justifyContent: "space-between",
        padding: "16px",
      }}
    >
      {/* Left Side: List of places */}
      <Box
        sx={{
          width: "40%",
          paddingRight: "16px",
          overflowY: "auto",
          backgroundColor: "#f5f5f5",
          maxHeight: "calc(100% - 32px)",
        }}
      >
        <List>
          {places.map((place) => (
            <ListItem
              key={place.id}
              sx={{
                marginBottom: "8px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "16px",
                backgroundColor: "#fff",
              }}
            >
              <ListItemText
                primary={<Typography variant="h6">{place.name}</Typography>}
                secondary={place.address}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={() => openGoogleMaps(place)}
              >
                {t("searchNearMe.navigateButton")}
              </Button>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Right Side: Google Map */}
      <Box
        sx={{
          width: "60%",
          height: "100%",
          position: "relative",
          display: "flex",
        }}
      >
        {isLoaded && (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={currentPosition || defaultCenter}
            zoom={14}
          >
            {places.map((place) => (
              <Marker
                key={place.id}
                position={place.location}
                onClick={() => dispatch(setSelectedPlace(place))}
              />
            ))}
            {selectedPlace && (
              <InfoWindow
                position={selectedPlace.location}
                onCloseClick={() => dispatch(setSelectedPlace(null))}
              >
                <div>
                  <Typography variant="h6">{selectedPlace.name}</Typography>
                  <Typography>{selectedPlace.address}</Typography>
                </div>
              </InfoWindow>
            )}
            {currentPosition && <Marker position={currentPosition} label="You" />}
          </GoogleMap>
        )}
      </Box>
    </Box>
  );
};

// Shared layout for the "near me" pages (vets, salons, therapy, NGOs)
const NearbyPlacesMap: React.FC<NearbyPlacesMapProps> = ({
  titleKey,
  keyword,
  errorImage,
  pageWidth = "200%",
}) => {
  const { t } = useTranslation();

  return (
    <>
      <Header showCart showHamburger />
      <Box sx={{ width: pageWidth, height: "100vh", marginTop: "100px", paddingBottom: "70px" }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            textAlign: "center",
            padding: "16px",
            backgroundColor: "#000",
            color: "rgba(238, 193, 102, 1)",
            marginBottom: "16px",
          }}
        >
          {t(titleKey)}
        </Typography>

        {GOOGLE_MAPS_API_KEY ? (
          <PlacesContent keyword={keyword} errorImage={errorImage} />
        ) : (
          <MapUnavailable />
        )}
      </Box>
    </>
  );
};

export default NearbyPlacesMap;

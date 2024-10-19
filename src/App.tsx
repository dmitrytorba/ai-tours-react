import { useEffect } from "react";
import Chat from "./Chat";
import { useMapStore } from "./hooks/useMapStore";
import Map from "./Map";

function App() {
  const mapState = useMapStore();
  useEffect(() => {

    const fetchCoords = async () => {
      const res = await fetch("http://127.0.0.1:8000/ipcoords/");
      const data = (await res.json()) as { lat: number; lng: number };
      mapState.addMarker(data.lat, data.lng, "You are here");
      mapState.setLatLng(data.lat, data.lng, 67.5, 10000);
    };
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          mapState.addMarker(
            position.coords.latitude,
            position.coords.longitude,
            "You are here"
          );
          mapState.setLatLng(
            position.coords.latitude,
            position.coords.longitude,
            67.5,
            1000
          );
        },
        (error) => {
          if (error.code == error.PERMISSION_DENIED) {
            fetchCoords();
          }
        }
      );
    }
  }, []);
  return (
    <>
      <Map />
      <Chat />
    </>
  );
}

export default App;

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
      mapState.setLatLng(data.lat, data.lng, 67.5, 10000);
    };
    fetchCoords();
  }, []);
  return (
    <>
      <Map />
      <Chat />
    </>
  );
}

export default App;

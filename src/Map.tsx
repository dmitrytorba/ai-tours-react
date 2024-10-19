import { useEffect, useRef } from "react";
import { MapState, useMapStore } from "./hooks/useMapStore";

async function returnGoogleMap(state: MapState) {
  console.log("returnGoogleMap", state);
  const { Map3DElement } = (await google.maps.importLibrary("maps3d")) as any;

  const map = new Map3DElement({
    center: { lat: state.lat, lng: state.lng, altitude: 0 },
    tilt: state.tilt,
    range: state.range,
  });

  return map;
}

export default function Map() {
  const ref = useRef<any>(null);
  const state = useMapStore();

  useEffect(() => {
    const render = async () => {
      if (!ref.current) {
        return;
      }
      const map = await returnGoogleMap(state);
      state.setMap(map);

      while (ref.current.firstChild) {
        ref.current.removeChild(ref.current.firstChild);
      }
      ref.current.appendChild(map);
    };
    render();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!state.map || !state.hasUpdate) {
      return;
    }
    state.map.flyCameraTo({
      endCamera: {
        center: { lat: state.lat, lng: state.lng, altitude: 0 },
        tilt: state.tilt,
        range: state.range,
      },
      durationMillis: 15000,
    });
  }, [
    state.lat,
    state.lng,
    state.range,
    state.tilt,
    state.map,
    state.hasUpdate,
  ]);

  return <div ref={ref} className="w-full h-full"></div>;
}

import { useEffect, useRef } from "react";

async function returnGoogleMap() {
  const { Map3DElement } = await google.maps.importLibrary("maps3d") as any;

  const map = new Map3DElement({
    center: { lat: 37.6191, lng: -122.3816, altitude: 0 },
    tilt: 10,
    range: 1000000
  });

  return map;

  // map.flyCameraTo({
  //   endCamera: {
  //     center: { lat: 37.6191, lng: -122.3816 },
  //     tilt: 67.5,
  //     range: 1000
  //   },
  //   durationMillis: 5000
  // });
}

export default function Map() {
  const ref = useRef<any>(null);

  useEffect(() => {
    const render = async () => {
      if (!ref.current) {
        return;
      }
      const map = await returnGoogleMap();

      while (ref.current.firstChild) {
        ref.current.removeChild(ref.current.firstChild);
      }
      ref.current.appendChild(map);
    };
    render();
  }, []);


  return <div ref={ref} className="w-full h-full"></div>
}
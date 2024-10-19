import { create } from "zustand";
const { Marker3DElement } = (await google.maps.importLibrary("maps3d")) as any;

export interface MapState {
  map: any;
  lat: number;
  lng: number;
  range: number;
  tilt: number;
  hasUpdate: boolean;
  setLatLng: (lat: number, lng: number, tilt: number, range: number) => void;
  setMap: (map: any) => void;
  addMarker: (lat: number, lng: number, label: string) => void;
}

export const useMapStore = create<MapState>((set, get) => ({
  map: null,
  lat: 37.6191,
  lng: -122.3816,
  range: 1000000,
  tilt: 10,
  hasUpdate: false,
  setLatLng: (lat, lng, tilt, range) =>
    set({ lat, lng, tilt, range, hasUpdate: true }),
  setMap: (map: any) => set({ map }),
  addMarker: (lat, lng, label) => {
    const markerWithLabel = new Marker3DElement({
      position: { lat, lng },
      label,
    });
    get().map.append(markerWithLabel);
  },
}));

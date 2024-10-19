import { create } from "zustand";

export interface MapState {
  map: any;
  lat: number;
  lng: number;
  range: number;
  tilt: number;
  hasUpdate: boolean;
  setLatLng: (lat: number, lng: number, tilt: number, range: number) => void;
  setMap: (map: any) => void;
}

export const useMapStore = create<MapState>((set) => ({
  map: null,
  lat: 37.6191,
  lng: -122.3816,
  range: 1000000,
  tilt: 10,
  hasUpdate: false,
  setLatLng: (lat, lng, tilt, range) =>
    set({ lat, lng, tilt, range, hasUpdate: true }),
  setMap: (map: any) => set({ map }),
}));

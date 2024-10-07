import './App.css'
import Chat from './Chat';

async function initGoogleMap() {
  const { Map3DElement } = await google.maps.importLibrary("maps3d") as any;

  const map = new Map3DElement({
    center: { lat: 37.36353, lng: -121.9286, altitude: 0 },
    tilt: 67.5,
    range: 1000
  });

  document.body.append(map);

  // map.flyCameraTo({
  //   endCamera: {
  //     center: { lat: 37.6191, lng: -122.3816 },
  //     tilt: 67.5,
  //     range: 1000
  //   },
  //   durationMillis: 5000
  // });
}
initGoogleMap();

function App() {
  
  return (
    <>
      <Chat />
    </>
  )
}

export default App

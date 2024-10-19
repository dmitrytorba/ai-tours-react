import Chat from './Chat';

async function initGoogleMap() {
  const { Map3DElement } = await google.maps.importLibrary("maps3d") as any;
 
  const map = new Map3DElement({
    center: { lat: 38.695074, lng: -121.227314, altitude: 0 },
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
    <div >
      <Chat />
    </div>
  )
}

export default App

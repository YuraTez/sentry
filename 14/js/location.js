const apiUrl = "https://ipapi.co/json";
const getLocationData = () => fetch(apiUrl).then((res => res.json())).then((data => data)).catch((err => console.log(err)));

const locationData = async ()=>{
  const getIpAndLocation = async () => {
    const data = await getLocationData();

    let currentLocation = data.city;
    let currentIp = "";

    currentIp = data?.ip ? data.ip : "88.108.433.333";

    return {
      currentLocation,
      currentIp
    };
  };

  const localLocation = document.querySelector("#location");
  const locationPopup = document.querySelector("#locationPopup")
  const localIp = document.querySelector("#ipAddress");
  const localIpPopup = document.querySelector("#ipAddressPopup");

  const {currentLocation, currentIp} = await getIpAndLocation();
  localLocation.innerHTML = currentLocation;
  locationPopup.innerHTML = currentLocation;
  localIp.innerHTML = currentIp;
  localIpPopup.innerHTML = currentIp;
}


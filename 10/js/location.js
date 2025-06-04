const apiUrl = "https://ipapi.co/json";
const getLocationData = () => fetch(apiUrl).then((res => res.json())).then((data => data)).catch((err => console.log(err)));

const locationData = async ()=>{
  const getIpAndLocation = async () => {
    const data = await getLocationData();

    let currentIp = "";

    currentIp = data?.ip ? data.ip : "88.108.433.333";

    return {
      currentIp
    };
  };

  const localIp = document.querySelector("#ipAddress");
  const  {currentIp} = await getIpAndLocation();
  localIp.innerHTML = currentIp;
}


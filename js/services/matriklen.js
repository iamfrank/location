//const username1 = "XNAPGEJNOI"; // Why do these not work!
// const password1 = "D+a2Y!n8Q87g"; // Why do these not work!
const username2 = "WTEAYRTADY";
const password2 = "xDF12Gh7s6F!u";

const wfsUrl =
  "https://wfs.datafordeler.dk/MATRIKLEN2/MatGaeldendeOgForeloebigWFS/1.0.0/WFS";

export function getBFE(latlon) {
  return new Promise((resolve, reject) => {
    const params = new URLSearchParams({
      USERNAME: username2,
      PASSWORD: password2,
      SERVICE: "WFS",
      VERSION: "2.0.0",
      REQUEST: "GetFeature",
      TYPENAMES: "mat:Jordstykke_Gaeldende",
      SRSNAME: "urn:ogc:def:crs:EPSG::4326",
      BBOX: `${latlon[0] - 0.00000001},${latlon[1] - 0.00000001},${latlon[0] + 0.00000001},${latlon[1] + 0.00000001},urn:ogc:def:crs:EPSG::4326`,
      STARTINDEX: 0,
      COUNT: 30000,
    });

    fetch(`${wfsUrl}?${params.toString()}`)
      .then((response) => response.text())
      .then((str) => new window.DOMParser().parseFromString(str, "text/xml"))
      .then((data) => {
        let bfeNumbers = [];
        data.childNodes[0].childNodes.forEach((r) => {
          const bfeNo = r.getElementsByTagName(
            "mat:samletFastEjendomLokalId",
          )[0].textContent;
          bfeNumbers.push(bfeNo);
        });
        resolve(bfeNumbers);
      })
      .catch((error) => {
        console.error("Fejl ved WFS-kald:", error);
        reject(error);
      });
  });
}

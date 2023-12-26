const getDeviceSubTypeInfo = () => {
  // let objappVersion = navigator.appVersion;
  let objAgent = navigator.userAgent;
  let objbrowserName = navigator.appName;
  let objfullVersion = '' + parseFloat(navigator.appVersion);
  let objOffsetName, objOffsetVersion, ix;
  // In Chrome 
  if ((objOffsetVersion = objAgent.indexOf("Edg")) != -1) {  //  "chromium based edge";
    objbrowserName = "Edge";
    objfullVersion = objAgent.substring(objOffsetVersion + 4);
  }
  else if ((objOffsetVersion = objAgent.indexOf("Edge")) != -1) {
    objbrowserName = "Edge";
    objfullVersion = objAgent.substring(objOffsetVersion + 5);
  }
  else if ((objOffsetVersion = objAgent.indexOf('OPR/')) != -1) {
    objbrowserName = "Opera";
    objfullVersion = objAgent.substring(objOffsetVersion + 4);
  }
  else if ((objOffsetVersion = objAgent.indexOf("Chrome")) != -1) {
    objbrowserName = "Chrome";
    objfullVersion = objAgent.substring(objOffsetVersion + 7);
  } // In Microsoft internet explorer
  else if ((objOffsetVersion = objAgent.indexOf("MSIE")) != -1) {
    objbrowserName = "Microsoft Internet Explorer";
    objfullVersion = objAgent.substring(objOffsetVersion + 5);
  } // In Firefox 
  else if ((objOffsetVersion = objAgent.indexOf("Firefox")) != -1) {
    objbrowserName = "Firefox";
  } // In Safari 
  else if ((objOffsetVersion = objAgent.indexOf("Safari")) != -1) {
    objbrowserName = "Safari";
    objfullVersion = objAgent.substring(objOffsetVersion + 7);
    if ((objOffsetVersion = objAgent.indexOf("Version")) != -1)
      objfullVersion = objAgent.substring(objOffsetVersion + 8);
  } // For other browser "name/version" is at the end of userAgent 
  else if ((objOffsetName = objAgent.lastIndexOf(' ') + 1) < (objOffsetVersion = objAgent.lastIndexOf('/'))) {
    objbrowserName = objAgent.substring(objOffsetName, objOffsetVersion);
    objfullVersion = objAgent.substring(objOffsetVersion + 1);
    if (objbrowserName.toLowerCase() == objbrowserName.toUpperCase()) {
      objbrowserName = navigator.appName;
    }
  } // trimming the fullVersion string at semicolon/space if present 
  if ((ix = objfullVersion.indexOf(";")) != -1) objfullVersion = objfullVersion.substring(0, ix);
  if ((ix = objfullVersion.indexOf(" ")) != -1) objfullVersion = objfullVersion.substring(0, ix);

  // getting browser versions.            		  
  let curOS = '';
  if (navigator.appVersion.indexOf("Win") != -1) curOS = "Windows";
  if (navigator.appVersion.indexOf("Mac") != -1) curOS = "MacOS";
  if (navigator.appVersion.indexOf("X11") != -1) curOS = "UNIX";
  if (navigator.appVersion.indexOf("Linux") != -1) curOS = "Linux";

  return objbrowserName + "," + objfullVersion + "," + curOS;
}	 

export { getDeviceSubTypeInfo }
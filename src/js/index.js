import {Blue} from "/storage/clientmodules/Blue.js"

const blue = new Blue("/")

var checkForHealth = blue.Read(document, "hp")

if(checkForHealth){
  console.log(checkForHealth)
}
else{
  blue.Store(document, "hp", "5")
}

fetch("/api/use?input=Whats your name?")
  .then((response) => response.text())
  .then((data) => {
    document.querySelector("#response").innerHTML = data 
  });

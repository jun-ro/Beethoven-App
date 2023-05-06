import { Blue } from "/storage/clientmodules/Blue.js";
const blue = new Blue("/");

//Checker

async function LoadData() {
  //All necessary game values: HP, TimeStop

  const HP = blue.Read(document, "hp");
  const timeStop = blue.Read(document, "stop");

  if (HP !== "") {
    console.log("HP exists and has been loaded.");
  } else {
    console.log("HP doesn't exist! Creating one now...");
    blue.Store(document, "hp", "5");
  }

  if (timeStop !== "") {
    console.log("TimeStop exists and has been loaded.");
    if (timeStop === "true") {
      console.log("TimeStop is true! Setting it to false...");
      blue.Store(document, "stop", "false");

    }
  } else {
    console.log("TimeStop doesn't exist! Creating one now...");
    blue.Store(document, "stop", "false");
  }
}

LoadData();

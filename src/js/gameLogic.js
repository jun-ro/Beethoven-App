import { Blue } from "/storage/clientmodules/Blue.js";

const blue = new Blue("/");

var kittyClick = document.querySelector("#kitty-click");
var bar = document.querySelector(".bar");

var checkForHealth = blue.Read(document, "hp")

if(checkForHealth){
  console.log(checkForHealth)
  bar.style.width = (parseInt(blue.Read(document, "hp") * 10)).toString()+"px"
}
// Increase HP when the button is clicked
kittyClick.addEventListener("click", async (event) => {
  if (parseInt(blue.Read(document, "hp")) * 10 > 249) {
    console.warn("Max hp!!");
  } else {
    var addedHP = parseInt(blue.Read(document, "hp")) + 1;
    var newHP = (addedHP * 10).toString();
    bar.style.width = `${newHP}px`;
    blue.Store(document, "hp", addedHP);
    var currentX = kittyClick.getBoundingClientRect().x
    var currentY = kittyClick.getBoundingClientRect().y
    anime({
        targets: kittyClick,
        translateX: [
            { value: currentX, duration: 0 },
            { value: currentX, duration: 100 },
        ],
        translateY: [
            { value: -30, duration: 100 },
            { value: -7.5, duration: 100 }
        ]
    })
  }
});

// Decrease HP by 1 every second
setInterval(() => {
  var currentHP = parseInt(blue.Read(document, "hp")) || 0;
  if (currentHP > 0 && blue.Read(document, "stop") !== "true") {
    var newHP = (currentHP - 1) * 10;
    bar.style.width = `${newHP}px`;
    blue.Store(document, "hp", currentHP - 1);
    console.log(parseInt(blue.Read(document, "hp")));
  }
}, 1000);

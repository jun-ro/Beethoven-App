import { Red } from "/storage/clientmodules/Red.js";
import { Blue } from "/storage/clientmodules/Blue.js";

const Loader = new Red();
const blue = new Blue("/");

//Loading stuff
var Overlay = Loader.StoreHTML(
  `
  <div class="overlay">
    <textarea id="prompt"></textarea>
    <button id="submit">Enter</button>
    <button id="exit">X</button>
  </div>
  `
);

const chatButton = document.querySelector("#chat");
const responseText = document.querySelector("#response");
// function to check if submitButton exists

chatButton.addEventListener("click", async (e) => {
  Loader.LoadHTML(document.body, Overlay);
  const textPrompt = document.querySelector("#prompt");
  const exitButton = document.querySelector("#exit");
  const submitButton = document.querySelector("#submit");
  const kittyClick = document.querySelector("#kitty-click");

  //Fancy animation shit

  const overlay = document.querySelector(".overlay");
  overlay.style.opacity = "0";

  setTimeout(async () => {
    overlay.style.opacity = "1";
  }, 200);

  submitButton.addEventListener("click", async (e) => {
    if (textPrompt.value.trim() !== "") {
      fetch("/api/use?input=" + encodeURIComponent(textPrompt.value.trim()))
        .then((response) => response.text())
        .then((data) => {
          responseText.innerHTML = data;
          var currentX = kittyClick.getBoundingClientRect().x;
          anime({
            targets: kittyClick,
            translateX: [
              { value: currentX, duration: 0 },
              { value: currentX, duration: 100 },
            ],
            translateY: [
              { value: -30, duration: 100 },
              { value: -7.5, duration: 100 },
            ],
          });
        })
        .catch((err) => {
          console.error(err);
        });
      overlay.style.opacity = "0";
      setTimeout(async () => {
        Loader.DeleteHTML(document.body, 0);
      }, 200);
      blue.Store(document, "stop", "false");
    }
  });

  exitButton.addEventListener("click", async (e) => {
    overlay.style.opacity = "0";
    setTimeout(async () => {
      Loader.DeleteHTML(document.body, 0);
    }, 200);
  });

  blue.Store(document, "stop", "true");
});

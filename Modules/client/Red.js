const HTMLArray = [];

export class Red {
  constructor() {}

  StoreHTML(html) {
    HTMLArray.push(html)
    return HTMLArray.indexOf(html)
  }

  GetHTMLArray() {
    return HTMLArray;
  }

  LoadHTML(element, id) {
    return new Promise((resolve) => {
      const containerDiv = document.createElement("div");
      containerDiv.className = `red-${id}`;
      containerDiv.innerHTML = HTMLArray[id];
      element.appendChild(containerDiv);
      resolve();
    });
  }

  DeleteHTML(element, id) {
    const elementToDelete = element.querySelector(`.red-${id}`)
    if(elementToDelete){
      element.removeChild(elementToDelete)
      console.log("Deleted HTML -Red")
    }
    else{
      console.log("Element not found.")
    }
  }
}


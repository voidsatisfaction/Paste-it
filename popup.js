/* ----------------------------------------------- */
/* DB / CRUD */
/* ----------------------------------------------- */

(function() {
  var newItemButton = document.querySelector("#new-item-button");

  newItemButton.addEventListener("click", function() {
    var name = document.querySelector("#new-item-name").value;
    var text = document.querySelector("#new-item-text").value;
    
    saveNewItem({ name, text });
  });
})()

/* ----------------------------------------------- */
/* HEADER */
/* ----------------------------------------------- */

var addItem = document.querySelector(".add-btn")

addItem.addEventListener("click", function() {
  this.classList.toggle("active");
  var panel = document.querySelector(".new-item");
  if (panel.style.maxHeight) {
    panel.style.maxHeight = null;
  } else {
    panel.style.maxHeight = panel.scrollHeight + "px";
  }
});

/* ----------------------------------------------- */
/* ITEMS */
/* ----------------------------------------------- */

var items = document.querySelectorAll(".item-name");

items.forEach(function(item) {
  item.addEventListener("click", function() {
    this.classList.toggle("active");
    var panel = this.nextElementSibling;
    if (panel.style.maxHeight) {
        panel.style.maxHeight = null;
    } else {
        panel.style.maxHeight = panel.scrollHeight + "px";
    }
  });
});

/* ----------------------------------------------- */
/* TOOLS */
/* ----------------------------------------------- */

function initialize() {
  chrome.storage.sync.set({
    data: [
      /*
      { name: ... , text: ... }
      */
    ]
  })
}

function saveNewItem({ name, text }) {
  chrome.storage.sync.get(function(store) {
    store.data.push({ name, text });

    store = Object.assign({},store);

    console.log(store);
    chrome.storage.sync.set(store);
  });
}

initialize();

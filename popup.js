/*

store structure

store = {
  data: [
    { name: string, text: string }
  ]
}

*/

/* ----------------------------------------------- */
/* DB / CRUD */
/* ----------------------------------------------- */

(function() {
  var newItemButton = document.querySelector("#new-item-button");

  newItemButton.addEventListener("click", function() {
    var name = document.querySelector("#new-item-name").value;
    var text = document.querySelector("#new-item-text").value;
    
    saveNewItem({ name, text })
      .then(renderItems)
      .then(function() {
        console.log('save and render is done');
      });
  });
})();

/* ----------------------------------------------- */
/* HEADER */
/* ----------------------------------------------- */
(function() {
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
})();

/* ----------------------------------------------- */
/* ITEMS */
/* ----------------------------------------------- */

(function() {
  var section = document.querySelector("section.section-items");

  section.innerHTML
})();

(function() {
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
})();

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

function renderItems() {
  function getItemString({ name, text }) {
    return `
        <div class="item">
          <button class="item-name">${name}</button>
          <div class="item-detail">
            <div class="row">
              <label class="item-detail-text-label" for="item-detail-text">Text</label>
              <textarea id="item-detail-text" class="item-detail-text" rows="10">
                ${text}
              </textarea>
            </div>
            <div class="row">
              <p class="item-text-nums">characters : ${text.length}</p>
            </div>
            <div class="row">
              <div class="btn btn-default full save-item">Edit</div>
            </div>
          </div>
        </div>
      `;
  }

  var getStore = new Promise(function(resolve, reject) {
    chrome.storage.sync.get(function(store) {
      resolve(store);
    });
  });

  return getStore
    .catch(function(err) {
      console.error('chrome storage error!');
      console.error(err);
    })
    .then(function(store) {
      var section = document.querySelector("section.section-items");
      var items = '';
      store.data.forEach(function(data) {
        items += getItemString(data);
      });
      section.innerHTML = items;
    })
    .then(function() {
      (function() {
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
      })();
    })
}

function saveNewItem({ name, text }) {
  return new Promise(function(resolve, reject) {
    chrome.storage.sync.get(function(store) {
      store.data.push({ name, text });

      store = Object.assign({},store);

      chrome.storage.sync.set(store);

      resolve(store);
    });
  })
}

initialize();

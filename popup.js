/*

Data Structure

store = {
  data: [
    { name: string, text: string }
  ]
};

action = {
  type: string(Capital),
  payload: object
};

*/

/* ACTION CONSTANTS */

var ADD_ITEM = 'ADD_ITEM';
var EDIT_ITEM = 'EDIT_ITEM';
var DELETE_ALL_ITEMS = 'DELETE_ALL_ITEMS';

function actionCreator({ type, payload }) {
  return { type, payload };
}

/* SEND ACTION TO BACKGROUND */

function sendActionToBackground({ type, payload }) {
  port.postMessage(actionCreator({ type, payload }));
}

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
        sendActionToBackground({ type: 'ADD_ITEM' });
      });
  });
})();

(function() {
  var deleteAllBtn = document.querySelector(".delete-all-btn");

  deleteAllBtn.addEventListener("click", function() {
    this.classList.toggle("active");
    
    sendActionToBackground({ type: 'DELETE_ALL_ITEMS' });
  });
})();

/* ----------------------------------------------- */
/* HEADER */
/* ----------------------------------------------- */

(function() {
  var addItem = document.querySelector(".add-btn");

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

(function() {
  var cancelButton = document.querySelector(".cancel-button")
  var addItem = document.querySelector(".add-btn")

  cancelButton.addEventListener("click", function() {
    addItem.classList.toggle("active");
    var panel = document.querySelector(".new-item");
    panel.style.maxHeight = null;
  });
})();


/* ----------------------------------------------- */
/* ITEMS */
/* ----------------------------------------------- */

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

/* ITEM DETAIL */

/* ----------------------------------------------- */
/* RENDER */
/* ----------------------------------------------- */

function renderItems() {
  function getItemString({ name, text, index }) {
    return `
        <div class="item">
          <button class="item-name">${name}</button>
          <div class="item-detail">
            <div class="row">
              <label for="item-detail-text-${index}" class="item-detail-text-label">Text</label>
              <textarea id="item-detail-text-${index}" class="item-detail-text" rows="10">${text}</textarea>
            </div>
            <div class="row">
              <p class="item-text-nums">characters : ${text.length}</p>
            </div>
            <div class="row">
              <div id="edit-button-${index}" class="btn btn-default full item-edit-button">Edit</div>
            </div>
          </div>
        </div>
      `;
  }

  var getStore = new Promise(function(resolve, reject) {
    chrome.storage.sync.get(function(store) {
      try {
        resolve(store);
      } catch(error) {
        reject(error);
      }
    });
  });

  return getStore
    .then(function(store) {
      /* Item block added */
      var section = document.querySelector("section.section-items");
      var items = '';
      store.data.forEach(function(data, index) {
        items += getItemString({
          name: data.name,
          text: data.text,
          index
        });
      });
      section.innerHTML = items;
    })
    .then(function() {
      /* item onclick event listener css js effects */
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
    })
    .then(function() {
      /* editbutton onClick event */
      var editButtons = document.querySelectorAll(".item-edit-button");
      editButtons.forEach(function(editButton, i) {
        editButton.addEventListener("click", function() {
          var innerText = document.querySelector("#item-detail-text-" + i).value;
          var action = {
            type: EDIT_ITEM,
            payload: {
              id: i,
              text: innerText,
            },
          }
          sendActionToBackground(action);
        });
      });
    })
    .catch(function(error) {
      console.error(error);
    });
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

function deleteAllItems() {
  return new Promise(function(resolve, reject) {
    try {
      chrome.storage.sync.set({
        data: [
          /*
          { name: ... , text: ... }
          */
        ]
      })
      resolve();
    } catch(error) {
      console.error(error);
    }
  });
}

/* ----------------------------------------------- */
/* BACKGROUND EVENT COMMUNICATION */
/* ----------------------------------------------- */

var port = chrome.extension.connect({
  name: 'popup-backround-connection'
});

port.onMessage.addListener(function(action) {
  switch (action.type) {
    case 'ADD_ITEM_SUCCESS':
      console.log('나방은 무서워')
      break;
    case 'DELETE_ALL_ITEMS_SUCCESS':
      renderItems();
      console.log('deleted all');
    default:
      break;
  }
});

/* ----------------------------------------------- */
/* MAIN */
/* ----------------------------------------------- */

function main() {
  renderItems();
};

main();
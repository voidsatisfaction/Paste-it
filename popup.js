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

/* DISPATCH ACTION TO BACKGROUND */

function dispatchActionToBackground({ type, payload }) {
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
    
    dispatchActionToBackground({ type: 'ADD_ITEM', payload: { name, text } });
  });
})();

(function() {
  var deleteAllBtn = document.querySelector(".delete-all-btn");

  deleteAllBtn.addEventListener("click", function() {
    this.classList.toggle("active");
    
    dispatchActionToBackground({ type: 'DELETE_ALL_ITEMS' });
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

/* ----------------------------------------------- */
/* HEADER DETAIL */
/* ----------------------------------------------- */

/* CANCEL BUTTON */

(function() {
  var cancelButton = document.querySelector(".cancel-button")
  var addItem = document.querySelector(".add-btn")

  cancelButton.addEventListener("click", function() {
    addItem.classList.toggle("active");
    var panel = document.querySelector(".new-item");
    panel.style.maxHeight = null;
  });
})();

/* TEXT REALTIME COUNTS */

(function() {
  function onInput(e) {
    var characterNums = e.target.value.length;
    var wordNums = e.target.value.split(' ').length;

    var sentence = `characters: ${characterNums}`;
    newItemTextNums.textContent = sentence;
  }

  var newItemTextarea = document.querySelector("#new-item-text");
  var newItemTextNums = document.querySelector("#new-item-text-nums");

  newItemTextarea.addEventListener("input", onInput);
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
          dispatchActionToBackground(action);
        });
      });
    })
    .catch(function(error) {
      console.error(error);
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
      renderItems();
      break;
    case 'DELETE_ALL_ITEMS_SUCCESS':
      renderItems();
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
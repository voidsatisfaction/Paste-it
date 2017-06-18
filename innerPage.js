/* ----------------------------------------------- */
/* HELPER */
/* ----------------------------------------------- */

function getStore() {
  return new Promise(function(resolve, reject) {
    try {
      chrome.storage.sync.get(function(store) {
        resolve(store);
      });
    } catch (error) {
      reject(error);
    }
  });
}

/* ----------------------------------------------- */
/* LISTENER */
/* ----------------------------------------------- */

function listenPopup() {
  chrome.extension.onConnect.addListener(function(port) {
    port.onMessage.addListener(function(action) {
      switch (action.type) {
        case 'ADD_ITEM':
          initialize();
          break;
        case 'DELETE_ALL':
          initialize();
          break;
        default:
          break;
      }
    });
  });
}

/* ----------------------------------------------- */
/* LOGICS */
/* ----------------------------------------------- */

function initialize() {
  function itemMenuOnClick(info, tab) {
    chrome.storage.sync.get(function(store) {
      var itemIndex = Number(info.menuItemId);
      chrome.tabs.sendMessage(tab.id, {
        type: 'ADD_ITEM',
        item: store.data[itemIndex]
      },
      function(msg) {
        console.log("result message:", msg);
      });
    });
  }

  function renderItemMenu(currentStore) {
    if (currentStore.data.length !== beforeStore.data.length) {
      currentStore.data.forEach(function(item,index) {
        chrome.contextMenus.create({
          id: String(index),
          title: item.name,
          "contexts": ["editable"],
          "onclick": itemMenuOnClick,
        }); 
      });
      beforeStore = currentStore;
      return; 
    }
  }

  function removeAllMenus(currentStore) {
    return new Promise(function(resolve, reject) {
      chrome.contextMenus.removeAll(function() {
        resolve(currentStore);
      });
    });
  }

  var beforeStore = beforeStore || {data:[]};

  getStore()
    .then(removeAllMenus)
    .then(renderItemMenu);
}

initialize();
listenPopup();

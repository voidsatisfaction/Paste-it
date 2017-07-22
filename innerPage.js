/* ----------------------------------------------- */
/* LOCAL STORE */
/* ----------------------------------------------- */

var localStore = { data: [] };

/* ----------------------------------------------- */
/* ACTION CONSTANTS */
/* ----------------------------------------------- */

var ADD_ITEM_SUCCESS = 'ADD_ITEM_SUCCESS';

function actionCreator({ type, payload }) {
  return { type, payload };
}

/* SEND ACTION TO POPUP */

function sendActionToPopup(port, { type, payload }) {
  return function() {
    port.postMessage(actionCreator({ type, payload }));
  }
}

/* ----------------------------------------------- */
/* HELPER */
/* ----------------------------------------------- */

function getStore() {
  return new Promise(function(resolve, reject) {
    try {
      chrome.storage.sync.get(function(store) {
        if (!(store.data instanceof Array)) {
          store = { data:[] }
        }
        resolve(store);
      });
    } catch (error) {
      reject(error);
    }
  });
}

function setStore(store) {
  return new Promise(function(resolve, reject) {
    try {
      chrome.storage.sync.set(store);
      resolve(store);
    } catch(error) {
      reject(error);
    }
  });
}

function editItem({ payload: { id, text } }) {
  return getStore()
    .then(function(store) {
      store.data[id].text = text;
      return store;
    })
    .then(setStore)
    .catch(function(error) {
      console.error('There is a something wrong with store')
      console.error(error);
    });
}

function saveNewItem({ payload: { name, text } }) {
  return new Promise(function(resolve, reject) {
    try {
      localStore.data.push({ name, text });

      chrome.storage.sync.set(localStore);

      resolve(localStore);
    } catch(error) {
      reject(error);
    }
  });
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
      reject(error);
    }
  });
}

/* ----------------------------------------------- */
/* POPUP EVENT COMMUNICATION */
/* ----------------------------------------------- */

function listenPopup() {
  chrome.extension.onConnect.addListener(function(port) {
    port.onMessage.addListener(function(action) {
      switch (action.type) {
        case 'ADD_ITEM':
          render()
            .then(sendActionToPopup(port, { type: ADD_ITEM_SUCCESS }));
          break;
        case 'DELETE_ALL_ITEMS':
          render();
          break;
        case 'EDIT_ITEM':
          editItem(action);
          break;
        default:
          break;
      }
    });
  });
}

/* ----------------------------------------------- */
/* RENDER UPTO DATE */
/* ----------------------------------------------- */

function render() {
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

  function removeAllMenus(currentStore) {
    return new Promise(function(resolve, reject) {
      chrome.contextMenus.removeAll(function() {
        resolve(currentStore);
      });
    });
  }

  function createItemMenu(currentStore) {
    currentStore.data.forEach(function(item,index) {
      chrome.contextMenus.create({
        id: String(index),
        title: item.name || 'unknown',
        "contexts": ["editable"],
        "onclick": itemMenuOnClick,
      }); 
    });
    return currentStore;
  }

  function renderLocalStore(currentStore) {
    localStore = currentStore;
  }

  function resetLocalStore() {
    localStore = { data: [] };
  }

  return getStore()
    .then(removeAllMenus)
    .then(createItemMenu)
    .then(renderLocalStore)
    .catch((error) => {
      console.error('error occured on rendering!');
      console.error(error);
    });
}

/* ----------------------------------------------- */
/* INITIALIZE */
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

  function createItemMenu(currentStore) {
    currentStore.data.forEach(function(item,index) {
      chrome.contextMenus.create({
        id: String(index),
        title: item.name || 'unknown',
        "contexts": ["editable"],
        "onclick": itemMenuOnClick,
      }); 
    });
    return currentStore; 
  }

  function removeAllMenus(currentStore) {
    return new Promise(function(resolve, reject) {
      chrome.contextMenus.removeAll(function() {
        resolve(currentStore);
      });
    });
  }

  function renderLocalStore(currentStore) {
    localStore = currentStore;
  }

  return getStore()
    .then(setStore)
    .then(removeAllMenus)
    .then(createItemMenu)
    .then(renderLocalStore);
}

initialize();
listenPopup();

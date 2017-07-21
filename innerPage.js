/* ----------------------------------------------- */
/* STORE */
/* ----------------------------------------------- */

var localStore = { data: [] };

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

/* ----------------------------------------------- */
/* LISTENER FROM POPUP */
/* ----------------------------------------------- */

function listenPopup() {
  chrome.extension.onConnect.addListener(function(port) {
    port.onMessage.addListener(function(action) {
      switch (action.type) {
        case 'ADD_ITEM':
          render();
          break;
        case 'DELETE_ALL':
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
/* RENDER UP TO DATE */
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

  function renderItemMenu(currentStore) {
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

  var localStore = localStore || { data:[] };

  getStore()
    .then(removeAllMenus)
    .then(renderItemMenu)
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

  getStore()
    .then(setStore)
    .then(removeAllMenus)
    .then(createItemMenu)
    .then(renderLocalStore);
}

initialize();
listenPopup();

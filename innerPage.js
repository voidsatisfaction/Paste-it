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

function listenPopup() {
  chrome.extension.onConnect.addListener(function(port) {
    port.onMessage.addListener(function(action) {
      switch (action.type) {
        case 'ADD_ITEM':
          initialize();
          break;
        default:
          break;
      }
    });
  });
}

function initialize() {
  function itemMenuOnClick(info, tab) {
    chrome.storage.sync.get(function(store) {
      alert(store.data[0].text);
    });
  }

  function renderItemMenu(currentStore) {
    if (currentStore.data.length !== beforeStore.data.length) {
      currentStore.data.forEach(function(item) {
        chrome.contextMenus.create({
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

// var contexts = ["page","selection","link","editable","image","video","audio"];
// for (var i = 0; i < contexts.length; i++) {
//   var context = contexts[i];
//   var title = "Test '" + context + "' menu item";
//   var id = chrome.contextMenus.create({
//     title,
//     "contexts": [context],
//     "onclick": genericOnClick,
//   });
//   console.log("'" + context + "' item:" + id);
// }


// // Create a parent item and two children.
// var parent = chrome.contextMenus.create({"title": "Test parent item"});
// var child1 = chrome.contextMenus.create(
//   {"title": "Child 1", "parentId": parent, "onclick": genericOnClick});
// var child2 = chrome.contextMenus.create(
//   {"title": "Child 2", "parentId": parent, "onclick": genericOnClick});
// console.log("parent:" + parent + " child1:" + child1 + " child2:" + child2);


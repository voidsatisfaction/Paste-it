chrome.runtime.onMessage.addListener(function(action, sender, sendResponse) {
  switch (action.type) {
    case 'ADD_ITEM':
      document.activeElement.value = action.item.text;
      break;
    default:
      break;
  }
});
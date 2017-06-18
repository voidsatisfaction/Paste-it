chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
  alert(msg);
    if (msg.color) {
        document.body.style.backgroundColor = msg.color;
        sendResponse('Change color to ' + msg.color);
    } else {
        sendResponse('Color message is none.');
    }
});
// console.log('hi');
// document.body.style.backgroundColor = 'red';
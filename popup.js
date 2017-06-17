/* ----------------------------------------------- */
/* HEADER */
/* ----------------------------------------------- */

var addItem = document.querySelector(".add-btn")

addItem.onclick = function() {
  this.classList.toggle("active");
  var panel = document.querySelector(".new-item");
  if (panel.style.maxHeight) {
    panel.style.maxHeight = null;
  } else {
    panel.style.maxHeight = panel.scrollHeight + "px";
  }
};

/* ----------------------------------------------- */
/* ITEMS */
/* ----------------------------------------------- */

var items = document.querySelectorAll(".item-name");
var i;

for (i = 0; i < items.length; i++) {
  items[i].onclick = function(){
      this.classList.toggle("active");
      var panel = this.nextElementSibling;
      if (panel.style.maxHeight) {
          panel.style.maxHeight = null;
      } else {
          panel.style.maxHeight = panel.scrollHeight + "px";
      }
  };
}
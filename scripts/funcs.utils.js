export function selectionHandler(event) {
   const types = document.querySelectorAll(".types");
   const current = event.target;

   if (current.dataset.type == undefined) {
      return;
   } else {
      types.forEach((element) => {
         element.classList.remove("selected");
      });
      current.classList.add("selected");
   }
}

export function selectionDropdown() {
   document.querySelector(".container-selection").classList.toggle("show");
   document.querySelector(".dropdown-btn").classList.toggle("show");
}

function throttle(func, ms) {
   let isWaiting = false;

   return function (event) {
      if (isWaiting) return;
      isWaiting = true;
      func.call(event, this);
      setTimeout(() => {
         func.call(event, this);
         isWaiting = false;
      }, ms);
   };
}

function debounce(func, ms) {
   let reference;
   return function (event) {
      clearTimeout(reference);
      reference = setTimeout(() => {
         func.call(event, this);
      }, ms);
   };
}

export {
   
}
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

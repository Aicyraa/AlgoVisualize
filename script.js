import { bubble, selection, insertion  } from "./scripts/funcs.algo.js";
import {
   selectionHandler,
   selectionDropdown,
   filterValues,
   throttle,
   debounce,
} from "./scripts/funcs.utils.js";
/* 

   1. function that generate a bar 
   2. decorator func that debounce a function
   3. a global variable that holds the value of the data in the graph
   4. function for animation for handling the animation
   5. modularized the function each algorithm

*/

const graphInfo = {
   type: function () {
      const types = Array.from(document.querySelectorAll(".types"));
      return types.filter((type) => type.classList.contains("selected"));
   },

   graph: document.querySelector(".graph"),
   input: document.querySelector("#input"),
   dataPoints: [],
};

function generateBar(event) {
   graphInfo.graph.innerHTML = "";
   let values = filterValues(event.value);
   values.forEach((point, index) => {
      const points = document.createElement("div");
      const height = 5 * point ? 5 * point : 0.8;
      points.className = "points"
      points.dataset.index = index
      points.innerHTML = `
            <span id=text>${point}</span>
            <span id=bar style="height:${height}px;"></span>
         `;
      graphInfo.graph.append(points);
   });
}

function sort() {
   const values = filterValues(graphInfo.input.value);
   const selectedType = graphInfo.type();
   
   switch(selectedType[0].dataset.type) {
      case "bubble":
         bubble(values)
         break;
      case "selection":
         selection(values)
         break;
      case "insertion":
         insertion(values)
         break;
      case "merge":
         // merge(values)
         break;
      case "quick":
         // quick(values)
         break;
      default:
         console.log("None");     
   }

}



(function () {
   const selectionContainer = document.querySelector(".container-selection");
   const dropdownBtn = document.querySelector(".dropdown-btn");
   const start = document.querySelector("#start");
   selectionContainer.addEventListener("click", selectionHandler);
   dropdownBtn.addEventListener("click", selectionDropdown);
   start.addEventListener("click", sort);
   graphInfo.input.addEventListener("input", throttle(generateBar, 2000));
})();

// console.log(insertion([2,5,2,3,7,1]));

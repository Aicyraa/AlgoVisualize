import { bubble, selection } from "./scripts/funcs.algo.js";
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
      points.setAttribute("class", `points points-${index + 1}`);
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
      case "insert":
         bubble(values)
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

// console.log(selection([23, 21, 4, 100, 200, 3, 10, 20, 3, 50, 5, 40, 40]));

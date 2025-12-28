import { selectionDropdown, selectionHandler } from "./funcs.utils.js";
/* 

   1. function that generate a bar 
   2. decorator func that debounce a function
   3. a global variable that holds the value of the data in the graph
   4. function for animation for handling the animation
   5. modularized the function each algorithm

   * Must finish today
   1. Make the selection container float 
   2. Change svg from flexbox, 
   3. Finish Generate bar 

*/

const selectionContainer = document.querySelector(".container-selection");
const dropdownBtn = document.querySelector(".dropdown-btn");
const graphInput = document.querySelector("#input");

selectionContainer.addEventListener("click", selectionHandler)
dropdownBtn.addEventListener("click", selectionDropdown)


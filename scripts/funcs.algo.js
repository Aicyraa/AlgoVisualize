import { sleep } from "./funcs.utils.js";

async function bubble(arr) {
   for (let i = 0; i < arr.length - 1; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
         console.log("comparing");
         sortCompare(j, j + 1);
         await sleep(2000);

         if (arr[j] > arr[j + 1]) {
            let temp = arr[j];
            sortSwap(j, j + 1);
            arr[j] = arr[j + 1];
            arr[j + 1] = temp;
         }
      }
   }
   console.log(arr);

   return arr;
}

function selection(arr) {
   let n = arr.length;
   console.log(n);

   for (let i = 0; i < n - 1; i++) {
      console.log(arr[i]);

      let smallest = arr[i];
      let index = 0;
      for (let j = i; j < n; j++) {
         if (smallest >= arr[j]) {
            index = j;
            smallest = arr[j];
         }
      }

      arr[index] = arr[i];
      arr[i] = smallest;
   }

   return arr;
}

// comparing, swapping

function sortCompare(index1, index2, special) {
   /* 
      1. get the index of the correct value
      2. apply css class
      3. remove the class after comparing
   */

   const points = document.querySelectorAll("#bar");
   function addStyle() {
      points[index1].classList.toggle("current");
      points[index2].classList.toggle("current");
   }

   addStyle();
   setTimeout(addStyle, 2000);

   if (special) {
      points[special].classList.add("correct-value");
   }
}

function sortSwap(index1, index2) {
   // accepts 2 values which is the index of a value in an array, and swap them while animation is playing
}

export { bubble, selection };

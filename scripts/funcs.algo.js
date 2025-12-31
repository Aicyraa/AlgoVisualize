import { sleep } from "./funcs.utils.js";

async function bubble(arr) {
   let sorted = [];
   let n = arr.length;
   
   for (let i = 0; i < n; i++) {
      for (let j = 0; j < n - i - 1; j++) {
         
         sortCompare([], j, j + 1);
         await sleep(1000);

         if (arr[j] > arr[j + 1]) {
            // sortSwap(j, j + 1);
            let temp = arr[j];
            arr[j] = arr[j + 1];
            arr[j + 1] = temp;
         }
      }
      sorted.push(n - i - 1);
      sortCompare(sorted);
   }
   return arr;
}

function selection(arr) {
   let n = arr.length;
   for (let i = 0; i < n - 1; i++) {
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

function sortCompare(sorted = [], idxA, idxB, idxSpecial) {
   /* 
      1. get the index of the correct value
      2. apply css class
      3. remove the class after comparing
   */
   const points = document.querySelectorAll("#bar");

   function styleAdd() {
      points.forEach((point, index) => {
         if (sorted.includes(index)) {
            point.classList.add("sorted");
         } else if (index == idxA || index == idxB) {
            point.classList.add("current");
         }
      });
   }

   function styleRemove() {
      points.forEach((point) => point.classList.remove("current"));
   }

   styleAdd();
   setTimeout(styleRemove, 1000);
}

function sortSwap(idxA, idxB) {
   // accepts 2 values which is the index of a value in an array, and swap them while animation is playing
}

export { bubble, selection };

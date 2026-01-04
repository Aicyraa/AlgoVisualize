import { sortSwap, sortCompare, sortCompareTime } from "./func.algo.animate.js";
import { sleep } from "./funcs.utils.js";

async function bubble(arr) {
   let sorted = [];
   const n = arr.length;

   for (let i = 0; i < n; i++) {
      for (let j = 0; j < n - i - 1; j++) {
         sortCompare([], j, j + 1);
         await sleep(sortCompareTime);

         if (arr[j] > arr[j + 1]) {
            sortSwap(j, j + 1);
            let temp = arr[j];
            arr[j] = arr[j + 1];
            arr[j + 1] = temp;
         }
      }
      sorted.push(n - i - 1);
      sortCompare(sorted);
   }
}

async function selection(arr) {
   let sorted = [];
   const n = arr.length;

   for (let i = 0; i < n; i++) {
      const last = n - i - 1;
      let bigIdx = 0;
      for (let j = 0; j < n - i; j++) {
         sortCompare([], j, undefined, bigIdx);
         await sleep(sortCompareTime);

         if (arr[j] >= arr[bigIdx]) {
            bigIdx = j;
         }
      }

      sortSwap(bigIdx, last);
      [arr[bigIdx], arr[last]] = [arr[last], arr[bigIdx]];

      sorted.push(n - i - 1);
      sortCompare(sorted);
      await sleep(sortCompareTime - 500);
   }
   return arr;
}

async function insertion(arr) {
   const n = arr.length;
   for (let i = 0; i < n; i++) {
      let j = i;

      while (j > 0 && arr[j] < arr[j - 1]) {
         sortCompare([], undefined, j - 1, j);
         await sleep(sortCompareTime);
         
         sortSwap(j, j - 1);
         [arr[j], arr[j - 1]] = [arr[j - 1], arr[j]]
         j -= 1;
      }
   }
   return arr;
}

function merge(arr) {
   // divides the array into N sublist, where the sublist must contain only 1 element
   // takes the 2 singleton array and merge them
   // consider the first element of both 2 sublist
   // the element who has the first lesser value become the new element
}

export { bubble, selection, insertion };

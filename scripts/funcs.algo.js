import {
   sortCompare,
   sortSwap,
   sortStatusLog,
   sortCompareTime,
   sortSwapTime,
} from "./func.algo.animate.js";
import { sleep } from "./funcs.utils.js";

async function bubble(arr) {
   let sorted = [];
   const n = arr.length;

   for (let i = 0; i < n; i++) {
      for (let j = 0; j < n - i - 1; j++) {
         sortStatusLog(false, {
            status: "Comparing",
            value: `is ${arr[j]} <b> > </b> ${arr[j + 1]}`,
         });
         sortCompare([], j, j + 1);
         await sleep(sortCompareTime);

         if (arr[j] > arr[j + 1]) {

            sortStatusLog("swap", { 
               status: "Swapping", 
               value: ""
            });
            await sortSwap(j, j + 1);
            await sleep(sortSwapTime * 2);

            let temp = arr[j];
            arr[j] = arr[j + 1];
            arr[j + 1] = temp;
         }
      }

      sorted.push(n - i - 1);
      sortCompare(sorted);
      await sleep(sortCompareTime);
   }

   sortStatusLog("reset", { status: "Finished", value: "" });
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

      await sortSwap(bigIdx, last);
      [arr[bigIdx], arr[last]] = [arr[last], arr[bigIdx]];

      sorted.push(n - i - 1);
      sortCompare(sorted);
      await sleep(sortCompareTime - 500);
   }
}

async function insertion(arr) {
   const n = arr.length;
   for (let i = 0; i < n; i++) {
      let j = i;

      while (j > 0 && arr[j] < arr[j - 1]) {
         sortCompare([], undefined, j - 1, j);
         await sleep(sortCompareTime);

         await sortSwap(j, j - 1);
         [arr[j], arr[j - 1]] = [arr[j - 1], arr[j]];
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

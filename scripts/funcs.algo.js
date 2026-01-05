import {
   sortCompare,
   sortSwap,
   sortStatusLog,
   sortSpeed,
} from "./func.algo.animate.js";
import { sleep } from "./funcs.utils.js";

async function bubble(arr) {
   let sorted = [];
   const n = arr.length;

   for (let i = 0; i < n; i++) {
      for (let j = 0; j < n - i - 1; j++) {

         sortStatusLog(false, {status: "Comparing", value: `is ${arr[j]} bigger than ${arr[j + 1]}?`, });
         sortCompare([], j, j + 1);
         await sleep(sortSpeed);

         if (arr[j] > arr[j + 1]) {

            sortStatusLog("swap", {status: "Swapping", value: `Moving ${arr[j]} to the right.`, });
            await sortSwap(j, j + 1);
            await sleep(sortSpeed);

            let temp = arr[j];
            arr[j] = arr[j + 1];
            arr[j + 1] = temp;
         }
      }

      sorted.push(n - i - 1);
      sortCompare(sorted);
      await sleep(sortSpeed);
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
         
         sortStatusLog(false, {status: "Comparing", value: `Is ${arr[j]} bigger than or equal to ${arr[bigIdx]}?`, });
         sortCompare([], j, undefined, bigIdx);
         await sleep(sortSpeed);

         if (arr[j] >= arr[bigIdx]) {
            bigIdx = j;
         }
      }

      sortStatusLog("swap", {status: "Swapping", value: `Switching ${arr[bigIdx]} to the array's last element of the array`, });
      await sortSwap(bigIdx, last);
      [arr[bigIdx], arr[last]] = [arr[last], arr[bigIdx]];

      sorted.push(n - i - 1);
      sortCompare(sorted);
      await sleep(sortSpeed);
   }

   sortStatusLog("reset", { status: "Finished", value: "" });
}

async function insertion(arr) {
   const n = arr.length;
   for (let i = 0; i < n; i++) {
      let j = i;

      while (j > 0 && arr[j] < arr[j - 1]) {

         sortStatusLog(false, {status: "Comparing", value: `Is ${arr[j]} less than ${arr[j - 1]}?`,});
         sortCompare([], undefined, j - 1, j);
         await sleep(sortSpeed);

         sortStatusLog("swap", {status: "Swapping", value: `Moving ${arr[j]} to left `, });
         await sortSwap(j, j - 1);
         await sleep(sortSpeed);

         [arr[j], arr[j - 1]] = [arr[j - 1], arr[j]];
         j -= 1;
      }
   }

   sortStatusLog("reset", { status: "Finished", value: "" });
}

function merge(arr) {
   // divides the array into N sublist, where the sublist must contain only 1 element
   // takes the 2 singleton array and merge them
   // consider the first element of both 2 sublist
   // the element who has the first lesser value become the new element
}

export { bubble, selection, insertion };

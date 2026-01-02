import { sleep } from "./funcs.utils.js";

var sortCompareTime = 800;
var sortSwapTime = 50;

async function bubble(arr) {
   let sorted = [];
   let n = arr.length;

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
   // first element always has the "current" class
   // hindi tama ung pag swap bandang gitna
   // issue
   const last = n - i - 1;
   let sorted = [];
   let n = arr.length;

   for (let i = 0; i < n; i++) {
      let bigIdx = 0;
      for (let j = 0; j < n - i; j++) {
         sortCompare([], j, undefined, index);
         await sleep(sortCompareTime + 1000);

         if (arr[j] >= arr[bigIdx]) {
            bigIdx = j;
         }
      }

      // swapping the bigIdx to last and vice versa
      sortSwap(bigIdx, last);
      arr[bigIdx] = arr[last];
      arr[last] = arr[bigIdx];

      // pushing the last index to the sorted array
      sorted.push(n - i - 1);
      sortCompare(sorted);
      await sleep(sortCompareTime - 500);
   }
   console.log(arr);
   return arr;
}

function insertion(arr) {
   let n = arr.length;
   for (let i = 0; i < n; i++) {
      let temp = arr[i];
      let j = i;
      while (j > 0 && temp < arr[j - 1]) {
         arr[j] = arr[j - 1];
         j -= 1;
      }
      arr[j] = temp;
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

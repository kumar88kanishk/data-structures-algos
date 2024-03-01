class Thunk {
  constructor(f) {
    this.f = f;
  }
}

function trampoline(thunk) {
  let res = thunk.f();
  while (res instanceof Thunk)
    res = res.f();
  return res;
}

function unCPS(f) {
  return (...args) =>
    trampoline(f(x => x, ...args));
}

function insertionSort(arr, i, dir) {
  if (i >= arr.length || dir.length >= arr.length * 2) {
    console.log("arr", arr)
    return arr
  } else {

    let left = arr[i - 1];
    let center = arr[i];
    let right = arr[i + 1];

    if ((left < center) && (center < right)) {
      return insertionSort(arr, i + 1, dir)
    }

    if (dir[0] === 'r') {
      console.log("r", i, dir, arr)
      if (right && (center > right)) {
        return insertionSort([...arr.slice(0, i), right, center, ...arr.slice(i + 2)], i + 1, ['r', ...dir])
      } else if (left && (left > center)) {
        return insertionSort([...arr.slice(0, i - 1), center, left, ...arr.slice(i + 1)], i - 1, ['l', ...dir])
      } else if (left && (left < center)) {
        return insertionSort(arr, i - 1, ['r', ...dir])
      }
    }
    else if (dir[0] === 'l') {
      console.log("l", i, dir, arr)
      if (left && (left > center)) {
        return insertionSort([...arr.slice(0, i - 1), center, left, ...arr.slice(i + 1)], i - 1, ['l', ...dir])
      } else if (left && (left < center)) {
        return insertionSort(arr, i - 1, ['r', ...dir])
      } else if (right && (center > right)) {
        return insertionSort([...arr.slice(0, i), right, center, ...arr.slice(i + 2)], i + 1, ['r', ...dir])
      }
    }

  }
}
// const unsortedArray = Array.from({length: 40}, () => Math.floor(Math.random() * 40))
let a = insertionSort([4, 2, 6, 109, 76, 3], 0, ['r'])
// [4, 2, 6, 109, 76, 3] i = 0, dir =[r],center=4, right = 2
// [2,4,6,109,76,3] i=1, dir=[r], 
//  i = 1,2,3,
// []




console.log("sorted array", a)
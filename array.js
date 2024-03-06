import {
  isReduced, cons, first, rest,
  isAccumlated, reduced, accumlate, delay, toArray, benchmark,
  generateArray, doAll, unAccumlated, unReduced
} from './helpers.cjs'

function reduce(arr, f, init) {
  let acc = init
  for (let x of arr) {
    acc = f(acc, x)
    if (isReduced(acc)) {
      acc = unReduced(acc)
      break;
    }
  }
  return acc;
}

function push(arr, x) {
  arr.push(x)
  return arr
}

function map(arr, f) {
  return reduce(arr, (acc, x) => push(acc, f(x)), [])
}

function filter(arr, f) {
  return reduce(arr, (acc, x) => {
    if (f(x))
      return push(acc, x)
    else
      return acc
  }, [])
}

function take(arr, n) {
  let c = 0
  return reduce(arr, (acc, x) => {
    if (c < n) {
      c = c + 1
      return push(acc, x)
    } else
      return reduced(acc)
  }, [])
}

let double = (x) => x * 2
let isEven = (x) => x % 2 === 0

let l4 = generateArray(10000000)
benchmark(() => take(filter(map(l4, double), isEven), 50))

let l5 = generateArray(10000000)
benchmark(() => take(filter(map(l5, double), isEven), 50)[0])

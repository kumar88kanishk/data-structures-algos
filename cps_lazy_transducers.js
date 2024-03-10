import {
  isReduced, cons, first, rest,
  isAccumlated, reduced, accumlate, delay, toArray, benchmark,
  generateList, doAll, unAccumlated, unReduced
} from './helpers.cjs'

function mapping(f) {
  return function (rf) {
    return function (acc, x) {
      return rf(acc, f(x))
    }
  }
}

function filtering(f) {
  return function (rf) {
    return function (acc, x) {
      if (f(x))
        return rf(acc, x)
      else
        return acc
    }
  }
}

function taking(n) {
  return function (rf) {
    let taken = 0
    return function (acc, x) {
      if (taken < n) {
        taken = taken + 1
        return rf(acc, x)
      } else {
        return reduced(acc)
      }
    }
  }
}

function comp(...fs) {
  // [f1, f2, f3] -> x => f1(f2(f3(x)))
  return function (x) {
    let acc = x
    for (let i = fs.length - 1; i >= 0; i--)
      acc = fs[i](acc)
    return acc
  }
}
function lazyReduce(list, rf) {
  while (list !== null) {
    let x = first(list), more = rest(list)
    let result = rf(null, x)
    if (isReduced(result)) {
      result = unReduced(result)
      if (isAccumlated(result)) {
        return cons(unAccumlated(result), null)
      } else {
        return null;
      }
    } else {
      if (isAccumlated(result)) {
        return cons(unAccumlated(result), delay(() => lazyReduce(more, rf)))
      } else {
        list = more
      }
    }
  }
  return null
}

function lazyTransduceList(list, xf) {
  let rf = xf(accumlate)
  return lazyReduce(list, rf)
}


let inc = (x) => x + 1
let isEven = (x) => x % 2 === 0

let xf1 = comp(
  mapping(inc),
  filtering(isEven),
  taking(10000)
)
let l1 = generateList(10000000)
benchmark(() => doAll(lazyTransduceList(l1, xf1)), toArray)


let xf2 = comp(
  mapping(inc),
  filtering(isEven),
  taking(10000)
)
let l2 = generateList(10000000)
benchmark(() => first(lazyTransduceList(l2, xf2)))

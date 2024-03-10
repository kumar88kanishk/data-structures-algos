import {
  isReduced, cons, first, rest,
  isAccumlated, reduced, accumlate, delay, toArray, benchmark,
  generateList, doAll, unAccumlated, unReduced
} from './helpers.cjs'
// fn accepts a list and f applies f on first item and applies delay to the rest of the list  
function map(list, f) {
  if (list === null)
    return list
  else
    return cons(f(first(list)), delay(() => map(rest(list), f)))
}
// fn accepts a list and f applies f on first item and applies delay to the rest of the list  
function filter(list, f) {
  if (list === null)
    return list
  else if (f(first(list)))
    return cons(first(list), delay(() => filter(rest(list), f)))
  else
    return filter(rest(list), f)
}


function iterate(e, f) {
  return cons(f(e), delay(() => iterate(f(e), f)))
}

function take(list, n) {
  if (n === 0)
    return null
  else
    return cons(first(list), delay(() => take(rest(list), n - 1)))
}


function reduce(list, rf, init) {
  let acc = init
  while (list != null) {
    acc = rf(acc, first(list))
    list = rest(list)
  }
  return acc
}

// chain(l4, [map, inc], [filter, isEven], [take, 40], [doAll], [reduce, add, 0])
// chain(l, [map, inc])
// 
let $ = new Object()

function chain(init, ...ops) {
  let result = init
  for (let op of ops) {
    let actualArgs = op.map((arg) => arg === $ ? result : arg)
    let [fn, ...args] = actualArgs
    result = fn(...args)
  }
  return result
}

let inc = (x) => x + 1
let isEven = (x) => x % 2 === 0
let add = (a, b) => a + b

// let l4 = generateList(1000000)
// benchmark(() => chain(l4, [map, inc], [filter, isEven], [take, 10000], [doAll])
//   , toArray)

// let l5 = generateList(1000000)
// benchmark(() => chain(l5, [map, inc], [filter, isEven], [take, 10000], [first]))

// benchmark(() => chain(l5, [map, $, inc], [cons, 0, $]), toArray)


function chain2(init, ...fs) {
  return fs.reduce((result, f) => f(result), init)
}

chain2(5,
  $ => map(generateList($), inc),
  $ => filter($, isEven))
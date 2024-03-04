// null
// [1, null]
// [1, [2, null]]
// [1, [2, null]]
// [1, [2, [3, null]]]

// implementing linked list representing arrays
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

function cons(first, next) {
  return [first, next]
}

function first(list) {
  return list[0]
}

function rest(list) {
  return list[1]
}

// Function result is in K

function cps_map(k, list, f) {
  if (list === null)
    return k(null)
  else
    return new Thunk(() =>
      cps_map(mappedRest => {
        let mappedFirst = f(first(list))
        return new Thunk(() => k(cons(mappedFirst, mappedRest)))
      }, rest(list), f))
}

function cps_filter(k, list, f) {
  if (list === null)
    return k(null)
  else
    return new Thunk(() =>
      cps_filter((filteredRest) => {
        if (f(first(list))) {
          return new Thunk(() => k(cons(first(list), filteredRest)))
        } else {
          return new Thunk(() => k(filteredRest))
        }
      }, rest(list), f))
}

function cps_take(k, list, n) {
  if (n === 0)
    return k(null)
  else
    return new Thunk(() => cps_take((taken) => {
      return new Thunk(() => k(cons(first(list), taken)))
    }, rest(list), n - 1))
}

function toArray(list) {
  let a = []
  while (list !== null) {
    a.push(first(list))
    list = rest(list)
  }
  return a;
}

function length(list) {
  if (list === null)
    return 0;
  else
    return 1 + length(rest(list))
}


function generateList(n) {
  let l = null
  for (let i = n; i >= 0; i--) {
    l = cons(i, l)
  }
  return l;
}

function benchmark(f, post = (x) => x) {
  let start = Date.now()
  let result = f()
  let end = Date.now()
  console.log(post(result))
  console.log(end - start + "ms")
}

let inc = (x) => x + 1
let isEven = (x) => x % 2 === 0

let map = unCPS(cps_map)
let filter = unCPS(cps_filter)
let take = unCPS(cps_take)

let l1 = generateList(1000000)

benchmark(() => take(filter(map(l1, inc), isEven), 10000), toArray)

let l2 = generateList(1000000)
benchmark(() => first(take(filter(map(l2, inc), isEven), 10000)))

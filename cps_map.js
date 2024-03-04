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


// function map(arr, f, init) {
//   if (arr.length === 0) {
//     return init
//   } else {
//     let more = arr.slice(1)
//     return map(more, f, [...init, f(arr[0])])
//   }
// }

// let testMap = map([...Array(50000).keys()], (e) => e + 1, [])
// console.log(testMap)

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

let map = unCPS(cps_map)
let inc = (x) => x + 1
console.log(JSON.stringify(map([...Array(50).keys()], inc)))
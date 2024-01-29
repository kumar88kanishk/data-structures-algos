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


function map(arr, f, init) {
  if (arr.length === 0) {
    return init
  } else {
    let more = arr.slice(1)
    return map(more, f, [...init, f(arr[0])])
  }
}

// let testMap = map([...Array(50000).keys()], (e) => e + 1, [])
// console.log(testMap)

function cps_map(k, arr, cps_f, init) {
  if (arr.length === 0) {
    return new Thunk(() => k(init))
  } else {
    return new Thunk(() => {
      return cps_f((acc) => {
        let more = arr.slice(1)
        return cps_map(k, more, cps_f, [...init, acc])
      }, arr[0])
    })
  }
}


let dirMap = unCPS(cps_map)``
console.log(JSON.stringify(dirMap([...Array(50000).keys()], (k, e) => k(e + 1), [])))
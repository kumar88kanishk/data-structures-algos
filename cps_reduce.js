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


function reduce(arr, f, init) {
  if (arr.length === 0) {
    return init
  } else {
    let acc = f(init, arr[0])
    let more = arr.slice(1)
    return reduce(more, f, acc)
  }
}

function cps_reduce(k, arr, cps_f, init) {
  if (arr.length === 0) {
    return new Thunk(() => k(init))
  } else {
    return new Thunk(() => {
      return cps_f((acc) => {
        let more = arr.slice(1)
        return cps_reduce(k, more, cps_f, acc)
      },
        init, arr[0])
    })
  }
}

let dirRed = unCPS(cps_reduce)
console.log(dirRed([...Array(50000).keys()], (k, acc, e) => k(acc + e), 0))

// console.log(reduce([...Array(5000).keys()], (acc, e) => acc + e, 0))

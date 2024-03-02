class Reduced {
  constructor(val) {
    this.val = val
  }
}

function unReduced(red) {
  if (red instanceof Reduced)
    return red.val
  return null
}

function isReduced(red) {
  return (red instanceof Reduced)
}

function reduced(item) {
  if (!isReduced(item))
    return new Reduced(item)
  else
    return item
}


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

function transduce(arr, xf) {
  let rf = xf(push)
  return reduce(arr, rf, [])
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

function generateArray(n) {
  let l = []
  for (let i = 0; i <= n; i++) {
    l.push(i)
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

let double = (x) => x * 2
let isEven = (x) => x % 2 === 0

let l4 = generateArray(10000000)
let tx1 = comp(
  mapping(double),
  filtering(isEven),
  taking(10000)
)
benchmark(() => transduce(l4, tx1))


let l5 = generateArray(10000000)
let tx2 = comp(
  mapping(double),
  filtering(isEven),
  taking(10000)
)
benchmark(() => transduce(l5, tx2)[0])

// transducers are generic wasy to write sequence operations
// Performance
// there are different type of adapters for different data structure. Current implementation is for array 


// function map(arr, f) {
//   return reduce(arr, (acc, x) => push(acc, f(x)), [])
// }

// function take(arr, n) {
//   let taken = 0
//   return reduce(arr, (acc, x) => {
//     if (taken < n) {
//       taken = taken + 1
//       return push(acc, x)
//     } else {
//       return acc
//     }
//   }, [])
// }
// let xf = function (rf) {
//   return function (acc, x) {
//     return rf(acc, inc(x))
//   }
// }
// let rf = function (acc, x) {
//   return push(acc, inc(x))
// }
// reduce(a, rf, [])

// let xf = function (rf) {
//   return function (acc, x) {
//     let X = inc(x)
//     if (isEven(X))
//       return rf(acc, X)
//     else
//       return acc
//   }
// }

// let rf = function (acc, x) {
//   let X = inc(x)
//   if (isEven(X))
//     return push(acc, X)
//   else
//     return acc
// }

// function mapping(f, rf, acc, x) {
//   return function (rf) {
//     return function (acc, x) {
//       return rf(acc, f(x))
//     }
//   }
// }

//comparison

// [1, 2, 3, 4, 5, 6]
//   .map(inc)
//   .filter(isEven)


// arr
//   .reduce(function (acc, x) {
//     return push(acc, inc(x))
//   }, []).reduce(function (acc, x) {
//     if (isEven(x))
//       return push(acc, x)
//     else
//       return acc
//   }, [])

// arr
//   .reduce(function (acc, x) {
//     let X = inc(x)
//     if (isEven(X))
//       return push(acc, X)
//     else
//       return acc
//   })




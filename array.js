class Reduced {
  constructor(val) {
    this.val = val
  }
}

function reduce(arr, f, init) {
  let acc = init
  for (let x of arr) {
    acc = f(acc, x)
    if (acc instanceof Reduced) {
      acc = acc.val
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
      return new Reduced(acc)
  }, [])
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
benchmark(() => take(filter(map(l4, double), isEven), 50))

let l5 = generateArray(10000000)
benchmark(() => take(filter(map(l5, double), isEven), 50)[0])

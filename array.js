function reduce(arr, f, init) {
  let acc = init
  for (let x of arr) {
    acc = f(acc, x)
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
      return acc
  }, [])
}

let a = [...Array(10000).keys()]
// console.log(reduce(a, (acc, x) => acc + x, 0))
console.log(take(a, 5))
// console.log(filter(a, (x) => x % 2 === 0))

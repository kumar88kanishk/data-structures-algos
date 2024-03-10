// 0, 1, 1, 2, 3, 5, 8....
let cache = {}

function memo(f) {
  return function (x) {
    if (cache[x])
      return cache[x]
    else {
      cache[x] = f(x)
      return cache[x]
    }
  }
}
function _fib(n) {
  if (n === 0)
    return 0
  else if (n === 1)
    return 1
  else
    return fib(n - 2) + fib(n - 1)
}
let fib = memo(_fib)
console.log(fib(50))
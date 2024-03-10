// 0, 1, 1, 2, 3, 5, 8....
let cache = {}
function fib(n) {

  let res;
  if (cache[n])
    return cache[n]

  if (n === 0)
    res = 0
  else if (n === 1)
    res = 1
  else
    res = fib(n - 2) + fib(n - 1)

  cache[n] = res

  return res
}

console.log(fib(50))
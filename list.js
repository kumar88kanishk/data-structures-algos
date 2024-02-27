// null
// [1, null]
// [1, [2, null]]
// [1, [2, null]]
// [1, [2, [3, null]]]

// implementing linked list representing functions

function cons(first, next) {
  return function (idx) {
    if (idx === 0)
      return first
    else if (idx === 1)
      return next
    else
      return new Error()
  }
}

function first(list) {
  return list(0)
}

function rest(list) {
  return list(1)
}

function map(list, f) {
  if (list === null)
    return list
  else
    return cons(f(first(list)), map(rest(list), f))
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

function filter(list, f) {
  if (list === null)
    return list
  else if (f(first(list)))
    return cons(first(list), filter(rest(list), f))
  else
    return filter(rest(list), f)
}

function generateList(n) {
  let l = null
  for (let i = n; i >= 0; i--) {
    l = cons(i, l)
  }
  return l;
}
// (0, null)
// (0, (1, null))
// (0, (1, (2, null)))
function take(list, n) {
  if (n === 0)
    return null
  else
    return cons(first(list), take(rest(list), n - 1))
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

let l4 = generateList(8000)
benchmark(() => take(filter(map(l4, double), isEven), 50), toArray)

let l5 = generateList(8000)
benchmark(() => first(take(filter(map(l5, double), isEven), 50)))
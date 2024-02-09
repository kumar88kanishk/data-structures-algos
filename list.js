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
  if (list === null)
    return []
  else
    return [first(list), ...toArray(rest(list))]
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

let l1 = cons(1, null)
let l2 = cons(2, l1)
let l3 = cons(3, l2)
// console.log(length(map((x) => x + 1, l3)))
console.log(toArray(filter(l3, (x) => x % 2 != 0)))
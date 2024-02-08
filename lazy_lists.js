// class Thunk to encapsulate the computation withibn itself. 
// When asked to compute, provides value from cache if present, else computes and saves in cache
class Thunk {
  constructor(f) {
    this.f = f
    this.cached = false
    this.cacheValue = null
  }
  realize() {
    if (this.cached)
      return this.cacheValue
    else {
      this.cacheValue = this.f()
      this.cached = true
      return this.f()
    }

  }
}
// fn accepts a f and return a thunk (a computation to be performed later) with f in it
function delay(f) {
  return new Thunk(f)
}

// fn accepts first and next and returns a function
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

// fn accepts a list and second item computes itself if thunk 
function rest(list) {
  if (list === null)
    return null
  else if (list(1) instanceof Thunk)
    return list(1).realize()
  else
    return list(1)
}
// fn accepts a list and f applies f on first item and applies delay to the rest of the list  
function map(list, f) {
  if (list === null)
    return list
  else
    return cons(f(first(list)), delay(() => map(rest(list), f)))
}
// fn accepts a list and f applies f on first item and applies delay to the rest of the list  
function filter(list, f) {
  if (list === null)
    return list
  else if (f(first(list)))
    return cons(first(list), delay(() => filter(rest(list), f)))
  else
    return filter(rest(list), f)
}

function toString(list) {
  if (list === null)
    return new String()
  else
    return new String(first(list)) + toString(rest(list))
}

function toArray(list) {
  if (list === null)
    return []
  else
    return [first(list), ...toArray(rest(list))]
}

let l = cons(1, null)
l = cons(2, l)
l = cons(3, l)
l = cons(4, l)
l = cons(5, l)
l = cons(6, l)
l = cons(7, l)

console.log(toString(filter(map(l, x => x + 1), (x) => x % 2 === 0)))
// console.log(toArray(map(l, x => x + 1)))

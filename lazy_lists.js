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
      return this.cacheValue
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
  let a = []
  while (list !== null) {
    a.push(first(list))
    list = rest(list)
  }
  return a;
}

function iterate(e, f) {
  return cons(f(e), delay(() => iterate(f(e), f)))
}

function take(list, n) {
  if (n === 0)
    return null
  else
    return cons(first(list), delay(() => take(rest(list), n - 1)))
}

function doAll(list) {
  let curr = list
  while (curr !== null) {
    curr = rest(curr)
  }
  return list
}

function generateList(n) {
  let l = null
  for (let i = n; i >= 0; i--) {
    l = cons(i, l)
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

let l4 = generateList(1000000)
benchmark(() => doAll(take(filter(map(l4, double), isEven), 10000)), toArray)

let l5 = generateList(1000000)
benchmark(() => first(take(filter(map(l5, double), isEven), 10000)))

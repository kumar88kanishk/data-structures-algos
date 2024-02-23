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

class Accumlated {
  constructor(val) {
    this.val = val
  }
}

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

function comp(...fs) {
  // [f1, f2, f3] -> x => f1(f2(f3(x)))
  return function (x) {
    let acc = x
    for (let i = fs.length - 1; i >= 0; i--)
      acc = fs[i](acc)
    return acc
  }
}

function lazyTransduce(arr, xf) {
  if (arr.length === 0)
    return null
  else {
    let [x, ...more] = arr
    let rf = xf((_, v) => new Accumlated(v))
    let result = rf(null, x)

    if (result instanceof Accumlated) {
      return cons(result.val, delay(() => lazyTransduce(more, xf)))
    } else {
      return lazyTransduce(more, xf)
    }
  }
}

function toArray(list) {
  let a = []
  while (list !== null) {
    a.push(first(list))
    list = rest(list)
  }
  return a;
}


let arr = [1, 2, 3, 4]
let inc = (x) => x + 1
let isEven = (x) => x % 2 === 0
let xf = comp(mapping(inc), filtering(isEven))
let res = lazyTransduce(arr, xf)

console.log(toArray(res))

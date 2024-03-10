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

function isThunk(thunk) {
  return thunk instanceof Thunk
}

function thunkfy(x) {
  return new Thunk(x)
}


class Accumlated {
  constructor(val) {
    this.val = val
  }
}

function unAccumlated(acc) {
  if (acc instanceof Accumlated)
    return acc.val
  return null
}

function isAccumlated(acc) {
  return (acc instanceof Accumlated)
}

function accumlate(x) {
  return new Accumlated(x)
}

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

const reduced = (item) => {
  if (!isReduced(item))
    return new Reduced(item)
  else
    return item
}

// fn accepts a f and return a thunk (a computation to be performed later) with f in it
function delay(f) {
  return new Thunk(f)
}

// fn to represent list in terms of array
function cons(first, next) {
  return [first, next]
  // return function (idx) {
  //   if (idx === 0)
  //     return first
  //   else if (idx === 1)
  //     return next
  //   else
  //     return new Error()
  // }
}

function first(list) {
  return list[0]
  // return list(0)
}

// fn accepts a list and second item computes itself if thunk 
function rest(list) {
  if (list === null)
    return null
  else if (isThunk(list[1]))
    return list[1].realize()
  else
    return list[1]
  //   if (list === null)
  //   return null
  // else if (list(1) instanceof Thunk)
  //   return list(1).realize()
  // else
  //   return list(1)
}

function toArray(list) {
  let a = []
  while (list !== null) {
    a.push(first(list))
    list = rest(list)
  }
  return a;
}
function generateList(n) {
  let l = null
  for (let i = n; i >= 0; i--) {
    l = cons(i, l)
  }
  return l;
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

function doAll(list) {
  let curr = list
  while (curr !== null) {
    curr = rest(curr)
  }
  return list
}
function push(arr, x) {
  arr.push(x)
  return arr
}
function toString(list) {
  if (list === null)
    return new String()
  else
    return new String(first(list)) + toString(rest(list))
}


module.exports = {
  isThunk, thunkfy, isReduced, cons, first, rest,
  isAccumlated, reduced, accumlate, delay, toArray, generateArray,
  generateList, benchmark, doAll, unAccumlated, unReduced, push, toString
}

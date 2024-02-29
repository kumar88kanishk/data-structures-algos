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
}

// fn accepts a list and second item computes itself if thunk 
function rest(list) {
  if (list === null)
    return null
  else if (list[1] instanceof Thunk)
    return list[1].realize()
  else
    return list[1]
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

function taking(n) {
  let taken = 0
  return function (rf) {
    return function (acc, x) {
      if (taken < n) {
        taken = taken + 1
        return rf(acc, x)
      } else
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

function lazyTransduceArr(arr, xf) {
  if (arr.length === 0)
    return null
  else {
    let [x, ...more] = arr
    let rf = xf((_, v) => new Accumlated(v))
    let result = rf(null, x)

    if (result instanceof Accumlated) {
      return cons(result.val, delay(() => lazyTransduceArr(more, xf)))
    } else {
      return lazyTransduceArr(more, xf)
    }
  }
}

function lazyTransduceList(list, xf) {
  while (list !== null) {
    let x = first(list), more = rest(list)
    let rf = xf((_, v) => new Accumlated(v))
    let result = rf(null, x)
    if (result instanceof Accumlated) {
      return cons(result.val, delay(() => lazyTransduceList(more, xf)))
    } else {
      list = more
    }
  }
  return null
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

let inc = (x) => x + 1
let isEven = (x) => x % 2 === 0


let xf1 = comp(
  mapping(inc),
  filtering(isEven),
  taking(50)
)
let l1 = generateList(10000000)
benchmark(() => doAll(lazyTransduceList(l1, xf1)), toArray)

let xf2 = comp(
  mapping(inc),
  filtering(isEven),
  taking(50)
)
let l2 = generateList(10000000)
let start = Date.now()
console.log(first(lazyTransduceList(l2, xf2)))
let end = Date.now()
console.log(end - start + "ms")

// benchmark(() => doAll(lazyTransduceList(l2, xf2)), toArray)
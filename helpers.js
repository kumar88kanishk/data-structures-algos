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

function unAccumlated(acc) {
  if (acc instanceof Accumlated)
    return acc.val
  return null
}

function isAccumlated(acc) {
  return (acc instanceof Accumlated)
}

function accumlate(acc, x) {
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

function reduced(item) {
  if (!isReduced(item))
    return new Reduced(item)
  else
    return item
}


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
  else if (list[1] instanceof Thunk)
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
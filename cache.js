// 0, 1, 1, 2, 3, 5, 8....
class LRUCache {
  // introducing capacity to implement LRU
  // LRU (Least Recently Used) is a GC(Garbage Collection)
  constructor(capacity) {
    this.store = {}
    this.capacity = capacity
    this.size = 0
  }
  put(key, val) {
    if (!this.has(key))
      this.size++
    this.store[key] = { ts: Date.now(), val }
    if (this.size > this.capacity) {
      let keys = Object.keys(this.store)
      let firstKey = keys[0]
      let leastRecent = keys.slice(1).reduce(([lastKey, lastTs], lruKey) => {
        if (lastTs < this.store[lruKey].ts)
          return [lastKey, lastTs]
        else
          return [lruKey, this.store[lruKey].ts]
      }, [firstKey, this.store[firstKey].ts])

      //console.log(leastRecent, this.store);
      delete this.store[leastRecent[0]]
    }
  }

  get(key) {
    // console.log("key", key, this.store)
    if (this.has(key)) {
      this.store[key].ts = Date.now()
      return this.store[key].val
    }
  }

  has(key) {
    return this.store.hasOwnProperty(key)
  }
}

function memo(f) {
  let lruCache = new LRUCache(4)
  return function (x) {
    if (lruCache.has(x))
      return lruCache.get(x)
    else {
      lruCache.put(x, f(x))
      return lruCache.get(x)
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
console.log(fib(8))
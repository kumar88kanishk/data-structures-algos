// 0, 1, 1, 2, 3, 5, 8....
class LRUCache {
  // Capcity limited LRU
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

      // console.log(leastRecent[0], this.store);
      delete this.store[leastRecent[0]]
      this.size--
    }
  }

  get(key) {
    if (this.has(key)) {
      this.store[key].ts = Date.now()
      return this.store[key].val
    }
  }

  has(key) {
    return this.store.hasOwnProperty(key)
  }
}

function memo(f, size = 4) {
  let lruCache = new LRUCache(size)
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
console.log(fib(20))



// function sleep(ms) {
//   return new Promise(resolve => setTimeout(resolve, ms));
// }

// let newCache = new LRUCache(1)
// newCache.put("key1", "val1")
// console.log("newCache", newCache)
// await sleep(5)
// newCache.put("key2", "val2")
// console.log("newCache", newCache)
// await sleep(5)
// newCache.put("key3", "val3")
// console.log("newCache", newCache)
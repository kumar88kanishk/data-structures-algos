class Thunk {
  constructor(f) {
    this.f = f;
  }
}

function trampoline(thunk) {
  let res = thunk.f();
  while (res instanceof Thunk)
    res = res.f();
  return res;
}

function unCPS(f) {
  return (...args) =>
    trampoline(f(x => x, ...args));
}

let v = {
  key1: " value1 ",
  key2: {
    key3: " val ue3 ",
    key4: {
      key5: " value 5 ",
      key2: {
        key3: " val ue3 ",
        key4: {
          key5: " value 5 ",
          key6: "sdfdf sdf "
        }
      },
      "key 8": {
        "  key  9  ": "value9"
      }
    }
  },
}

// function walk(strct) {
//   if (strct instanceof Object) {
//     return Object.keys(strct).reduce((acc, e) => {
//       acc[e.trim()] = typeof strct[e] == 'string' ? strct[e].trim() : walk(strct[e])
//       return acc
//     }, {})
//   } return strct
// }

function cps_reduce(k, arr, cps_f, init) {
  if (arr.length === 0) {
    return new Thunk(() => k(init))
  } else {
    return new Thunk(() => {
      return cps_f((acc) => {
        let more = arr.slice(1)
        return cps_reduce(k, more, cps_f, acc)
      },
        init, arr[0])
    })
  }
}



function cps_walk(k, strct) {
  if (strct instanceof Object) {
    return new Thunk(() => {
      return cps_reduce(k, Object.keys(strct),
        (k1, acc, e) => {
          if (typeof strct[e] === 'string') {
            acc[e.trim()] = strct[e].trim()
            return k1(acc)
          } else {
            return cps_walk((subStrct) => {
              acc[e.trim()] = subStrct
              return k1(acc)
            }, strct[e])
          }
        }, {})
    })
  }
  return new Thunk(() => k(strct))
}

let z_walk = unCPS(cps_walk);
console.log(JSON.stringify(z_walk(v)));
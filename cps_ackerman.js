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

// function A(m, n) {
//   if (m === 0)
//     return n+1;
//   else if (n === 0)
//     return A(m-1, 1);
//   else
//     return A(m-1, A(m, n-1));
// }

// Ackerman (3, 11)

function cpsA(k, m, n) {
  if (m === 0) {
    return new Thunk(() => k(n + 1))
  } else if (n === 0) {
    return new Thunk(() => cpsA(k, m - 1, 1))
  } else {
    return new Thunk(() =>
      cpsA(
        v1 => new Thunk(() => cpsA(k, m - 1, v1)),
        m,
        n - 1))
  }
}

let A = unCPS(cpsA)
console.log(A(3, 11))


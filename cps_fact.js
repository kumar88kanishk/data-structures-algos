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

function cps_fact(k, n) {
  if (n < 2)
    return new Thunk(() => k(1));

  return new Thunk(() => cps_fact(
    nMinus1Fact => {
      let nFact = n * nMinus1Fact;
      return new Thunk(() => k(nFact));
    },
    n - 1
  ));
}

let fact = unCPS(cps_fact);
console.log(fact(5));

// trampoline(cps_fact(x => x, 5))
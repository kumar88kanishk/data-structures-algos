// {
//   value: e,
//   left: _,
//   right: _,
// }
// Fn takes a binary tree and inserts the element, building a max heap

function insert(bst, e) {
  if (bst === null)
    return { value: e, left: null, right: null }
  else if (e < bst.value)
    return { value: bst.value, left: insert(bst.left, e), right: bst.right }
  else
    return { value: bst.value, left: bst.left, right: insert(bst.right, e) }
}

// fn takes a binary tree and returns the array
function walk(bst) {
  if (bst === null)
    return []
  else
    return [...walk(bst.left), bst.value, ...walk(bst.right)]
}

function sort(arr) {
  let sorted = null
  for (let e of arr)
    sorted = insert(sorted, e)
  return walk(sorted)
}
// TEST
// ====
function test(size) {
  function shuffle(arr) {
    return arr
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value)
  }

  let arr = [...Array(size).keys()]
  let shuffled = shuffle(arr)
  let sorted = sort(shuffled)

  console.log(arr[0] === sorted[0]
    && arr.at(-1) === sorted.at(-1))
}

test(10)
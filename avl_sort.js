function getHeight(tree) {
  return tree === null ? 0 : tree.height
}

function newHeight(leftSubtree, rightSubtree) {
  return Math.max(getHeight(leftSubtree), getHeight(rightSubtree)) + 1
}

function insert(tree, e) {
  if (tree === null)
    return { val: e, left: null, right: null, height: 1 }
  else if (e < tree.val) {
    let left = insert(tree.left, e)
    let height = newHeight(left, tree.right)
    return { val: tree.val, left: left, right: tree.right, height: height }
  } else {
    let right = insert(tree.right, e)
    let height = newHeight(tree.left, right)
    return { val: tree.val, left: tree.left, right: right, height: height }
  }
}

function balanceFactor(tree) {
  if (tree === null)
    return 0

  return getHeight(tree.left) - getHeight(tree.right)
}

function isRightCase(tree) {
  return balanceFactor(tree) < -1
}

function isRightLeftCase(tree) {
  return isRightCase(tree) && balanceFactor(tree.right) > 0
}

function isLeftCase(tree) {
  return balanceFactor(tree) > 1
}

function isLeftRightCase(tree) {
  return isLeftCase(tree) && balanceFactor(tree.left) < 0
}

function rotateLeft(tree) {
  if (tree.right === null)
    return tree

  let left = { val: tree.val, left: tree.left, right: tree.right.left }
  let height = newHeight(left, tree.right)
  return { val: tree.right.val, left: left, right: tree.right, height: height }
}

function rotateRight(tree) {
  if (tree.left === null)
    return tree

  let right = { val: tree.val, left: tree.left.right, right: tree.right }
  let height = newHeight(tree.left, right)
  return { val: tree.left.val, left: tree.left.left, right: right, height: height }
}

function balance(tree) {
  if (isLeftRightCase(tree)) {
    let left = rotateLeft(tree.left)
    let height = newHeight(left, tree.right)
    return rotateRight({ val: tree.val, left: left, right: tree.right, height: height })
  } else if (isRightLeftCase(tree)) {
    let right = rotateRight(tree.right)
    let height = newHeight(tree.left, right)
    return rotateLeft({ val: tree.val, left: tree.left, right: right, height: height })
  } else if (isLeftCase(tree))
    return rotateRight(tree)
  else if (isRightCase(tree))
    return rotateLeft(tree)
  else
    return tree
}

function walk(tree) {
  if (tree === null)
    return []
  else if (tree.left === null && tree.right === null)
    return [tree.val]
  else
    return [...walk(tree.left), tree.val, ...walk(tree.right)]
}

function sort(arr) {
  let tree = null

  for (let e of arr)
    tree = balance(insert(tree, e))

  return walk(tree)
}

function test(size) {
  function shuffle(arr) {
    return arr
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value)
  }

  let arr = [...Array(size).keys()]

  let shuffled = [...arr].reverse()
  let start = Date.now()
  let sorted = sort(shuffled)
  let end = Date.now()
  console.log(arr[0] === sorted[0]
    && arr.at(-1) === sorted.at(-1))
  console.log(end - start + "ms")
}

test(1000);
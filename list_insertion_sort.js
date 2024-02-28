// null
// [1, null]
// [1, [2, null]]
// [1, [2, null]]
// [1, [2, [3, null]]]

// implementing insertion sort using linked list

// fn takes a sorted list array and insert the next item
function insert(sortedList, e) {
  if (sortedList === null)
    return [e, null]
  else if (e < sortedList[0])
    return [e, sortedList]
  else
    return [sortedList[0], insert(sortedList[1], e)]
}

// fn walks down the sorted list and returns array
function walk(list) {
  let arr = []
  while (list !== null) {
    arr.push(list[0])
    list = list[1]
  }
  return arr
}

// fn takes a unsorted array and picks one element at a time and puts them into a new list
function sort(arr) {
  let sorted = null

  for (let e of arr)
    sorted = insert(sorted, e)

  return walk(sorted)
}


// TEST
// ==== Fn takes a size and generates random array of the size (0,n) and sorts them
function test(size) {
  function shuffle(arr) {
    return arr
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value)
  }

  let arr = [...Array(size).keys()]
  let shuffled = shuffle(arr)
  let start = Date.now()
  let sorted = sort(shuffled)
  let end = Date.now()
  console.log(arr[0] === sorted[0]
    && arr.at(-1) === sorted.at(-1))
  console.log(end - start + "ms")
}

test(1000)
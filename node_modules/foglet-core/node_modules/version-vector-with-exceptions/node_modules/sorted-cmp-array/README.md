# sorted-cmp-array

  a sorted array, with user-supplied sorting.

## Installation

    npm install sorted-cmp-array

## API
  
  `var SortedArray = require('sorted-cmp-array')`

### new SortedArray(function cmp(a, b) → -1|0|-1, arr = [])

  Creates a new sorted array with the supplied comparison function, backed by either a fresh array or a supplied one.

#### sortedArray.arr

  The backing array.

#### sortedArray.insert(element)

  Inserts an element into the array.

#### sortedArray.indexOf(element) → Integer

  Returns the index of the element, or `-1` if it wasn't found.

#### sortedArray.remove(element) → Boolean

  Removes an element from the array.
  Returns `true` if the element was removed, `false` if it wasn't there in the first place.


# Enumtree

Fast enumeration tree - represents an ordered sequence of elements with
O(n) insert, remove, and position

Supports the following operations:

 * `insert(id, pos)` - insert element `id` at position `pos`
 * `remove(pos)` - remove element at position `pos`
 * `pos(id)` - return the position of element `id`

## Status

Currently have part of a proof-of-concept in node.js, the "real" implementation
will be in C.

## TODO

* Red-Black balancing
* Delete
* Implement in blazing-fast C

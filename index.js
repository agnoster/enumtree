var archy = require('archy')

var RED = "R", BLACK = "B"
  , LEAF =
  {
      color: BLACK,
      archy: function(){
          return { label: "\033[34m*\033[0m" }
      },
      forEach: function(){},
      map: function() { return [] }
  }

// proof of concept in JavaScript
//
function EnumNode(id, parent, offset) {
    this.id = id
    this.parent = parent || null
    this.left = LEAF
    this.right = LEAF
    this.offset = offset || 0
    this.color = this.parent ? RED : BLACK
}

EnumNode.prototype = {}

EnumNode.prototype.insert = function(id, pos, offset, dir) {

    var current = function() { return offset + this.offset }.bind(this)
    dir = (dir || 1)

    if (pos > current() || (dir < 0 && pos >= current())) { // add to the right

        if (dir < 0) {
            this.offset--
        }

        if (this.right != LEAF) return this.right.insert(id, pos, current(), 1)

        return this.right = new EnumNode(id, this, pos - current())
    } else { // add to the left

        if (dir > 0) {
            this.offset++
        }

        if (this.left != LEAF) return this.left.insert(id, pos, current(), -1)

        return this.left = new EnumNode(id, this, pos - current())
    }
}

EnumNode.prototype.pos = function(offset) {

    offset += this.offset
    if (this.parent) return this.parent.pos(offset)
    return offset
}

EnumNode.prototype.archy = function() {

    var label = "( " + this.id + " @ " + this.offset + " " + this.color + " )"
    if (this.color == RED) label = "\033[31m" + label + "\033[0m"
    if (this.color == BLACK) label = "\033[34m" + label + "\033[0m"
    return {
        label: label,
        nodes: [ this.right.archy(), this.left.archy() ]
    }
}

EnumNode.prototype.forEach = function(cb) {
    
    this.left.forEach(cb)
    cb(this.id)
    this.right.forEach(cb)
}

EnumNode.prototype.map = function(cb) {

    var results = []
    results = results.concat(this.left.map(cb))
    results.push(cb(this.id))
    results = results.concat(this.right.map(cb))
    return results
}

function EnumTree(ids) {
    this.root = null
    this.index = {}

    for (var i = 0; i < ids.length; i++) {
        this.insert(ids[i], i)
    }
}

EnumTree.prototype = {}

EnumTree.prototype.insert = function(id, pos) {

    if (this.index[id]) throw "Cannot insert an element that already exists"

    if (this.root) this.index[id] = this.root.insert(id, pos, 0)
    else this.root = this.index[id] = new EnumNode(id, null, pos)
}

EnumTree.prototype.remove = function(pos) {
}

EnumTree.prototype.pos = function(id) {
    if (!this.index[id]) return -1
    return this.index[id].pos(0)
}

EnumTree.prototype.toString = function() {
    if (this.root) return archy(this.root.archy())
    else return '-- empty tree --'
}

EnumTree.prototype.map = function(cb) {

    if (this.root) return this.root.map(cb)
}

EnumTree.prototype.forEach = function(cb) {

    if (this.root) this.root.forEach(cb)
}

module.exports = EnumTree

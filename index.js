var archy = require('archy')

// proof of concept in JavaScript
//
function EnumNode(id, parent, left, right, offset) {
    this.id = id
    this.parent = parent || null
    this.left = left || null
    this.right = right || null
    this.offset = offset || 0
}

EnumNode.prototype = {}

EnumNode.prototype.insert = function(id, pos, offset) {

    offset += this.offset

    if (pos > offset) {

        if (this.right) return this.right.insert(id, pos, offset)

        return this.right = new EnumNode(id, this, null, null, pos - offset)
    } else {

        this.offset++

        if (this.left) return this.left.insert(id, pos, offset - 1)

        return this.left = new EnumNode(id, this, null, null, pos - offset - 1)
    }
}

EnumNode.prototype.replaceChild = function(child, newChild) {

    if (this.left == child) this.left = newChild
    else if (this.right == child) this.right = newChild
    else throw "Cannot replace a child I never had"
}

EnumNode.prototype.pos = function(offset) {

    offset += this.offset
    if (this.parent) return this.parent.pos(offset)
    return offset
}

EnumNode.prototype.archy = function() {

    var node = { label: this.id + " " + this.offset }

    if (this.right || this.left) {

        node.nodes = [{ label: "" }, { label: "" }]

        if (this.left) node.nodes[0] = this.left.archy()
        if (this.right) node.nodes[1] = this.right.archy()
    }

    return node
}


function EnumTree(ids) {
    this.root = null
    this.map = {}

    for (var i = 0; i < ids.length; i++) {
        this.insert(ids[i], i)
    }
}

EnumTree.prototype = {}

EnumTree.prototype.insert = function(id, pos) {

    if (this.map[id]) throw "Cannot insert an element that already exists"

    if (this.root) this.map[id] = this.root.insert(id, pos, 0)
    else this.root = this.map[id] = new EnumNode(id, null, null, null, pos)
}

EnumTree.prototype.remove = function(pos) {
}

EnumTree.prototype.pos = function(id) {
    if (!this.map[id]) return -1
    return this.map[id].pos(0)
}

EnumTree.prototype.toString = function() {
    if (this.root) return archy(this.root.archy())
    else return '-- empty tree --'
}

module.exports = EnumTree

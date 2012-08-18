var should = require('should')
  , EnumTree = require('../')

function EnumList(ids) {
    this.ids = (ids || [])
}

EnumList.prototype = {}

EnumList.prototype.insert = function(id, pos) {
    this.ids.splice(pos, 0, id)
}

EnumList.prototype.remove = function(pos) {
    this.ids.splice(pos, 1)
}

EnumList.prototype.pos = function(id) {
    return this.ids.indexOf(id)
}

EnumList.prototype.toString = function() {
    return 'EnumList: ' + this.ids.join(", ")
}

function EnumTester(ids) {
    var l, t
    l = this.l = new EnumList(ids)
    t = this.t = new EnumTree(ids)

    this.timespent = { l: 0, t: 0 }

    this.insertAndTest = function(id, pos) {
        this.insert(id, pos)
        this.test()
    }

    this.insert = function(id, pos) {
        if (t) t.insert(id, pos)
        if (l) l.insert(id, pos)
    }

    this.remove = function(pos) {
        if (t) t.remove(pos)
        if (l) l.remove(pos)
        this.test()
    }

    this.pos = function(id) {
        if (l && t)
            return should.strictEqual(t.pos(id), l.pos(id))
        if (t) return t.pos(id)
        if (l) return l.pos(id)
    }

    this.test = function() {
        if (l && t) {
            l.ids.forEach(function(id) {
                this.pos(id)
            }.bind(this))
        }
    }

    this.dump = function() {
        console.log(l.toString())
        console.log(t.toString())
    }
}

describe('EnumTree', function() {
    var test = new EnumTester(["a", "b", "c", "d", "e", "f", "g"])

    it('returns the position of elements', function() {

        test.test()
    })

    it('inserts new elements', function() {

        test.insertAndTest("1", 3)
        test.insertAndTest("2", 0)
        test.insertAndTest("3", 6)
        test.insertAndTest("5", 0)
        test.insertAndTest("4", 10)
    })

    it('can iterate', function() {
        
        if (test.t && test.l) {
            var ids = []
            test.t.forEach(function(id) { ids.push(id) })
            ids.should.eql(test.l.ids)
        }
    })

    it('can map', function() {
        if (test.t && test.l) {
            test.t.map(function(id) { return id }).should.eql(test.l.ids)
        }
    })

    it('passes a fuzz test', function() {

        for (var i = 10; i < 1000; i++) {
            var pos = Math.floor(Math.random() * i)
            test.insert(""+i, pos)
        }
        test.test()
        test.dump()
    })
})

describe("Edge cases", function() {
    var test = new EnumTester(["a"])
    it("passes the 'off by one' issue" ,function() {
        test.insert("1", 0)
        test.insert("2", 1)
    })
})


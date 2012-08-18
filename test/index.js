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
    var l = new EnumList(ids)
      , t = new EnumTree(ids)

    this.l = l
    this.t = t

    this.insert = function(id, pos) {
        t.insert(id, pos)
        l.insert(id, pos)
        this.dump()
        this.test()
    }

    this.remove = function(pos) {
        t.remove(pos)
        l.remove(pos)
        this.test()
    }

    this.pos = function(id) {
        return should.strictEqual(t.pos(id), l.pos(id), "wrong index for " + id + ": expected " + l.pos(id) + ", got " + t.pos(id))
    }

    this.test = function() {
        l.ids.forEach(function(id) {
            this.pos(id)
        }.bind(this))
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

        test.insert("1", 3)
        test.insert("2", 0)
        test.insert("3", 6)
        test.insert("5", 0)
        test.insert("4", 10)
    })

    it('can iterate', function() {
        
        var ids = []
        test.t.forEach(function(id) { ids.push(id) })
        ids.should.eql(test.l.ids)
    })

    it('can map', function() {
        test.t.map(function(id) { return id }).should.eql(test.l.ids)
    })

    it('passes a fuzz test', function() {

        for (var i = test.l.ids.length; i < 100; i++) {
            var pos = Math.floor(Math.random() * i)
            console.log("<insert " + i + " at " + pos + ">")
            test.insert(""+i, pos)
        }
    })
})

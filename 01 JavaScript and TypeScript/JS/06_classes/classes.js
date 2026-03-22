/************************************************
This example shows how to implement classes
using prototype/based inheritance
************************************************/

// Class constructor

// Suppose we want to create a class "Range" describing a range
// of values. We start by defining a constructor (which is just a JavaScript function)

function Range( from, to ) {
    // When Range is invoked with new, this will refere to the newly created object.
    // NOTE: if we call Range() without new we will pollute the global object (so it
    // is a good idea to use strict mode for constructors)
    'use strict'
    this.from = from;
    this.to = to;
}

// By modifying the function prototype property we can define all 
// the properties of the instances of class Range

Range.prototype = {

    includes:  function( x ) {
        // Returns true if x is in range
        return this.from <= x && x <= this.to;
    },

    foreach: function( f ) {
        // Invokes f for each element in the range
        for( var i=this.from; i<=this.to; ++i )
            f(i);

    },

    toString: function() {
        return "Range [" + this.from + " ... " + this.to + "]";
    }
}

// Some tests
let r = new Range(1,5); // <-- we use new to create a new instance of Range class
console.log(r.includes(3) );
console.log( r.toString() );
r.foreach( console.log );


// The identity of a class depends by the object prototype, not the constructor
// used to build it. Two objects can be instance of the same class even if they
// have been built with different constructors but have the same prototype

function RangeDefault() {
    'use strict'
    this.from = 0;
    this.to = 10;
}
RangeDefault.prototype = Range.prototype;

let rd = new RangeDefault();
console.log( rd.toString() );
console.log( rd instanceof Range ); // true
console.log( Range.prototype.isPrototypeOf(rd) ); // true


// We can dynamically add methods or properties to
// all the existing objects of a class

let s = "test"; // first, we instantiate a new String

String.prototype.strWithSpaces = function() {
    // Then we add a new method to all the strings
    var out ="";

    for (var idx=0; idx<this.length; ++idx ) {
        out = out + this[idx] + " ";
    }

    return out;
}

// Object s, instantiated before our modification, dinamically acquires
// the new method
console.log( s.strWithSpaces() )
/************************************************
Example of how to use closures to simulate private
properties of a class 
************************************************/

// Let's modify the Range class to let from and to
// properties private

function Range( from, to ) {

    // The basic idea is to use closures instead!

    this.from = function() { return from; }
    this.to = function() { return to; }
}

// We also modify the Range methods
Range.prototype = {

    includes:  function( x ) {
        return this.from() <= x && x <= this.to();
    },

    foreach: function( f ) {
        for( let i=this.from(); i<=this.to(); ++i )
            f(i);

    },
    toString: function() {
        return "Range [" + this.from() + " ... " + this.to() + "]";
    }
}

let r = new Range(1,5);
console.log(r.includes(3) );
console.log( r.toString() );

// WARNING: from and to properties behave as private but the whole object
// remain mutable unless we use specific ES5 features to let the properties
// being immutables

r.from = function() { return 3; }
console.log( r.toString() );
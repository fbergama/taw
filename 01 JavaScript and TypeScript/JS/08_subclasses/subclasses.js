/************************************************
Example of how to exploit the prototype chain
for class inheritance
************************************************/


// We create a class RangeStep to represent a range of values
// with a certain step (ex: RangeStep(2,8,2) = [2 4 6 8])


// Let's start by implementing the base class
function Range( from, to ) {
    this.from = function() { return from; }
    this.to = function() { return to; }
}
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

// And now the subclass

function RangeStep( from, to, step) {
    Range.apply( this, arguments ); //super(arguments)
    this.step = function() { return step; };
}

RangeStep.prototype = Object.create(Range.prototype);  // the actual subclassing operation.
                                                       // Object.create creates a new object with Range.prototype as prototype

// Override some methods
RangeStep.prototype.toString = function() {
    let out = "Range: [ ";
    for( let i=this.from(); i<this.to(); i+=this.step() ) {
        out = out + i + " ";
    }
    out = out + this.to() + " ]";
    return out;
}

RangeStep.prototype.includes = function(x) {
    // We use call() to invoke the superclass
    return Range.prototype.includes.call(this,x) && (x-this.from())%this.step() == 0 || x==this.to() ;
}

let rs = new RangeStep( 2, 9, 2 );
console.log( rs.toString() );
for( let ii=0; ii<12; ++ii ) {
    console.log(ii + ") " + rs.includes(ii) );
}
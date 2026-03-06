/************************************************
 Class definition using the class keyword. 
 This examples demonstrates that the class keyword does 
 not alter the fundamental nature of 
 JavaScript’s prototype-based classes.
************************************************/

class Range {
    constructor( from, to ) {
        this.from = from;
        this.to = to;
    }
    
    includes( x ) {
        return this.from <= x && x <= this.to;
    }
    foreach( f ) {
        for( var i=this.from; i<=this.to; ++i )
            f(i);
    }

    toString() {
        return "Range [" + this.from + " ... " + this.to + "]";
    }
}

class RangeStep extends Range {
    constructor( from, to, step ) {
        super( from, to )
        this.step = step
    }

    // method override
    toString() {
        let out = "Range: [ ";
        for (let i = this.from; i < this.to; i += this.step) {
            out = out + i + " ";
        }
        out = out + this.to + " ]";
        return out;
    }
}


let r = new Range(1,5);
console.log( r.includes(2) );
console.log( r.toString() );

let rs = new RangeStep(2, 9, 2);
console.log( rs.toString() );
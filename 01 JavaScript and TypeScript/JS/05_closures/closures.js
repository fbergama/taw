/************************************************
Closures and their applications
************************************************/

let scope = "global scope";
function checkscope() {
	let scope = "local scope";
	function f() { return scope; }
	return f;
}
console.log( checkscope()() );


// some of useful idioms using closures

// 1) Singleton
let unique_integer = (function() {
    let counter = 0;
    return function() { return counter++; }
})();

console.log( unique_integer() );
console.log( unique_integer() );
console.log( unique_integer() );

// 2) Closure used to implement private variables
console.log("---")

function counter() {
    let n=0;  // private variable we want to hide
    return {
        count: function() { return n++; }, // Both count and reset share the same scope (variable n is shared)
        reset: function() { n=0; }
    };
}

// Every counter() invocation creates a new scope chain. Variable n is private in each chain
let a = counter();
let b = counter();

// Two counters are independent. Each function have a different scope chain, one for each
// invocation of counter()
console.log( a.count() );
console.log( b.count() );
b.reset();
console.log( a.count() );
console.log( b.count() );
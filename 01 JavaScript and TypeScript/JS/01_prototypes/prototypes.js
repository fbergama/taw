/************************************************
 Objects and prototypes example 
************************************************/

let a = {title:"Javascript", pages:20 }

function f() 
{
    console.log("you invoked function f()")
}
f.prototype = { info: "this is the prototype of f" }

let b = new f();
b.x = 10;


// Prototype of any object can be retrieved using
// the static method Object.getPrototypeOf(..)

// Note: the strict equality operator (===) checks
// for reference equality (i.e. same memory address) when
// applied to objecs

console.log( Object.getPrototypeOf(a) === Object.prototype );   // true
console.log( Object.getPrototypeOf(a) === f.prototype );    // false
console.log( Object.getPrototypeOf(b) === f.prototype );  // true

// o1.isPrototypeOf( o2 ) can be used to check
// if an object o1 exists in the prototype chain
// of the object o2. If that's the case, o2 
// inherits all the properties of o1

console.log( Object.prototype.isPrototypeOf(a) );   // true
console.log( Object.prototype.isPrototypeOf(b) );   // also true, because f.prototype 
                                                    // is an object that was created with 
                                                    // an object literal expression

console.log( f.prototype.isPrototypeOf(a) );        // false


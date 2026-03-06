/************************************************
Prototype example
************************************************/

let a = {title:"Javascript", pages:20 }
let arr = new Array();

// Prototype of any object can be retrieved using
// the static method Object.getPrototypeOf(..)

console.log( Object.getPrototypeOf(a) );    // Object.prototype
console.log( Object.getPrototypeOf(arr) );  // Array.prototype

// Method isPrototypeOf can be used to check
// if one object is a prototype of another one

console.log( Object.prototype.isPrototypeOf(a) );
console.log( Object.prototype.isPrototypeOf(arr) );
console.log( Array.prototype.isPrototypeOf(arr) );
console.log( Array.prototype.isPrototypeOf(a) );
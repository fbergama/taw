/************************************************
Example demonstrating the behaviour of the
this keyword 
************************************************/


// in browser, this refer to window object if invoked in global scope
// in Node.js, this refers to the "global" object
function f() {
    console.log(this); // object of type "global"
}
f();

function f2() {
    "use strict";
    console.log(this); // undefined
}
f2();


let o = {
    prop: 10,
    f: function() { return this.prop; } // f is a property of an object 
}
console.log( o.f() );   // f is invoked as a method, so "this" refers to o
let ff = o.f;
console.log( ff() );    // f is invoked as as an expression, so "this" refers to the 
                        // global object and this.prop is undefined because prop is 
                        // not a property of the global object



{
// "this" in the prototype chain refers to the object on which the
// method is invoked, not the object that actually contains the method
let o2 = Object.create(o);
o2.prop = 20;
console.log( o2.f() );

function printprop() {
    console.log(this.prop);
};

// When call is used, this refer to the object passed as the first argument
printprop.call( o );
}


{
// When using arrow functions, the this keyword is inherited from the environment 
// in which the arrow function is defined rather than when is invoked
// This feature is called "lexical this"

function Object1() {
    this.x = 5;
    this.getx = () => { return this.x } // here we use the arrow function
}
function Object2() {
    this.x = 7;
    this.getx = function()  { return this.x } // here we use the classic JS function definition
}

let o1 = new Object1();
let o2 = new Object2();

console.log( o1.getx() )
console.log( o2.getx() )

let o3 = {
    x: 100,
    getx: o1.getx
}
let o4 = {
    x: 100,
    getx: o2.getx
}

console.log( o3.getx() ) // Prints 5 because this in the arrow function refers to o1, not o3!
console.log( o4.getx() ) // Prints 100


}


// Variadic functions
// ================================
// JavaScript functions accept a variable number 
// of parameters even if not explicitly declared in the 
// function signature 

function fvar( a, b, c )
{
    console.log(`a = ${a}`);
    console.log(`b = ${b}`);
    console.log(`c = ${c}`);

    for( i=0; i<arguments.length; ++i ) {
        console.log(`arguments[${i}] = ${arguments[i]}`);
    }
}

// f invoked with fewer arguments as expected
fvar( 1, 2 )

// f invoked with more arguments as expected
fvar( 1, 2, 3, 4, 5, 6 )
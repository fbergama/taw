/************************************************
Example demonstrating the behaviour of the
this keyword 
************************************************/


// in browser, this refer to window object if invoked in global scope
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
    f: function() { return this.prop; } // function invoked as method
}
console.log( o.f() );


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



// When using arrow functions, the this keyword is inherited from the environment 
// in which the arrow function is defined rather than when is invoked
// This feature is called "lexical this"

function TestObject1() {
    this.x = 5;
    this.getx = () => { return this.x } // here we use the arrow function
}
function TestObject2() {
    this.x = 7;
    this.getx = function()  { return this.x } // here we use the classic JS function definition
}

let o3 = new TestObject1();
let oo = Object.create(o3);
let o4 = new TestObject2();

console.log( o3.getx() )
console.log( o4.getx() )

let o5 = {
    x: 100,
    getx: o3.getx
}
let o6 = {
    x: 100,
    getx: o4.getx
}

console.log( o5.getx() ) // Prints 5 because this in the arrow function refers to o3, not o5!
console.log( o6.getx() ) // Prints 100

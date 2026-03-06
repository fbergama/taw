/************************************************
Hoisting example
************************************************/

console.log(a); // throws a ReferenceError because a is not yet declared 
//let a = 10;

if (true) {
    console.log(`b=${b}`);  // b exists (undefined) even if it hasn't been declared yet
    var b=20;
    console.log(`b=${b}`);
}

console.log(a);



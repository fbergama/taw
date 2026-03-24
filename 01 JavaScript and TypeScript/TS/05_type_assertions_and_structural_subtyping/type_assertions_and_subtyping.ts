/************************************************
This example demonstrates how to use type
assertions and structural subtyping
************************************************/

interface A {
    bar: number;
    bas: string;
}

let a1 = {};
a1.bar = 123;     // wrong because the bar property do not exist in an empty object. Empty object and "A" are not compatible
a1.bas = 'hello';

let a2 = <A>a1; 
//let a2 = a1 as A; // you can also use this notation
a2.bar = 123;


// Type compatibility in TypeScript is based on structural subtyping:

interface AA {
    bar: number;
}
let a3: AA = a2;    // This assignment is allowed even if a2 and a3 have
                    // two different types. Indeed, the two types are compatible:
                    // "AA" has all the members of "A"
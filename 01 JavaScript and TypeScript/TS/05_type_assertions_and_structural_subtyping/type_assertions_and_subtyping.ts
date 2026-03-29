/************************************************
This example demonstrates how to use type
assertions and structural subtyping


Usually, in classic typed languages, the equivalence 
between two types is determined explicitly by their 
name or specific declarations.

TS uses the so-called structural subtyping:

A type X is compatible with another type Y 
    if Y has all the attributes of X

This allows a more flexible type checker that is 
closer to the JavaScript style.


************************************************/

interface A {
    bar: number;
    bas: string;
}

let a1 = {};
a1.bar = 123;     // wrong because the bar property do not exist in an empty object. 
                  // Empty object and "A" are not compatible
a1.bas = 'hello';


// Type assertion can be used to force a type definition
//
let a2 = <A>a1; 
//let a2 = a1 as A; // <- you can also use this notation
a2.bar = 123;


// Type compatibility in TypeScript is based on structural subtyping:

interface AA {
    bar: number;
}
let a3: AA = a2;    // This assignment is allowed even if a2 and a3 have
                    // two different types. Indeed, the two types are compatible:
                    // "AA" has all the members of "A"
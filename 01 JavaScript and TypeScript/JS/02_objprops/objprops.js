/************************************************
Example demonstrating how objects behave
when reading and writing properties
************************************************/

let unitcircle = {
    radius: 1
};

let c = Object.create( unitcircle );

for( let p in c ) {
    console.log(`c.${p} = ${c[p]}`)
}

c.x = 10;                  // properties added to c
c.y = 20;

console.log("---");
for( let p in c ) {
    console.log(`c.${p} = ${c[p]}`)
}

c.radius = 20;             // c overrides its inherited property

console.log("---");
for( let p in c ) {
    console.log(`c.${p} = ${c[p]}`)
}


// Delete a property
delete c.radius         // radius is deleted from c but not
                        // from its prototype!

for( let p in c ) {
    console.log(`c.${p} = ${c[p]}`)
}


// Spreading operator
let coloredcircle = { ...c, ...unitcircle, color:"red" }

for( let p in coloredcircle ) {
    console.log(`coloredcircle.${p} = ${coloredcircle[p]}`)
}



// Note about const:
// A const variable referencing to an object cannot
// be changed to point to some other object, but 
// the object properties can be modified (the reference
// remains unchanged)

let a = { x:10 }
console.log( a.x )
const b = a;
b.x = 20;
//b = 3;  // <- this triggers a type error
console.log( a.x )
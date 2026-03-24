/************************************************
A JS program is also a valid TS program

compile with:
$ npx tsc js_ts.ts

after installing the project dependencies with: 
$ npm install
************************************************/

let radius = 4; // TS infers that radius has type Number
let area = Math.PI * radius * radius;
area = "ciao";  // TS complains because 'string' is not assignable
                // to a variable of type 'number'
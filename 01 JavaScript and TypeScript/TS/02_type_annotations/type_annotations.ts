/************************************************
TS uses annotations to explicitly provide type
information to variables

compile with:
$ npx tsc type_annotations.ts

after installing the project dependencies with: 
$ npm install
************************************************/

let myname: string = 'Filippo';
let heightInCentimeters: number = 87.3;
let isActive: boolean = true;

// array type annotation
let names: string[] = ['James', 'Nick', 'Rebecca', 'Lily'];

// function annotation with parameter type annotation and return type annotation
let sayHello: (name: string) => string;

// implementation of sayHello function
sayHello = function (name: string) {
    return 'Hello ' + name;
};

sayHello = function() { // Invalid function implementation
    console.log("Hello"); 
} 

// object type annotation
let person: { name: string; heightInCentimeters: number; };

// Implementation of a person object
person = {
  name: "Mark",
  heightInCentimeters: 183,
};

let a: any;  // Special type "any" denotes a dynamic type
a = "test";
a = 3;

/************************************************
TS uses annotations to explicitly provide type
information to variables

Datatypes:

Name                        Values
----------------------------------------------------------------
boolean                     true / false
number                      All floating point numbers
string                      Strings
Array< base > or base[ ]    Every array in which elements are of a base type
any                         Type representing any value (useful when the 
                            type is unknown during transpilation)
void                        Type representing the absence of a value 
                            (like functions not returning any value)
Object                      Everything that is not a primitive type 
                            in JavaScript

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

/************************************************
TS supports classes in the following way:

- the class keyword is used to define a class;
- the constructor keyword is used to specify the class constructor;
- public, private, and protected are used to modify methods and attribute visibility;
- getters and setters can be used to implement class accessors.

More info:
https://www.typescriptlang.org/docs/handbook/2/classes.html#handbook-content

************************************************/


// Interface definition
interface Movable {
    move( distanceInMeters: number ) : void;
}

class Animal implements Movable { // implements is used to implement interfaces
    name: string;
    // class constructor
    constructor(_name: string) { this.name = _name; }

    // class method
    move(distanceInMeters: number = 0) {
        console.log(this.name + " moved " + distanceInMeters + "m.");
    }
}

class Snake extends Animal { // extends is used to define subclasses

    constructor(name: string) {
        super(name); // super _must_ be called in subclass constructor
    }

    move(distanceInMeters = 5) { // Method override
        console.log("Slithering...");
        super.move(distanceInMeters);
    }
}

let s: Snake = new Snake("Alex");
s.move(10);


// Class modifiers, parameter properties, getters setters

class Person {
    protected name: string;
    protected constructor(theName: string) { this.name = theName; }
}

// Employee can extend Person
class Employee extends Person {
    readonly office_number: number; // Readonly properties are public properties that 
                                    // can only be set in class constructor
    
    constructor(name: string, private department: string, _offnum: number = 10) { 
        // The private modifier in constructor parameters adds a new property
        // in the class with the specified access modifier (private in this case)
        super(name);

        //this.department = department;  <- class properties are assigned automatically if constructor parameters
        //                                  contain an access modifier like private or public

        this.office_number = _offnum;    // <- here instead we are setting the class property explicitly
    }

    public indroduce_myself() {
        console.log( "Hello, my name is " + this.name + " and I work at " + this.department );
    }

    // class accessors
    get employee_name() { return this.name; }
    set employee_name( newname: string ) { 
        this.name = newname[0].toLocaleUpperCase() + newname.substr(1).toLocaleLowerCase(); 
    }
}

let e : Employee = new Employee("Filippo Bergamasco", "DAIS");
e.indroduce_myself();

e.employee_name = "mario";
e.indroduce_myself();

/************************************************
This example demonstrates how to use interfaces
to describe the properties of objects and classes
************************************************/

interface Point {
    x: number;
    y: number; 
}

interface Passenger {
    name: string;
}

// Class interface
interface Vehicle {
    // Constructor
    new() : Vehicle;
    
    // Properties
    currentLocation: Point;

    // Methods
    travelTo(point: Point): void;
    addPassenger(passenger: Passenger): void;
    removePassenger(passenger: Passenger): void;
}

// NOTE: Interfaces do not result in any Javascript code generated.
// their only purpose is to provide type checking

// interfaces are open-ended and hence new methods/properties can
// be added after the initial definition

interface Passenger {
    age: number;
}

let passengers : Passenger[] = [];
passengers.push( {name: "Filippo", age: 39} );
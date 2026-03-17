/************************************************
Example demonstrating function hoisting and naming
************************************************/


{
    a(); // Prints "Hello" even if a has not been declared yet
    console.log(a.name) 

    function a()
    {
        console.log("Hello");
    }
}


{
    //a(); // ReferenceError 
    let a = function() { console.log("Hello"); } 
    let b = a;
    b();
    console.log(a.name)
    console.log(b.name)
}


// Arrow functions behave like function expressions
{
    //a(); // ReferenceError 
    let a = () => { console.log("Hello"); } 
}


// Functions passed as arguments to other functions 
// can be purely anonymous:

function say_hello( sayname )
{
    console.log("Hello ");
    sayname();

    console.log(`sayname.name="${sayname.name}"`);
}

say_hello( ()=>{console.log("Filippo")} );  // <- this function has no name
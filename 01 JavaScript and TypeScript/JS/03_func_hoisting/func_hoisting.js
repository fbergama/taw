/************************************************
Example demonstrating function hoisting
************************************************/


{
    a(); // Prints "Hello" even if a has not been declared yet

    function a()
    {
        console.log("Hello");
    }
}

{
    a(); // ReferenceError 
    let a = function() { console.log("Hello"); } 
}

// Arrow functions behave like function expressions
{
    a(); // ReferenceError 
    let a = () => { console.log("Hello"); } 
}
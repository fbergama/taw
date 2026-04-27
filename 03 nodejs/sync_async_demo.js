/**
 * Syncronous/Asynchronous function call in node.js
 * 
 * This example shows the *single-threaded* nature of node.js, which leverage
 * ansynchronous functions to avoid blocking on long or computationally expensive
 * operations.
 * 
 * We use the built-in crypto library to generate a secure hash.  This is a
 * potentially long operation (especially with a high number if iterations) for
 * which a sync and async variants are provided.
 * 
 * What happens in the two cases?
 * 
 */

const ITERATIONS = 30000000;    // <- This controls for how expensive the operation will be
const use_sync = false;         // <- This selects sync or async variants


const crypto = require('crypto');   // Load the crypto built-in library


// A helper function to format timestamps for our console logs
const time = () => new Date().toISOString().split('T')[1].slice(0, 8);


console.log("[${time()}] Sync/Async code execution demo");


/**
 *  Invoke a lightweight function every second for 10 times.
 * 
 *  this will be useful to monitor if the JS interpreter
 *  get stuck while waiting for a blocking function
 */
const timer_id = setInterval( (function() {
    let count = 10;
    return function() {
        count--;
        console.log(`[${time()}] timer event fired. Remaining executions: ${count}`);
        if( count==0 )
            clearInterval( timer_id );
    }
})(), 1000);



// Invoke out crypto function after 4 sec
//
setTimeout( ()=>{ 

    // As an example of a long, expensive operation, we use Password-Based Key Derivation Function 2 (PBKDF2) 

    if( use_sync )
    {
        // Sync (blocking) version
        console.log(`[${time()}] Invoking pbkdf (sync version)...`);
        const key = crypto.pbkdf2Sync('password123', 'salt', ITERATIONS, 64, 'sha512');
        console.log(`[${time()}] pbkdf finished! Generated key: ${key.toString("base64")}`);
    }
    else
    {
        // Async (non-blocking) version
        console.log(`[${time()}] Invoking pbkdf (async version)...`);
        crypto.pbkdf2('password123', 'salt', ITERATIONS, 64, 'sha512', (err, key) => {
            // this callback function is invoked when pbkdf terminates
            // and the result value (key) is finally available
            console.log(`[${time()}] pbkdf finished! Generated key: ${key.toString("base64")}`);
        });
    }

}, 4000 );


console.log(`[${time()}] script executed till the end`);

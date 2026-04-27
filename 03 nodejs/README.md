 # Syncronous/Asynchronous function call in node.js
 
 This example shows the *single-threaded* nature of node.js, while leveraging
 ansynchronous functions to avoid blocking on long or computationally expensive
 operations.
 Specifically, we use the built-in crypto library to generate a secure hash.
 This is a potentially long operation (especially with a high number if
 iterations) for which a sync and async variants are provided.
 
 What happens in the two cases?

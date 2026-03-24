/************************************************
 This program shows functions' optional and default
 parameters 
************************************************/

function repeat_string(str: string, n: number ): string {
    let outstr: string = "";
    while( n-->0 ) {
        outstr = str + " " + outstr;
    }
    return outstr;
}
console.log( repeat_string("Hello", 3) );


function repeat_string2(str: string, n: number, sepstr?: string ): string {  // sepstr parameter is optional
    let outstr: string = "";
    sepstr = sepstr || "";
    while( n-->0 ) {
        outstr = str + sepstr + outstr;
    }
    return outstr;
}
console.log( repeat_string2("Hello",3,'-') );


function repeat_string3(str: string, n: number, sepstr= "_" ): string {  // sepstr has a default value whose type 
                                                                         // is automatically inferred 
    let outstr: string = "";
    sepstr = sepstr || "";
    while( n-->0 ) {
        outstr = str + sepstr + outstr;
    }
    return outstr;
}
console.log( repeat_string3("Hello",4) );
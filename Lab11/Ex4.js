    /* 
    This function returns true if string_to_check is a non-negative integer. If returnErrors=true, it will return the array of reasons it is not a non-negative integer
    */
   function isNonNegInt(val, returnErrors=false) {

    errors = []; // assume no errors at first
    if(Number(val) != val) errors.push('Not a number!'); // Check if string is a number value
    if(val < 0) errors.push('Negative value!'); // Check if it is non-negative
    if(parseInt(val) != val) errors.push('Not an integer!'); // Check that it is an integer
    return returnErrors ? errors : (errors.length > 0)?false:true;
}

attributes = "Kimberly;20;20.5;" + (0.5 - 20)
pieces = attributes.split(";");

function callback(i, part) {
    console.log(`${i} is non neg int 
    ${isNonNegIntString(part, true).join("***")}`);
}
pieces.forEach(function(item,i,)
    {console.log((typeof item == 'string' && item. length > 0)?true:false)});



attributes = "Kimberly;20;20.5;" + (0.5 - 20)
pieces = attributes.split(";");

function callback(i, part) {
    console.log(`${part} is non neg int 
    ${isNonNegIntString(part, true).join("***")}`);
}
pieces.forEach(function(item,i)
    console.log(`${part} is non neg int 
    ${isNonNegIntString(pieces[i], true).join("***")}`);

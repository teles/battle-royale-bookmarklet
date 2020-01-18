const bookmarkleter = require( "bookmarkleter" );
const br = require("./src/br");
const bookmarklet = bookmarkleter( br, {urlencode: true, iife: true, minify: true, transpile: true} );
console.log(bookmarklet);
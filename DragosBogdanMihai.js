"use strict";

const testlib = require( './testlib.js' );
let allPatterns;			//all patterns
var sequence = []; 			//the "semaphore" array 
let check=0; 				//helps with only having a sequence array of a maximum size of the biggest pattern size
let count=0;				//count how many items in a line and keep track where every match was found
var occurences = []; 		//array holding the number of occurences of the patterns 
let position=0;             //the position of each pattern in the array of patterns 
let max=0;                  //the maximum length of the array that is holding the data (semaphore array)
let posibleElements = [];   //all the variation posibility of a pattern 
let elementBrakeDown = [];  //an array that is holding the char of a string individually 
let resetSeq =0;  			//the line number 

const characters ={
	"R": ["G" , "A"],
	"Y": ["T" , "C"], 
	"K": ["G" , "T"], 
	"M": ["A" , "C"], 
	"S": ["G" , "C"], 
	"W": ["A" , "T"], 
	"B": ["G" , "T" , "C"], 
	"D": ["G" , "A" , "T"], 
	"H": ["A" , "C" , "T"], 
	"V": ["G" , "C" , "A"], 
	"N": ["A" , "G" , "C" , "T"]
};

testlib.on( 'ready', function( patterns ) {
	allPatterns = patterns;
	console.log( "Patterns:", patterns );

	testlib.runTests();
	allPatterns.forEach(element=>{
		if(element.length>max){
			max = element.length;
		}
		occurences.push(0);
	});
} );

testlib.on( 'data', function( data ){
	sequence.push(data);
	checkOccurences();
});
testlib.on('reset', resetOccurences);
testlib.on('end', resetOccurences);	
testlib.setup( 4 ); // Runs test 1 (task1.data and task1.seq)


//check the occurences of the patterns in the sequence 
function checkOccurences(){
	if(sequence[max-1] != null){
		console.log(sequence );
		position = 0;
		allPatterns.forEach(element => {
			if(element == firstN(sequence,element.length) ){
				testlib.foundMatch(element, count);
				occurences[position]++; 
			}
			else{
				posibleElements = [];
				posibilities(element);
				completePosibilities(posibleElements);
				completePosibilities(posibleElements);
				posibleElements.forEach(pos =>{
					if(pos == firstN(sequence,element.length) ){
						testlib.foundMatch(element, count);
						occurences[position]++; 
					}
				});
			}
			position++;
		});
	}
	if(check==max-1){
		sequence.shift();
		check=max-2;
		count++;
	}
	check++;
}

//find some posible variations of the pattern 
let elementPosition;
function posibilities(item){
	progress(item);
	regress(item);
}
//it will call replaceElement and it will replace the elements that can be replaced from the right to the left 
function regress(item){
	breakElement(item);
	elementPosition= elementBrakeDown.length-1;
	elementBrakeDown.forEach(b=> {
		replaceElement(b,elementPosition);
		elementPosition--;
	});
}

//it call replaceElements begining from left to the right
function progress(item){
	breakElement(item);
	elementPosition=0;
	elementBrakeDown.forEach(e => {
		replaceElement(e,elementPosition);
		elementPosition++;
	});
}
//because posibilities only finds some elements it need to be called again for every posible combinations that it found initially
//by calling this function all posibilities will be find  
function completePosibilities(arrayPos){
	arrayPos.forEach(element =>{
		posibilities(element);
	});
}

//replace an element form an array of char with the posible combination of itself (R with G/A, Y with C/T...)
//convert the replaced array of char into a string and add it to the array that is holding every posible combination: "posibleElements"
let zxc;
let temparray = [];
let stringC;
function replaceElement(e,p){
	zxc = elementBrakeDown;
	temparray=[];
	Object.keys(characters).forEach(k=>{
		if(k==e){
			temparray=characters[k];
			if(posibleElements.includes(stringC)==false){
				stringC = zxc.toString();
				stringC = stringC.replace(new RegExp(",","g"),"");
				posibleElements.push(stringC);
			}
			temparray.forEach(v=>{
				zxc[p] = v;
				stringC = zxc.toString();
				stringC = stringC.replace(new RegExp(",","g"),"");
				if(posibleElements.includes(stringC)==false){
					posibleElements.push(stringC);
				}
			});
		}
	});
}

//break a string into individual characters and add every char into an array "elementBrakeDown"
let index=0;
function breakElement(element){
	if(index == 0){
		elementBrakeDown = [];
	}
	if(element.length > index){
		elementBrakeDown.push(element.slice(index,index+1));
		index++;
		return breakElement(element);
	}
	else{
	 	index=0;
	}
}

//take the first N elements from an array, convert them to string and return the string
function firstN(array,nr){
	let temp = array.slice(0, nr);
	temp = temp.toString();
	temp = temp.replace(new RegExp("," , "g"),"");
	return temp;
}


//This function will be called at the end of each line, it will fill the buffer array with X and shift it length-times 
//it will print all the patterns and how many times it was found
//reset the buffer array to 0 elements 
//reset the occurences number for each pattern
let tempbuffer = [];
function resetOccurences(){
	let int=0;
	tempbuffer = sequence;
	tempbuffer.forEach(b=>{
		sequence.push("X");
		checkOccurences();
	});
	console.log("......................................................................");
	occurences.forEach(element => {
	 	console.log(allPatterns[int] , element);
		element=0;
		int++;
	});
	console.log(".....................................................................");
	let res=0;
	occurences.forEach(element=> {
		occurences[res] = 0;
		res++;
	});
	sequence = [];
	check=0;
	resetSeq++;
	count=0;
}

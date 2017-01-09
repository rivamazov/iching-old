// probabilities of 1/16, 5/16, 7/16, and 3/16
let arr = [6, 7, 7, 7, 7, 7, 8, 8, 8, 8, 8, 8, 8, 9, 9, 9];
let hexagram = 0;

// Maps hexagram to James Dekorne's I Ching Pagee
function returnURL(hexagramNum) {
	prefixUrl = "http://www.jamesdekorne.com/GBCh/hex";
	postUrl = ".htm";
	hexagramNum.toString();
	return prefixUrl + hexagramNum + postUrl
}

// Returns integer corresponding to a hexagram line
function getLine() {
	shuffle(arr);
	return arr[0];
}

// Runs getLine() 6 times and passes array to linesToHexagram()
function getHexagram() {
	let lines = [];
	let i = 0;
	while (i < 6) {
		lines.push(getLine());
		i++;
	}
	return linesToHexagram(lines);
}

// Takes an array of line nums and gives resulting hexagram
// If there are changing lines, returns changes separated by .
// ie 54.3.6 -> 
function linesToHexagram(arr) {
	const primary = getPrimary(arr);
	// if the arrays are equal then no changing lines and return hexagram no.
	// uses arrow functions because comparing arrays in javascript
	if (arr.length==primary.length && arr.every((v,i)=> v === primary[i])) {
		return hexagramLookup(arr);
	}
	else {
		const secondary = getSecondary(arr);
		const p = hexagramLookup(primary);
		const s = hexagramLookup(secondary);
		const c = changingLines(arr);
		hexagram = p;
		return (p + c + ' --> ' + s);
	}
}

function changingLines(arr) {
	let changing = '';
	changing+=arr.map(function(x, i) {
		if (x == 6 || x == 9) return (i+1).toString();
	})
	//map seems to add commas for each iteration somehow
	changing = '.' + changing.replace(/,/g,'').split('').join('.');
	return changing;
}

//returns hexagram number from list of hexagrams
function hexagramLookup(arr) {
	const hexstr = arrayToString(arr);
	for (let i in Hexagrams) {
		if (Hexagrams[i] == hexstr) {
			return i;
		}
	}
}

// TODO -- create one function that returns both primary and secondary
// HINT -- reverses the added/sub values
// Takes a hexagram as an int array and returns primary hexagram
function getPrimary(arr) {
	return arr.map(function(x) {
  	if (x == 6) return x+=2;
    if (x == 9) return x-=2;
    return x;
   	});
}

// Takes a hexagram as an int array and returns secondary hexagram
function getSecondary(arr) {
	return arr.map(function(x) {
  	if (x == 6) return x+=1;
    if (x == 9) return x-=1;
    return x;
   	});
}

// Takes an integer between 6-9 and returns ascii i ching line
function lineToAscii(line) {
	switch(line) {
		case 8: return '=== ===';
		case 7: return '=======';
		case 9: return '===&theta;===';
		case 6: return '===x===';
	}
}

//convert array to string and remove commas
function arrayToString(arr) {
	return arr.toString().replace(/,/g,'') 
}

function shuffle(arr) {
	let count = arr.length;
	while (count > 0) {
		let i = Math.floor(Math.random() * count);
		count--;
		let tmp = arr[count];
		arr[count] = arr[i];
		arr[i] = tmp;
	}
}

const Hexagrams = {
	1: '777777', 
	2: '888888',
	3: '788878',
	4: '878887',  
	5: '777878',
	6: '878777', 
	7: '878888',
	8: '888878',
	9: '777877', 
	10: '778777', 
	11: '777888', 
	12: '888777',
	13: '787777',
	14:	'777787',
	15:	'887888',
	16:	'888788',
	17:	'788778',
	18:	'877887',
	19:	'778888',
	20:	'888877',
	21:	'788787',
	22:	'787887',
	23:	'888887',
	24:	'788888',
	25:	'788777',
	26:	'777887',
	27:	'788887',
	28:	'877778',
	29:	'878878',
	30:	'787787',
	31:	'887778',
	32:	'877788',
	33:	'887777',
	34:	'777788',
	35:	'888787',
	36:	'787888',
	37:	'787877',
	38:	'778787',
	39:	'887878',
	40:	'878788',
	41:	'778887',
	42:	'788877',
	43:	'777778',
	44:	'877777',
	45:	'888778',
	46:	'877888',
	47:	'878778',
	48:	'877878',
	49:	'787778',
	50:	'877787',
	51:	'788788',
	52:	'887887',
	53:	'887877',
	54:	'778788',
	55:	'787788',
	56:	'887787',
	57:	'877877',
	58:	'778778',
	59:	'878877',
	60:	'778878',
	61:	'778877',
	62:	'887788',
	63:	'787878',
	64:	'878787',
};

console.log(linesToHexagram([7,7,8,8,8,7]));



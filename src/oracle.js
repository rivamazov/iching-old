// probabilities of 1/16, 5/16, 7/16, and 3/16
Vue.component('hex-line', {
	props: ['hex'],
	template: '<p> {{ hex.line }} </p>'

})
var app = new Vue({
  el: '#app',

  data: {
  	message: "hello",
  	arr: [6, 7, 7, 7, 7, 7, 8, 8, 8, 8, 8, 8, 8, 9, 9, 9],
		line: 0,
		lines: [],
		numLines: 0,
		hexagram: 0,
		hexagram2: 0,
		dekornURL: '',
		dekornURL2: '',
		helpVisible: false,
		helpText: 'Your hexagram is The first number, if there are dots they signify changing lines and the resulting secondary hexagram i.e. 17.4.6 --> 42 means hexagram 17 with changing lines 4 and 6 alternating to hexagram 42.',
		complete: false
  },

  methods: {
  	toggleHelp: function() {
  		this.helpVisible = !this.helpVisible;
  	},
  	castLine: function() {
  		shuffle(this.arr);
  		this.numLines = this.line = this.arr[0];
  		this.lines.unshift(this.line);
  		if (this.lines.length === 6) {
  			this.complete = true;
  			this.hexagram = hexagramLookup(this.lines)
  			return;
  		}

  	},
  	lineToAscii(line) {
  		switch(line) {
				case 8: return "=== ==="
				case 7: return "======="
				case 9: return "===o==="
				case 6: return "===x==="
			}
  	},
  	decodeHtml: function (html) {
  		var txt = document.createElement("textarea");
  		txt.innerHTML = html;
  		return txt.value
  	},
  	reset: function() {
  			this.line = 0
				this.numLines = 0
				this.hexagram = 0
				this.hexagram2 = 0
				this.lines = []
				this.helpVisible = false
				this.complete = false
  	},
  	hexagramLookup(arr) {
			const hexstr = arrayToString(arr);
			for (let i in Hexagrams) {
				if (Hexagrams[i] == hexstr) return Hexagrams[i];
			}
		}
  }
})

function castOracle() {
	$('#cast').on('click', function() {
   		//if get 6 lines then calculate hexagram and possible second
  		if (app.numlines < 6) {
        $('<code>'+getLine()+'</code>').appendTo('#lines');
  			$('<br /><div>'+lineToAscii(app.line)+'</div>').prependTo('#hexagram');
  			if (app.numlines === 6) {
          $('<div>'+linesToHexagram(app.lines)+'</div>').appendTo('#result');
          setURL();
          $("<br /><button class='btn' id='websearch'>"+hexagram+"</button>").appendTo('#result');
          $('#websearch').on('click', function() {
            window.open(dekornURL);
          });
          if (hexagram2 > 0) {
            $("<button class='btn' id='websearch2'>"+hexagram2+"</button>").appendTo('#result');
            $('#websearch2').on('click', function() {
              console.log(dekornURL2);
              window.open(dekornURL2);
            });
          }
        }
		}
  	});
};

function refresh() {
	$('#refresh').on('click', function() {
  		$('#lines').empty();
  		$('#hexagram').empty();
  		$('#result').empty();
  		eraseHexagram();
  	});
}

// Maps hexagram to James Dekorne's I Ching Pagee
function setURL() {
	const prefixUrl = "http://www.jamesdekorne.com/GBCh/hex";
	const postUrl = ".htm";
	let hexstr = hexagram.toString();
	dekornURL = prefixUrl + hexstr + postUrl;
	if (parseInt(hexagram2) > 0) {
		dekornURL2 = prefixUrl + hexagram2 + postUrl;
	}
}

// Returns integer corresponding to a hexagram line
// And changes array
function getLine() {
	shuffle(arr);
	line = arr[0];
	lines.push(line);
	numlines++;
	return line;
}

function eraseHexagram() {
	line = 0;
	numlines = 0;
	hexagram = 0;
	hexagram2 = 0;
	lines = [];
}

// Takes an array of line nums and gives resulting hexagram
// If there are changing lines, returns changes separated by .
// ie 54.3.6 -> 
function linesToHexagram(arr) {
	const primary = getPrimary(arr);
	// if the arrays are equal then no changing lines and return hexagram no.
	// uses arrow functions because comparing arrays in javascript
	const p = hexagramLookup(primary);
	hexagram = p;
	if (arr.length==primary.length && arr.every((v,i)=> v === primary[i])) {
		return p;
	}
	else {
		const secondary = getSecondary(arr);
		const s = hexagramLookup(secondary);
		const c = changingLines(arr);
		hexagram2 = s;
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

function run() {
	castOracle();
    refresh();
    help();
}

Oracle = {run: run}

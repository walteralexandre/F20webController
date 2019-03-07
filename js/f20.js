// Variáveis globais
var DebugMode = true;
var MidiAccess;											// Objeto do web midi
var MidiInput;											// Dispositivo de entrada
var MidiOutput;											// Dispositivo de saída
var OnMidiMessageDefaultFunction = OnMidiMessage;		// Função default para recebimento de mensagens midi

//===================================================================================================
//  WEB MIDI
//===================================================================================================
function StartWebMidi() {
	// inicia web midi
	navigator.requestMIDIAccess({sysex:true}).then(OnMidiSuccess, OnMidiFailure);
}
// Inicia execução do midi Controller.
function OnMidiSuccess(midiAccess){
	MidiAccess = midiAccess;
	
	if (DebugMode)
		console.log("Web Midi Started.");
	
	DeviceList();
}
// Caso o Web Midi não tenha sido inicializado com sucesso.
function OnMidiFailure(msg){
	console.log("Error: Web Midi not supported on this browser.");
	console.log(msg);
}
// Executa quando chegar alguma mensagem midi
function OnMidiMessage(midimsg) {
	//if (midimsg.data[0] == 248) return;		// não exibe mensagens de sincronização/timing
	
	if(DebugMode)
		console.log(midimsg.data);
}
// Lista dos dispositivos midi disponíveis
function DeviceList(obj) {
	var input, output;
	
	if (DebugMode)
		console.log("Device List:");
	
	for (var entry of MidiAccess.inputs) {
		input = entry[1];

		if(DebugMode)
			console.log( "Input port [type:'" + input.type + "'] id:'" + input.id +
			"' manufacturer:'" + input.manufacturer + "' name:'" + input.name +
			"' version:'" + input.version + "'" );
		
		if (input.name.match("Roland Digital Piano") != null) {
			MidiInput = input;
			MidiInput.onmidimessage = OnMidiMessage;
		}
	}

	for (var entry of MidiAccess.outputs) {
		output = entry[1];

		if (DebugMode)
			console.log( "Output port [type:'" + output.type + "'] id:'" + output.id +
			"' manufacturer:'" + output.manufacturer + "' name:'" + output.name +
			"' version:'" + output.version + "'" );

		if (output.name.match("Roland Digital Piano") != null)
			MidiOutput = output;
	}
	
	if (MidiOutput)
		MidiOutput.open();
	if (MidiInput)
		MidiInput.open();
}

//===================================================================================================
//  FUNÇÕES DO ROLAND F-20
//===================================================================================================
// Ao clicar em um botão de modelo temperamento, o formulário de temperamento customizado é preenchido com os valores
//	adequados ao modelo escolhido
function setTemperament(temper) {
	var scale = [];
	switch(temper) {
		case 'eq':	scale=[  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0];	break;	// equal
		case 'ar':	scale=[ -6, 45, -2,-12,-51, -8, 43, -4, 47,  0,-10,-49];	break;	// arabian from manual of roland f20 (midi implemantation)
		case 'jc':	scale=[  0, -8,  4, 16,-14, -2,-10,  2, 14,-16, 14,-12];	break;	// just in C from manual of roland f20 (midi implementation)
		case 'jcs':	scale=[-12,  0, -8,  4, 16,-14, -2,-10,  2, 14,-16, 14];	break;  // just in C#
		case 'jd':	scale=[ 14,-12,  0, -8,  4, 16,-14, -2,-10,  2, 14,-16];	break;  // ...
		case 'jds':	scale=[-16, 14,-12,  0, -8,  4, 16,-14, -2,-10,  2, 14];	break;
		case 'je':	scale=[ 14,-16, 14,-12,  0, -8,  4, 16,-14, -2,-10,  2];	break;
		case 'jf':	scale=[  2, 14,-16, 14,-12,  0, -8,  4, 16,-14, -2,-10];	break;
		case 'jfs':	scale=[-10,  2, 14,-16, 14,-12,  0, -8,  4, 16,-14, -2];	break;
		case 'jg':	scale=[ -2,-10,  2, 14,-16, 14,-12,  0, -8,  4, 16,-14];	break;
		case 'jgs':	scale=[-14, -2,-10,  2, 14,-16, 14,-12,  0, -8,  4, 16];	break;
		case 'ja':	scale=[ 16,-14, -2,-10,  2, 14,-16, 14,-12,  0, -8,  4];	break;
		case 'jas':	scale=[  4, 16,-14, -2,-10,  2, 14,-16, 14,-12,  0, -8];	break;
		case 'jb':	scale=[ -8,  4, 16,-14, -2,-10,  2, 14,-16, 14,-12,  0];	break;
		case 'mt':  scale=[ -9,  4, -3, -8,  3,-12, 10, -6, -2,  0,-14,  7];	break;	// meantone from http://pages.mtu.edu/~suits/etvsmean.html
		case 'mth': scale=[  7, -9,	 2,	14,	-2,	 9,	-7,	 5,-12,	 0,	12,	-5];	break;  // meantone homoneous from http://www.instrument-tuner.com/temperaments.html
		case 'py':  scale=[ -6,	 8,	-2,-12,	 2,	-8,	 6,	-4,	10,	 0,-10,	 4];	break;	// pythagorian from http://www.instrument-tuner.com/temperaments.html
		case 'pyp': scale=[ 16,	 8,	20,	12,	 2,	14,	 6,	18,	10,	 0,	12,	 4];	break;  // pythagorian perfect from http://www.instrument-tuner.com/temperaments.html
		case 'nh':  scale=[ 16,	27,	20,	31,	 2,	14,	 6,	18,	29,	 0,	33,	 4];	break; 	// naturally harmoniours from from http://www.instrument-tuner.com/temperaments.html
		case 'nh3': scale=[ 16,	27,	20,	31,	 2,	14,	 6,	18,	29,	 0,	12,	 4];	break;  // naturally harmoniours (thirds) from from http://www.instrument-tuner.com/temperaments.html
	}
	
	document.getElementById("customTemperamentC").value  = scale[0];	
	document.getElementById("customTemperamentCs").value = scale[1];	
	document.getElementById("customTemperamentD").value  = scale[2];	
	document.getElementById("customTemperamentDs").value = scale[3];	
	document.getElementById("customTemperamentE").value  = scale[4];	
	document.getElementById("customTemperamentF").value  = scale[5];	
	document.getElementById("customTemperamentFs").value = scale[6];	
	document.getElementById("customTemperamentG").value  = scale[7];	
	document.getElementById("customTemperamentGs").value = scale[8];	
	document.getElementById("customTemperamentA").value  = scale[9];	
	document.getElementById("customTemperamentAs").value = scale[10];	
	document.getElementById("customTemperamentB").value  = scale[11];
	
	applyTemperament();
}	
function applyTemperament() {
	var temper  = [];
	var channel = 0;
	
	temper[0]  = 0x40 + parseInt(document.getElementById('customTemperamentC').value);
	temper[1]  = 0x40 + parseInt(document.getElementById('customTemperamentCs').value);
	temper[2]  = 0x40 + parseInt(document.getElementById('customTemperamentD').value);
	temper[3]  = 0x40 + parseInt(document.getElementById('customTemperamentDs').value);
	temper[4]  = 0x40 + parseInt(document.getElementById('customTemperamentE').value);
	temper[5]  = 0x40 + parseInt(document.getElementById('customTemperamentF').value);
	temper[6]  = 0x40 + parseInt(document.getElementById('customTemperamentFs').value);
	temper[7]  = 0x40 + parseInt(document.getElementById('customTemperamentG').value);
	temper[8]  = 0x40 + parseInt(document.getElementById('customTemperamentGs').value);
	temper[9]  = 0x40 + parseInt(document.getElementById('customTemperamentA').value);
	temper[10] = 0x40 + parseInt(document.getElementById('customTemperamentAs').value);
	temper[11] = 0x40 + parseInt(document.getElementById('customTemperamentB').value);
	
	channel = parseInt(document.getElementById('customTemperamentChannel').value) - 1;

	setParameter('scaleTuning', temper, channel);
}

// Seleciona um tone (som de instrumento)
// Funciona apenas para midi (não afeta o som gerado quando se toca as teclas).
function toneSelect(toneNumber) {
	var bankSelectMSB;
	var bankSelectLSB;
	var programChange;
	
	var channel = parseInt(document.getElementById('toneSelectChannel').value)-1;
	
	
	switch(toneNumber) {
		case 101:	bankSelectMSB = 0;	bankSelectLSB = 68;	programChange = 0;	break;
		case 102:	bankSelectMSB = 16;	bankSelectLSB = 67;	programChange = 0;	break;
		case 103:	bankSelectMSB = 8;	bankSelectLSB = 66;	programChange = 1;	break;
		case 104:	bankSelectMSB = 0;	bankSelectLSB = 64;	programChange = 3;	break;
		case 105:	bankSelectMSB = 0;	bankSelectLSB = 66;	programChange = 6;	break;
		case 106:	bankSelectMSB = 8;	bankSelectLSB = 66;	programChange = 6;	break;
		
		case 201:	bankSelectMSB = 16;	bankSelectLSB = 67;	programChange = 4;	break;
		case 202:	bankSelectMSB = 0;	bankSelectLSB = 70;	programChange = 5;	break;
		case 203:	bankSelectMSB = 24;	bankSelectLSB = 65;	programChange = 4;	break;
		case 204:	bankSelectMSB = 0;	bankSelectLSB = 67;	programChange = 7;	break;
		case 205:	bankSelectMSB = 0;	bankSelectLSB = 0;	programChange = 11;	break;
		case 206:	bankSelectMSB = 0;	bankSelectLSB = 0;	programChange = 8;	break;
		case 207:	bankSelectMSB = 0;	bankSelectLSB = 68;	programChange = 98;	break;
		
		case 301:	bankSelectMSB = 0;	bankSelectLSB = 71;	programChange = 49;	break;
		case 302:	bankSelectMSB = 0;	bankSelectLSB = 64;	programChange = 48;	break;
		case 303:	bankSelectMSB = 0;	bankSelectLSB = 68;	programChange = 46;	break;
		case 304:	bankSelectMSB = 0;	bankSelectLSB = 70;	programChange = 18;	break;
		case 305:	bankSelectMSB = 0;	bankSelectLSB = 69;	programChange = 18;	break;
		case 306:	bankSelectMSB = 0;	bankSelectLSB = 66;	programChange = 19;	break;
		case 307:	bankSelectMSB = 8;	bankSelectLSB = 69;	programChange = 19;	break;
		case 308:	bankSelectMSB = 0;	bankSelectLSB = 68;	programChange = 21;	break;
		case 309:	bankSelectMSB = 8;	bankSelectLSB = 64;	programChange = 52;	break;
		case 310:	bankSelectMSB = 0;	bankSelectLSB = 65;	programChange = 54;	break;
		case 311:	bankSelectMSB = 8;	bankSelectLSB = 66;	programChange = 52;	break;
		case 312:	bankSelectMSB = 8;	bankSelectLSB = 68;	programChange = 52;	break;
		case 313:	bankSelectMSB = 0;	bankSelectLSB = 64;	programChange = 89;	break;
		case 314:	bankSelectMSB = 0;	bankSelectLSB = 0;	programChange = 24;	break;
		case 315:	bankSelectMSB = 0;	bankSelectLSB = 0;	programChange = 25;	break;
		case 316:	bankSelectMSB = 1;	bankSelectLSB = 65;	programChange = 49;	break;
		case 317:	bankSelectMSB = 1;	bankSelectLSB = 64;	programChange = 52;	break;
		case 318:	bankSelectMSB = 1;	bankSelectLSB = 66;	programChange = 89;	break;
		case 319:	bankSelectMSB = 0;	bankSelectLSB = 0;	programChange = 32;	break;
		case 320:	bankSelectMSB = 0;	bankSelectLSB = 66;	programChange = 32;	break;
		case 321:	bankSelectMSB = 0;	bankSelectLSB = 0;	programChange = 33;	break;
		case 322:	bankSelectMSB = 0;	bankSelectLSB = 66;	programChange = 53;	break;
	}
	
	MidiOutput.send([0xb0+channel, 0x00, bankSelectMSB]);	 for (var j=0; j<200000000;j++){}	// pause
	MidiOutput.send([0xb0+channel, 0x20, bankSelectLSB]);	 for (var j=0; j<200000000;j++){}	// pause
	MidiOutput.send([0xc0+channel, programChange]);
		
	if (DebugMode) {
		console.log("Tone Select:");
		console.log([0xb0+channel,0x00,bankSelectMSB]);	
		console.log([0xb0+channel,0x20,bankSelectLSB]);	
		console.log([0xc0+channel,programChange]);	
	}
}

// usado apenas para testes de som
function CMajorScale() {
	var notes = [72,74,76,77,79,81,83,84,83,81,79,77,76,74,72];
	var velo  = 70;
	var bytes;
	
	for (var i=0; i<notes.length; i++) {
		bytes = [144, notes[i], velo];
		MidiOutput.send(bytes);
		
		for (var j=0; j<200000000;j++){}	// delay
		
		bytes = [144, notes[i], 0];
		MidiOutput.send(bytes);
	}
}
function GFCchords() {
var notes = [62,67,71,74, 60,65,69,72, 60,64,67,72];
var velo  = 70;

MidiOutput.send([144, notes[0], velo]);
MidiOutput.send([144, notes[1], velo]);
MidiOutput.send([144, notes[2], velo]);
MidiOutput.send([144, notes[3], velo]);
for (var j=0; j<1000000000;j++){}	// delay
MidiOutput.send([144, notes[0], 0]);
MidiOutput.send([144, notes[1], 0]);
MidiOutput.send([144, notes[2], 0]);
MidiOutput.send([144, notes[3], 0]);

MidiOutput.send([144, notes[4], velo]);
MidiOutput.send([144, notes[5], velo]);
MidiOutput.send([144, notes[6], velo]);
MidiOutput.send([144, notes[7], velo]);
for (var j=0; j<1000000000;j++){}	// delay
MidiOutput.send([144, notes[4], 0]);
MidiOutput.send([144, notes[5], 0]);
MidiOutput.send([144, notes[6], 0]);
MidiOutput.send([144, notes[7], 0]);

MidiOutput.send([144, notes[8], velo]);
MidiOutput.send([144, notes[9], velo]);
MidiOutput.send([144, notes[10], velo]);
MidiOutput.send([144, notes[11], velo]);
for (var j=0; j<1000000000;j++){}	// delay
MidiOutput.send([144, notes[8], 0]);
MidiOutput.send([144, notes[9], 0]);
MidiOutput.send([144, notes[10], 0]);
MidiOutput.send([144, notes[11], 0]);
}

function setParameter(name, value, channel=0) {
	var sysex = [0xF0,0x41,0x10,0x42,0x12];				// system exclusive DT1
	var bytes;
	
	name = name.toLowerCase();
	
	if (typeof value === 'string')
		value = parseInt(value);
	
	switch(name) {
		case 'mastertune':						bytes = [0x40,0x00,0x00].concat(value); 		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'mastervolume':					bytes = [0x40,0x00,0x04,  value]; 				bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'masterkeyshift':					bytes = [0x40,0x00,0x05,  value]; 				bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'masterpan':						bytes = [0x40,0x00,0x06,  value]; 				bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'modeset':							bytes = [0x40,0x00,0x7f,  value]; 				bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		
		case 'gm1systemon':						bytes = [0xf0,0x7e,0x7f,0x09,0x01,0xf7];												break;
		case 'gm2systemon':						bytes = [0xf0,0x7e,0x7f,0x09,0x03,0xf7];                            					break;
		case 'gsreset':							bytes = [0xf0,0x41,0x10,0x42,0x12,0x40,0x00,0x7f,0x00,0x41,0xf7];   					break;
		case 'identityreply':					bytes = [0xf0,0x7e,0x10,0x06,0x02,0x41,0x42,0x00,0x00,0x1d,0x01,0x01,0x00,0x00,0xf7];	break;
		
		//------------------------------------------------------------------------
		// REVERB
		//------------------------------------------------------------------------
		case 'reverbmacro':						bytes = [0x40,0x01,0x30,  value];				bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'reverbcharacter':					bytes = [0x40,0x01,0x31,  value];				bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'reverbprelpf':					bytes = [0x40,0x01,0x32,  value];				bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'reverblevel':						bytes = [0x40,0x01,0x33,  value];				bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'reverbtime':						bytes = [0x40,0x01,0x34,  value];				bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'reverbdelayfeedback':				bytes = [0x40,0x01,0x35,  value];				bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		
		//------------------------------------------------------------------------
		// CHORUS
		//------------------------------------------------------------------------
		case 'chorusmacro':						bytes = [0x40,0x01,0x38,  value];				bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'chorusprelpf':						bytes = [0x40,0x01,0x39,  value];				bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'choruslevel':						bytes = [0x40,0x01,0x3a,  value];				bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'chorusfeedback':					bytes = [0x40,0x01,0x3b,  value];				bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'chorusdelay':						bytes = [0x40,0x01,0x3c,  value];				bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'chorusrate':						bytes = [0x40,0x01,0x3d,  value];				bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'chorusdepth':						bytes = [0x40,0x01,0x3e,  value];				bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'chorussendleveltoreverb':			bytes = [0x40,0x01,0x3f,  value];				bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		
		//case 'chorustype':						bytes = [0xf0,0x7f,0x7f,0x04,0x05,0x01,0x01,0x01,0x01,0x02,0x00,value,0xf7];		break;
		//case 'chorusmodrate':					bytes = [0xf0,0x7f,0x7f,0x04,0x05,0x01,0x01,0x01,0x01,0x02,0x01,value,0xf7];		break;	
		//case 'chorusmoddepth':					bytes = [0xf0,0x7f,0x7f,0x04,0x05,0x01,0x01,0x01,0x01,0x02,0x02,value,0xf7];		break;
		//case 'chorusmodfeedback':				bytes = [0xf0,0x7f,0x7f,0x04,0x05,0x01,0x01,0x01,0x01,0x02,0x03,value,0xf7];		break;
		//case 'chorussendtoreverb':				bytes = [0xf0,0x7f,0x7f,0x04,0x05,0x01,0x01,0x01,0x01,0x02,0x04,value,0xf7];		break;
		
		//------------------------------------------------------------------------
		// EFX
		//------------------------------------------------------------------------
		case 'efxtype':							bytes = [0x40,0x03,0x00].concat(value);			bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'efxparameter1':					bytes = [0x40,0x03,0x03,  value];				bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'efxparameter2':					bytes = [0x40,0x03,0x04,  value];				bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'efxparameter3':					bytes = [0x40,0x03,0x05,  value];				bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'efxparameter4':					bytes = [0x40,0x03,0x06,  value];				bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'efxparameter5':					bytes = [0x40,0x03,0x07,  value];				bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'efxparameter6':					bytes = [0x40,0x03,0x08,  value];				bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'efxparameter7':					bytes = [0x40,0x03,0x09,  value];				bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'efxparameter8':					bytes = [0x40,0x03,0x0a,  value];				bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'efxparameter9':					bytes = [0x40,0x03,0x0b,  value];				bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'efxparameter10':					bytes = [0x40,0x03,0x0c,  value];				bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'efxparameter11':					bytes = [0x40,0x03,0x0d,  value];				bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'efxparameter12':					bytes = [0x40,0x03,0x0e,  value];				bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'efxparameter13':					bytes = [0x40,0x03,0x0f,  value];				bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'efxparameter14':					bytes = [0x40,0x03,0x10,  value];				bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'efxparameter15':					bytes = [0x40,0x03,0x11,  value];				bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'efxparameter16':					bytes = [0x40,0x03,0x12,  value];				bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'efxparameter17':					bytes = [0x40,0x03,0x13,  value];				bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'efxparameter18':					bytes = [0x40,0x03,0x14,  value];				bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'efxparameter19':					bytes = [0x40,0x03,0x15,  value];				bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'efxparameter20':					bytes = [0x40,0x03,0x16,  value];				bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'efxsendleveltoreverb':			bytes = [0x40,0x03,0x17,  value];				bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'efxsendleveltochorus':			bytes = [0x40,0x03,0x18,  value];				bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'efxdepth':						bytes = [0x40,0x03,0x1a,  value];				bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'partefxtype':						bytes = [0x40,0x40+channel,0x23].concat(value);	bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;


		case 'tonenumber':						bytes = [0x40,0x10+channel,0x00].concat(value);	bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'rxchannel':						bytes = [0x40,0x10+channel,0x02,  value];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'rxpitchbend':						bytes = [0x40,0x10+channel,0x03,  value];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'rxchpressure':					bytes = [0x40,0x10+channel,0x04,  value];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'rxprogramchange':					bytes = [0x40,0x10+channel,0x05,  value];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'rxcontrolchange':					bytes = [0x40,0x10+channel,0x06,  value];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'rxpolypressure':					bytes = [0x40,0x10+channel,0x07,  value];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'rxnotemessage':					bytes = [0x40,0x10+channel,0x08,  value];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'rxrpn':							bytes = [0x40,0x10+channel,0x09,  value];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'rxnrpn':							bytes = [0x40,0x10+channel,0x0a,  value];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'rxmodulation':					bytes = [0x40,0x10+channel,0x0b,  value];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'rxvolume':						bytes = [0x40,0x10+channel,0x0c,  value];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'rxpanpot':						bytes = [0x40,0x10+channel,0x0d,  value];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'rxexpression':					bytes = [0x40,0x10+channel,0x0e,  value];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'rxhold1':							bytes = [0x40,0x10+channel,0x0f,  value];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'rxportamento':					bytes = [0x40,0x10+channel,0x10,  value];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'rxsostenuto':						bytes = [0x40,0x10+channel,0x11,  value];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'rxsoft':							bytes = [0x40,0x10+channel,0x12,  value];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'mono/polymode':					bytes = [0x40,0x10+channel,0x13,  value];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'useforrhythmpart':				bytes = [0x40,0x10+channel,0x15,  value];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'pitchkeyshift':					bytes = [0x40,0x10+channel,0x16,  value];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'pitchoffsetfine':					bytes = [0x40,0x10+channel,0x17].concat(value);	bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'partlevel':						bytes = [0x40,0x10+channel,0x19,  value];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'velocitysensedepth':				bytes = [0x40,0x10+channel,0x1a,  value];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'velocitysenseoffset':				bytes = [0x40,0x10+channel,0x1b,  value];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'partpanpot':						bytes = [0x40,0x10+channel,0x1c,  value];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'keyrangelow':						bytes = [0x40,0x10+channel,0x1d,  value];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'keyrangehigh':					bytes = [0x40,0x10+channel,0x1e,  value];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'cc1controllernumber':				bytes = [0x40,0x10+channel,0x1f,  value];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'cc2controllernumber':				bytes = [0x40,0x10+channel,0x20,  value];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'chorussendlevel':					bytes = [0x40,0x10+channel,0x21,  value];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'reverbsendlevel':					bytes = [0x40,0x10+channel,0x22,  value];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'rxbankselect':					bytes = [0x40,0x10+channel,0x23,  value];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'rxbankselectlsb':					bytes = [0x40,0x10+channel,0x24,  value];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'toneremain':						bytes = [0x40,0x10+channel,0x25,  value];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'bankselectlsbrange':				bytes = [0x40,0x10+channel,0x28].concat(value);	bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		
		case 'tonemodify1':						bytes = [0x40,0x10+channel,0x30,  value];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'tonemodify2':						bytes = [0x40,0x10+channel,0x31,  value];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'tonemodify3':						bytes = [0x40,0x10+channel,0x32,  value];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'tonemodify4':						bytes = [0x40,0x10+channel,0x33,  value];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'tonemodify5':						bytes = [0x40,0x10+channel,0x34,  value];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'tonemodify6':						bytes = [0x40,0x10+channel,0x35,  value];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'tonemodify7':						bytes = [0x40,0x10+channel,0x36,  value];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'tonemodify8':						bytes = [0x40,0x10+channel,0x37,  value];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		
		case 'scaletuning':						bytes = [0x40,0x10+channel,0x40].concat(value);	bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		
		case 'modpitchcontrol':					bytes = [0x40,0x20+channel,0x00,  value];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'modtvfcutoffcontrol':				bytes = [0x40,0x20+channel,0x01,  value];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'modamplitudecontrol':				bytes = [0x40,0x20+channel,0x02,  value];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'modlfo1ratecontrol':				bytes = [0x40,0x20+channel,0x03,  value];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'modlfo1pitchdepth':				bytes = [0x40,0x20+channel,0x04,  value];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'modlfo1tvfdepth':					bytes = [0x40,0x20+channel,0x05,  value];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'modlfo1tvadepth':					bytes = [0x40,0x20+channel,0x06,  value];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'modlfo2ratecontrol':				bytes = [0x40,0x20+channel,0x07,  value];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'modlfo2pitchdepth':				bytes = [0x40,0x20+channel,0x08,  value];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'modlfo2tvfdepth':					bytes = [0x40,0x20+channel,0x09,  value];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'modlfo2tvadepth':					bytes = [0x40,0x20+channel,0x0a,  value];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		
		case 'bendpitchcontrol':				bytes = [0x40,0x20+channel,0x10,  value];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'bendtvfcutoffcontrol':			bytes = [0x40,0x20+channel,0x11,  value];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'bendamplitudecontrol':			bytes = [0x40,0x20+channel,0x12,  value];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'bendlfo1ratecontrol':				bytes = [0x40,0x20+channel,0x13,  value];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'bendlfo1pitchdepth':				bytes = [0x40,0x20+channel,0x14,  value];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'bendlfo1tvfdepth':				bytes = [0x40,0x20+channel,0x15,  value];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'bendlfo1tvadepth':				bytes = [0x40,0x20+channel,0x16,  value];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'bendlfo2ratecontrol':				bytes = [0x40,0x20+channel,0x17,  value];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'bendlfo2pitchdepth':				bytes = [0x40,0x20+channel,0x18,  value];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'bendlfo2tvfdepth':				bytes = [0x40,0x20+channel,0x19,  value];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'bendlfo2tvadepth':				bytes = [0x40,0x20+channel,0x1a,  value];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		
		case 'rxchpressurepitchcontrol':		bytes = [0x40,0x20+channel,0x20,  value];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'rxchpressuretvfcutoffcontrol':	bytes = [0x40,0x20+channel,0x21,  value];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'rxchpressureamplitudecontrol':	bytes = [0x40,0x20+channel,0x22,  value];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'rxchpressurelfo1ratecontrol':		bytes = [0x40,0x20+channel,0x23,  value];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'rxchpressurelfo1pitchdepth':		bytes = [0x40,0x20+channel,0x24,  value];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'rxchpressurelfo1tvfdepth':		bytes = [0x40,0x20+channel,0x25,  value];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'rxchpressurelfo1tvadepth':		bytes = [0x40,0x20+channel,0x26,  value];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'rxchpressurelfo2ratecontrol':		bytes = [0x40,0x20+channel,0x27,  value];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'rxchpressurelfo2pitchdepth':		bytes = [0x40,0x20+channel,0x28,  value];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'rxchpressurelfo2tvfdepth':		bytes = [0x40,0x20+channel,0x29,  value];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'rxchpressurelfo2tvadepth':		bytes = [0x40,0x20+channel,0x2a,  value];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		
		case 'rxpolypressurepitchcontrol':		bytes = [0x40,0x20+channel,0x30,  value];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'rxpolypressuretvfcutoffcontrol':	bytes = [0x40,0x20+channel,0x31,  value];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'rxpolypressureamplitudecontrol':	bytes = [0x40,0x20+channel,0x32,  value];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'rxpolypressurelfo1ratecontrol':	bytes = [0x40,0x20+channel,0x33,  value];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'rxpolypressurelfo1pitchdepth':	bytes = [0x40,0x20+channel,0x34,  value];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'rxpolypressurelfo1tvfdepth':		bytes = [0x40,0x20+channel,0x35,  value];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'rxpolypressurelfo1tvadepth':		bytes = [0x40,0x20+channel,0x36,  value];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'rxpolypressurelfo2ratecontrol':	bytes = [0x40,0x20+channel,0x37,  value];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'rxpolypressurelfo2pitchdepth':	bytes = [0x40,0x20+channel,0x38,  value];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'rxpolypressurelfo2tvfdepth':		bytes = [0x40,0x20+channel,0x39,  value];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'rxpolypressurelfo2tvadepth':		bytes = [0x40,0x20+channel,0x3a,  value];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		
		case 'cc1pitchcontrol':					bytes = [0x40,0x20+channel,0x40,  value];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'cc1tvfcutoffcontrol':				bytes = [0x40,0x20+channel,0x41,  value];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'cc1amplitudecontrol':				bytes = [0x40,0x20+channel,0x42,  value];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'cc1lfo1ratecontrol':				bytes = [0x40,0x20+channel,0x43,  value];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'cc1lfo1pitchdepth':				bytes = [0x40,0x20+channel,0x44,  value];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'cc1lfo1tvfdepth':					bytes = [0x40,0x20+channel,0x45,  value];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'cc1lfo1tvadepth':					bytes = [0x40,0x20+channel,0x46,  value];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'cc1lfo2ratecontrol':				bytes = [0x40,0x20+channel,0x47,  value];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'cc1lfo2pitchdepth':				bytes = [0x40,0x20+channel,0x48,  value];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'cc1lfo2tvfdepth':					bytes = [0x40,0x20+channel,0x49,  value];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'cc1lfo2tvadepth':					bytes = [0x40,0x20+channel,0x4a,  value];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		
		case 'cc2pitchcontrol':					bytes = [0x40,0x20+channel,0x50,  value];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'cc2tvfcutoffcontrol':				bytes = [0x40,0x20+channel,0x51,  value];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'cc2amplitudecontrol':				bytes = [0x40,0x20+channel,0x52,  value];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'cc2lfo1ratecontrol':				bytes = [0x40,0x20+channel,0x53,  value];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'cc2lfo1pitchdepth':				bytes = [0x40,0x20+channel,0x54,  value];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'cc2lfo1tvfdepth':					bytes = [0x40,0x20+channel,0x55,  value];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'cc2lfo1tvadepth':					bytes = [0x40,0x20+channel,0x56,  value];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'cc2lfo2ratecontrol':				bytes = [0x40,0x20+channel,0x57,  value];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'cc2lfo2pitchdepth':				bytes = [0x40,0x20+channel,0x58,  value];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'cc2lfo2tvfdepth':					bytes = [0x40,0x20+channel,0x59,  value];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'cc2lfo2tvadepth':					bytes = [0x40,0x20+channel,0x5a,  value];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
	}
	
	try {
		MidiOutput.send(bytes);
	} catch(e) {
		console.log(e);
	}

	if (DebugMode) console.log("Midi Output:" + bytes);
}

function setEfxType(name, value, channel=0) {
	var bytes = [];
	
	bytes[0] = parseInt("0x" + value[0] + value[1]);
	bytes[1] = parseInt("0x" + value[2] + value[3]);
	
	setParameter(name, bytes, channel);
}

function getParameter(name) {
	var sysex = [0xF0,0x41,0x10,0x42,0x11];				// system exclusive RQ1
	var bytes;
	
	name = name.toLowerCase();
	
	switch(name) {
		case 'mastertune':						bytes = [0x40,0x00,0x00,  0x00,0x00,0x04];		 		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'mastervolume':					bytes = [0x40,0x00,0x04,  0x00,0x00,0x01]; 				bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'masterkeyshift':					bytes = [0x40,0x00,0x05,  0x00,0x00,0x01]; 				bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'masterpan':						bytes = [0x40,0x00,0x06,  0x00,0x00,0x01]; 				bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'modeset':							bytes = [0x40,0x00,0x7f,  0x00,0x00,0x01]; 				bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		
		//------------------------------------------------------------------------
		// REVERB
		//------------------------------------------------------------------------
		case 'reverbmacro':						bytes = [0x40,0x01,0x30,  0x00,0x00,0x01];				bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'reverbcharacter':					bytes = [0x40,0x01,0x31,  0x00,0x00,0x01];				bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'reverbprelpf':					bytes = [0x40,0x01,0x32,  0x00,0x00,0x01];				bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'reverblevel':						bytes = [0x40,0x01,0x33,  0x00,0x00,0x01];				bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'reverbtime':						bytes = [0x40,0x01,0x34,  0x00,0x00,0x01];				bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'reverbdelayfeedback':				bytes = [0x40,0x01,0x35,  0x00,0x00,0x01];				bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		
		//------------------------------------------------------------------------
		// CHORUS
		//------------------------------------------------------------------------
		case 'chorusmacro':						bytes = [0x40,0x01,0x38,  0x00,0x00,0x01];				bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'chorusprelpf':					bytes = [0x40,0x01,0x39,  0x00,0x00,0x01];				bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'choruslevel':						bytes = [0x40,0x01,0x3a,  0x00,0x00,0x01];				bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'chorusfeedback':					bytes = [0x40,0x01,0x3b,  0x00,0x00,0x01];				bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'chorusdelay':						bytes = [0x40,0x01,0x3c,  0x00,0x00,0x01];				bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'chorusrate':						bytes = [0x40,0x01,0x3d,  0x00,0x00,0x01];				bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'chorusdepth':						bytes = [0x40,0x01,0x3e,  0x00,0x00,0x01];				bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'chorussendleveltoreverb':			bytes = [0x40,0x01,0x3f,  0x00,0x00,0x01];				bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		
		//------------------------------------------------------------------------
		// EFX
		//------------------------------------------------------------------------
		case 'efxtype':							bytes = [0x40,0x03,0x00,  0x00,0x00,0x02];				bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'efxparameter1':					bytes = [0x40,0x03,0x03,  0x00,0x00,0x01];				bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'efxparameter2':					bytes = [0x40,0x03,0x04,  0x00,0x00,0x01];				bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'efxparameter3':					bytes = [0x40,0x03,0x05,  0x00,0x00,0x01];				bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'efxparameter4':					bytes = [0x40,0x03,0x06,  0x00,0x00,0x01];				bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'efxparameter5':					bytes = [0x40,0x03,0x07,  0x00,0x00,0x01];				bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'efxparameter6':					bytes = [0x40,0x03,0x08,  0x00,0x00,0x01];				bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'efxparameter7':					bytes = [0x40,0x03,0x09,  0x00,0x00,0x01];				bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'efxparameter8':					bytes = [0x40,0x03,0x0a,  0x00,0x00,0x01];				bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'efxparameter9':					bytes = [0x40,0x03,0x0b,  0x00,0x00,0x01];				bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'efxparameter10':					bytes = [0x40,0x03,0x0c,  0x00,0x00,0x01];				bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'efxparameter11':					bytes = [0x40,0x03,0x0d,  0x00,0x00,0x01];				bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'efxparameter12':					bytes = [0x40,0x03,0x0e,  0x00,0x00,0x01];				bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'efxparameter13':					bytes = [0x40,0x03,0x0f,  0x00,0x00,0x01];				bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'efxparameter14':					bytes = [0x40,0x03,0x10,  0x00,0x00,0x01];				bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'efxparameter15':					bytes = [0x40,0x03,0x11,  0x00,0x00,0x01];				bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'efxparameter16':					bytes = [0x40,0x03,0x12,  0x00,0x00,0x01];				bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'efxparameter17':					bytes = [0x40,0x03,0x13,  0x00,0x00,0x01];				bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'efxparameter18':					bytes = [0x40,0x03,0x14,  0x00,0x00,0x01];				bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'efxparameter19':					bytes = [0x40,0x03,0x15,  0x00,0x00,0x01];				bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'efxparameter20':					bytes = [0x40,0x03,0x16,  0x00,0x00,0x01];				bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'efxsendleveltoreverb':			bytes = [0x40,0x03,0x17,  0x00,0x00,0x01];				bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'efxsendleveltochorus':			bytes = [0x40,0x03,0x18,  0x00,0x00,0x01];				bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'efxdepth':						bytes = [0x40,0x03,0x1a,  0x00,0x00,0x01];				bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'partefxtype':						bytes = [0x40,0x40+channel,0x23,  0x00,0x00,0x06];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;


		case 'tonenumber':						bytes = [0x40,0x10+channel,0x00,  0x00,0x00,0x02];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'rxchannel':						bytes = [0x40,0x10+channel,0x02,  0x00,0x00,0x01];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'rxpitchbend':						bytes = [0x40,0x10+channel,0x03,  0x00,0x00,0x01];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'rxchpressure':					bytes = [0x40,0x10+channel,0x04,  0x00,0x00,0x01];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'rxprogramchange':					bytes = [0x40,0x10+channel,0x05,  0x00,0x00,0x01];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'rxcontrolchange':					bytes = [0x40,0x10+channel,0x06,  0x00,0x00,0x01];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'rxpolypressure':					bytes = [0x40,0x10+channel,0x07,  0x00,0x00,0x01];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'rxnotemessage':					bytes = [0x40,0x10+channel,0x08,  0x00,0x00,0x01];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'rxrpn':							bytes = [0x40,0x10+channel,0x09,  0x00,0x00,0x01];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'rxnrpn':							bytes = [0x40,0x10+channel,0x0a,  0x00,0x00,0x01];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'rxmodulation':					bytes = [0x40,0x10+channel,0x0b,  0x00,0x00,0x01];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'rxvolume':						bytes = [0x40,0x10+channel,0x0c,  0x00,0x00,0x01];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'rxpanpot':						bytes = [0x40,0x10+channel,0x0d,  0x00,0x00,0x01];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'rxexpression':					bytes = [0x40,0x10+channel,0x0e,  0x00,0x00,0x01];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'rxhold1':							bytes = [0x40,0x10+channel,0x0f,  0x00,0x00,0x01];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'rxportamento':					bytes = [0x40,0x10+channel,0x10,  0x00,0x00,0x01];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'rxsostenuto':						bytes = [0x40,0x10+channel,0x11,  0x00,0x00,0x01];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'rxsoft':							bytes = [0x40,0x10+channel,0x12,  0x00,0x00,0x01];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'mono/polymode':					bytes = [0x40,0x10+channel,0x13,  0x00,0x00,0x01];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'useforrhythmpart':				bytes = [0x40,0x10+channel,0x15,  0x00,0x00,0x01];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'pitchkeyshift':					bytes = [0x40,0x10+channel,0x16,  0x00,0x00,0x01];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'pitchoffsetfine':					bytes = [0x40,0x10+channel,0x17,  0x00,0x00,0x02];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'partlevel':						bytes = [0x40,0x10+channel,0x19,  0x00,0x00,0x01];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'velocitysensedepth':				bytes = [0x40,0x10+channel,0x1a,  0x00,0x00,0x01];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'velocitysenseoffset':				bytes = [0x40,0x10+channel,0x1b,  0x00,0x00,0x01];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'partpanpot':						bytes = [0x40,0x10+channel,0x1c,  0x00,0x00,0x01];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'keyrangelow':						bytes = [0x40,0x10+channel,0x1d,  0x00,0x00,0x01];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'keyrangehigh':					bytes = [0x40,0x10+channel,0x1e,  0x00,0x00,0x01];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'cc1controllernumber':				bytes = [0x40,0x10+channel,0x1f,  0x00,0x00,0x01];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'cc2controllernumber':				bytes = [0x40,0x10+channel,0x20,  0x00,0x00,0x01];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'chorussendlevel':					bytes = [0x40,0x10+channel,0x21,  0x00,0x00,0x01];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'reverbsendlevel':					bytes = [0x40,0x10+channel,0x22,  0x00,0x00,0x01];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'rxbankselect':					bytes = [0x40,0x10+channel,0x23,  0x00,0x00,0x01];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'rxbankselectlsb':					bytes = [0x40,0x10+channel,0x24,  0x00,0x00,0x01];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'toneremain':						bytes = [0x40,0x10+channel,0x25,  0x00,0x00,0x01];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'bankselectlsbrange':				bytes = [0x40,0x10+channel,0x28,  0x00,0x00,0x03];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		
		case 'tonemodify1':						bytes = [0x40,0x10+channel,0x30,  0x00,0x00,0x01];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'tonemodify2':						bytes = [0x40,0x10+channel,0x31,  0x00,0x00,0x01];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'tonemodify3':						bytes = [0x40,0x10+channel,0x32,  0x00,0x00,0x01];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'tonemodify4':						bytes = [0x40,0x10+channel,0x33,  0x00,0x00,0x01];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'tonemodify5':						bytes = [0x40,0x10+channel,0x34,  0x00,0x00,0x01];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'tonemodify6':						bytes = [0x40,0x10+channel,0x35,  0x00,0x00,0x01];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'tonemodify7':						bytes = [0x40,0x10+channel,0x36,  0x00,0x00,0x01];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'tonemodify8':						bytes = [0x40,0x10+channel,0x37,  0x00,0x00,0x01];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		
		case 'scaletuning':						bytes = [0x40,0x10+channel,0x40,  0x00,0x00,0x0c];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		
		case 'modpitchcontrol':					bytes = [0x40,0x20+channel,0x00,  0x00,0x00,0x01];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'modtvfcutoffcontrol':				bytes = [0x40,0x20+channel,0x01,  0x00,0x00,0x01];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'modamplitudecontrol':				bytes = [0x40,0x20+channel,0x02,  0x00,0x00,0x01];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'modlfo1ratecontrol':				bytes = [0x40,0x20+channel,0x03,  0x00,0x00,0x01];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'modlfo1pitchdepth':				bytes = [0x40,0x20+channel,0x04,  0x00,0x00,0x01];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'modlfo1tvfdepth':					bytes = [0x40,0x20+channel,0x05,  0x00,0x00,0x01];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'modlfo1tvadepth':					bytes = [0x40,0x20+channel,0x06,  0x00,0x00,0x01];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'modlfo2ratecontrol':				bytes = [0x40,0x20+channel,0x07,  0x00,0x00,0x01];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'modlfo2pitchdepth':				bytes = [0x40,0x20+channel,0x08,  0x00,0x00,0x01];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'modlfo2tvfdepth':					bytes = [0x40,0x20+channel,0x09,  0x00,0x00,0x01];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'modlfo2tvadepth':					bytes = [0x40,0x20+channel,0x0a,  0x00,0x00,0x01];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		
		case 'bendpitchcontrol':				bytes = [0x40,0x20+channel,0x10,  0x00,0x00,0x01];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'bendtvfcutoffcontrol':			bytes = [0x40,0x20+channel,0x11,  0x00,0x00,0x01];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'bendamplitudecontrol':			bytes = [0x40,0x20+channel,0x12,  0x00,0x00,0x01];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'bendlfo1ratecontrol':				bytes = [0x40,0x20+channel,0x13,  0x00,0x00,0x01];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'bendlfo1pitchdepth':				bytes = [0x40,0x20+channel,0x14,  0x00,0x00,0x01];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'bendlfo1tvfdepth':				bytes = [0x40,0x20+channel,0x15,  0x00,0x00,0x01];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'bendlfo1tvadepth':				bytes = [0x40,0x20+channel,0x16,  0x00,0x00,0x01];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'bendlfo2ratecontrol':				bytes = [0x40,0x20+channel,0x17,  0x00,0x00,0x01];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'bendlfo2pitchdepth':				bytes = [0x40,0x20+channel,0x18,  0x00,0x00,0x01];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'bendlfo2tvfdepth':				bytes = [0x40,0x20+channel,0x19,  0x00,0x00,0x01];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'bendlfo2tvadepth':				bytes = [0x40,0x20+channel,0x1a,  0x00,0x00,0x01];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		
		case 'rxchpressurepitchcontrol':		bytes = [0x40,0x20+channel,0x20,  0x00,0x00,0x01];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'rxchpressuretvfcutoffcontrol':	bytes = [0x40,0x20+channel,0x21,  0x00,0x00,0x01];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'rxchpressureamplitudecontrol':	bytes = [0x40,0x20+channel,0x22,  0x00,0x00,0x01];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'rxchpressurelfo1ratecontrol':		bytes = [0x40,0x20+channel,0x23,  0x00,0x00,0x01];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'rxchpressurelfo1pitchdepth':		bytes = [0x40,0x20+channel,0x24,  0x00,0x00,0x01];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'rxchpressurelfo1tvfdepth':		bytes = [0x40,0x20+channel,0x25,  0x00,0x00,0x01];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'rxchpressurelfo1tvadepth':		bytes = [0x40,0x20+channel,0x26,  0x00,0x00,0x01];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'rxchpressurelfo2ratecontrol':		bytes = [0x40,0x20+channel,0x27,  0x00,0x00,0x01];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'rxchpressurelfo2pitchdepth':		bytes = [0x40,0x20+channel,0x28,  0x00,0x00,0x01];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'rxchpressurelfo2tvfdepth':		bytes = [0x40,0x20+channel,0x29,  0x00,0x00,0x01];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'rxchpressurelfo2tvadepth':		bytes = [0x40,0x20+channel,0x2a,  0x00,0x00,0x01];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		
		case 'rxpolypressurepitchcontrol':		bytes = [0x40,0x20+channel,0x30,  0x00,0x00,0x01];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'rxpolypressuretvfcutoffcontrol':	bytes = [0x40,0x20+channel,0x31,  0x00,0x00,0x01];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'rxpolypressureamplitudecontrol':	bytes = [0x40,0x20+channel,0x32,  0x00,0x00,0x01];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'rxpolypressurelfo1ratecontrol':	bytes = [0x40,0x20+channel,0x33,  0x00,0x00,0x01];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'rxpolypressurelfo1pitchdepth':	bytes = [0x40,0x20+channel,0x34,  0x00,0x00,0x01];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'rxpolypressurelfo1tvfdepth':		bytes = [0x40,0x20+channel,0x35,  0x00,0x00,0x01];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'rxpolypressurelfo1tvadepth':		bytes = [0x40,0x20+channel,0x36,  0x00,0x00,0x01];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'rxpolypressurelfo2ratecontrol':	bytes = [0x40,0x20+channel,0x37,  0x00,0x00,0x01];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'rxpolypressurelfo2pitchdepth':	bytes = [0x40,0x20+channel,0x38,  0x00,0x00,0x01];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'rxpolypressurelfo2tvfdepth':		bytes = [0x40,0x20+channel,0x39,  0x00,0x00,0x01];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'rxpolypressurelfo2tvadepth':		bytes = [0x40,0x20+channel,0x3a,  0x00,0x00,0x01];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		
		case 'cc1pitchcontrol':					bytes = [0x40,0x20+channel,0x40,  0x00,0x00,0x01];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'cc1tvfcutoffcontrol':				bytes = [0x40,0x20+channel,0x41,  0x00,0x00,0x01];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'cc1amplitudecontrol':				bytes = [0x40,0x20+channel,0x42,  0x00,0x00,0x01];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'cc1lfo1ratecontrol':				bytes = [0x40,0x20+channel,0x43,  0x00,0x00,0x01];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'cc1lfo1pitchdepth':				bytes = [0x40,0x20+channel,0x44,  0x00,0x00,0x01];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'cc1lfo1tvfdepth':					bytes = [0x40,0x20+channel,0x45,  0x00,0x00,0x01];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'cc1lfo1tvadepth':					bytes = [0x40,0x20+channel,0x46,  0x00,0x00,0x01];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'cc1lfo2ratecontrol':				bytes = [0x40,0x20+channel,0x47,  0x00,0x00,0x01];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'cc1lfo2pitchdepth':				bytes = [0x40,0x20+channel,0x48,  0x00,0x00,0x01];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'cc1lfo2tvfdepth':					bytes = [0x40,0x20+channel,0x49,  0x00,0x00,0x01];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'cc1lfo2tvadepth':					bytes = [0x40,0x20+channel,0x4a,  0x00,0x00,0x01];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		
		case 'cc2pitchcontrol':					bytes = [0x40,0x20+channel,0x50,  0x00,0x00,0x01];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'cc2tvfcutoffcontrol':				bytes = [0x40,0x20+channel,0x51,  0x00,0x00,0x01];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'cc2amplitudecontrol':				bytes = [0x40,0x20+channel,0x52,  0x00,0x00,0x01];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'cc2lfo1ratecontrol':				bytes = [0x40,0x20+channel,0x53,  0x00,0x00,0x01];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'cc2lfo1pitchdepth':				bytes = [0x40,0x20+channel,0x54,  0x00,0x00,0x01];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'cc2lfo1tvfdepth':					bytes = [0x40,0x20+channel,0x55,  0x00,0x00,0x01];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'cc2lfo1tvadepth':					bytes = [0x40,0x20+channel,0x56,  0x00,0x00,0x01];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'cc2lfo2ratecontrol':				bytes = [0x40,0x20+channel,0x57,  0x00,0x00,0x01];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'cc2lfo2pitchdepth':				bytes = [0x40,0x20+channel,0x58,  0x00,0x00,0x01];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'cc2lfo2tvfdepth':					bytes = [0x40,0x20+channel,0x59,  0x00,0x00,0x01];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
		case 'cc2lfo2tvadepth':					bytes = [0x40,0x20+channel,0x5a,  0x00,0x00,0x01];		bytes = sysex.concat(bytes,checksum(bytes),0xf7);	break;
	}
	
	MidiInput.onmidimessage = readParameter;
	MidiOutput.send(bytes);
	
	if (DebugMode)
		console.log(bytes);
}

function readParameter(message) {
	if (DebugMode) {
		console.log("Midi Input:");
		console.log(message);
	}
	
	
	
	MidiInput.onmidimessage = OnMidiMessageDefaultFunction;
}

// Calcula e retorna checksum de dados midi
function checksum(bytes) {
	var check = 0;

	for (var i=0; i<bytes.length; i++)	// começa do bytes 7 (checksum considera apenas address e data)
		check += bytes[i];
	check %= 128;
	if (check > 0) check = 128 - check;
	
	return check;
}

// Converte valor inteiro em um vetor de nibbles (unidade de 4 bits)
function nibblizer(value, length) {
	var nibble = [];
	var i = 0;
	
	value = parseInt(value);
	
	while (value > 0) {
		nibble[i] = value % 16; 	value = (value-nibble[i]) / 16;
		i++;
	}
	
	if (nibble.length < length)
		nibble[i] = 0;
	
	return nibble.reverse();
}

// converte um vetor de nibbles (unidade de 4 bits) para um valor inteiro
function unnibblizer(nibble) {
	var value = 0;
	
	for (var i=0; i<nibble.length; i++) {
		value = value*16 + nibble[i];
	}
	
	return value;
}

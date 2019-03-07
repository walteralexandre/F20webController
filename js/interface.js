//===================================================================================================
//  FUNÇÕES HTML
//===================================================================================================

// Ao abrir um details de primeiro nível, os demais são fechados
function toogleDetails(obj) {
	if (obj.open == false) {
		var det = document.querySelectorAll('#body > details ');
		for(var i=0; i<det.length; i++)
			det[i].open = false;
		obj = true;
	}
}

// Ao abrir um details de segundo nível (seção EFX), os demais são fechados
function toogleDetails2(obj) {
	if (obj.open == false) {
		var det = document.querySelectorAll("details > details");
		for (var i=0; i<det.length; i++)
			det[i].open = false;
		obj = true;
	}
}

// Altera automaticamente tamanhos de buttons de modo que não seja necessário atribuir tamanhos indidualmente ou criar 
//	classes css para tipos de butons.
function setSizeButtons() {
	var dt  = document.getElementsByTagName('details');		// a tag details interfere na propriedade offsetwidth
	var btn = document.getElementsByTagName('button');
	
	var minSize  = 120;
	var stepSize = minSize/4;
	
	for (var i=0; i<btn.length; i++) {
		if (btn[i].offsetWidth < minSize)
			btn[i].style.width = minSize + "px";
		else
			btn[i].style.width = Math.ceil(btn[i].offsetWidth/stepSize)*stepSize + "px";
	}
	
	// quando details é inicialmente fechado, é atribuído valor 0 para offsetwidth de seus elementos filhos
	// para resolver, coloque details inicialmente abertos e o seguinte código irá fechá-los automaticamente mas sem afetar
	//	 a propriedade offsetwidth de seus elementos filhos
	for (var i=0; i<dt.length; i++)
		dt[i].open = false;
}

function pageLoader() {
  document.getElementById("loader").style.display = "none";
  document.getElementById("body").style.display   = "block";
}
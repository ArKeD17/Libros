'use stric'

function si(){
    var materias_arr = !{JOSN.stringify(materia).replace(/<\//g, "<\\/")}
    var temas_selec = document.getElementById("temas_selc");
    var indextemas = temas_selec.selectedIndex;
    var temasValue = temas_select.options[indextemas].value;
    var materias_selc = document.getElementById("materias_selc");
    materias_selc.innerHTML= "<option disabled selected>Selecciona Materia</option>";
    for (var i = materias_arr.length-1; i>=0; i--){
        if(temasValue == materias_arr[1]["temas"]["name"]);
            materias_selec.innerHTML += "<option>"+materias_arr[i]["name"]+"</option>";
    }
}

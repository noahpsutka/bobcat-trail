// Template for autocomplete provided by W3Schools, remixed for the purposes of our project
function autocomplete(inp, arr) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function (e) {
        var a, b, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) { return false; }
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        /*for each item in the array...*/
        for (const key in arr) {
            /*check if the item starts with the same letters as the text field value:*/
            var indexOfOpen = key.indexOf("(");
            if (key.substr(0, val.length).toUpperCase() == val.toUpperCase() ||
                key.substr(indexOfOpen + 1, val.length).toUpperCase() == val.toUpperCase()) {
                /*create a DIV element for each matching element:*/
                b = document.createElement("DIV");
                /*make the matching letters bold:*/
                // b.innerHTML = "<strong>" + key.substr(0, val.length) + "</strong>";
                b.innerHTML = key.substr(0, val.length);
                b.innerHTML += key.substr(val.length);
                /*insert a input field that will hold the current array item's value:*/
                b.innerHTML += "<input type='hidden' value='" + key + "'>";
                /*execute a function when someone clicks on the item value (DIV element):*/
                b.addEventListener("click", function (e) {
                    /*insert the value for the autocomplete text field:*/
                    inp.value = this.getElementsByTagName("input")[0].value;
                    /*close the list of autocompleted values,
                    (or any other open lists of autocompleted values:*/
                    closeAllLists();
                });
                a.appendChild(b);
            }
        }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function (e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            /*If the arrow DOWN key is pressed,
            increase the currentFocus variable:*/
            currentFocus++;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 38) { //up
            /*If the arrow UP key is pressed,
            decrease the currentFocus variable:*/
            currentFocus--;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 13) {
            /*If the ENTER key is pressed, prevent the form from being submitted,*/
            e.preventDefault();
            if (currentFocus > -1) {
                /*and simulate a click on the "active" item:*/
                if (x) x[currentFocus].click();
            }
        }
    });
    function addActive(x) {
        /*a function to classify an item as "active":*/
        if (!x) return false;
        /*start by removing the "active" class on all items:*/
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        /*add class "autocomplete-active":*/
        x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
        /*a function to remove the "active" class from all autocomplete items:*/
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }
    function closeAllLists(elmnt) {
        /*close all autocomplete lists in the document,
        except the one passed as an argument:*/
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }
    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}

/* A dictionary of buildings with both latitude and longitude values */
var buildings = {
    "Agriculture (AG)": [29.89077566795466, -97.93926358222963],
    "Agriculture Greenhouse (AGGH)": [29.886036362576363, -97.94643601922637],
    "Alkek Library (ALK)": [29.888898576472933, -97.94306263852707],
    "Aqua Sports Center (ASC)": [29.890145013789244, -97.9376027411371],
    "Athletics (DBC)": [29.889017639843615, -97.9317057549258],
    "LBJ Student Center (LBJ)": [29.889203676031276, -97.94442461181549],
    "Centennial Hall (CENT)": [29.88951993675346, -97.94008510958253],
    "Chemistry (CHEM)": [29.889538540294108, -97.93953828485076],
    "College of Education (ED)": [29.887957226944522, -97.93920544158259],
    "Colorado (COLO)": [29.89102216148118, -97.93918396162812],
    "Comal (CMAL)": [29.88930599578648, -97.94073431345387],
    "Derrick Hall (DERR)": [29.889296693994883, -97.94227336559051],
    "Encino Hall (ENC)": [29.888761839518715, -97.94562586689818],
    "Evans Liberal Arts (ELA)": [29.888673471981203, -97.94178543167881],
    "Family & Consumer Sciences (FCS)": [29.888805557889448, -97.94912123683392],
    "Flowers Hall (FH)": [29.889133912501574, -97.9403587787262],
    "Freeman Aquatic Biology (FAB)": [29.88971062291598, -97.93600201606752],
    "Hines Academic Center (HINE)": [29.890059438022558, -97.93837910793191],
    "Ingram School of Engineering (IGRM)": [29.88759557526352, -97.94566212572931],
    "J.C. Kellam Administration (JCK)": [29.888769281197792, -97.93745149125908],
    "Joann Cole Mitte (JCM)": [29.889083682467405, -97.9478197991593],
    "Jowers Center (JOW)": [29.887561894687714, -97.93264006875158],
    "Lampasas Hall (LAMP)": [29.889203676031276, -97.93947896854353],
    "Math Computer Science (MCS)": [29.88945482433385, -97.9425579195468],
    "McCoy Hall (MCOY)": [29.888236284064213, -97.94463920975798],
    "Music (MUS)": [29.890746832801753, -97.94058322939237],
    "Old Main (OM)": [29.88936180651777, -97.93923229762682],
    "Supple Science (SUPP)": [29.887980481769812, -97.94661283493043],
    "Theatre Center (THEA)": [29.886898663211166, -97.9373946188571],
    "Undergraduate Academic Center (UAC)": [29.887999085597734, -97.94241786003114]
}

/* The fields below have autocomplete capability, both the search-bar and the input of course-location */
autocomplete(document.getElementById("search-bar"), buildings);
autocomplete(document.getElementById("course-location"), buildings);

let boutonRecherche = document.querySelector("#btn-lancer-recherche");
boutonRecherche.setAttribute("onclick", "lancerRecherche()");
let champRecherche = document.querySelector("#recherche");
let valChampRecherche = champRecherche.value;
let boutonFav = document.querySelector("#btn-favoris");
if(valChampRecherche.length != 0) {
    boutonFav.removeAttribute("disabled");
} else {
    
}

function lancerRecherche() {
    var recherche = document.querySelector("#recherche");
    var valRecherche = encodeURIComponent(recherche.value);
    
    if (valRecherche.length > 0 ) {
        ajax_get_request(afficherResultat, "https://api.genius.com/search?q="+valRecherche, true);
    }
    
}

function afficherResultat(res) {

    let objJson = JSON.parse(res);
    var champResultat = document.querySelector("#bloc-resultats p:first-child");
    let blocResultat = document.querySelector("#bloc-resultats");
    let nbDeResultats = objJson.response.hits.length;

    if (nbDeResultats == 0) {
        let champVide = "<p> Aucun résultat n'a été trouvé ! </p>";
        blocResultat.innerHTML =  champVide;
    } else {
        for(let i=0; i<nbDeResultats; i++) {
            let strLink = "https://genius.com" +objJson.response.hits[i].result.api_path;
            let resultatN = '<p class="res">'+objJson.response.hits[i].result.full_title+' - Paroles complètes disponibles '+`<a href=${strLink}>`+ 'ici</a> </p>';

            blocResultat.insertAdjacentHTML('beforeend', resultatN);
        }
    }
}




function ajax_get_request(callback, url, async) {
    var xhr = new XMLHttpRequest(); // Création de l'objet
       // Définition de la fonction à exécuter à chaque changement d'état
    xhr.onreadystatechange = function(){
    if (callback && xhr.readyState == XMLHttpRequest.DONE
    && xhr.status == 200){
    // Si le serveur a fini son travail (XMLHttpRequest.DONE = 4) 
    // et que le code d'état indique que tout s'est bien passé
    // => On appelle la fonction callback en lui passant la réponse 
    callback(xhr.responseText);
    } };
    xhr.open("GET", url, async); // Initialisation de l'objet
    xhr.setRequestHeader('Authorization', 'Bearer 7eoDZy400nLQe8jiqvekYbwGdwAjp21Fl2kGWU3V2ACskoBGZLtM7G7_csryBqJ2');
    xhr.send(); // Envoi de la requête 

}

function init() {
    let champRecherche = document.querySelector("#recherche");
    let valChampRecherche = champRecherche.value;
    champRecherche.addEventListener("input", checkInput);
    chargerFavoris();
    eventCroix();
    let boutonRecherche = document.querySelector("#btn-lancer-recherche");
    boutonRecherche.classList.remove("btn_clicable");
    eventClickFavoris();
    //Evenement quand la touche entrée est pressée on lance la requ
    enterKeyUp();

}

function checkInput() {
    let champRecherche = document.querySelector("#recherche");
    let valChampRecherche = champRecherche.value;
    let boutonFav = document.querySelector("#btn-favoris");
    let boutonRecherche = document.querySelector("#btn-lancer-recherche");
    if(valChampRecherche.length != 0) {
        boutonFav.removeAttribute("disabled");
        boutonFav.classList.add("btn_clicable");
        boutonFav.setAttribute("onclick", "ajouterFavoris(valChampRecherche)");
        boutonRecherche.classList.add("btn_clicable");
        let etoile = document.querySelector("#etoile");
        if (favoriEstPresent(valChampRecherche)) {
            etoile.setAttribute("src", "images/etoile-pleine.svg");
        } else {
            etoile.setAttribute("src", "images/etoile-vide.svg");
        }

        boutonFav.onclick = function() {
            
            if(favoriEstPresent(valChampRecherche)) {
                removeFavori(valChampRecherche);

            } else {
                ajouterFavoris(valChampRecherche);

            }

            if (favoriEstPresent(valChampRecherche)) {
                etoile.setAttribute("src", "images/etoile-pleine.svg");
            } else {
                etoile.setAttribute("src", "images/etoile-vide.svg");
            }
        
        };
    } else {
    boutonFav.classList.remove("btn_clicable");
    boutonFav.setAttribute("disabled", true);
    boutonRecherche.classList.remove("btn_clicable");
    }

    enterKeyUp();
}


function ajouterFavoris(valChampRecherche) {

    if (valChampRecherche.length > 0) {
        

        if(!localStorage.getItem("favoris")) {
            
            localStorage.setItem("favoris", JSON.stringify([]));
        }

        let liste = JSON.parse(localStorage.getItem("favoris"));
        
        liste.push(valChampRecherche);
        localStorage.setItem("favoris", JSON.stringify(liste));
        

        
        let blocFavori = document.querySelector("#liste-favoris");
        let elementAjoute = '<li> <span title="Cliquer pour relancer la recherche">'+valChampRecherche+'</span> <div class="croix"> <img src="images/croix.png" alt="Icone pour supprimer le favori" width=15 title="Cliquer pour supprimer le favori"> </div></li>';

        blocFavori.insertAdjacentHTML("beforeend",elementAjoute);
        eventCroix();
        eventClickFavoris();
        let blocAucunFav = document.querySelector(".info-vide");
        if(blocAucunFav) {
            blocAucunFav.parentNode.removeChild(blocAucunFav);
        }
        
    }
}

function createUniqueID() {
    return Math.floor(Math.random() * Math.floor(Math.random() * Date.now()));
}

//
function chargerFavoris() {
    let favoris = JSON.parse(localStorage.getItem("favoris"));
    let blocFavori = document.querySelector("#liste-favoris");
    if (favoris.length > 0) {
        for(var val of favoris) {
            let elementAjoute = '<li> <span title="Cliquer pour relancer la recherche">'+val+'</span> <div class="croix"> <img src="images/croix.png" alt="Icone pour supprimer le favori" width=15 title="Cliquer pour supprimer le favori"> </div> </li>';
            blocFavori.insertAdjacentHTML("beforeend", elementAjoute);
        }
            
    } else {
        let blocSectionFavori = document.querySelector("#section-favoris");
        let elem = '<p class="info-vide">( &empty; Aucune recherche enregistrée )</p>';
        blocFavori.insertAdjacentHTML("beforeend",elem);
    }
    
}

function favoriEstPresent(valChampRecherche) {
        
        if(!localStorage.getItem("favoris")) {
            localStorage.setItem("favoris", JSON.stringify([]));
            return false;
        } else {
            let liste = JSON.parse(localStorage.getItem("favoris"));

        let valPresente = false;
        
        liste.forEach(function(val, cle){
            
            if(val === valChampRecherche) {
                valPresente = true;
            }
            
        });
        
        return valPresente;
        }
        
}

function removeFavori(valChampRecherche) {

    let resultat = window.confirm("Voulez vous vraiment supprimer ce favoris ?");
    if (resultat) {
        let liste = JSON.parse(localStorage.getItem("favoris"));
        
        const index = liste.indexOf(valChampRecherche);
        if (index > -1) {
            
            liste.splice(index,1);
            
        }

        localStorage.setItem("favoris", JSON.stringify(liste));
        let favs = document.querySelector("#liste-favoris");
        for(var elem = favs.firstChild; elem !==null; elem=elem.nextSibling) {
        
            if(elem.textContent.includes(valChampRecherche)) {
                favs.removeChild(elem);
            }
        }
        let etoile = document.querySelector("#etoile");
        etoile.setAttribute("src", "images/etoile-vide.svg");

        liste = JSON.parse(localStorage.getItem("favoris"));
        if(liste.length == 0) {
            let blocAucunFav = '<p class="info-vide">( &empty; Aucune recherche enregistrée )</p>';
            favs.insertAdjacentHTML("beforeend",blocAucunFav);
        }
    }
}

function eventCroix() {
    $("#liste-favoris img").click(function(event) {
        let imgCroix = document.querySelector("#liste-favoris img");
        let elemARetirer = $(event.target).parent().parent().first().text();
        removeFavori(elemARetirer);
    })


}

function eventClickFavoris() {
   
    $("#liste-favoris span").click(function(event) {
        
        let textPourAjax = $(event.target).text();
        lancerAjaxSurFavoris(textPourAjax);
    })

}

function lancerAjaxSurFavoris(textPourAjax) {
    let champEncode = encodeURIComponent(textPourAjax);

    let champResultat = document.querySelector("#bloc-resultats");
    champResultat.innerHTML = "";
    ajax_get_request(afficherResultat, "https://api.genius.com/search?q="+champEncode, true);
}

function enterKeyUp() {
    document.addEventListener("keyup", function(event) {
        if (event.key === 'Enter') {
           lancerRecherche();
            
        }
    });
} 



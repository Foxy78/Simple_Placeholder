
//Activité 3

//Description : Cette activité consiste à récupérer des liens dans un site et à ajouter dans ce site un nouveau lien.

var formulaire1Elt = document.createElement("form"); // on crée un élément "formulaire1Elt" qui contiendra le boton "Ajouter un lien"
document.querySelector ("div").appendChild (formulaire1Elt);
var formulaire2Elt = document.createElement("form"); // on crée un élément "formulaire2Elt" qui contiendra les champs de saisie du lien supplémentaire
document.querySelector ("div").appendChild (formulaire2Elt);
var liensElt = document.createElement("section"); // on crée un élément "liensElt" qui contiendra la table des liens
document.querySelector ("div").appendChild (liensElt);

function afficherTable () { // fonction d'affichage des liens
    
    ajaxGet("https://oc-jswebsrv.herokuapp.com/api/liens", function (reponse) {
        var reponseElts = JSON.parse(reponse);

        reponseElts.forEach (function(reponseElt) {

        // ajout de l'élément "titreElt" qui contiendra un lien
        var titreElt = document.createElement("h2");   
        liensElt.appendChild (titreElt);

        // ajout du titre et de l'url du titre
        var lienDuTitreElt = document.createElement("a");
        lienDuTitreElt.textContent = reponseElt.titre + "  " ;
        lienDuTitreElt.style.color = "#428bca";
        lienDuTitreElt.href = reponseElt.url;
        titreElt.appendChild (lienDuTitreElt);


        // ajout du texte de l'url
        var lienTexte = document.createElement("h3");
        lienTexte.class = "lien";
        lienTexte.textContent = reponseElt.url;
        titreElt.appendChild (lienTexte);

        // ajout de l'auteur 
        var auteur = document.createElement ("span");
        auteur.class = "auteur";
        auteur.innerHTML = 'Ajouté par ' + reponseElt.auteur;
        titreElt.appendChild (auteur);

         }); //for Each

         });//ajaxGet

    };// fonction d'affichage des liens

afficherTable(); // on affiche tous les liens présents dans le serveur

saisieNouveauLien(); //ajout d'un nouveau lien

function saisieNouveauLien (e) { // fonction qui ajoute un nouveau lien
        
    var bouton1Elt = document.createElement("button"); // on crée le bouton "Ajouter un lien" dans "formulaire1Elt"
    bouton1Elt.textContent = "Ajouter un lien";
    formulaire1Elt.appendChild (bouton1Elt);
    
    bouton1Elt.addEventListener ("click", function (e) {   //  évènement "click" sur le bouton1Elt 
        e.preventDefault();
        bouton1Elt.style.display = "none"; //effacement du bouton "bouton1Elt"

        // affichage du champ de saisie "titre"

        var titreElt = document.createElement("input");
        titreElt.type = "text";
        titreElt.placeholder = "Entrez le titre du lien";
        formulaire2Elt.appendChild (titreElt);

        // affichage du champ de saisie "url"

        var urlElt = document.createElement ("input");
        urlElt.placeholder = "Entrez l'URL du lien";
        urlElt.type = "text";
        formulaire2Elt.appendChild (urlElt); 

        urlElt.addEventListener ("change", function () { // vérification de la conformité du début de l'url saisie

            urlElt.innerHTML = "";  

            //vérification de la conformité du début de l'url saisie
            if ((urlElt.value.indexOf ("http://") !== 0) && (urlElt.value.indexOf ("https://") !== 0)) { 

                urlElt.value =  "http://" + urlElt.value; 

            } else {        
               }; 
        });//vérification de la conformité du début de l'url saisie
        
        // affichage du champ de saisie "Auteur"

        var auteurElt = document.createElement ("input");
        auteurElt.placeholder = "Entrez l'auteur du lien";
        auteurElt.name = "text";
        formulaire2Elt.appendChild (auteurElt);  

        var bouton2Elt = document.createElement ("button"); // on crée le bouton2Elt "Ajouter", après les trois champs de saisie
        bouton2Elt.textContent = "Ajouter";
        formulaire2Elt.appendChild (bouton2Elt);

        enterKeyHasNoAction (); // blocage de la validation du formulaire si on fait "Enter" sur un champ de saisie

        function enterKeyHasNoAction () {// fonction de blocage de la validation du formulaire si on fait "Enter" sur un champ de saisie
        var inputs = document.getElementsByTagName ('input');
        for (var i =0 ; i < inputs.length ; i++)
        {
                inputs[i].onkeypress = function (evenement) {
                    //renvoie true pour toute autre touche que Enter
                    return (evenement.keyCode != 13);
            };
        }
    };

        function alertEmpty (emptyField, e)  { // fonction pour afficher un message d'alerte "saisissez un champ"
        var alertElt = document.createElement ("p");
        alertElt.textContent = "Saisissez " + emptyField+ ", SVP !";
        alertElt.style.color = "red";
        alertElt.style.fontFamily = "Courier New";
        alertElt.style.fontSize = "2.0em";
        formulaire2Elt.appendChild (alertElt);
        e.preventDefault ();

     };  // fin de la fonction pour afficher un message d'alerte "saisissez un champ"

        bouton2Elt.addEventListener ("click", function(e) { // évènement "click" sur le bouton bouton2Elt "Ajouter"

        // vérification que les champs sont tous renseignés

            if (!titreElt.value) {
                alertEmpty ("un titre", e); 
                e.preventDefault ();
            } else {
                if ((!urlElt.value)||(urlElt.value ==="http://")) {
                    alertEmpty ("une URL", e);  

            } else {
                if (!auteurElt.value) {
                    alertEmpty ("un auteur", e);

            } else {
                
                formulaire2Elt.innerHTML = ""; // RAZ de formulaire2Elt
                
                bouton1Elt.style.display = "block"; // faire réapparaître le bouton "bouton1Elt"

                // traitement du nouveau lien
                
                var nouveauLien = { 
                    titre : titreElt.value,
                    url : urlElt.value,
                    auteur : auteurElt.value
                       }; 

                ajaxPost("https://oc-jswebsrv.herokuapp.com/api/lien", nouveauLien, function (reponse) {//envoi du nouveau lien au serveur

                    var confirmationElt = document.createElement("message"); // affichage du message de confirmation
                    confirmationElt.textContent = 'Le lien "' + nouveauLien.titre + '" a été rajouté';
                    formulaire1Elt.insertBefore (confirmationElt, bouton1Elt);

                    setTimeout (function () {// le message de confirmation disparaît au bout de 2 secondes
                            confirmationElt.innerHTML = ""; 
                    }, 2000);

                    // On affiche le nouveau lien avant les liens déjà affichés

                    var titreElt = document.createElement("h2");   

                    // Ajout du lien du titre
                    var lienDuTitreElt = document.createElement("a");
                    lienDuTitreElt.textContent = nouveauLien.titre + "  " ;
                    lienDuTitreElt.style.color = "#428bca";
                    lienDuTitreElt.href = nouveauLien.url;
                    titreElt.appendChild (lienDuTitreElt);

                    // Ajout du texte du lien dans le titre
                    var lienTexte = document.createElement("h3");
                    lienTexte.class = "lien";
                    lienTexte.textContent = nouveauLien.url;
                    titreElt.appendChild (lienTexte);

                    // Ajout de l'auteur dans le contenu
                    var auteur = document.createElement ("span");
                    auteur.class = "auteur";
                    auteur.innerHTML = 'Ajouté par ' + nouveauLien.auteur;
                    titreElt.appendChild (auteur);

                    liensElt.insertBefore (titreElt, liensElt.querySelector("h2"));

            }, true);//Envoi du nouveau lien au serveur

            };//else
            };//else
            };//else

        });//listerner bouton2Elt "Ajouter"
    });//évènement "click" sur le bouton1Elt
        
    };// définition de la fonction qui ajoute un nouveau lien


        





    
// ======================================
// MIJN BOODSCHAPPENLIJST
// ======================================


// ======================================
// ELEMENTEN
// ======================================

const productInput =
    document.getElementById("productInput");

const aantalInput =
    document.getElementById("aantalInput");

const eenheidInput =
    document.getElementById("eenheidInput");

const winkelInput =
    document.getElementById("winkelInput");

const toevoegenKnop =
    document.getElementById("toevoegen");

const boodschappenLijst =
    document.getElementById("boodschappenLijst");

const legeLijst =
    document.getElementById("legeLijst");

const allesWissenKnop =
    document.getElementById("allesWissen");


// ======================================
// OPSLAG
// ======================================

const opslagNaam =
    "mijnBoodschappenlijst";


// ======================================
// WINKELS
// ======================================

const winkels = [

    "Albert Heijn",

    "Aldi",

    "Toko",

    "Jumbo",

    "Lidl"

];


// ======================================
// OPSLAG LADEN
// ======================================

function productenLaden() {

    try {

        const opgeslagen =
            localStorage.getItem(
                opslagNaam
            );


        if (!opgeslagen) {

            return [];

        }


        const data =
            JSON.parse(opgeslagen);


        if (!Array.isArray(data)) {

            return [];

        }


        return data;

    } catch (error) {

        console.error(
            "Fout bij laden boodschappen:",
            error
        );

        return [];

    }

}


let producten =
    productenLaden();


// ======================================
// BESTAANDE PRODUCTEN AANPASSEN
// ======================================
//
// Producten uit de oude versie hadden
// nog geen winkel.
//
// Deze krijgen automatisch
// Albert Heijn.
//

producten =
    producten.map(product => {

        return {

            naam:
                product.naam || "",

            aantal:
                Number(product.aantal) > 0
                    ? Number(product.aantal)
                    : 1,

            eenheid:
                product.eenheid || "st",

            winkel:
                winkels.includes(
                    product.winkel
                )
                    ? product.winkel
                    : "Albert Heijn",

            gekocht:
                product.gekocht === true

        };

    });


slaProductenOp();


// ======================================
// OPSLAAN
// ======================================

function slaProductenOp() {

    try {

        localStorage.setItem(

            opslagNaam,

            JSON.stringify(
                producten
            )

        );

    } catch (error) {

        console.error(
            "Fout bij opslaan:",
            error
        );

        alert(
            "De boodschappen konden niet worden opgeslagen."
        );

    }

}


// ======================================
// STAPGROOTTE
// ======================================

function bepaalStap(eenheid) {

    if (eenheid === "st") {

        return 1;

    }


    if (
        eenheid === "g" ||
        eenheid === "ml"
    ) {

        return 50;

    }


    return 1;

}


// ======================================
// EENHEID WEERGEVEN
// ======================================

function toonEenheid(eenheid) {

    if (eenheid === "g") {

        return "g";

    }


    if (eenheid === "ml") {

        return "ml";

    }


    return "st";

}


// ======================================
// WINKEL EMOJI
// ======================================

function winkelEmoji(winkel) {

    if (winkel === "Toko") {

        return "🏮";

    }


    return "🛒";

}


// ======================================
// WINKEL KLASSE
// ======================================

function winkelKlasse(winkel) {

    return winkel
        .toLowerCase()
        .replace(
            /[^a-z0-9]+/g,
            "-"
        );

}


// ======================================
// LIJST WEERGEVEN
// ======================================

function toonProducten() {

    boodschappenLijst.innerHTML = "";


    if (producten.length === 0) {

        controleerLegeLijst();

        return;

    }


    // ----------------------------------
    // WINKELS DOORLOPEN
    // ----------------------------------

    winkels.forEach(
        winkel => {

            const winkelProducten =
                producten.filter(
                    product =>
                        product.winkel ===
                        winkel
                );


            // Geen producten?
            // Dan geen winkelkop tonen.

            if (
                winkelProducten.length === 0
            ) {

                return;

            }


            maakWinkelSectie(
                winkel,
                winkelProducten
            );

        }
    );


    controleerLegeLijst();

}


// ======================================
// WINKEL SECTIE MAKEN
// ======================================

function maakWinkelSectie(
    winkel,
    winkelProducten
) {

    const winkelSectie =
        document.createElement(
            "section"
        );


    winkelSectie.className =
        "winkel-sectie";


    winkelSectie.classList.add(
        winkelKlasse(winkel)
    );


    // ==================================
    // WINKEL KOP
    // ==================================

    const winkelKop =
        document.createElement(
            "div"
        );


    winkelKop.className =
        "winkel-kop";


    const winkelNaam =
        document.createElement(
            "h2"
        );


    winkelNaam.textContent =
        `${winkelEmoji(winkel)} ${winkel}`;


    const aantal =
        document.createElement(
            "span"
        );


    aantal.className =
        "winkel-aantal";


    aantal.textContent =
        `${winkelProducten.length} ${
            winkelProducten.length === 1
                ? "product"
                : "producten"
        }`;


    winkelKop.appendChild(
        winkelNaam
    );


    winkelKop.appendChild(
        aantal
    );


    winkelSectie.appendChild(
        winkelKop
    );


    // ==================================
    // PRODUCTEN
    // ==================================

    const productenContainer =
        document.createElement(
            "div"
        );


    productenContainer.className =
        "winkel-producten";


    winkelProducten.forEach(
        product => {

            const echteIndex =
                producten.indexOf(
                    product
                );


            maakProductElement(
                product,
                echteIndex,
                productenContainer
            );

        }
    );


    winkelSectie.appendChild(
        productenContainer
    );


    boodschappenLijst.appendChild(
        winkelSectie
    );

}


// ======================================
// PRODUCT ELEMENT MAKEN
// ======================================

function maakProductElement(
    product,
    index,
    container
) {

    const lijstItem =
        document.createElement(
            "div"
        );


    lijstItem.classList.add(
        "product"
    );


    if (product.gekocht) {

        lijstItem.classList.add(
            "gekocht"
        );

    }


    // ==================================
    // CHECKBOX
    // ==================================

    const checkbox =
        document.createElement(
            "input"
        );


    checkbox.type =
        "checkbox";


    checkbox.checked =
        product.gekocht;


    checkbox.title =
        "Markeer als gekocht";


    checkbox.addEventListener(
        "change",
        () => {

            product.gekocht =
                checkbox.checked;


            lijstItem.classList.toggle(
                "gekocht",
                checkbox.checked
            );


            slaProductenOp();

        }
    );


    // ==================================
    // PRODUCTNAAM
    // ==================================

    const productNaam =
        document.createElement(
            "span"
        );


    productNaam.className =
        "product-naam";


    productNaam.textContent =
        product.naam;


    // ==================================
    // AANTAL BEDIENING
    // ==================================

    const aantalBediening =
        document.createElement(
            "div"
        );


    aantalBediening.className =
        "aantal-bediening";


    // ==================================
    // MIN
    // ==================================

    const minKnop =
        document.createElement(
            "button"
        );


    minKnop.className =
        "aantal-knop min";


    minKnop.textContent =
        "−";


    minKnop.title =
        "Hoeveelheid verminderen";


    minKnop.addEventListener(
        "click",
        () => {

            const stap =
                bepaalStap(
                    product.eenheid
                );


            product.aantal =
                Math.max(

                    stap,

                    product.aantal -
                    stap

                );


            slaProductenOp();

            toonProducten();

        }
    );


    // ==================================
    // HOEVEELHEID
    // ==================================

    const hoeveelheid =
        document.createElement(
            "span"
        );


    hoeveelheid.className =
        "hoeveelheid";


    hoeveelheid.textContent =
        `${product.aantal} ${
            toonEenheid(
                product.eenheid
            )
        }`;


    // ==================================
    // PLUS
    // ==================================

    const plusKnop =
        document.createElement(
            "button"
        );


    plusKnop.className =
        "aantal-knop plus";


    plusKnop.textContent =
        "+";


    plusKnop.title =
        "Hoeveelheid verhogen";


    plusKnop.addEventListener(
        "click",
        () => {

            const stap =
                bepaalStap(
                    product.eenheid
                );


            product.aantal +=
                stap;


            slaProductenOp();

            toonProducten();

        }
    );


    aantalBediening.appendChild(
        minKnop
    );


    aantalBediening.appendChild(
        hoeveelheid
    );


    aantalBediening.appendChild(
        plusKnop
    );


    // ==================================
    // VERWIJDEREN
    // ==================================

    const verwijderKnop =
        document.createElement(
            "button"
        );


    verwijderKnop.className =
        "verwijder";


    verwijderKnop.textContent =
        "🗑️";


    verwijderKnop.title =
        "Product verwijderen";


    verwijderKnop.addEventListener(
        "click",
        () => {

            const bevestiging =
                confirm(
                    `Weet je zeker dat je "${product.naam}" wilt verwijderen?`
                );


            if (!bevestiging) {

                return;

            }


            producten.splice(
                index,
                1
            );


            slaProductenOp();

            toonProducten();

        }
    );


    // ==================================
    // PRODUCT OPBOUWEN
    // ==================================

    lijstItem.appendChild(
        checkbox
    );


    lijstItem.appendChild(
        productNaam
    );


    lijstItem.appendChild(
        aantalBediening
    );


    lijstItem.appendChild(
        verwijderKnop
    );


    container.appendChild(
        lijstItem
    );

}


// ======================================
// PRODUCT TOEVOEGEN
// ======================================

function productToevoegen() {

    const naam =
        productInput.value.trim();


    let aantal =
        Number(
            aantalInput.value
        );


    const eenheid =
        eenheidInput.value;


    const winkel =
        winkelInput.value;


    // ==================================
    // GEEN PRODUCT
    // ==================================

    if (naam === "") {

        productInput.focus();

        return;

    }


    // ==================================
    // AANTAL CONTROLEREN
    // ==================================

    if (
        isNaN(aantal) ||
        aantal < 1
    ) {

        aantal = 1;

    }


    // ==================================
    // GRAM / ML
    // ==================================

    if (
        eenheid === "g" ||
        eenheid === "ml"
    ) {

        aantal =
            Math.round(
                aantal / 50
            ) * 50;


        if (aantal < 50) {

            aantal = 50;

        }

    }


    // ==================================
    // BESTAAND PRODUCT ZOEKEN
    // ==================================

    const bestaandProduct =
        producten.find(
            product =>

                product.naam
                    .toLowerCase() ===
                naam.toLowerCase()

                &&

                product.eenheid ===
                eenheid

                &&

                product.winkel ===
                winkel

        );


    // ==================================
    // BESTAAND PRODUCT
    // ==================================

    if (bestaandProduct) {

        bestaandProduct.aantal +=
            aantal;


        // Opnieuw toevoegen betekent
        // dat het product weer nodig is.

        bestaandProduct.gekocht =
            false;

    }


    // ==================================
    // NIEUW PRODUCT
    // ==================================

    else {

        producten.push({

            naam:
                naam,

            aantal:
                aantal,

            eenheid:
                eenheid,

            winkel:
                winkel,

            gekocht:
                false

        });

    }


    // ==================================
    // OPSLAAN
    // ==================================

    slaProductenOp();


    // ==================================
    // LIJST TONEN
    // ==================================

    toonProducten();


    // ==================================
    // INPUT RESETTEN
    // ==================================

    productInput.value =
        "";

    aantalInput.value =
        1;

    eenheidInput.value =
        "st";

    winkelInput.value =
        "Albert Heijn";


    productInput.focus();

}


// ======================================
// ENTER PRODUCT
// ======================================

productInput.addEventListener(
    "keydown",
    event => {

        if (
            event.key ===
            "Enter"
        ) {

            event.preventDefault();

            productToevoegen();

        }

    }
);


// ======================================
// ENTER AANTAL
// ======================================

aantalInput.addEventListener(
    "keydown",
    event => {

        if (
            event.key ===
            "Enter"
        ) {

            event.preventDefault();

            productToevoegen();

        }

    }
);


// ======================================
// ENTER WINKEL
// ======================================

winkelInput.addEventListener(
    "keydown",
    event => {

        if (
            event.key ===
            "Enter"
        ) {

            event.preventDefault();

            productToevoegen();

        }

    }
);


// ======================================
// TOEVOEGEN KNOP
// ======================================

toevoegenKnop.addEventListener(
    "click",
    productToevoegen
);


// ======================================
// ALLES WISSEN
// ======================================

allesWissenKnop.addEventListener(
    "click",
    () => {

        if (
            producten.length === 0
        ) {

            return;

        }


        const bevestigen =
            confirm(

                "Weet je zeker dat je de hele boodschappenlijst wilt wissen?"

            );


        if (!bevestigen) {

            return;

        }


        producten = [];


        slaProductenOp();


        toonProducten();

    }
);


// ======================================
// LEGE LIJST
// ======================================

function controleerLegeLijst() {

    if (
        producten.length === 0
    ) {

        legeLijst.style.display =
            "block";

    } else {

        legeLijst.style.display =
            "none";

    }

}


// ======================================
// START
// ======================================

toonProducten();

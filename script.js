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

const winkelsContainer =
    document.getElementById("winkelsContainer");

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
// PRODUCTEN LADEN
// ======================================

let producten = [];

try {

    const opgeslagenProducten =
        localStorage.getItem(
            opslagNaam
        );


    if (opgeslagenProducten) {

        const geladen =
            JSON.parse(
                opgeslagenProducten
            );


        if (Array.isArray(laden)) {

            producten = geladen;

        }

    }

} catch (error) {

    console.error(
        "Fout bij laden boodschappen:",
        error
    );

    producten = [];

}


// ======================================
// OUDE PRODUCTEN OMZETTEN
// ======================================
//
// Producten uit de vorige versie hadden
// nog geen winkel.
//
// Deze worden automatisch bij Albert Heijn
// geplaatst zodat niets verloren gaat.
// ======================================

producten =
    producten.map(
        product => {

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

        }
    );


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

function bepaalStap(
    eenheid
) {

    if (
        eenheid === "st"
    ) {

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

function toonEenheid(
    eenheid
) {

    if (
        eenheid === "g"
    ) {

        return "g";

    }


    if (
        eenheid === "ml"
    ) {

        return "ml";

    }


    return "st";

}


// ======================================
// WINKEL ICOON
// ======================================

function winkelIcoon(
    winkel
) {

    if (
        winkel === "Albert Heijn"
    ) {

        return "🛒";

    }


    if (
        winkel === "Aldi"
    ) {

        return "🔵";

    }


    if (
        winkel === "Toko"
    ) {

        return "🌶️";

    }


    if (
        winkel === "Jumbo"
    ) {

        return "🟡";

    }


    if (
        winkel === "Lidl"
    ) {

        return "🔵";

    }


    return "🏪";

}


// ======================================
// WINKEL KLASSE
// ======================================

function winkelKlasse(
    winkel
) {

    return winkel
        .toLowerCase()
        .replace(
            /\s+/g,
            "-"
        );

}


// ======================================
// LIJST WEERGEVEN
// ======================================

function toonProducten() {

    winkelsContainer.innerHTML =
        "";


    // ----------------------------------
    // CONTROLEREN OF LIJST LEEG IS
    // ----------------------------------

    if (
        producten.length === 0
    ) {

        legeLijst.style.display =
            "block";

        return;

    }


    legeLijst.style.display =
        "none";


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
        `winkel-sectie ${winkelKlasse(winkel)}`;


    // ----------------------------------
    // WINKEL KOP
    // ----------------------------------

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
        `${winkelIcoon(winkel)} ${winkel}`;


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


    // ----------------------------------
    // PRODUCTLIJST
    // ----------------------------------

    const productLijst =
        document.createElement(
            "ul"
        );


    productLijst.className =
        "winkel-producten";


    winkelProducten.forEach(
        product => {

            const echteIndex =
                producten.indexOf(
                    product
                );


            const productElement =
                maakProductElement(
                    product,
                    echteIndex
                );


            productLijst.appendChild(
                productElement
            );

        }
    );


    winkelSectie.appendChild(
        productLijst
    );


    winkelsContainer.appendChild(
        winkelSectie
    );

}


// ======================================
// PRODUCT ELEMENT MAKEN
// ======================================

function maakProductElement(
    product,
    index
) {

    const lijstItem =
        document.createElement(
            "li"
        );


    lijstItem.className =
        "product";


    if (
        product.gekocht
    ) {

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


    checkbox.setAttribute(
        "aria-label",
        `${product.naam} gekocht`
    );


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
    // HOEVEELHEID
    // ==================================

    const hoeveelheid =
        document.createElement(
            "span"
        );


    hoeveelheid.className =
        "hoeveelheid";


    hoeveelheid.textContent =
        `${product.aantal} ${toonEenheid(product.eenheid)}`;


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
                    product.aantal - stap
                );


            slaProductenOp();

            toonProducten();

        }
    );


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


    // ==================================
    // AANTAL BEDIENING
    // ==================================

    const aantalBediening =
        document.createElement(
            "div"
        );


    aantalBediening.className =
        "aantal-bediening";


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


            if (
                !bevestiging
            ) {

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


    return lijstItem;

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


    // ----------------------------------
    // PRODUCT CONTROLEREN
    // ----------------------------------

    if (
        naam === ""
    ) {

        productInput.focus();

        return;

    }


    // ----------------------------------
    // AANTAL CONTROLEREN
    // ----------------------------------

    if (
        isNaN(aantal) ||
        aantal < 1
    ) {

        aantal = 1;

    }


    // ----------------------------------
    // GRAM / ML AFRONDEN
    // ----------------------------------

    if (
        eenheid === "g" ||
        eenheid === "ml"
    ) {

        aantal =
            Math.round(
                aantal / 50
            ) * 50;


        if (
            aantal < 50
        ) {

            aantal = 50;

        }

    }


    // ----------------------------------
    // BESTAAND PRODUCT ZOEKEN
    // ----------------------------------

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


    // ----------------------------------
    // BESTAAND PRODUCT
    // ----------------------------------

    if (
        bestaandProduct
    ) {

        bestaandProduct.aantal +=
            aantal;


        // Opnieuw toevoegen =
        // weer nodig

        bestaandProduct.gekocht =
            false;

    }


    // ----------------------------------
    // NIEUW PRODUCT
    // ----------------------------------

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


    // ----------------------------------
    // OPSLAAN
    // ----------------------------------

    slaProductenOp();


    // ----------------------------------
    // WEERGEVEN
    // ----------------------------------

    toonProducten();


    // ----------------------------------
    // INPUT RESETTEN
    // ----------------------------------

    productInput.value =
        "";

    aantalInput.value =
        "1";

    eenheidInput.value =
        "st";


    // Winkel blijft staan.
    // Dat is handig als je meerdere
    // producten bij dezelfde winkel
    // wilt toevoegen.


    productInput.focus();

}


// ======================================
// ENTER PRODUCT
// ======================================

productInput.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Enter"
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
            event.key === "Enter"
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
            event.key === "Enter"
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


        const bevestiging =
            confirm(
                "Weet je zeker dat je de hele boodschappenlijst wilt wissen?"
            );


        if (
            !bevestiging
        ) {

            return;

        }


        producten = [];


        slaProductenOp();


        toonProducten();

    }
);


// ======================================
// START
// ======================================

toonProducten();

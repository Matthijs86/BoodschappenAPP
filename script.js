// ======================================
// MIJN BOODSCHAPPENLIJST
// JAVASCRIPT
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

const toevoegenKnop =
    document.getElementById("toevoegen");

const boodschappenLijst =
    document.getElementById("boodschappenLijst");

const legeLijst =
    document.getElementById("legeLijst");

const allesWissenKnop =
    document.getElementById("allesWissen");

const winkelKnoppen =
    document.querySelectorAll(".winkel-knop");

const alleWinkelsKnop =
    document.getElementById("alleWinkelsKnop");

const gekozenWinkel =
    document.getElementById("gekozenWinkel");


// ======================================
// OPSLAG
// ======================================

const opslagNaam =
    "mijnBoodschappenlijst";


// ======================================
// WINKELS
// ======================================

let huidigeWinkel = null;


// ======================================
// PRODUCTEN LADEN
// ======================================

let producten =
    JSON.parse(
        localStorage.getItem(opslagNaam)
    ) || [];


// ======================================
// OUDE PRODUCTEN AANPASSEN
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

                gekocht:
                    product.gekocht === true,

                winkel:
                    product.winkel ||
                    "Alle winkels"

            };

        }
    );


// ======================================
// OPSLAAN
// ======================================

function slaProductenOp() {

    localStorage.setItem(
        opslagNaam,
        JSON.stringify(producten)
    );

}


// ======================================
// STAPGROOTTE
// ======================================

function bepaalStap(
    eenheid
) {

    if (
        eenheid === "g" ||
        eenheid === "ml"
    ) {

        return 50;

    }

    return 1;

}


// ======================================
// EENHEID
// ======================================

function toonEenheid(
    eenheid
) {

    if (eenheid === "g") {

        return "g";

    }

    if (eenheid === "ml") {

        return "ml";

    }

    return "st";

}


// ======================================
// PRODUCTEN WEERGEVEN
// ======================================

function toonProducten() {

    boodschappenLijst.innerHTML = "";


    const zichtbareProducten =
        producten.filter(
            product => {

                if (!huidigeWinkel) {

                    return true;

                }

                return (
                    product.winkel ===
                    huidigeWinkel
                );

            }
        );


    zichtbareProducten.forEach(
        product => {

            const echteIndex =
                producten.indexOf(
                    product
                );

            maakProductElement(
                product,
                echteIndex
            );

        }
    );


    controleerLegeLijst(
        zichtbareProducten
    );

}


// ======================================
// PRODUCT ELEMENT
// ======================================

function maakProductElement(
    product,
    index
) {

    const lijstItem =
        document.createElement("li");


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
        document.createElement("input");

    checkbox.type =
        "checkbox";

    checkbox.checked =
        product.gekocht;


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
        document.createElement("span");

    productNaam.classList.add(
        "product-naam"
    );

    productNaam.textContent =
        product.naam;


    // ==================================
    // WINKEL LABEL
    // ==================================

    const winkelLabel =
        document.createElement("small");

    winkelLabel.classList.add(
        "product-winkel"
    );

    winkelLabel.textContent =
        product.winkel;


    // ==================================
    // HOEVEELHEID
    // ==================================

    const hoeveelheid =
        document.createElement("span");

    hoeveelheid.classList.add(
        "hoeveelheid"
    );

    hoeveelheid.textContent =
        `${product.aantal} ${toonEenheid(product.eenheid)}`;


    // ==================================
    // MIN KNOP
    // ==================================

    const minKnop =
        document.createElement("button");

    minKnop.classList.add(
        "aantal-knop",
        "min"
    );

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
    // PLUS KNOP
    // ==================================

    const plusKnop =
        document.createElement("button");

    plusKnop.classList.add(
        "aantal-knop",
        "plus"
    );

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
        document.createElement("div");

    aantalBediening.classList.add(
        "aantal-bediening"
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
        document.createElement("button");

    verwijderKnop.classList.add(
        "verwijder"
    );

    verwijderKnop.textContent =
        "🗑️";

    verwijderKnop.title =
        "Product verwijderen";


    verwijderKnop.addEventListener(
        "click",
        () => {

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


    const naamContainer =
        document.createElement("div");

    naamContainer.classList.add(
        "naam-container"
    );


    naamContainer.appendChild(
        productNaam
    );

    naamContainer.appendChild(
        winkelLabel
    );


    lijstItem.appendChild(
        naamContainer
    );


    lijstItem.appendChild(
        aantalBediening
    );


    lijstItem.appendChild(
        verwijderKnop
    );


    boodschappenLijst.appendChild(
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
    // WINKEL
    // ==================================

    const winkel =
        huidigeWinkel ||
        "Alle winkels";


    // ==================================
    // BESTAAND PRODUCT
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
    // BESTAAND
    // ==================================

    if (bestaandProduct) {

        bestaandProduct.aantal +=
            aantal;


        bestaandProduct.gekocht =
            false;

    }


    // ==================================
    // NIEUW
    // ==================================

    else {

        producten.push({

            naam:
                naam,

            aantal:
                aantal,

            eenheid:
                eenheid,

            gekocht:
                false,

            winkel:
                winkel

        });

    }


    // ==================================
    // OPSLAAN
    // ==================================

    slaProductenOp();


    // ==================================
    // WEERGEVEN
    // ==================================

    toonProducten();


    // ==================================
    // INPUT RESET
    // ==================================

    productInput.value =
        "";

    aantalInput.value =
        1;

    eenheidInput.value =
        "st";


    productInput.focus();

}


// ======================================
// WINKEL SELECTEREN
// ======================================

winkelKnoppen.forEach(
    knop => {

        knop.addEventListener(
            "click",
            () => {

                huidigeWinkel =
                    knop.dataset.winkel;


                winkelKnoppen.forEach(
                    andereKnop => {

                        andereKnop.classList
                            .remove(
                                "actief"
                            );

                    }
                );


                knop.classList.add(
                    "actief"
                );


                alleWinkelsKnop.classList
                    .remove(
                        "actief"
                    );


                gekozenWinkel.textContent =
                    `🏪 ${huidigeWinkel}`;


                toonProducten();

                productInput.focus();

            }
        );

    }
);


// ======================================
// ALLE WINKELS
// ======================================

alleWinkelsKnop.addEventListener(
    "click",
    () => {

        huidigeWinkel =
            null;


        winkelKnoppen.forEach(
            knop => {

                knop.classList.remove(
                    "actief"
                );

            }
        );


        alleWinkelsKnop.classList.add(
            "actief"
        );


        gekozenWinkel.textContent =
            "🛒 Alle winkels";


        toonProducten();

    }
);


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
// TOEVOEGEN
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

function controleerLegeLijst(
    zichtbareProducten
) {

    if (
        zichtbareProducten.length === 0
    ) {

        legeLijst.style.display =
            "block";

    }

    else {

        legeLijst.style.display =
            "none";

    }

}


// ======================================
// START
// ======================================

slaProductenOp();

toonProducten();

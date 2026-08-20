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


/* ==========================
   OPSLAG
========================== */

const opslagNaam =
    "mijnBoodschappenlijst";


let producten =
    JSON.parse(
        localStorage.getItem(opslagNaam)
    ) || [];


/* ==========================
   BESTAANDE PRODUCTEN
   OMZETTEN NAAR NIEUWE STRUCTUUR
========================== */

producten = producten.map(product => {

    return {

        naam: product.naam,

        aantal:
            Number(product.aantal) > 0
                ? Number(product.aantal)
                : 1,

        eenheid:
            product.eenheid || "st",

        gekocht:
            product.gekocht || false

    };

});


/* ==========================
   OPSLAAN
========================== */

function slaProductenOp() {

    localStorage.setItem(
        opslagNaam,
        JSON.stringify(producten)
    );

}


/* ==========================
   STAPGROOTTE
========================== */

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


/* ==========================
   EENHEID WEERGAVE
========================== */

function toonEenheid(eenheid) {

    if (eenheid === "g") {

        return "g";

    }

    if (eenheid === "ml") {

        return "ml";

    }

    return "st";

}


/* ==========================
   LIJST WEERGEVEN
========================== */

function toonProducten() {

    boodschappenLijst.innerHTML = "";


    producten.forEach(
        (product, index) => {

            maakProductElement(
                product,
                index
            );

        }
    );


    controleerLegeLijst();

}


/* ==========================
   PRODUCT ELEMENT MAKEN
========================== */

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


    /* ==========================
       CHECKBOX
    ========================== */

    const checkbox =
        document.createElement("input");


    checkbox.type = "checkbox";


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


    /* ==========================
       PRODUCTNAAM
    ========================== */

    const productNaam =
        document.createElement("span");


    productNaam.classList.add(
        "product-naam"
    );


    productNaam.textContent =
        product.naam;


    /* ==========================
       HOEVEELHEID
    ========================== */

    const hoeveelheid =
        document.createElement("span");


    hoeveelheid.classList.add(
        "hoeveelheid"
    );


    hoeveelheid.textContent =
        `${product.aantal} ${toonEenheid(product.eenheid)}`;


    /* ==========================
       MIN KNOP
    ========================== */

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
                bepaalStap(product.eenheid);


            product.aantal =
                Math.max(
                    stap,
                    product.aantal - stap
                );


            slaProductenOp();

            toonProducten();

        }
    );


    /* ==========================
       PLUS KNOP
    ========================== */

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
                bepaalStap(product.eenheid);


            product.aantal +=
                stap;


            slaProductenOp();

            toonProducten();

        }
    );


    /* ==========================
       AANTAL BEDIENING
    ========================== */

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


    /* ==========================
       DELETE BUTTON
    ========================== */

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


    /* ==========================
       PRODUCT OPBOUWEN
    ========================== */

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


    boodschappenLijst.appendChild(
        lijstItem
    );

}


/* ==========================
   PRODUCT TOEVOEGEN
========================== */

function productToevoegen() {

    const naam =
        productInput.value.trim();


    let aantal =
        Number(
            aantalInput.value
        );


    const eenheid =
        eenheidInput.value;


    /* ==========================
       GEEN PRODUCT
    ========================== */

    if (naam === "") {

        productInput.focus();

        return;

    }


    /* ==========================
       ONGELDIG AANTAL
    ========================== */

    if (
        isNaN(aantal) ||
        aantal < 1
    ) {

        aantal = 1;

    }


    /*
     * Voor gram en ml gebruiken
     * we stappen van 50.
     */

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


    /* ==========================
       BESTAAND PRODUCT ZOEKEN
    ========================== */

    const bestaandProduct =
        producten.find(product =>

            product.naam.toLowerCase() ===
            naam.toLowerCase()

            &&
            
            product.eenheid ===
            eenheid

    );


    /* ==========================
       BESTAAND PRODUCT
    ========================== */

    if (bestaandProduct) {

        bestaandProduct.aantal +=
            aantal;


        /*
         * Wanneer je een gekocht
         * product opnieuw toevoegt,
         * wordt het weer open gezet.
         */

        bestaandProduct.gekocht =
            false;

    }


    /* ==========================
       NIEUW PRODUCT
    ========================== */

    else {

        producten.push({

            naam: naam,

            aantal: aantal,

            eenheid: eenheid,

            gekocht: false

        });

    }


    /* ==========================
       OPSLAAN
    ========================== */

    slaProductenOp();


    /* ==========================
       LIJST OPNIEUW TONEN
    ========================== */

    toonProducten();


    /* ==========================
       INPUT RESETTEN
    ========================== */

    productInput.value = "";

    aantalInput.value = 1;

    eenheidInput.value = "st";


    /* ==========================
       CURSOR TERUG NAAR PRODUCT
    ========================== */

    productInput.focus();

}


/* ==========================
   ENTER IN PRODUCTVELD
========================== */

productInput.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key === "Enter"
        ) {

            event.preventDefault();

            productToevoegen();

        }

    }
);


/* ==========================
   ENTER IN AANTALVELD
========================== */

aantalInput.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key === "Enter"
        ) {

            event.preventDefault();

            productToevoegen();

        }

    }
);


/* ==========================
   TOEVOEGEN BUTTON
========================== */

toevoegenKnop.addEventListener(
    "click",
    productToevoegen
);

/* ==========================
   ALLES WISSEN
========================== */

allesWissenKnop.addEventListener(
    "click",
    () => {

        if (producten.length === 0) {

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


/* ==========================
   LEGE LIJST
========================== */

function controleerLegeLijst() {

    if (
        producten.length === 0
    ) {

        legeLijst.style.display =
            "block";

    }

    else {

        legeLijst.style.display =
            "none";

    }

}


/* ==========================
   START
========================== */

toonProducten();
let heroIdx = 0;
let bookNavIdx = 0;
let bookStage = 0;
let isSwitching = false;
let isPopup = false;
let heroImgInt;

let fullServices = "";
let bookingMessage = "Not entered";
let couponCode = "Not entered";
let codeApplied = false;
let price = 0;
let todayBox;
let isAdmin = false;

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
const now = new Date();
const todayDate = now.getDate();
const startPosition = now.getMonth();
let currentMonth = now.getMonth();
const startYear = now.getFullYear().toString();
let currentYear = now.getFullYear().toString();

const services = [
    {
        type: "face",
        name: "Threading",
        description: "Threading is a precise and natural method for removing unwanted facial hair, especially around the eyebrows, using a simple twisted thread. This ancient technique provides clean, defined lines and is gentle on sensitive skin. It’s chemical-free and ideal for shaping brows beautifully without irritation. Threading delivers longer-lasting results than many alternatives and leaves your skin smooth, neat, and glowing.",
        options: [
            "Eyebrows <span>-</span> £4",
            "Upper Lips <span>-</span> £3",
            "Lower Lip <span>-</span> £3",
            "Chin <span>-</span> £3",
            "Forehead <span>-</span> £3",
            "Chin extended to neck <span>-</span> £5",
            "Sides of face <span>-</span> £7",
            "Full Face inc. eyebrows <span>-</span> £15",
            "Full Face inc. eyebrows & neck <span>-</span> £18",
        ],
        benefits: [
"Achieve precise brow shaping without irritation, even on sensitive skin types.",
"No harsh chemicals used, just pure precision and smooth, defined facial features.",
"Removes even fine hair, leaving skin cleaner, softer, and beautifully smooth after treatment.",
"Quick treatment time with long-lasting results that grow back finer and less often."
]

    },
    {
        type: "face",
        name: "Lashes",
        description: "Our lash treatments enhance the natural beauty of your eyes by adding volume, length, and curl. Whether you choose extensions or lifts, we ensure a flawless, lightweight finish tailored to your style. These treatments eliminate the need for daily mascara, saving you time and effort. Walk out with captivating eyes that frame your face and elevate your everyday confidence effortlessly.",
        options: [
            "Strip lashes <span>-</span> £8",
            "Individual lashes <span>-</span> £25",
            "Removal of lashes <span>-</span> £8",
        ],
        benefits: [
"Wake up with fuller, longer lashes — no mascara or curling required daily.",
"Enhances your natural beauty with depth, lift, and seamless, eye-opening definition instantly.",
"Safe application process by professionals using only premium glue and lash materials.",
"Custom styles available to suit your personality, eye shape, and preferred boldness level."
]

    },
    {
        type: "skin",
        name: "Waxing",
        description: "Waxing provides a fast and effective way to remove unwanted hair from the root. It leaves your skin smooth and hair-free for weeks, making it a convenient alternative to shaving. Over time, hair regrows finer and more sparsely. We offer professional waxing for various areas, ensuring comfort, hygiene, and long-lasting results with minimal irritation—ideal for smooth, confident skin.",
        options: [
            "Eyebrows <span>-</span> £5",
            "Upper Lips <span>-</span> £4",
            "Lower Lip <span>-</span> £3",
            "Chin <span>-</span> £4",
            "Forehead <span>-</span> £4",
            "Chin extended to neck <span>-</span> £6",
            "Sides of face <span>-</span> £8",
            "Full Face inc. eyebrows <span>-</span> £20",
            "Full Face inc. eyebrows & neck <span>-</span> £23",
            "Half arms <span>-</span> £6",
            "Full arms <span>-</span> £10",
            "Under arms <span>-</span> £5",
            "Full arms & under arms <span>-</span> £14",
            "Half legs <span>-</span> £10",
            "Full legs <span>-</span> £15",
            "Buttocks <span>-</span> £8",
            "Hollywood Wax <span>-</span> £12",
            "Bikini Line <span>-</span> £5",
            "Stomach <span>-</span> £10",
            "Full Body <span>-</span> £45",
        ],
        benefits: [
"Longer-lasting smoothness compared to shaving — no stubble, just soft skin.",
"Removes hair from the root for slower regrowth and finer texture over time.",
"Reduces skin irritation by eliminating frequent shaving and cuts from razors.",
"Leaves skin silky, clean, and glowing with a boost of natural confidence."
]


    },
    {
        type: "face",
        name: "Tinting",
        description: "Tinting enhances your natural brows and lashes by adding semi-permanent colour for definition and depth. Perfect for light or sparse hair, it frames the face beautifully without the need for daily makeup. Safe and quick, our tinting service creates a polished look that lasts for weeks, giving you bolder, fuller features with zero effort. Wake up ready and radiant, every day.",
        options: [
            "Eyebrows <span>-</span> £8",
            "Eyelash <span>-</span> £10",
            "Lash & Brows <span>-</span> £16",
        ],
        benefits: [
"Enhances lashes or brows with lasting color — no daily makeup needed anymore.",
"Defines facial features naturally with safe, professional-grade dyes tailored to your complexion.",
"Smudge-proof color that withstands sweat, water, and time for effortless beauty daily.",
"Achieve a bolder, youthful look without overdoing it — subtle yet stunning definition guaranteed."
]
    },
    {
        type: "face",
        name: "Facials",
        description: "Our facials deeply cleanse, hydrate, and nourish your skin using high-quality, tailored treatments. They help reduce acne, dullness, and dryness while promoting circulation and relaxation. Every session is personalized for your skin type, leaving your face soft, radiant, and refreshed. Whether you seek a glow or a full reset, facials are perfect for maintaining healthy, beautiful skin from the inside out.",
        options: [
            "Deep Cleansing <span>-</span> £30",
            "Shahnaz <span>-</span> £30",
            "Lotus <span>-</span> £20",
            "Hydrating <span>-</span> £30",
            "D-Tan Pack <span>-</span> £10",
        ],
        benefits: [
"Deeply cleanses, exfoliates, and hydrates skin for a fresher, healthier facial glow.",
"Removes impurities and unclogs pores to fight acne, dullness, and early aging.",
"Boosts collagen and circulation while relieving tension — skin and soul refreshed together.",
"Tailored treatments using high-quality products based on your unique skin type needs."
]

    },
    {
        type: "skin",
        name: "Massage",
        description: "Experience deep relaxation and physical renewal with our therapeutic massages. Whether you need tension relief, stress reduction, or muscle recovery, our skilled techniques are customized to your needs. Massage improves circulation, eases aches, and brings calm to both body and mind. Let yourself unwind, breathe deeper, and restore balance—because you deserve to feel peaceful, well-rested, and recharged.",
        options: [
            "Head Massage <span>-</span> £20",
            "Full Body Massage <span>-</span> £40",
            "Hair SPA <span>-</span> £25",
        ],
        benefits: [
"Relieves muscle tension and stress, restoring balance to body and nervous system.",
"Improves blood flow, posture, and sleep through skilled, relaxing hands-on therapy sessions.",
"Custom massages designed to target your stress zones with precision and lasting calm.",
"Experience true physical release, mental peace, and spiritual renewal in every healing touch."
]

    },
    {
        type: "nails",
        name: "Manicure",
        description: "Our manicure service offers meticulous care for your hands and nails. We shape, file, and buff your nails, gently tend to cuticles, and hydrate your skin with nourishing treatments. Finished with your choice of polish or natural shine, our manicure leaves your hands looking elegant and feeling soft. It’s a perfect blend of relaxation and beauty, tailored to your style and needs.",
        options: [
            "Manicure <span>-</span> £20",
            "Pedicure <span>-</span> £25",
            "Mani & Pedi <span>-</span> £45",
        ],
        benefits: [
"Cleans, shapes, and nourishes nails for a polished and professional-looking finish.",
"Promotes nail health with gentle care, exfoliation, and long-lasting cuticle protection.",
"A relaxing, confidence-boosting treat that makes hands look fresh, soft, and well-groomed.",
"Choose from natural or bold finishes — always tailored to your personal style."
]

    },
    {
        type: "nails",
        name: "Nails",
        description: "Our nails service includes expert shaping, strengthening, and polishing to keep your nails healthy and beautiful. Whether you want classic polish, gel, or nail art, we customize each treatment for lasting shine and durability. We focus on nail health, ensuring your nails stay strong and vibrant. Our team uses quality products and techniques to give your nails a flawless, confident finish.",
        options: [
            "Gel Polish <span>-</span> £18",
            "Full Set with acrylic <span>-</span> £25",
            "Gel polish removal <span>-</span> £10",
        ],
        benefits: [
"Flawless nail designs with durable finish that resists chips and everyday wear.",
"Express your personality through vibrant colours, textures, and unique custom nail art.",
"Safe, salon-grade products that protect your natural nails while looking amazing.",
"Get creative, feel empowered — your nails will speak confidence without a word."
]

    },
    {
        type: "hair",
        name: "Hair Colour & Highlights",
        description: "Our nails service includes expert shaping, strengthening, and polishing to keep your nails healthy and beautiful. Whether you want classic polish, gel, or nail art, we customize each treatment for lasting shine and durability. We focus on nail health, ensuring your nails stay strong and vibrant. Our team uses quality products and techniques to give your nails a flawless, confident finish.",
        options: [
            "Roots Touch Up <span>-</span> £25",
            "Full Head From <span>-</span> £35",
            "Highlights Half Head From <span>-</span> £75",
            "Highlights Full Head From <span>-</span> £95",
            "Keratin Hair From <span>-</span> £95",
            "Smoothing From <span>-</span> £95",
        ],
        benefits: [
"Revive dull hair with radiant colour that enhances your natural skin tone beautifully.",
"Professional colour blends for dimension, shine, and head-turning, graceful transformation.",
"Subtle highlights or bold statements — tailored colour that expresses your unique personality.",
"Expert application ensures vibrant results while protecting hair health and shine long-term."
]

    },
    {
        type: "face",
        name: "Other Treatments",
        description: "Our specialized treatments enhance your natural beauty with subtle yet striking effects. LVL lifts and lengthens your lashes for an eye-opening look without mascara. Brow lamination smooths and shapes brows for fullness and definition. Henna brows add rich, natural tint, while tooth gems create a playful sparkle. Each treatment is expertly applied to boost your confidence and style with care.",
        options: [
            "Tooth Gems <span>-</span> £15",
            "Brow Lamination <span>-</span> £30",
            "LVL <span>-</span> £35",
            "Brow Lamination & LVL <span>-</span> £60",
            "Henna Brows <span>-</span> £30",
        ],
        benefits: [
"Add sparkle or shape — subtle details that make your beauty effortlessly stand out.",
"Tooth gems safely applied for charming, unique style with a radiant, confident smile.",
"Brow lamination and LVL lifts enhance natural features with zero harsh chemicals involved.",
"Henna brows create rich, lasting definition tailored perfectly to your face’s natural symmetry."
]

    },
    {
        type: "hair",
        name: "Ladies Haircut",
        description: "Our ladies’ haircut service offers precision and style tailored to your unique features and lifestyle. Whether you want a trendy trim, layered cut, or a bold new shape, our stylists listen carefully to deliver a flattering, easy-to-maintain look. We focus on enhancing your hair’s natural texture and health, leaving you feeling refreshed, confident, and ready to turn heads every day.",
        options: [
            "Wash, Cut & Style <span>-</span> £30",
            "Cut Only <span>-</span> £20",
            "Cut & Blow Dry <span>-</span> £25",
            "Wash & Style <span>-</span> £30",
            "Wash Simple Blow Dry <span>-</span> £20",
            "Wash Only <span>-</span> £5",
            "Bang Trim <span>-</span> £5",
            "Style (Curls, Straighten) <span>-</span> £20",
            "Girls Cut <span>-</span> £18",
        ],
        benefits: [
"Precision cuts designed to flatter your face shape and highlight your natural beauty.",
"From trims to full transformations, each cut is tailored with expert care and style.",
"Healthy, flowing hair begins with a great cut that supports strength and shape.",
"Walk out refreshed and radiant — a great haircut brings new energy and confidence."
]

    },
    {
        type: "hair",
        name: "Makeup & Hair Style",
        description: "Prepare for any occasion with our professional makeup and hair styling service. We create flawless, radiant makeup looks that highlight your best features and match your personal style. Paired with expertly styled hair—whether soft waves, sleek updos, or bold statements—our service ensures you look stunning, polished, and camera-ready for weddings, events, or everyday confidence.",
        options: [
            "Party Makeup From <span>-</span> £65",
            "Party Hair Style From <span>-</span> £35",
            "Bridal Makeup & Hair From <span>-</span> £300",
            "Full Bridal Package <span>-</span> £400",
        ],
        benefits: [
"Flawless makeup and hair styling for special days or a radiant everyday look.",
"Enhances your natural features while staying true to your personal taste and comfort.",
"Expert techniques ensure long-lasting, camera-ready results without damaging skin or hair.",
"Leave feeling beautiful, balanced, and ready — inside and out — for any occasion."
]

    },
    {
        type: "men",
        name: "Mens Services",
        description: "Our mens grooming services combine precision cuts, beard shaping, and tailored treatments to keep you looking sharp and confident. From classic trims to modern styles, we focus on clean lines and effortless maintenance. We also offer skin treatments and styling advice, ensuring a polished, fresh look that fits your lifestyle. Experience grooming designed specifically for the modern man’s needs and style.",
        options: [
            "Eyebrows Threading <span>-</span> £5",
            "Eyebrows Waxing <span>-</span> £6",
            "Cheeks <span>-</span> £6",
            "Cheeks wax <span>-</span> £7",
            "Mono-brow <span>-</span> £3.50",
            "Mono-brow wax <span>-</span> £4.50",
            "Beard shape <span>-</span> £7",
        ],
        benefits: [
"Tailored grooming services to enhance your masculine features with clean, sharp results.",
"From beard trims to haircuts, we offer the ultimate male grooming experience.",
"Gentlemen's services designed for comfort, precision, and lasting results that elevate your style.",
"Affordable luxury that helps you look sharp, feel confident, and maintain personal grooming."
]

    },
];

let url = "";

function createHtml(){
    let menu = document.createElement("div");
    menu.classList.add("menu-container");
    menu.innerHTML = `
        <div class="menu-x" onclick="closeMenu()">
            <div class="x-line x1"></div>
            <div class="x-line x2"></div>
        </div>
        <div class="menu-ul">
            <div class="menu-li menu-li-main">
                <div class="menu-li-txt">Treatments</div>
                <i class="fa-solid fa-chevron-right menu-chevron"></i>

                <div class="menu-dropdown">
                    <div class="menu-flex">
                        <div class="menu-drop-txt">Threading</div>
                        <img src="images/arrow.png" class="menu-arrow" />
                    </div>
                    <div class="menu-flex">
                        <div class="menu-drop-txt">Lashes</div>
                        <img src="images/arrow.png" class="menu-arrow" />
                    </div>
                    <div class="menu-flex">
                        <div class="menu-drop-txt">Waxing</div>
                        <img src="images/arrow.png" class="menu-arrow" />
                    </div>
                    <div class="menu-flex">
                        <div class="menu-drop-txt">Other treatments</div>
                        <img src="images/arrow.png" class="menu-arrow" />
                    </div>
                    <div class="menu-flex">
                        <div class="menu-drop-txt">Ladies haircut</div>
                        <img src="images/arrow.png" class="menu-arrow" />
                    </div>
                    <div class="menu-flex">
                        <div class="menu-drop-txt">Makeup & Hair style</div>
                        <img src="images/arrow.png" class="menu-arrow" />
                    </div>
                    <div class="menu-flex">
                        <div class="menu-drop-txt">Tinting</div>
                        <img src="images/arrow.png" class="menu-arrow" />
                    </div>
                    <div class="menu-flex">
                        <div class="menu-drop-txt">Facials</div>
                        <img src="images/arrow.png" class="menu-arrow" />
                    </div>
                    <div class="menu-flex">
                        <div class="menu-drop-txt">Massage</div>
                        <img src="images/arrow.png" class="menu-arrow" />
                    </div>
                    <div class="menu-flex">
                        <div class="menu-drop-txt">Manicure</div>
                        <img src="images/arrow.png" class="menu-arrow" />
                    </div>
                    <div class="menu-flex">
                        <div class="menu-drop-txt">Nails</div>
                        <img src="images/arrow.png" class="menu-arrow" />
                    </div>
                    <div class="menu-flex">
                        <div class="menu-drop-txt">Hair colour & Highlights</div>
                        <img src="images/arrow.png" class="menu-arrow" />
                    </div>
                    <div class="menu-flex">
                        <div class="menu-drop-txt">Mens services</div>
                        <img src="images/arrow.png" class="menu-arrow" />
                    </div>
                </div>
            </div>
            <a href="about.html#price-list" class="menu-li"><div class="menu-li-txt">Price list</div></a>
            <a href="about.html" class="menu-li"><div class="menu-li-txt">About us</div></a>
            <a href="testimonials.html" class="menu-li"><div class="menu-li-txt">Testimonials</div></a>
            <a href="gallery.html" class="menu-li"><div class="menu-li-txt">Photo Gallery</div></a>
            <a href="about.html#contact" class="menu-li"><div class="menu-li-txt">Contact Us</div></a>
            <a href="bookings.html" class="menu-li"><div class="menu-li-txt">Book Appointment</div></a>
        </div>
    `

    let btnText;
    let btnHref;
    if(!document.querySelector(".book-container")){
        btnText = "Book Now";
        btnHref = "bookings.html";
    } else {
        btnText = "Back Home";
        btnHref = "index.html";
    }
    let header = document.createElement("div");
    header.classList.add("header");
    header.innerHTML = `
        <div class="header-plant-box">
            <img src="images/plants/plant5.png" class="header-plant" />
        </div>

        <div class="header-flex">
            <img onclick="window.location.href = 'index.html';" src="images/FullLogo_Transparent.png" class="header-logo" />

            <div class="header-nav">
                <div class="serv-nav">
                    <div class="serv-link">Threading</div>
                    <div class="serv-link">Lashes</div>
                    <div class="serv-link">Waxing</div>
                    <div class="serv-link">Other Treatments</div>
                    <div class="serv-link">Ladies Haircut</div>
                    <div class="serv-link">Makeup & Hair Style</div>
                    <div class="serv-link">Tinting</div>
                    <div class="serv-link">Facials</div>
                    <div class="serv-link">Massage</div>
                    <div class="serv-link">Manicure</div>
                    <div class="serv-link">Nails</div>
                    <div class="serv-link">Hair Colour & Highlights</div>
                    <div class="serv-link">Mens Services</div>
                </div>

                <a href="index.html" class="header-link header-line">Home</a>
                <div class="header-link">Treatments <i class="fa-solid fa-chevron-down header-chevron"></i></div>
                <a href="about.html#price-list" class="header-link header-line">Price list</a>
                <a href="about.html" class="header-link header-line">About us</a>
                <a href="testimonials.html" class="header-link header-line">Testimonials</a>
                <a href="gallery.html" class="header-link header-line">Photo Gallery</a>
            </div>

            <a href="${btnHref}" class="btn-header">${btnText} <img src="images/arrow.png" class="foot-arrow" /></a>
            <div class="header-burger" onclick="openMenu()">
                <div class="burger-line"></div>
                <div class="burger-line"></div>
                <div class="burger-line"></div>
            </div>
        </div>
    `

    let footer = document.createElement("div");
    footer.classList.add("foot-bg");
    footer.innerHTML = `
        <div class="foot-container">
            <div class="foot-bot">
                <div class="fbot-left">
                    <img src="images/FullLogo_Transparent.png" class="foot-logo" />
                    <div class="foot-para">Discover NextDesign, an agency speicializing in web design and development. Elevate your brand's online presence with our tailored services.</div>
                    <a href="bookings.html" class="btn-foot">Book Appointment <img src="images/arrow.png" class="foot-arrow" /></a>
                </div>

                <div class="foot-nav">
                    <div class="foot-nav-col">
                        <div class="foot-label">Quick Links</div>
                        <a href="about.html" class="foot-txt">About us</a>
                        <a href="#services" class="foot-txt">Our services</a>
                        <a href="testimonials.html" class="foot-txt">Testimonials</a>
                        <a href="gallery.html" class="foot-txt">Gallery</a>
                        <a href="about.html#price-list" class="foot-txt">Price list</a>
                    </div>
                    <div class="foot-nav-col">
                        <div class="foot-label">Get in Touch</div>
                        <a href="bookings.html" class="foot-txt">Book now</a>
                        <a href="#contact" class="foot-txt">Message us</a>
                        <a href="#" class="foot-txt">Call us</a>
                        <a href="https://www.instagram.com/poojasbeauty2025/" target="_blank" class="foot-txt">Instagram</a>
                        <a href="about.html" class="foot-txt">Learn more</a>
                    </div>
                </div>
            </div>
            <div class="foot-copy">© 2025 Poojasbeautysalon — Site by <a href="https://nextdesignwebsite.com" target="_blank" class="foot-copy" style="text-decoration: underline;">Next Design</a>.</div>
        </div>
    `

    document.body.prepend(header);
    document.body.prepend(menu);
    document.body.appendChild(footer);
}
if(!document.querySelector(".header")){
    createHtml();
}

document.querySelector("div.header-link").addEventListener("click", () => {
    if(document.querySelector(".serv-nav").style.opacity == "1"){
        document.querySelector("div.header-link i").style.transform = "rotate(0deg)";
        document.querySelector(".serv-nav").style.opacity = "0";
        document.querySelector(".serv-nav").style.pointerEvents = "none";
    } else {
        document.querySelector("div.header-link i").style.transform = "rotate(-180deg)";
        document.querySelector(".serv-nav").style.opacity = "1";
        document.querySelector(".serv-nav").style.pointerEvents = "auto";
    }
});

document.addEventListener("click", (e) => {
    if(!document.querySelector(".serv-nav").contains(e.target) && !document.querySelector("div.header-link").contains(e.target) && document.querySelector(".serv-nav").style.opacity == "1"){
        document.querySelector("div.header-link i").style.transform = "rotate(0deg)";
        document.querySelector(".serv-nav").style.opacity = "0";
        document.querySelector(".serv-nav").style.pointerEvents = "none";
    }
});

document.querySelectorAll(".serv-link").forEach(li => {
    li.addEventListener("click", () => {
        window.location.href = "/services.html?service=" + li.textContent.toLowerCase().replace(/ /g, "-").replace(/&/g, "and");
    });
});

if(document.querySelector(".detail-container")){

    const params = new URLSearchParams(window.location.search);
    const serviceName = params.get("service");
    const serviceData = services.find(s => s.name.toLowerCase().replace(/ /g, "-").replace(/&/g, "and") === serviceName);

    if(serviceData){
        let serviceTypes = ["hair", "face", "skin", "nails", "men"];

        document.querySelector(".banner-title").textContent = serviceData.name;
        document.querySelectorAll(".detail-right-head")[0].textContent = serviceData.name;
        document.querySelectorAll(".detail-para")[0].textContent = serviceData.description;
        serviceData.options.forEach(option => {
            let newOption = document.createElement("div");
            newOption.classList.add("detail-pill");
            newOption.innerHTML = option;
            document.querySelector(".detail-pill-flex").appendChild(newOption);
        });
        document.querySelectorAll(".detail-ben-txt").forEach((txt, idx) => {
            txt.innerHTML = serviceData.benefits[idx];
        });
        document.querySelectorAll(".detail-li").forEach(li => {
            li.addEventListener("click", () => {
                window.location.href = "/services.html?service=" + li.textContent.toLowerCase().replace(/ /g, "-").replace(/&/g, "and");
            });
            if(li.innerHTML.includes(serviceData.name)){
                li.classList.add("detail-li-active");
                li.querySelector("i.detail-chevron").classList.add("detail-chevron-active");
            }
        });
        serviceTypes.forEach((type, idx) => {
            if(type == serviceData.type){
                document.querySelectorAll(".banner-img").forEach((img, imgIdx) => {
                    if(imgIdx == idx){
                        img.style.display = "block";
                    } else {
                        img.style.display = "none";
                    }
                }); 
            }
        });
    } else {
        //window.location.href = "/index.html";
        console.log("failed");
    }
}

if(document.querySelector(".offer-modal")){
    document.addEventListener("scroll", () => {
        let scroll = window.scrollY;
        if(scroll > 100 && !isPopup){
            isPopup = true;
            document.querySelector(".offer-modal").style.pointerEvents = "auto";
            document.querySelector(".offer-modal").style.opacity = "1";
        }
    });
    document.querySelector(".offer-modal").addEventListener("click", (e) => {
        if(!document.querySelector(".offer-img-container").contains(e.target)){
            closeOffer();
        }
    });
}
function closeOffer(){
    document.querySelector(".offer-modal").style.pointerEvents = "none";
    document.querySelector(".offer-modal").style.opacity = "0";
}

function openMenu(){
    document.querySelector(".menu-container").style.opacity = "1";
    document.querySelector(".menu-container").style.pointerEvents = "auto";
}
function closeMenu(){
    document.querySelector(".menu-container").style.opacity = "0";
    document.querySelector(".menu-container").style.pointerEvents = "none";
}
document.querySelector(".menu-li-main").addEventListener("click", (e) => {if(!document.querySelector(".menu-dropdown").contains(e.target)){
    if(document.querySelector(".menu-chevron").style.transform == "rotate(90deg)"){
        document.querySelector(".menu-dropdown").style.opacity = "0";
        document.querySelector(".menu-dropdown").style.pointerEvents = "none";
        setTimeout(() => {
            document.querySelector(".menu-li-main").style.paddingBottom = "15px";
            document.querySelector(".menu-chevron").style.transform = "rotate(0deg)";
        }, 100);
    } else {
        document.querySelector(".menu-li-main").style.paddingBottom = "510px";
        document.querySelector(".menu-chevron").style.transform = "rotate(90deg)";
        setTimeout(() => {
            document.querySelector(".menu-dropdown").style.opacity = "1";
            document.querySelector(".menu-dropdown").style.pointerEvents = "auto";
        }, 100);
    }
}});
document.querySelectorAll(".menu-flex").forEach(li => {
    li.addEventListener("click", (e) => {
        window.location.href = "/services.html?service=" + li.querySelector(".menu-drop-txt").textContent.toLowerCase().replace(/ /g, "-").replace(/&/g, "and");
    });
});

document.addEventListener("keydown", (e) => {
    if(e.key == "y"){
        console.log(window.innerWidth);
    }
});

function startHeroInt(){
    heroImgInt = setInterval(() => {
        isSwitching = true;
        if(heroIdx == 2){
            heroIdx = 0;
        } else {
            heroIdx++; 
        }
        document.querySelector(".hero-img-active").classList.remove("hero-img-active");
        document.querySelector(".hero-idx-active").classList.remove("hero-idx-active");
        setTimeout(() => {
            isSwitching = false;
            document.querySelectorAll(".hero-img")[heroIdx].classList.add("hero-img-active");
            document.querySelectorAll(".hero-idx-border")[heroIdx].classList.add("hero-idx-active");
        }, 50);
    }, 10000);
}
if(document.querySelector(".hero-img-active")){
    startHeroInt();
}

document.querySelectorAll(".hero-idx-border").forEach((border, idx) => {
    border.addEventListener("click", () => {
        if(!isSwitching){
            clearInterval(heroImgInt);
            isSwitching = true;
            heroIdx = idx;
            document.querySelector(".hero-img-active").classList.remove("hero-img-active");
            document.querySelector(".hero-idx-active").classList.remove("hero-idx-active");
            setTimeout(() => {
                document.querySelectorAll(".hero-img")[heroIdx].classList.add("hero-img-active");
                document.querySelectorAll(".hero-idx-border")[heroIdx].classList.add("hero-idx-active");
                isSwitching = false;
                startHeroInt();
            }, 50);        
        }
    });
});

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
          entry.target.style.position = "relative";
          entry.target.style.top = "0px";
          entry.target.style.opacity = "1";

        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.3,
});
document.querySelectorAll(".scroll-target").forEach(target => {
    observer.observe(target);
});

// choose treatment
document.querySelectorAll(".book-option").forEach(opt => {
    opt.addEventListener("click", () => {
        document.querySelectorAll(".book-ul-head").forEach(heading => {
            if(heading.textContent == opt.textContent){
                heading.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });
            }
        });
    });
});
document.querySelectorAll(".book-li").forEach(li => {
    li.addEventListener("click", () => {
        if(li.classList.contains("book-li-active")){
            li.classList.remove("book-li-active");

            document.querySelectorAll(".book-sum-flex").forEach(cont => {
                if(cont.querySelector(".book-sum-label").textContent == li.textContent.slice(0, (li.textContent.indexOf("-") - 1))){
                    document.querySelector(".book-sum-ul").removeChild(cont);
                    document.querySelector(".book-sum-total").textContent = "free";
                }
            });
            if(document.querySelectorAll(".book-sum-flex").length == 0){
                document.querySelector(".book-sum-default").style.display = "block";
                document.querySelector(".book-mobile").style.opacity = "0";
                document.querySelector(".book-mobile").style.pointerEvents = "none";
            }
        } else {
            li.classList.add("book-li-active");

            let section = document.createElement("div");
            section.classList.add("book-sum-flex");
            section.innerHTML = `
                <div class="book-sum-label">${li.textContent.slice(0, (li.textContent.indexOf("-") - 1))}</div>
                <div class="book-sum-price">${li.textContent.slice(li.textContent.indexOf("£"))}</div>
            `
            document.querySelector(".book-sum-ul").appendChild(section);

            document.querySelector(".book-sum-default").style.display = "none";
            let totalPrice = 0;
            document.querySelectorAll(".book-sum-price").forEach(price => {
                totalPrice = totalPrice + Number(price.textContent.slice(1));
            });
            document.querySelector(".book-sum-total").textContent = "£" + totalPrice;
            document.querySelector(".btn-book-sum").classList.remove("book-btn-inactive");

            document.querySelector(".book-code-total").textContent = "£" + totalPrice;
            document.querySelector(".book-mobile-head").textContent = "Total £" + totalPrice;
            if(document.querySelectorAll(".book-sum-flex").length == 1){
                document.querySelector(".book-mobile-txt").textContent = "1 Service";
            } else {
                document.querySelector(".book-mobile-txt").textContent = document.querySelectorAll(".book-sum-flex").length + " Services";
            }
            document.querySelector(".book-mobile").style.opacity = "1";
            document.querySelector(".book-mobile").style.pointerEvents = "auto";
        }
    });
});
function scrollBookNav(direction){
    if(direction == "right"){
        document.querySelectorAll("i.book-nav-chevron")[0].classList.remove("book-flow-inactive");
        bookNavIdx++;
        let scrollPercent = bookNavIdx * 0.25;
        document.querySelector(".book-option-flex").scrollTo({
            left: document.querySelector(".book-option-flex").scrollWidth * scrollPercent,
            behavior: "smooth"
        });
        if(bookNavIdx == 3){
            document.querySelectorAll("i.book-nav-chevron")[1].classList.add("book-flow-inactive");
        }
    } else {
        document.querySelectorAll("i.book-nav-chevron")[1].classList.remove("book-flow-inactive");
        bookNavIdx--;
        let scrollPercent = bookNavIdx * 0.25;
        document.querySelector(".book-option-flex").scrollTo({
            left: document.querySelector(".book-option-flex").scrollWidth * scrollPercent,
            behavior: "smooth"
        });
        if(bookNavIdx == 0){
            document.querySelectorAll("i.book-nav-chevron")[0].classList.add("book-flow-inactive");
        }
    }
}
document.querySelectorAll(".book-all-modal").forEach(modal => {
    modal.querySelector("i.modal-exit, i.book-show-x").addEventListener("click", () => {
        modal.style.opacity = "0";
        modal.style.pointerEvents = "none";
    });

    modal.addEventListener("click", (e) => {
        if(!modal.querySelector("div").contains(e.target)){
        modal.style.opacity = "0";
        modal.style.pointerEvents = "none";   
        }
    });
});

// choose time
document.querySelectorAll(".book-time-wrapper").forEach(box => {
    box.addEventListener("click", () => {
        if(!isAdmin){
            document.querySelectorAll(".book-time-wrapper").forEach(other => {
                other.classList.remove("book-time-active");
            });
            box.classList.add("book-time-active");
            document.querySelector(".btn-book-sum").classList.remove("book-btn-inactive");
            document.querySelector(".book-mobile").style.opacity = "1";
            document.querySelector(".book-mobile").style.pointerEvents = "auto";
        }
    });
    box.querySelector("i.time-trash").addEventListener("click", () => {
        async function removeSlot() {
            console.log("w");
            let monStr = String(currentMonth + 1);
            if(monStr.length == 1){
                monStr = "0" + monStr;
            }
            let dateStr = document.querySelector(".book-cal-active").textContent;
            if(dateStr.length == 1){
                dateStr = "0" + dateStr;
            }
            let fullDate = currentYear + "-" + monStr + "-" + dateStr;
            const dataToSend = { date: fullDate, time: box.textContent };
            try {
                const response = await fetch('/api/remove-slot', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json', 
                    },
                    body: JSON.stringify(dataToSend), 
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('Error:', errorData.message);
                    return;
                }

                const responseData = await response.json();
                window.location.href = "/bookings.html?admin=true";
            } catch (error) {
                console.error('Error posting data:', error);
            }
        }
        removeSlot();
    });
});
function nextBookingStage(){
    bookStage++;
    if(bookStage == 1){
        document.querySelector('.book-container').scrollIntoView({
            block: 'start'   
        });
        document.querySelector(".btn-book-sum").classList.add("book-btn-inactive");
        document.querySelector(".btn-book-sum").textContent = "Create Booking";
        document.querySelector(".book-treatments").style.opacity = "0";
        document.querySelector(".book-mobile").style.opacity = "0";
        document.querySelector(".book-mobile").style.pointerEvents = "none";
        setTimeout(() => {
            document.querySelector(".btn-book-mobile").textContent = "Create Booking";
            document.querySelector(".book-treatments").style.display = "none";
            document.querySelector(".book-time").style.display = "block";
            setTimeout(() => {
                document.querySelector(".book-time").style.opacity = "1";
            }, 50);
        }, 200);
    } 
    
    else {
        price = document.querySelector(".book-code-total").textContent;
        document.querySelector(".book-code-modal").style.opacity = "1";
        document.querySelector(".book-code-modal").style.pointerEvents = "auto";
        document.querySelector(".book-mobile").style.opacity = "0";
        document.querySelector(".book-mobile").style.pointerEvents = "none";
    }
}

// summary
if(document.querySelector(".book-container")){
    const params = new URLSearchParams(window.location.search);

    document.querySelectorAll(".book-code-input").forEach((inp, idx) => {
        inp.addEventListener("focus", () => {
            document.querySelectorAll(".book-code-input-container")[idx].style.border = "1px solid var(--purple-bright)";
        });
    }); 
    document.querySelectorAll(".book-code-input").forEach((inp, idx) => {
        inp.addEventListener("blur", () => {
            document.querySelectorAll(".book-code-input-container")[idx].style.border = "";
        });
    }); 
    function createBooking(){
        postBooking();
    }
    function applyCode(){
        if(!codeApplied){
            async function checkCode(){
                const dataToSend = { code: document.querySelector(".book-code-code").value };
                try {
                    const response = await fetch('/api/check-code', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json', 
                        },
                        body: JSON.stringify(dataToSend), 
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        console.error('Error:', errorData.message);
                        return;
                    }

                    const responseData = await response.json();
                    if(responseData.message == "failure"){
                        document.querySelector(".book-code-error").style.display = "block";
                        setTimeout(() => {
                            document.querySelector(".book-code-error").style.display = "none";
                        }, 2000);
                    } else {
                        codeApplied = true;
                        couponCode = document.querySelector(".book-code-code").value;
                        let discountMulti = Number(responseData.discount) / 100;
                        let newNum = Number(document.querySelector(".book-code-total").textContent.slice(1)) * discountMulti;
                        price = "£" + newNum;
                        document.querySelector(".book-code-total").innerHTML = `<span class="book-code-total" style="text-decoration: line-through; margin-right: 10px;">${document.querySelector(".book-code-total").textContent}</span> £${newNum}`;
                    }
                    document.querySelector(".book-code-code").value = "";
                } catch (error) {
                    console.error('Error posting data:', error);
                }
            }
            checkCode();
        }
    }

    // calendar
    function setCalendar(monthIdx, yearStr, firstCall){
        document.querySelector(".book-cal-head").textContent = months[monthIdx] + " " + yearStr;

        let startIdx = firstDay(monthIdx, yearStr);
        let endIdx = totalDays(monthIdx, yearStr);

        let bookings = [];
        async function getBookings(){
            const dataToSend = { month: monthIdx + 1, year: yearStr };
            try {
                const response = await fetch('/api/get-bookings', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json', 
                    },
                    body: JSON.stringify(dataToSend), 
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('Error:', errorData.message);
                    return;
                }

                const responseData = await response.json();
                console.log(responseData.bookings);
                bookings = responseData.bookings;

                document.querySelectorAll(".book-cal-box").forEach((box, idx) => {
                    box.classList.remove("book-cal-active");
                    box.classList.remove("book-cal-disabled");
                    box.classList.add("book-cal-inactive");
                    box.textContent = "";

                    if(idx >= startIdx && idx < (endIdx + startIdx)){
                        box.classList.remove("book-cal-inactive");
                        box.textContent = String(idx - (startIdx - 1));

                        if(monthIdx == startPosition && Number(box.textContent) < todayDate){
                            box.classList.add("book-cal-disabled");
                        } else if(monthIdx == startPosition && Number(box.textContent) == todayDate){
                            box.classList.add("book-cal-active");
                            box.classList.remove("book-cal-inactive");
                            if(firstCall){
                                todayBox = box;
                            }
                        } else if(monthIdx == startPosition && Number(box.textContent) > todayDate){
                            box.classList.remove("book-cal-inactive");
                        } else if(monthIdx != startPosition && Number(box.textContent) == 1){
                            box.classList.add("book-cal-active");
                            box.classList.remove("book-cal-inactive");
                        }

                        let todayBookings = 0;
                        bookings.forEach(booking => {
                            if(Number(booking.booking_date.slice(8, 10)) == Number(box.textContent)){
                                todayBookings++;
                            }
                        });
                        if(todayBookings == 17){
                            box.classList.add("book-cal-disabled");

                            if(Number(box.textContent) >= todayDate){
                                box.style.pointerEvents = "auto";
                            }
                        }
                    }
                });

                if(document.querySelector(".last-cal").querySelectorAll(".book-cal-inactive").length < 7){
                    document.querySelector(".book-time-ul").style.marginTop = "50px";
                } else {
                    document.querySelector(".book-time-ul").style.marginTop = "-20px";
                }

                checkSlots();
            } catch (error) {
                console.error('Error posting data:', error);
            }
        }
        getBookings();
    }
    if(document.querySelector(".book-container")){
        setCalendar(currentMonth, currentYear, true);
    }
    function changeMonth(direction){
        if(direction == "right"){
            currentMonth++;
        } else if(currentMonth > startPosition || Number(currentYear) > Number(startYear)){
            currentMonth--;
        }

        if(currentMonth == 12){
            currentMonth = 0;
            currentYear = Number(currentYear) + 1;
        } else if(currentMonth < 0) {
            currentMonth = 11;
            currentYear = Number(currentYear) - 1;
        }
        setCalendar(currentMonth, currentYear, false);
    }
    document.querySelectorAll(".book-cal-box").forEach(box => {
        box.addEventListener("click", () => {
            document.querySelectorAll(".book-cal-box").forEach(other => {
                other.classList.remove("book-cal-active");
            });
            box.classList.add("book-cal-active");

            checkSlots();
        });
    });
    function firstDay(monthIdx, yearStr) {
        const date = new Date(parseInt(yearStr), monthIdx, 1);
        let day = date.getDay() - 1;
        if(day == -1){
            return 6;
        } else {
            return day;
        }
    }
    function totalDays(monthIdx, yearStr) {
        const year = parseInt(yearStr);
        return new Date(year, monthIdx + 1, 0).getDate();
    }

    // backend
    async function postBooking(){
        let monStr = String(currentMonth + 1);
        if(monStr.length == 1){
            monStr = "0" + monStr;
        }
        let dateStr = document.querySelector(".book-cal-active").textContent;
        if(dateStr.length == 1){
            dateStr = "0" + dateStr;
        }
        let fullDate = currentYear + "-" + monStr + "-" + dateStr;
        const fullTime = document.querySelector(".book-time-active").textContent;
        const emailTxt = document.querySelector(".book-code-email").value;
        if(document.querySelector(".book-code-area").value.length > 0){
            bookingMessage = document.querySelector(".book-code-area").value;
        }
        document.querySelectorAll(".book-sum-label").forEach((label, idx) => {
            if((idx + 1) == document.querySelectorAll(".book-sum-label").length){
                fullServices += label.textContent;
            } else {
                fullServices += label.textContent + ",,";
            }
        }); 
        const dataToSend = { date: fullDate, time: fullTime, email: emailTxt, message: bookingMessage, code: couponCode, services: fullServices, price: price, type: 'user' };
        try {
            const response = await fetch('/api/book-appointment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', 
                },
                body: JSON.stringify(dataToSend), 
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error:', errorData.message);
                return;
            }

            const responseData = await response.json();
            if(responseData.message == "Success"){
                document.querySelector(".book-code-modal").style.opacity = "0";
                document.querySelector(".book-code-modal").style.pointerEvents = "none";
                setTimeout(() => {
                    document.querySelector(".book-modal").style.opacity = "1";
                    document.querySelector(".book-modal").style.pointerEvents = "auto";
                }, 200);
            } else {
                document.querySelector(".book-email-error").style.display = "block";
                setTimeout(() => {
                    document.querySelector(".book-email-error").style.display = "none";
                }, 2000);
            }
        } catch (error) {
            console.error('Error posting data:', error);
        }
    }
    async function checkSlots() {
        let monStr = String(currentMonth + 1);
        if(monStr.length == 1){
            monStr = "0" + monStr;
        }
        let dateStr = document.querySelector(".book-cal-active").textContent;
        if(dateStr.length == 1){
            dateStr = "0" + dateStr;
        }
        let fullDate = currentYear + "-" + monStr + "-" + dateStr;
        const dataToSend = { date: fullDate };
        try {
            const response = await fetch('/api/check-slots', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', 
                },
                body: JSON.stringify(dataToSend), 
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error:', errorData.message);
                return;
            }

            const responseData = await response.json();
            if(response.message == "failure"){
                console.log("Fail");
            } else {
                const ukTime = new Date().toLocaleTimeString('en-GB', {
                    timeZone: 'Europe/London',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false
                });
                document.querySelector(".book-time-empty").style.display = "none";
                document.querySelector(".book-time-closed").style.display = "none";
                document.querySelector(".btn-book-delete").classList.remove("admin-none");
                document.querySelector(".btn-book-open").classList.add("admin-none");
                document.querySelectorAll(".book-time-wrapper").forEach(wrapper => {
                    wrapper.style.display = "block";
                    if(todayBox.classList.contains("book-cal-active") && (Number(ukTime.slice(0, 2)) > wrapper.textContent.slice(0, 2) || (Number(ukTime.slice(0, 2)) == wrapper.textContent.slice(0, 2) && Number(ukTime.slice(3, 5)) > wrapper.textContent.slice(3, 5)))){
                        wrapper.style.display = "none";
                    }
                });
                if(responseData.times != ""){
                    const timesTaken = responseData.times.split(",,");
                    console.log(timesTaken);
                    timesTaken.forEach(time => {
                        document.querySelectorAll(".book-time-wrapper").forEach(wrapper => {
                            if(wrapper.textContent == time){
                                wrapper.style.display = "none";
                            }
                        });
                    });
                }
                let bookingFound = false;
                document.querySelectorAll(".book-time-wrapper").forEach(wrapper => {
                    wrapper.classList.remove("book-time-active");
                    document.querySelector(".btn-book-sum").classList.add("book-btn-inactive");
                    document.querySelector(".book-mobile").style.opacity = "0";
                    document.querySelector(".book-mobile").style.pointerEvents = "none";
                    if(wrapper.style.display == "block"){
                        bookingFound = true;
                    }
                });
                if(!bookingFound && responseData.closed < 17){
                    document.querySelector(".book-time-empty").style.display = "block";
                } else if(responseData.closed == 17){
                    document.querySelector(".btn-book-delete").classList.add("admin-none");
                    document.querySelector(".btn-book-open").classList.remove("admin-none");
                    document.querySelector(".book-time-closed").style.display = "block";
                }
            }
        } catch (error) {
            console.error('Error posting data:', error);
        }
    }

    // admin
    if(params.get("admin") == "true"){
        async function checkAdmin() {
            try {
                const response = await fetch('/api/check-admin');
                const data = await response.json(); 
                if(data.message == "Failure"){
                    document.querySelector(".book-access-modal").style.pointerEvents = "auto";
                    document.querySelector(".book-access-modal").style.opacity = "1";
                } 
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        checkAdmin();

        isAdmin = true;
        document.querySelector(".book-time").style.display = "block";
        document.querySelector(".book-time").style.opacity = "1";
        document.querySelector(".book-treatments").style.display = "none";
        document.querySelector(".book-treatments").style.opacity = "0";
        document.querySelectorAll(".admin-element").forEach(element => {
            element.classList.remove("admin-element");
        });

        function closeAccessModal(){
            document.querySelector(".book-access-modal").style.pointerEvents = "none";
            document.querySelector(".book-access-modal").style.opacity = "0";
        }

        // get session access button
        function enterAccessCode(){
            async function getAccessCode() {
                const dataToSend = { code: document.querySelector(".book-access-input").value };
                try {
                    const response = await fetch('/api/admin-access', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json', 
                        },
                        body: JSON.stringify(dataToSend), 
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        console.error('Error:', errorData.message);
                        return;
                    }

                    const responseData = await response.json();
                    if(responseData.message == "Success"){
                        closeAccessModal();
                    } else {
                        document.querySelector(".book-access-error").style.display = "block";
                        setTimeout(() => {
                            document.querySelector(".book-access-error").style.display = "none";
                        }, 2000);
                    }
                } catch (error) {
                    console.error('Error posting data:', error);
                }
            }
            getAccessCode();
        }

        function closeAllBookings(){
            async function requestClose(){
                let monStr = String(currentMonth + 1);
                if(monStr.length == 1){
                    monStr = "0" + monStr;
                }
                let dateStr = document.querySelector(".book-cal-active").textContent;
                if(dateStr.length == 1){
                    dateStr = "0" + dateStr;
                }
                let fullDate = currentYear + "-" + monStr + "-" + dateStr;
                const dataToSend = { date: fullDate };
                try {
                    const response = await fetch('/api/close-all', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json', 
                        },
                        body: JSON.stringify(dataToSend), 
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        console.error('Error:', errorData.message);
                        return;
                    }

                    const responseData = await response.json();
                    window.location.href = "/bookings.html?admin=true";
                } catch (error) {
                    console.error('Error posting data:', error);
                }
            }
            requestClose();
        }

        function showBookings(){
            async function requestShow() {
                try {
                    let monStr = String(currentMonth + 1);
                    if(monStr.length == 1){
                        monStr = "0" + monStr;
                    }
                    let dateStr = document.querySelector(".book-cal-active").textContent;
                    if(dateStr.length == 1){
                        dateStr = "0" + dateStr;
                    }
                    let fullDate = currentYear + "-" + monStr + "-" + dateStr;
                    const dataToSend = { date: fullDate };
                    const response = await fetch('/api/show-bookings', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json', 
                        },
                        body: JSON.stringify(dataToSend), 
                    });

                    if (!response.ok){
                        const errorData = await response.json();
                        console.error('Error:', errorData.message);
                        return;
                    }

                    const responseData = await response.json();
                    if(responseData.message == "Unauth"){
                        window.location.href = "/bookings.html";
                    }
                    let bookings = responseData.arrayObjs;
                    bookings.forEach(obj => {
                        let newCard = document.createElement("div");
                        newCard.classList.add("book-show-section");
                        newCard.innerHTML = `
                            <div class="book-show-time">${obj.booking_time}</div>
                            <div class="book-show-price">Total price: ${obj.price}</div>
                            <div class="book-show-message">${obj.message}</div>
                            <div class="book-show-services">${obj.services.replace(",,", ", ")}</div>
                            <div class="btn-show-delete">Delete Booking</div>
                        `
                        newCard.querySelector(".btn-show-delete").addEventListener("click", () => {
                            async function deleteCard() {
                                const dataToSend = { code: obj.cancel_code };
                                try {
                                    const response = await fetch('/api/delete-booking', {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json', 
                                        },
                                        body: JSON.stringify(dataToSend), 
                                    });

                                    if (!response.ok) {
                                        const errorData = await response.json();
                                        console.error('Error:', errorData.message);
                                        return;
                                    }

                                    const responseData = await response.json();
                                    if(responseData.message == "Success"){
                                        document.querySelector(".book-show-wrapper").removeChild(newCard);
                                        if(document.querySelectorAll(".book-show-section").length == 0){
                                            closeShowModal();
                                        }
                                    } else {
                                        window.location.href = "/bookings.html";
                                    }
                                } catch (error) {
                                    console.error('Error posting data:', error);
                                }
                            }
                            deleteCard();
                        });
                        document.querySelector(".book-show-wrapper").appendChild(newCard);
                    });
                    if(bookings.length > 0){
                        document.querySelector(".book-show-empty").style.display = "none";
                    }
                    document.querySelector(".book-show-modal").style.opacity = "1";
                    document.querySelector(".book-show-modal").style.pointerEvents = "auto";
                } catch (error) {
                    console.error('Error posting data:', error);
                }
            }
            requestShow();
        }
        function closeShowModal(){
            document.querySelector(".book-show-modal").style.opacity = "0";
            document.querySelector(".book-show-modal").style.pointerEvents = "none";
            document.querySelector(".book-show-wrapper").innerHTML = `
                <i class="fa-solid fa-xmark book-show-x" onclick="closeShowModal()"></i>

                <div class="book-show-empty">
                    <div class="book-show-title">No Bookings Made</div>
                    <div class="book-show-para">No bookings have been made for this day so far.</div>
                    <div class="btn-book-show-empty" onclick="closeShowModal()">Go Back</div>
                </div>
            `
        }

        function openDay(){
            async function requestOpen() {
                let monStr = String(currentMonth + 1);
                if(monStr.length == 1){
                    monStr = "0" + monStr;
                }
                let dateStr = document.querySelector(".book-cal-active").textContent;
                if(dateStr.length == 1){
                    dateStr = "0" + dateStr;
                }
                let fullDate = currentYear + "-" + monStr + "-" + dateStr;
                const dataToSend = { date: fullDate };
                try {
                    const response = await fetch('/api/open-day', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json', 
                        },
                        body: JSON.stringify(dataToSend), 
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        console.error('Error:', errorData.message);
                        return;
                    }

                    const responseData = await response.json();
                    window.location.href = "/bookings.html?admin=true";
                } catch (error) {
                    console.error('Error posting data:', error);
                }
            }
            requestOpen();
        }
    }

    // cancel
    if(params.get("cancel")){
        console.log(params.get("cancel"));
        async function verifyCode() {
            const dataToSend = { code: params.get("cancel") };
            try {
                const response = await fetch('/api/verify-cancel', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json', 
                    },
                    body: JSON.stringify(dataToSend), 
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('Error:', errorData.message);
                    return;
                }

                const responseData = await response.json()
                if(responseData.message == "Failure"){
                    window.location.href = "/bookings.html";
                } else {
                    document.querySelector(".book-delete-modal").style.opacity = "1";
                    document.querySelector(".book-delete-modal").style.pointerEvents = "auto";
                }
            } catch (error) {
                console.error('Error posting data:', error);
            }
        }
        verifyCode();

        function deleteBooking(){
            async function requestDelete() {
                const dataToSend = { code: params.get("cancel"), user: true };
                try {
                    const response = await fetch('/api/delete-booking', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json', 
                        },
                        body: JSON.stringify(dataToSend), 
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        console.error('Error:', errorData.message);
                        return;
                    }

                    const responseData = await response.json();
                    if(responseData.message == "Success"){
                        window.location.href = "/bookings.html";
                    }
                } catch (error) {
                    console.error('Error posting data:', error);
                }
            }
            requestDelete();
        }
    }
}

// voucher button?
document.addEventListener("DOMContentLoaded", function () {

/* ===== MAP SETUP ===== */

var bounds = [[0,0], [1080,1920]];

var map = L.map('map', {
    crs: L.CRS.Simple,
    minZoom: -1,
    dragging: false,
    scrollWheelZoom: true,
    doubleClickZoom: true,
    keyboard: false,
    zoomControl: false   // 🔥 REMOVE + -
});
map.attributionControl.remove();

L.imageOverlay('images/map.png', bounds).addTo(map);
map.fitBounds(bounds);
// ===== LAYERS FOR TOGGLES =====
// MARKERS (icons)
var hostelMarkers = L.layerGroup().addTo(map);
var foodMarkers = L.layerGroup().addTo(map);
var academicMarkers = L.layerGroup().addTo(map);
var sportsMarkers = L.layerGroup().addTo(map);
var otherMarkers = L.layerGroup().addTo(map);

// POLYGONS (buildings)
var hostelPolygons = L.layerGroup().addTo(map);
var foodPolygons = L.layerGroup().addTo(map);
var academicPolygons = L.layerGroup().addTo(map);
var sportsPolygons = L.layerGroup().addTo(map);
var otherPolygons = L.layerGroup().addTo(map);



/* ===== TEMP CLICK DEBUG (MULTI POINT)=====*/
(function () {

    if (typeof map === "undefined") {
        console.warn("Map not found");
        return;
    }

    map.on("click", function (e) {

        const lat = e.latlng.lat; // Y coordinate
        const lng = e.latlng.lng; // X coordinate

        console.log(`Lat (Y): ${lat}, Lng (X): ${lng}`);

        // Add marker correctly
        L.marker([lat, lng]).addTo(map);
    });

})();

/*===== END TEMP ===== */

setTimeout(() => {
    map.invalidateSize();
}, 200);

map.setMaxBounds(bounds);

map.on('zoomend', function() {
    map.panInsideBounds(bounds, { animate: false });
});
/* ==== MESS MENU ==== */
function getMessStatus() {
    const now = new Date();
    const minutes = now.getHours() * 60 + now.getMinutes();

    const timings = {
        breakfast: [480, 570],
        lunch: [750, 840],
        snacks: [1020, 1080],
        dinner: [1200, 1290]
    };

    for (let meal in timings) {
        const [start, end] = timings[meal];

        if (minutes >= start && minutes <= end) {
            const remaining = end - minutes;
            const h = Math.floor(remaining / 60);
            const m = remaining % 60;

            return {
                status: "open",
                meal,
                remaining: `${h > 0 ? h + "h " : ""}${m}m left`
            };
        }
    }

    return { status: "closed", meal: null };
}

function getNextMealCountdown() {
    const now = new Date();
    const minutes = now.getHours() * 60 + now.getMinutes();

    const schedule = [
        { name: "Breakfast", time: 480 },
        { name: "Lunch", time: 750 },
        { name: "Snacks", time: 1020 },
        { name: "Dinner", time: 1200 }
    ];

    for (let item of schedule) {
        if (minutes < item.time) {
            const diff = item.time - minutes;
            const h = Math.floor(diff / 60);
            const m = diff % 60;
            return `${item.name} opens in ${h}h ${m}m`;
        }
    }

    return "Breakfast opens tomorrow";
}
function updateMessIconEffect() {
    const mess = getMessStatus();

    foodMarkers.eachLayer(layer => {
        if (layer.getPopup && layer.getPopup().getContent().includes("Mess")) {

            const el = layer.getElement();
            if (!el) return;

            if (mess.status === "open") {
                el.style.filter = "drop-shadow(0 0 10px green)";
            } else {
                el.style.filter = "grayscale(70%)";
            }
        }
    });
}

setInterval(updateMessIconEffect, 60000);
updateMessIconEffect();

/* ===== PANEL ===== */

var panelTitle = document.getElementById("panelTitle");
var description = document.getElementById("description");
var sliderImage = document.getElementById("sliderImage");
var dotsContainer = document.getElementById("dotsContainer");
document.getElementById("infoPanel").style.display = "none";

/* ===== SLIDER STATE ===== */

let images = [];
let currentIndex = 0;
let autoSlideInterval;
let currentBuilding = null;


/* ===== RESET PANEL ===== */

function resetPanel() {
    document.getElementById("infoPanel").style.display = "none";
}
resetPanel();


/* ===== SLIDER FUNCTIONS ===== */

function showImage() {
    if (!images || images.length === 0) return;
    sliderImage.style.display = "block"; 
    sliderImage.style.opacity = 0;

    setTimeout(() => {
        sliderImage.src = images[currentIndex];
        sliderImage.style.opacity = 1;
        updateDots();
    }, 150);
}
    
function createDots() {
    dotsContainer.innerHTML = "";

    images.forEach((_, index) => {
        const dot = document.createElement("span");
        dot.classList.add("dot");
        

        dot.onclick = () => {
            stopAutoSlide();
            currentIndex = index;
            showImage();
        };

        dotsContainer.appendChild(dot);
    });

    updateDots();
}

function updateDots() {
    const dots = document.querySelectorAll(".dot");

    dots.forEach((dot, index) => {
        dot.classList.remove("active");

        if (index === currentIndex) {
            setTimeout(() => {
                dot.classList.add("active");
            }, 50);
        }
    });
}


/* ===== AUTO SLIDE ===== */

function startAutoSlide() {
    stopAutoSlide();

    if (images.length <= 1) return;

    autoSlideInterval = setInterval(() => {
        currentIndex = (currentIndex + 1) % images.length;
        showImage();
    }, 2500);
}

function stopAutoSlide() {
    if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
    }
}


/* ===== SET PANEL DATA ===== */

function setPanelData(title, desc, imgArray) {

    document.getElementById("infoPanel").style.display = "block"; 

    stopAutoSlide();

    panelTitle.innerText = title;
    description.innerHTML = desc;

    images = imgArray && imgArray.length ? imgArray : ["images/academic.jpg"];
    currentIndex = 0;

    showImage();

    if (images.length <= 1) {
        dotsContainer.innerHTML = "";
    } else {
        createDots();
        startAutoSlide();
    }
}


/* =====  PAUSE ON HOVER ===== */

sliderImage.addEventListener("mouseenter", stopAutoSlide);
sliderImage.addEventListener("mouseleave", startAutoSlide);

/* ================= ICON SYSTEM ================= */

// ===== 1. ICON CREATOR =====
function createIcon(iconPath, bgColor) {
    return L.divIcon({
        className: '',
        html: `
            <div style="
                width: 34px;
                height: 34px;
                background: ${bgColor};
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            ">
                <img src="${iconPath}" style="width:18px;height:18px;">
            </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 17]
    });
}
// ===== SPECIAL ICONS (IF ANY) =====
function createIcon(iconPath, bgColor, size = 34) {

    const innerSize = size * 0.5;

    return L.divIcon({
        className: '',
        html: `
            <div style="
                width: ${size}px;
                height: ${size}px;
                background: ${bgColor};
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            ">
                <img src="${iconPath}" style="width:${innerSize}px;height:${innerSize}px;">
            </div>
        `,
        iconSize: [size, size],
        iconAnchor: [size/2, size/2]
    });
}
function makeSmallIcon(baseIcon, size = 24) {

    const div = document.createElement("div");
    div.innerHTML = baseIcon.options.html;

    const wrapper = div.firstElementChild;
    const img = wrapper.querySelector("img");

    wrapper.style.width = size + "px";
    wrapper.style.height = size + "px";

    img.style.width = (size * 0.5) + "px";
    img.style.height = (size * 0.5) + "px";

    return L.divIcon({
        className: '',
        html: wrapper.outerHTML,
        iconSize: [size, size],
        iconAnchor: [size/2, size/2]
    });
}

// ===== 2. ICON COLLECTION (ALL ICONS IN ONE PLACE) =====
const ICONS = {

    hostel: createIcon("icons/hostel.png", "#2b7cff"), // 🔵 boys (default)

    girlsHostel: createIcon("icons/hostel.png", "#ff69b4"), // 🌸 girls

    academic: createIcon("icons/buildings.png", "#3bb273"),
    library: createIcon("icons/library.png", "#3bb273"),

    food: createIcon("icons/cafe.png", "#ff8c42"),
    mess: createIcon("icons/mess.png", "#ff8c42"),

    fountain: createIcon("icons/fountain.png", "#2a8af9"),
    medical: createIcon("icons/health.png", "rgb(249, 25, 25)"),

    sports: {
        football: createIcon("icons/football.png", "#9b59b6"),
        basketball: createIcon("icons/basketball.png", "#9b59b6"),
        badminton: createIcon("icons/badminton.png", "#ffc800"),
        volleyball: createIcon("icons/vollyball.png", "#9b59b6"),
        gym: createIcon("icons/gym.png", "#9b59b6"),
        ground: createIcon("icons/ground.png", "#9b59b6")
    }
};


// ===== 3. ICON PICKER FUNCTION =====
function getPlaceIcon(p) {

    if (p.icon) return p.icon;

    let icon;

    switch (p.type) {

        case "hostel":
            icon = p.isGirls
                ? ICONS.girlsHostel
                : ICONS.hostel;
            break;
        case "academic":
            icon = p.name.toLowerCase().includes("library")
                ? ICONS.library
                : ICONS.academic;
            break;

        case "food":
            icon = p.name.toLowerCase().includes("mess")
                ? ICONS.mess
                : ICONS.food;
            break;

        case "sports":
            if (p.name.toLowerCase().includes("football")) return ICONS.sports.football;
            if (p.name.toLowerCase().includes("basketball")) return ICONS.sports.basketball;
            if (p.name.toLowerCase().includes("badminton court")) return ICONS.sports.badminton;
            if (p.name.toLowerCase().includes("volleyball")) return ICONS.sports.volleyball;
            if (p.name.toLowerCase().includes("gym")) return ICONS.sports.gym;
            return ICONS.sports.ground;
        case "medical":
            icon = ICONS.medical;
            break;

        default:
            icon = ICONS.academic;
    }
    return p.small ? makeSmallIcon(icon) : icon;
}


/* ================= PLACES (MANUAL ICONS) ================= */

var places = [

    { name: "Mess", type: "food",images: ["images/mess.png"], coords: [800, 500] },
    { name: "Mess", type: "food", images: ["images/mess.png"],coords: [250.07, 1477.5] },

    
    //===== Admin Block INTERNAL =====

    {
        name: "Library",
        type: "academic",
        coords: [594, 234],
        images: ["images/library.png"],
        desc: "Library inside admin block."
    },
    {
        name: "Nescafe",
        type: "food",
        coords: [507.02,204.5],
        images: ["images/nescafe1.png", "images/nescafe2.png"],
        desc: "Nescafe outlet inside admin block serving a variety of coffee and snacks."
    },
    // ===== MINI CAMPUS INTERNAL =====

    // 🏋 Gym (inside mini campus)
    {
        name: "Mini Campus Gym",
        type: "sports",
        coords: [367.05, 1499.5],   
        images: ["images/gym.png"],
        desc: "Gym inside mini campus with modern equipment."
    },

    // 👩 Girls Hostel
    {
    name: "Yamuna Hostel",
    type: "hostel",
    isGirls: true,   // 🔥 ADD THIS
    coords: [401.07,1444],
    images: ["images/yamuna.png"],
    desc: "Girls hostel inside mini campus."
    },

    // 👨 Boys Hostel
    {
        name: "Dhauladhar Hostel",
        type: "hostel",
        coords: [319.5, 1553.25],
        images: ["images/dhauladhar.png"],
        desc: "Additional boys hostel inside mini campus with sharing options upto 6 roomates."
    },
    {
        name: "Health Centre",
        type: "medical",
        coords: [253.06, 1584.5],   
        images: ["images/health.png"],
        desc: "Campus health centre providing medical assistance and first aid."
    }

];


// ===== 4. ADD ICONS TO MAP =====
places.forEach(p => {

    let markerLayer;

    switch (p.type) {
        case "hostel": markerLayer = hostelMarkers; break;
        case "food": markerLayer = foodMarkers; break;
        case "academic": markerLayer = academicMarkers; break;
        case "sports": markerLayer = sportsMarkers; break;
        case "other": markerLayer = otherMarkers; break;
        case "medical": markerLayer = otherMarkers; break;
        default: markerLayer = academicMarkers;
    }

    const marker = L.marker(p.coords, { icon: getPlaceIcon(p) })
    .addTo(markerLayer)
    .bindPopup(p.name);

    let hoverTimeout;

    marker.on("mouseover", function () {

        if (p.name.toLowerCase().includes("mess")) {

                    const mess = getMessStatus();
        const countdown = getNextMealCountdown();

        let html = "";

        if (mess.status === "open") {
            html = `
            <div class="mess-highlight open">
                <div class="badge green">● OPEN</div>
                <div class="meal">Now Serving: ${mess.meal.toUpperCase()}</div>
                <div class="time">⏳ Closes in ${mess.remaining}</div>
            </div>`;
        } else {
            html = `
            <div class="mess-highlight closed">
                <div class="badge red">● CLOSED</div>
                <div>No meal currently</div>
                <div class="time">⏳ ${countdown}</div>
            </div>`;
        }

        setPanelData("Mess", html, p.images);

        } else {
            if (p.images) {
                setPanelData(p.name, p.desc || "", p.images);
            }
        }

    });

    marker.on("mouseout", function () {
        clearTimeout(hoverTimeout);
    });

});
function getIconPosition(b) {
    return b.iconCoords ? b.iconCoords : b.coords[0];
}

/* ===== BUILDINGS ===== */

var buildings = [

{
    name: "Shivalik Hostel",
    type: "hostel",
    iconCoords: [889,488], 
    coords: [
        [724.10,414.99],[724.10,588.98],[725.60,596.48],[728.60,603.98],[740.60,611.48],
        [773.10,611.48],[850.10,611.98],[897.60,608.48],[911.80,604.74],[921.80,597.74],
        [927.28,591.99],[941.28,560.24],[952.40,531.75],[953.60,507.99],[954.10,409.00]
    ],
    images: [
        "images/hostel1.png",
        "images/hostel2.png",
        "images/hostel3.png"
    ],
    desc: "Boys hostel with modern facilities."
},

{
    name: "Sagar Apartment",
    showIcon: false,
    type: "residential",
    iconCoords: [842,288],
    coords: [
        [730.10,149.50],[723.10,150.00],[720.60,151.50],[718.10,155.50],[715.10,161.00],
        [710.60,169.99],[711.10,180.99],[711.60,322.98],[718.60,333.98],[736.10,338.98],
        [929.60,342.98],[938.90,342.37],[945.15,339.49],[951.55,332.49],[953.60,311.98],
        [953.10,191.49],[953.60,173.99],[952.60,166.49],[950.10,160.49],[949.10,154.49]
    ],
    images: ["images/faculty.png"],
    desc: "Apartment for faculty members with modern facilities."
},

{
    name: "Directors House",
    type: "residential",
    showIcon: false,
    iconCoords: [530,820],
    coords: [
    [500.50,779.48],[501.50,858.97],[586.00,858.97],[587.00,778.98]
    ],
    images: ["images/directors house.png"],
    desc: "Director's residence located in the heart of the campus with a beautiful garden."
},

{
    name: "Academic Block",
    iconCoords: [324,274],
    type: "academic",
    coords: [
    [229.03,90.12],[224.53,90.62],[220.03,93.12],[216.28,96.37],[213.03,101.62],
    [211.53,108.50],[211.53,115.62],[212.28,460.99],[213.28,470.61],[217.28,480.36],
    [227.15,487.36],[238.28,490.99],[427.10,487.50],[439.28,487.37],[447.15,481.87],
    [451.90,476.37],[453.78,469.75],[453.03,126.12],[453.15,121.37],[453.40,115.75],
    [452.28,111.50],[451.53,106.49],[449.03,102.37],[446.40,97.99],[444.28,94.75],
    [439.70,92.31],[436.51,91.69],[433.33,91.75]
    ],
    images: ["images/academic.png"],
    desc: "Main academic classrooms and lecture halls."
},

{
    name: "Admin Block",
    type: "academic",
    iconCoords: [562,150],
    coords: [
    [502.15,88.75],[496.65,91.25],[492.40,95.12],[487.78,99.87],[485.78,103.37],
    [482.78,107.75],[480.28,112.25],[477.90,118.87],[476.28,125.50],[475.15,131.24],
    [474.65,136.12],[474.65,141.74],[474.28,148.99],[475.05,261.24],[474.89,267.69],
    [475.14,274.12],[478.39,281.43],[482.20,286.12],[489.14,291.18],[494.39,292.50],
    [503.83,292.94],[616.78,293.25],[624.03,292.62],[630.40,289.25],[634.78,283.12],
    [637.78,277.62],[639.28,272.24],[639.78,122.12],[639.28,118.37],[639.15,115.62],
    [638.65,112.62],[638.28,110.12],[636.20,106.94],[634.26,103.31],[632.76,101.44],
    [630.89,98.69],[628.83,96.37],[627.33,94.56],[625.33,92.62],[623.26,91.25],
    [620.83,90.37],[618.40,89.37],[616.15,88.62],[614.03,87.75]
    ],
    isLibrary: true,
    images: [
        "images/admin.jpg",
        "images/admin1.png"
    ],
    desc: "Administrative offices and director's office."
},

{
    name: "Football Ground",
    type:"sports",
    iconCoords: [594,516],
    coords: [
    [669.50,356.50],[660.50,356.00],[655.00,355.50],[651.00,355.50],[648.00,356.00],
    [644.50,355.50],[642.15,354.62],[639.15,352.12],[635.78,349.87],[633.78,348.87],
    [631.65,346.62],[628.40,345.37],[625.65,343.74],[621.28,341.49],[616.53,339.37],
    [612.28,338.37],[608.53,337.37],[604.15,336.37],[598.15,336.12],[594.15,335.74],
    [585.28,335.24],[580.40,336.24],[574.28,338.49],[567.53,341.74],[561.40,344.99],
    [555.28,348.37],[550.65,351.62],[546.65,355.87],[543.15,359.49],[538.65,364.37],
    [535.28,368.99],[531.53,374.74],[528.53,379.49],[526.03,384.74],[524.03,389.99],
    [522.15,396.74],[519.40,405.74],[518.15,412.12],[517.53,417.62],[517.40,474.87],
    [517.03,567.24],[518.03,618.75],[519.65,624.75],[520.65,632.37],[523.65,640.99],
    [528.65,650.37],[534.40,660.49],[542.53,670.99],[553.90,679.24],[571.15,688.86],
    [581.53,693.24],[592.53,693.74],[601.90,692.49],[613.53,690.49],[624.78,686.24],
    [633.03,679.49],[639.15,675.87],[643.90,671.62],[647.90,669.49],[656.15,670.12],
    [669.65,670.12]
    ],
    images: ["images/ground.jpg"],
    desc: "Sports ground used for football and events."
},

{
    name: "Canteen",
    type: "food",
    iconCoords: [530,1328],
    coords: [
    [497.60,1218.48],[497.60,1446.46],[570.20,1443.25],[572.16,1442.59],[573.91,1441.81],
    [575.10,1440.59],[576.01,1439.12],[576.44,1437.19],[578.15,1230.12],[578.90,1226.37],
    [579.15,1223.87],[578.15,1221.75],[576.53,1220.00],[574.65,1219.37]
    ],
    images: [
        "images/canteen2.png",
        "images/canteen3.png",
        "images/canteen4.png"
    ],
    desc: "Campus food court with outlets like Amul,Mother Dairy and VegMorning Fresh."
},
{
    name: "Fountain",
    type: "other",
    icon: ICONS.fountain,
    iconCoords: [418,1259],
    coords: [
    [448.60,1201.47],[394.60,1199.47],[388.60,1307.96],[391.10,1318.46],[416.60,1323.46],
    [445.10,1321.96],[456.10,1311.46],[455.10,1215.97],[453.76,1207.62],[452.01,1204.06]
],
    images: [
        "images/fountain1.png",
        "images/fountain2.png"
    ],
    desc: "fountain of NIT DELHI"
},
{
    name: "Entrance gate 1 ",
    type: "other",
    showIcon: false,
    coords: [
    [89.80,1258.48],[92.20,1427.92],[179.20,1421.92],[185.20,1250.93]
],
    images: [
        "images/entrance.png"
    ],
    desc: "Enterance gate 1 of NIT DELHI"
},
{
    name: "Entrance gate 2 ",
    type: "other",
    showIcon: false,
    coords: [
    [92.09,620.5],[91.09,809.5],[178.063,808],[183.06,618.5]
],
    images: [
        "images/entrance2.png"
    ],
    desc: "entrance gate 2 of NIT DELHI"
},

{
    name: "H.K Cafe",
    type: "food",
    small: true,
    iconCoords: [690,390],
    coords: [
    [678.28,356.25],[678.15,432.62],[715.78,431.74],[717.28,356.50]
    ],
    images: ["images/HK_cafe.png"],
    desc: "Modern green-themed café powered by Mountain Dew."
},

{
    name: "Dept Of Mechanical Engineering",
    type: "academic",
    small: true,
    iconCoords: [528.27,1189.5],
    coords: [
    [497.03,1163.75],[497.53,1216.75],[561.51,1216.5],[563.76,1163.75]
],
    images: ["images/mechanical dept.png"],
    desc: "Mechanical engineering department building."
},
{
    name: "Startup Centre",
    small: true, 
    type: "academic",
    iconCoords: [525.55,1141.5],
    coords: [
    [495.28,1109.75],[497.781,1161.75],[563.76,1160.5],[564.01,1111]
],
    images: ["images/startup.png"],
    desc: "Startup centre of NIT DELHI"
},


{
    name: "Sports Courts",
    type:"sports",
    iconCoords: [632,1164],
    coords: [
    [565.03,1118.49],[566.10,1208.98],[686.10,1210.98],[687.60,1117.49]
    ],
    images: ["images/sports court.png"],
    desc: "Courts for basketball and tennis sports."
    
},

{
    name: "Mini Campus",
    type: "academic",
    iconCoords: [274,1380],
    coords: [
    [282.90,1335.74],[280.03,1335.87],[277.90,1335.37],[274.65,1335.37],[273.03,1335.37],
    [271.28,1336.49],[268.40,1338.87],[226.10,1385.97],[224.83,1388.75],[223.14,1392.56],
    [221.64,1397.00],[220.33,1403.25],[220.01,1407.74],[217.60,1697.47],[234.10,1711.97],
    [240.53,1713.37],[247.28,1712.49],[255.03,1710.99],[263.53,1707.99],[270.78,1702.99],
    [451.80,1450.99],[457.33,1441.62],[460.64,1433.75],[463.26,1425.31],[464.76,1416.00],
    [464.55,1357.75],[462.55,1352.75],[459.30,1348.50],[456.30,1344.25],[451.80,1341.00],
    [448.80,1338.75],[445.55,1337.50],[442.05,1336.50]
    ],
    images: ["images/minicampus.png"],
    desc: "Mini campus with labs and classrooms."
}

];


/* ===== ADD POLYGONS ===== */

let polygons = [];

buildings.forEach(b => {

    if (!b.coords || b.coords.length === 0) return;

    // ===== POLYGON LAYER (unchanged logic) =====
    let polygonLayer;

    switch(b.type) {
        case "hostel": polygonLayer = hostelPolygons;
        case "food": polygonLayer = foodPolygons;
        case "academic": polygonLayer = academicPolygons;
        case "sports": polygonLayer = sportsPolygons;
        case "other": polygonLayer = otherPolygons;
        default: polygonLayer = otherPolygons;
    }

    // ===== ADD POLYGON =====
    var poly = L.polygon(b.coords, {
        color: "transparent",
        fillOpacity: 0.01
    }).addTo(polygonLayer);

    polygons.push({ poly, data: b });

    let position = getIconPosition(b);

    // ===== MARKER LAYER (NEW 🔥) =====
    let markerLayer;

    switch(b.type) {
        case "hostel": markerLayer = hostelMarkers; break;
        case "food": markerLayer = foodMarkers; break;
        case "academic": markerLayer = academicMarkers; break;
        case "sports": markerLayer = sportsMarkers; break;
        case "other": markerLayer = otherMarkers; break;
        default: markerLayer = otherMarkers;
    }

    // ===== ADD BUILDING ICON (FIXED 🔥) =====
    if (b.showIcon !== false) {
        L.marker(position, {
            icon: getPlaceIcon(b)
        })
        .addTo(markerLayer)   
        .bindPopup(b.name);
    }

    // ===== EVENTS =====

    poly.on('mouseover', function() {

        if (currentBuilding === b.name) return;

        currentBuilding = b.name;

        poly.setStyle({
            color: '#00bcd4',
            weight: 2,
            fillColor: '#00bcd4',
            fillOpacity: 0.25
        });

        setPanelData(b.name, b.desc, b.images);
    });

    poly.on('mouseout', function() {

        poly.setStyle({
            color: 'transparent',
            fillOpacity: 0.01
        });

        currentBuilding = null;
    });



    // ===== EVENTS =====

    poly.on('mouseover', function() {

    if (currentBuilding === b.name) return;

    currentBuilding = b.name;

    poly.setStyle({
        color: '#00bcd4',
        weight: 2,
        fillColor: '#00bcd4',
        fillOpacity: 0.25
    });

    setPanelData(b.name, b.desc, b.images);
    });

    poly.on('mouseout', function() {

        poly.setStyle({
            color: 'transparent',
            fillOpacity: 0.01
        });

        currentBuilding = null;
    });

});

/* ===== DETECT OUTSIDE ===== */
map.on('mousemove', function(e) {

    let insideAny = false;

    polygons.forEach(obj => {
        if (obj.poly._containsPoint(map.latLngToLayerPoint(e.latlng))) {
            insideAny = true;
        }
    });

    if (!insideAny) {
        resetPanel();
        stopAutoSlide();
        currentBuilding = null;
    }
});

// ===== SIDEBAR TOGGLES =====

// ===== HELPER FUNCTION =====
function toggleLayer(markerLayer, polygonLayer, visible) {
    if (visible) {
        map.addLayer(markerLayer);
        map.addLayer(polygonLayer);
    } else {
        map.removeLayer(markerLayer);
        map.removeLayer(polygonLayer);
    }
}


// ===== CATEGORY TOGGLES =====

// 🏠 HOSTELS
document.getElementById("hostelToggle").addEventListener("change", function(e) {
    toggleLayer(hostelMarkers, hostelPolygons, e.target.checked);
});

// 🍴 FOOD
document.getElementById("canteenToggle").addEventListener("change", function(e) {
    toggleLayer(foodMarkers, foodPolygons, e.target.checked);
});

// 🏫 ACADEMIC
document.getElementById("academicToggle").addEventListener("change", function(e) {
    toggleLayer(academicMarkers, academicPolygons, e.target.checked);
});

// ⚽ SPORTS
document.getElementById("sportsToggle").addEventListener("change", function(e) {
    toggleLayer(sportsMarkers, sportsPolygons, e.target.checked);
});

// 🌟 OTHER
document.getElementById("otherToggle").addEventListener("change", function(e) {
    toggleLayer(otherMarkers, otherPolygons, e.target.checked);
});


// ===== SUB FILTERS =====

// 📚 LIBRARY (only affects markers)
document.getElementById("libraryToggle").addEventListener("change", function(e) {

    academicMarkers.eachLayer(layer => {

        if (layer.getPopup && layer.getPopup()) {
            const name = layer.getPopup().getContent().toLowerCase();

            if (name.includes("library")) {
                if (e.target.checked) {
                    map.addLayer(layer);
                } else {
                    map.removeLayer(layer);
                }
            }
        }

    });

});


// 🏋 GYM
document.getElementById("gymToggle").addEventListener("change", function(e) {

    sportsMarkers.eachLayer(layer => {

        if (layer.getPopup && layer.getPopup()) {
            const name = layer.getPopup().getContent().toLowerCase();

            if (name.includes("gym")) {
                if (e.target.checked) {
                    map.addLayer(layer);
                } else {
                    map.removeLayer(layer);
                }
            }
        }

    });

});

// 🏥 HEALTH CENTRE
document.getElementById("medicalToggle").addEventListener("change", function(e) {

    otherMarkers.eachLayer(layer => {

        if (layer.getPopup && layer.getPopup()) {
            const name = layer.getPopup().getContent().toLowerCase();

            if (name.includes("health")) {
                if (e.target.checked) {
                    map.addLayer(layer);
                } else {
                    map.removeLayer(layer);
                }
            }
        }

    });

});


// 🍽 MESS
document.getElementById("messToggle").addEventListener("change", function(e) {

    foodMarkers.eachLayer(layer => {

        if (layer.getPopup && layer.getPopup()) {
            const name = layer.getPopup().getContent().toLowerCase();

            if (name.includes("mess")) {
                if (e.target.checked) {
                    map.addLayer(layer);
                } else {
                    map.removeLayer(layer);
                }
            }
        }

    });

});

// ===== TOGGLE ALL =====
let visible = true;

document.getElementById("toggleAll").onclick = () => {

    const hostel = document.getElementById("hostelToggle");
    const food = document.getElementById("canteenToggle");
    const academic = document.getElementById("academicToggle");
    const sports = document.getElementById("sportsToggle");
    const other = document.getElementById("otherToggle");

    const library = document.getElementById("libraryToggle");
    const gym = document.getElementById("gymToggle");
    const mess = document.getElementById("messToggle");
    const medical = document.getElementById("medicalToggle");

    if (visible) {

        // ❌ TURN OFF ONLY ICONS
        hostel.checked = false;
        food.checked = false;
        academic.checked = false;
        sports.checked = false;
        other.checked = false;

        library.checked = false;
        gym.checked = false;
        mess.checked = false;
        medical.checked = false;

        // 🔥 ONLY REMOVE MARKERS
        map.removeLayer(hostelMarkers);
        map.removeLayer(foodMarkers);
        map.removeLayer(academicMarkers);
        map.removeLayer(sportsMarkers);
        map.removeLayer(otherMarkers);

        document.getElementById("toggleAll").innerText = "Show All";

    } else {

        // ✅ TURN ON ICONS
        hostel.checked = true;
        food.checked = true;
        academic.checked = true;
        sports.checked = true;
        other.checked = true;

        library.checked = true;
        gym.checked = true;
        mess.checked = true;
        medical.checked = true;
        

        // 🔥 ONLY ADD MARKERS
        map.addLayer(hostelMarkers);
        map.addLayer(foodMarkers);
        map.addLayer(academicMarkers);
        map.addLayer(sportsMarkers);
        map.addLayer(otherMarkers);

        document.getElementById("toggleAll").innerText = "Hide All";
    }

    visible = !visible;
};
// ===== DIGITAL CLOCK =====
function updateClock() {
    const now = new Date();
    const mess = getMessStatus();

    const clock = document.getElementById("digitalClock");

    if (mess.status === "open") {
        clock.style.color = "#16a34a";
        clock.style.fontWeight = "700";
    } else {
        clock.style.color = "#2563eb";
    }

    let h = now.getHours();
    let m = now.getMinutes();
    let s = now.getSeconds();

    // AM / PM
    let ampm = h >= 12 ? "PM" : "AM";

    // Convert to 12-hour format
    h = h % 12;
    h = h ? h : 12; // 0 → 12

    // Add leading zeros
    h = h.toString().padStart(2, '0');
    m = m.toString().padStart(2, '0');
    s = s.toString().padStart(2, '0');


    if (clock) {
        clock.innerText = `${h}:${m} ${ampm}`; 
    }
}

setInterval(updateClock, 1000);
updateClock();

});


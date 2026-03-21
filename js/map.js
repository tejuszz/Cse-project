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

L.imageOverlay('images/map.jpg', bounds).addTo(map);
map.fitBounds(bounds);
/* ===== TEMP CLICK DEBUG (MULTI POINT) 
(function () {

    if (!map) {
        console.warn("Map not found");
        return;
    }

    map.on('click', function (e) {
        const x = e.latlng.lng;
        const y = e.latlng.lat;

        console.log(`X: ${x}, Y: ${y}`);

        // add marker without removing previous ones
        L.marker([y, x]).addTo(map);
    });

})();
 ===== END TEMP ===== */
setTimeout(() => {
    map.invalidateSize();
}, 200);

map.setMaxBounds(bounds);

map.on('zoomend', function() {
    map.panInsideBounds(bounds, { animate: false });
});


/* ===== PANEL ===== */

var panelTitle = document.getElementById("panelTitle");
var description = document.getElementById("description");
var sliderImage = document.getElementById("sliderImage");
var dotsContainer = document.getElementById("dotsContainer");
var prevBtn = document.getElementById("prevBtn");
var nextBtn = document.getElementById("nextBtn");

/* ===== SLIDER STATE ===== */

let images = [];
let currentIndex = 0;
let autoSlideInterval;
let currentBuilding = null;


/* ===== RESET PANEL ===== */

function resetPanel() {
    panelTitle.innerText = "Hover on a Building";
    description.innerText = "Building information will appear here.";
    sliderImage.src = "";
    sliderImage.style.display = "none";
    dotsContainer.innerHTML = "";
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

function nextImage() {
    stopAutoSlide();
    currentIndex = (currentIndex + 1) % images.length;
    showImage();
}

function prevImage() {
    stopAutoSlide();
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    showImage();
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
            }, 50); // small delay = smoother animation
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

    stopAutoSlide();

    panelTitle.innerText = title;
    description.innerText = desc;

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


/* ===== OPTIONAL: PAUSE ON HOVER ===== */

sliderImage.addEventListener("mouseenter", stopAutoSlide);
sliderImage.addEventListener("mouseleave", startAutoSlide);


/* ===== BUILDINGS ===== */

var buildings = [

{
    name: "Shivalik Hostel",
    coords: [
        [727.57,316],[727.07,350.5],[728.07,390],[727.07,432],[727.57,491],
        [730.01,514.5],[736.01,527.38],[752.01,535.38],[798.51,535.5],
        [876.05,535],[905.04,529],[926.38,516.5],[936.51,495.75],
        [954.51,448],[955.25,406.13],[954.75,363.25],[953.01,320.5]
    ],
    images: [
        "images/hostel1.png",
        "images/hostel2.png",
        "images/hostel3.png"
    ],
    desc: "Boys hostel with modern facilities."
},

{
    name: "Faculty Building",
    coords: [
        [731.76,44.75],[725.26,46.38],[720.14,52.63],[716.64,65.25],
        [716.77,82.75],[717.52,108.75],[718.27,136.75],[717.77,179.75],
        [717.52,224.75],[732.05,247],[801.03,247],[864.52,246],
        [904.01,248],[928.51,248],[943.25,247.25],[949.88,245.13],
        [953.01,239.5],[953.51,233],[952.03,96],[953.51,77],
        [952.51,63],[949,49.13],[942.51,35]
    ],
    images: ["images/faculty.png"],
    desc: "Apartment for faculty members with modern facilities."
},

{
    name: "Directors House",
    coords: [
        [510.50, 712.98],
        [511.00, 794.48],
        [596.00, 795.48],
        [597.50, 711.48]
        ],
    images: ["images/directors house.png"],
    desc: "Apartment for faculty members with modern facilities."
},

{
    name: "Academic Block",
    coords: [
        [236.23,10],[240.23,188],[240.23,374],[246.11,395],[289.1,402],
        [349.09,402],[436.06,405],[458.27,399.25],[468.51,383],
        [469.04,205.5],[467.08,4]
    ],
    images: ["images/academic.jpg"],
    desc: "Main academic classrooms and lecture halls."
},

{
    name: "Admin Block",
    coords: [
        [504.57,0.5],[494.07,7.5],[487.57,26.5],[486.07,48.5],
        [486.07,72.5],[487.57,94.5],[486.07,117.5],[486.07,144],
        [487.07,177.5],[506.07,194.5],[540.56,196.5],[580.05,194],
        [622.04,194.5],[644.03,186.5],[648.03,157.5],[650.03,0]
    ],
    images: ["images/admin.jpg"],
    desc: "Administrative offices and director's office."
},

{
    name: "Football Ground",
    coords: [
        [675.06,261],[653.06,262],[638.07,250],[618.07,242],[598.52,240.75],
        [581.28,244.75],[565.53,252.25],[554.76,261.75],[546.01,273.25],
        [537.51,289],[529.76,312],[529.51,350.5],[530.01,385.25],
        [529.76,426.5],[532.53,455],[531.03,485.5],[531.53,516],
        [532.53,543],[538.53,570],[554.52,598],[585.51,618],
        [605.03,621],[622.02,620.25],[636.02,612.25],[644.52,604.25],
        [653.76,596.5],[670.26,597.25],[666.51,596.75],[679.01,593.75]
    ],
    images: ["images/ground.jpg"],
    desc: "Sports ground used for football and events."
},

{
    name: "Canteen",
    coords: [
        [509,1180.5],[509,1422],[583.5,1418.5],[590,1178.5]
    ],
    images: [
        "images/canteen1.png",
        "images/canteen2.png",
        "images/canteen3.png",
        "images/canteen4.png"
    ],
    desc: "Campus food court with outlets like Amul and Mother Dairy."
},

{
    name: "H.K Cafe",
    coords: [
        [692,266],[692,336],[721,334],[723,271]
    ],
    images: ["images/HK_cafe.png"],
    desc: "Modern green-themed café powered by Mountain Dew."
},

{
    name: "Dept Of Mechanical Engineering",
    coords: [
        [504.5,1059.5],[504,1173],[565,1173],[570,1055.5]
    ],
    images: ["images/mechanical dept.png"],
    desc: "Mechanical engineering department building."
},

{
    name: "Sports Courts",
    coords: [
        [575.04,1070],[574,1169],[696,1173],[697.5,1070]
    ],
    images: ["images/sports court.png"],
    desc: "Courts for basketball, badminton, and other sports."
},

{
    name: "Mini Campus",
    coords: [
        [288.22,1302],[264.11,1331],[237.11,1370],[236.11,1399],
        [234.12,1450],[236.11,1530],[232.12,1663],[229.12,1700],
        [254.11,1722],[467.05,1415],[476.05,1396],[479.05,1366],
        [476.05,1322],[469.05,1307],[451.06,1300],[393.07,1301],
        [349.08,1300]
    ],
    images: ["images/minicampus.jpg"],
    desc: "Mini campus with labs and classrooms."
}

];


/* ===== ADD POLYGONS ===== */

let polygons = [];

buildings.forEach(b => {

    var poly = L.polygon(b.coords, {
        color: "transparent",
        fillOpacity: 0.01
    }).addTo(map);

    polygons.push({ poly, data: b });

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
        if (obj.poly.getBounds().contains(e.latlng)) {
            insideAny = true;
        }
    });

    if (!insideAny) {
        resetPanel();
        stopAutoSlide();
        currentBuilding = null;
    }
});

});

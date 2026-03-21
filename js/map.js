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

L.imageOverlay('images/test.png', bounds).addTo(map);
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
    name: "Faculty Building",
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
    coords: [
    [500.50,779.48],[501.50,858.97],[586.00,858.97],[587.00,778.98]
    ],
    images: ["images/directors house.png"],
    desc: "Apartment for faculty members with modern facilities."
},

{
    name: "Academic Block",
    coords: [
    [229.03,90.12],[224.53,90.62],[220.03,93.12],[216.28,96.37],[213.03,101.62],
    [211.53,108.50],[211.53,115.62],[212.28,460.99],[213.28,470.61],[217.28,480.36],
    [227.15,487.36],[238.28,490.99],[427.10,487.50],[439.28,487.37],[447.15,481.87],
    [451.90,476.37],[453.78,469.75],[453.03,126.12],[453.15,121.37],[453.40,115.75],
    [452.28,111.50],[451.53,106.49],[449.03,102.37],[446.40,97.99],[444.28,94.75],
    [439.70,92.31],[436.51,91.69],[433.33,91.75]
    ],
    images: ["images/academic.jpg"],
    desc: "Main academic classrooms and lecture halls."
},

{
    name: "Admin Block",
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
    images: ["images/admin.jpg"],
    desc: "Administrative offices and director's office."
},

{
    name: "Football Ground",
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
    coords: [
    [497.60,1218.48],[497.60,1446.46],[570.20,1443.25],[572.16,1442.59],[573.91,1441.81],
    [575.10,1440.59],[576.01,1439.12],[576.44,1437.19],[578.15,1230.12],[578.90,1226.37],
    [579.15,1223.87],[578.15,1221.75],[576.53,1220.00],[574.65,1219.37]
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
    name: "Fountain",
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
    coords: [
    [89.80,1258.48],[92.20,1427.92],[179.20,1421.92],[185.20,1250.93]
],
    images: [
        "images/entrance.png"
    ],
    desc: "fountain of NIT DELHI"
},

{
    name: "H.K Cafe",
    coords: [
    [678.28,356.25],[678.15,432.62],[715.78,431.74],[717.28,356.50]
    ],
    images: ["images/HK_cafe.png"],
    desc: "Modern green-themed café powered by Mountain Dew."
},

{
    name: "Dept Of Mechanical Engineering",
    coords: [
    [495.60,1111.48],[498.60,1215.47],[556.35,1212.87],[556.53,1111.00]
],
    images: ["images/mechanical dept.png"],
    desc: "Mechanical engineering department building."
},

{
    name: "Sports Courts",
    coords: [
    [565.03,1118.49],[566.10,1208.98],[686.10,1210.98],[687.60,1117.49]
    ],
    images: ["images/sports court.png"],
    desc: "Courts for basketball, badminton, and other sports."
},

{
    name: "Mini Campus",
    coords: [
    [282.90,1335.74],[280.03,1335.87],[277.90,1335.37],[274.65,1335.37],[273.03,1335.37],
    [271.28,1336.49],[268.40,1338.87],[226.10,1385.97],[224.83,1388.75],[223.14,1392.56],
    [221.64,1397.00],[220.33,1403.25],[220.01,1407.74],[217.60,1697.47],[234.10,1711.97],
    [240.53,1713.37],[247.28,1712.49],[255.03,1710.99],[263.53,1707.99],[270.78,1702.99],
    [451.80,1450.99],[457.33,1441.62],[460.64,1433.75],[463.26,1425.31],[464.76,1416.00],
    [464.55,1357.75],[462.55,1352.75],[459.30,1348.50],[456.30,1344.25],[451.80,1341.00],
    [448.80,1338.75],[445.55,1337.50],[442.05,1336.50]
    ],
    images: ["images/minicampus.jpg"],
    desc: "Mini campus with labs and classrooms."
}

];


/* ===== ADD POLYGONS ===== */

let polygons = [];

buildings.forEach(b => {
    if (!b.coords || b.coords.length === 0) return;
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

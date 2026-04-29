document.addEventListener("DOMContentLoaded", function () {
  /* ===== MAP SETUP ===== */

  var bounds = [
    [0, 0],
    [1080, 1920],
  ];

  var map = L.map("map", {
    crs: L.CRS.Simple,
    minZoom: -1,
    dragging: false,
    scrollWheelZoom: true,
    doubleClickZoom: true,
    keyboard: false,
    zoomControl: false, // 🔥 REMOVE + -
  });
  map.attributionControl.remove();

  L.imageOverlay("images/map.png", bounds).addTo(map);
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

  /* ===== TEMP CLICK DEBUG =====
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

===== END TEMP ===== */

  setTimeout(() => {
    map.invalidateSize();
  }, 200);

  map.setMaxBounds(bounds);

  map.on("zoomend", function () {
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
      dinner: [1200, 1290],
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
          remaining: `${h > 0 ? h + "h " : ""}${m}m left`,
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
      { name: "Dinner", time: 1200 },
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

    foodMarkers.eachLayer((layer) => {
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
      className: "",
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
      iconAnchor: [17, 17],
    });
  }
  // ===== SPECIAL ICONS (IF ANY) =====
  function createIcon(iconPath, bgColor, size = 34) {
    const innerSize = size * 0.5;

    return L.divIcon({
      className: "",
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
      iconAnchor: [size / 2, size / 2],
    });
  }
  function makeSmallIcon(baseIcon, size = 24) {
    const div = document.createElement("div");
    div.innerHTML = baseIcon.options.html;

    const wrapper = div.firstElementChild;
    const img = wrapper.querySelector("img");

    wrapper.style.width = size + "px";
    wrapper.style.height = size + "px";

    img.style.width = size * 0.5 + "px";
    img.style.height = size * 0.5 + "px";

    return L.divIcon({
      className: "",
      html: wrapper.outerHTML,
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
    });
  }

  // ===== 2. ICON COLLECTION =====
  const ICONS = {
    hostel: createIcon("icons/hostel.png", "#2b7cff"), // 🔵 boys (default)

    girlsHostel: createIcon("icons/hostel.png", "#ff69b4"), // 🌸 girls

    academic: createIcon("icons/buildings.png", "#3bb273"),
    library: createIcon("icons/library.png", "#3bb273"),

    food: createIcon("icons/cafe.png", "#ff8c42"),
    mess: createIcon("icons/mess.png", "#ff8c42"),

    fountain: createIcon("icons/fountain.png", "#2a8af9"),
    medical: createIcon("icons/health.png", "rgb(249, 25, 25)"),
    residential: createIcon("icons/residential.png", "#84CC16"),
    entrance: createIcon("icons/entrance.png", "#FFD166"),
    sports: {
      football: createIcon("icons/football.png", "#9b59b6"),
      basketball: createIcon("icons/basketball.png", "#9b59b6"),
      badminton: createIcon("icons/badminton.png", "#9b59b6"),
      volleyball: createIcon("icons/volleyball.png", "#9b59b6"),
      gym: createIcon("icons/gym.png", "#9b59b6"),
      ground: createIcon("icons/ground.png", "#9b59b6"),
      yoga: createIcon("icons/yoga.png", "#9b59b6"),
    },
  };

  // ===== 3. ICON PICKER FUNCTION =====
  function getPlaceIcon(p) {
    if (p.icon) return p.icon;

    let icon;

    switch (p.type) {
      case "hostel":
        icon = p.isGirls ? ICONS.girlsHostel : ICONS.hostel;
        break;
      case "academic":
        icon = p.name.toLowerCase().includes("library")
          ? ICONS.library
          : ICONS.academic;
        break;

      case "food":
        icon = p.name.toLowerCase().includes("mess") ? ICONS.mess : ICONS.food;
        break;
      case "residential":
        icon = ICONS.residential;
        break;
      case "other":
        if (p.name.toLowerCase().includes("entrance")) return ICONS.entrance;
        icon = ICONS.academic;
        break;
      case "sports":
        const name = p.name.toLowerCase();

        if (name.includes("football")) icon = ICONS.sports.football;
        else if (name.includes("basketball")) icon = ICONS.sports.basketball;
        else if (name.includes("badminton")) icon = ICONS.sports.badminton;
        else if (name.includes("volley")) icon = ICONS.sports.volleyball;
        else if (name.includes("yoga")) icon = ICONS.sports.yoga;
        else if (name.includes("gym")) icon = ICONS.sports.gym;
        else icon = ICONS.sports.ground;

        break;
      case "medical":
        icon = ICONS.medical;
        break;

      default:
        icon = ICONS.academic;
    }
    return p.small ? makeSmallIcon(icon) : icon;
  }
  /* ================= Loaction ================= */
  const allLocations = {};

  /* ================= PLACES (MANUAL ICONS) ================= */

  var places = [
    {
      name: "Mess1",
      type: "food",
      images: ["images/mess.png"],
      coords: [800, 500],
    },
    {
      name: "Mess2",
      type: "food",
      images: ["images/mess.png"],
      coords: [250.07, 1477.5],
    },

    //===== Admin Block INTERNAL =====

    {
      name: "Library",
      type: "academic",
      coords: [594, 234],
      images: ["images/library.png"],
      desc: "Library inside admin block.",
    },
    {
      name: "Nescafe",
      type: "food",
      coords: [507.02, 204.5],
      images: ["images/nescafe1.png", "images/nescafe2.png"],
      desc: "Nescafe outlet inside admin block serving a variety of coffee and snacks.",
    },
    // ===== MINI CAMPUS INTERNAL =====

    // 🏋 Gym (inside mini campus)
    {
      name: "Mini Campus Gym",
      type: "sports",
      coords: [367.05, 1499.5],
      images: ["images/gym.png"],
      desc: "Gym inside mini campus with modern equipment.",
    },

    // 👩 Girls Hostel
    {
      name: "Yamuna Hostel",
      type: "hostel",
      isGirls: true,
      coords: [401.07, 1444],
      images: ["images/yamuna.png"],
      desc: "Girls hostel inside mini campus.",
    },

    // 👨 Boys Hostel
    {
      name: "Dhauladhar Hostel",
      type: "hostel",
      coords: [319.5, 1553.25],
      images: ["images/dhauladhar.png"],
      desc: "Additional boys hostel inside mini campus with sharing options upto 6 roomates.",
    },
    {
      name: "Health Centre",
      type: "medical",
      coords: [253.06, 1584.5],
      images: ["images/health.png"],
      desc: "Campus health centre providing medical assistance and first aid.",
    },
  ];

  // ===== 4. ADD ICONS TO MAP =====
  places.forEach((p) => {
    let markerLayer;
    allLocations[p.name] = p.coords;
    switch (p.type) {
      case "hostel":
        markerLayer = hostelMarkers;
        break;
      case "food":
        markerLayer = foodMarkers;
        break;
      case "academic":
        markerLayer = academicMarkers;
        break;
      case "sports":
        markerLayer = sportsMarkers;
        break;
      case "other":
        markerLayer = otherMarkers;
        break;
      case "medical":
        markerLayer = otherMarkers;
        break;
      default:
        markerLayer = academicMarkers;
    }

    const marker = L.marker(p.coords, { icon: getPlaceIcon(p) })
      .addTo(markerLayer)
      .bindPopup(p.name);
    marker.on("click", function () {
    map.flyTo(p.coords, 1.5, {
      animate: true,
      duration: 0.8
    });

    if (p.images) {
      setPanelData(p.name, p.desc || "", p.images);
    }
  });
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
    marker.on("mouseover", function () {
      this.setZIndexOffset(1000);
    });

    marker.on("mouseout", function () {
      this.setZIndexOffset(0);
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
      iconCoords: [889, 488],
      coords: [
        [724.1, 414.99],
        [724.1, 588.98],
        [725.6, 596.48],
        [728.6, 603.98],
        [740.6, 611.48],
        [773.1, 611.48],
        [850.1, 611.98],
        [897.6, 608.48],
        [911.8, 604.74],
        [921.8, 597.74],
        [927.28, 591.99],
        [941.28, 560.24],
        [952.4, 531.75],
        [953.6, 507.99],
        [954.1, 409.0],
      ],
      images: [
        "images/hostel1.png",
        "images/hostel2.png",
        "images/hostel3.png",
      ],
      desc: "Boys hostel with modern facilities.",
    },

    {
      name: "Sagar Apartment",
      type: "residential",
      iconCoords: [842, 224],
      coords: [
        [730.1, 149.5],
        [723.1, 150.0],
        [720.6, 151.5],
        [718.1, 155.5],
        [715.1, 161.0],
        [710.6, 169.99],
        [711.1, 180.99],
        [711.6, 322.98],
        [718.6, 333.98],
        [736.1, 338.98],
        [929.6, 342.98],
        [938.9, 342.37],
        [945.15, 339.49],
        [951.55, 332.49],
        [953.6, 311.98],
        [953.1, 191.49],
        [953.6, 173.99],
        [952.6, 166.49],
        [950.1, 160.49],
        [949.1, 154.49],
      ],
      images: ["images/faculty.png"],
      desc: "Apartment for faculty members with modern facilities.",
    },

    {
      name: "Directors House",
      type: "residential",
      iconCoords: [530, 820],
      coords: [
        [500.5, 779.48],
        [501.5, 858.97],
        [586.0, 858.97],
        [587.0, 778.98],
      ],
      images: ["images/directors house.png"],
      desc: "Director's residence located in the heart of the campus with a beautiful garden.",
    },

    {
      name: "Academic Block",
      iconCoords: [324, 274],
      type: "academic",
      coords: [
        [229.03, 90.12],
        [224.53, 90.62],
        [220.03, 93.12],
        [216.28, 96.37],
        [213.03, 101.62],
        [211.53, 108.5],
        [211.53, 115.62],
        [212.28, 460.99],
        [213.28, 470.61],
        [217.28, 480.36],
        [227.15, 487.36],
        [238.28, 490.99],
        [427.1, 487.5],
        [439.28, 487.37],
        [447.15, 481.87],
        [451.9, 476.37],
        [453.78, 469.75],
        [453.03, 126.12],
        [453.15, 121.37],
        [453.4, 115.75],
        [452.28, 111.5],
        [451.53, 106.49],
        [449.03, 102.37],
        [446.4, 97.99],
        [444.28, 94.75],
        [439.7, 92.31],
        [436.51, 91.69],
        [433.33, 91.75],
      ],
      images: ["images/academic.png"],
      desc: "Main academic classrooms and lecture halls.",
    },

    {
      name: "Admin Block",
      type: "academic",
      iconCoords: [562, 150],
      coords: [
        [502.15, 88.75],
        [496.65, 91.25],
        [492.4, 95.12],
        [487.78, 99.87],
        [485.78, 103.37],
        [482.78, 107.75],
        [480.28, 112.25],
        [477.9, 118.87],
        [476.28, 125.5],
        [475.15, 131.24],
        [474.65, 136.12],
        [474.65, 141.74],
        [474.28, 148.99],
        [475.05, 261.24],
        [474.89, 267.69],
        [475.14, 274.12],
        [478.39, 281.43],
        [482.2, 286.12],
        [489.14, 291.18],
        [494.39, 292.5],
        [503.83, 292.94],
        [616.78, 293.25],
        [624.03, 292.62],
        [630.4, 289.25],
        [634.78, 283.12],
        [637.78, 277.62],
        [639.28, 272.24],
        [639.78, 122.12],
        [639.28, 118.37],
        [639.15, 115.62],
        [638.65, 112.62],
        [638.28, 110.12],
        [636.2, 106.94],
        [634.26, 103.31],
        [632.76, 101.44],
        [630.89, 98.69],
        [628.83, 96.37],
        [627.33, 94.56],
        [625.33, 92.62],
        [623.26, 91.25],
        [620.83, 90.37],
        [618.4, 89.37],
        [616.15, 88.62],
        [614.03, 87.75],
      ],
      isLibrary: true,
      images: ["images/admin.jpg", "images/admin1.png"],
      desc: "Administrative offices and director's office.",
    },

    {
      name: "Football Ground",
      type: "sports",
      iconCoords: [594, 516],
      coords: [
        [669.5, 356.5],
        [660.5, 356.0],
        [655.0, 355.5],
        [651.0, 355.5],
        [648.0, 356.0],
        [644.5, 355.5],
        [642.15, 354.62],
        [639.15, 352.12],
        [635.78, 349.87],
        [633.78, 348.87],
        [631.65, 346.62],
        [628.4, 345.37],
        [625.65, 343.74],
        [621.28, 341.49],
        [616.53, 339.37],
        [612.28, 338.37],
        [608.53, 337.37],
        [604.15, 336.37],
        [598.15, 336.12],
        [594.15, 335.74],
        [585.28, 335.24],
        [580.4, 336.24],
        [574.28, 338.49],
        [567.53, 341.74],
        [561.4, 344.99],
        [555.28, 348.37],
        [550.65, 351.62],
        [546.65, 355.87],
        [543.15, 359.49],
        [538.65, 364.37],
        [535.28, 368.99],
        [531.53, 374.74],
        [528.53, 379.49],
        [526.03, 384.74],
        [524.03, 389.99],
        [522.15, 396.74],
        [519.4, 405.74],
        [518.15, 412.12],
        [517.53, 417.62],
        [517.4, 474.87],
        [517.03, 567.24],
        [518.03, 618.75],
        [519.65, 624.75],
        [520.65, 632.37],
        [523.65, 640.99],
        [528.65, 650.37],
        [534.4, 660.49],
        [542.53, 670.99],
        [553.9, 679.24],
        [571.15, 688.86],
        [581.53, 693.24],
        [592.53, 693.74],
        [601.9, 692.49],
        [613.53, 690.49],
        [624.78, 686.24],
        [633.03, 679.49],
        [639.15, 675.87],
        [643.9, 671.62],
        [647.9, 669.49],
        [656.15, 670.12],
        [669.65, 670.12],
      ],
      images: ["images/ground.jpg"],
      desc: "Sports ground used for football and events.",
    },

    {
      name: "Yoga court 1",
      small: true,
      type: "sports",
      iconCoords: [510, 339],
      coords: [
        [493.52, 321.5],
        [493.52, 359.5],
        [529.51, 359],
        [529.51, 320.75],
      ],
      images: ["images/yoga.png"],
      desc: "Outdoor yoga court surrounded by greenery, ideal for morning and evening sessions.",
    },

    {
      name: "Yoga court 2",
      small: true,
      type: "sports",
      iconCoords: [511.88, 692],
      coords: [
        [493.52, 672.75],
        [493.52, 712.5],
        [529.51, 713],
        [529.51, 673],
      ],
      images: ["images/yoga.png"],
      desc: "Outdoor yoga court surrounded by greenery, ideal for morning and evening sessions.",
    },

    {
      name: "Volley ball court 1",
      small: true,
      type: "sports",
      iconCoords: [503.52, 447.75],
      coords: [
        [492.38, 424.38],
        [492.26, 473.31],
        [513.19, 473.06],
        [513.32, 424.06],
      ],
      images: ["images/volleyball.png"],
      desc: "Outdoor volleyball court with synthetic flooring and floodlights for night play.",
    },

    {
      name: "Volley ball court 2",
      small: true,
      type: "sports",
      iconCoords: [502.26, 592.125],
      coords: [
        [493.02, 569.5],
        [494.02, 618.0],
        [512.77, 618.25],
        [514.02, 567.75],
      ],
      images: ["images/volleyball.png"],
      desc: "Outdoor volleyball court with synthetic flooring and floodlights for night play.",
    },

    {
      name: "Badminton court",
      small: true,
      type: "sports",
      iconCoords: [374.37, 1652.09],
      coords: [
        [373.77, 1589.75],
        [317.29, 1660.25],
        [380.77, 1712.5],
        [431.39, 1642.5],
      ],
      images: ["images/badminton.png"],
      desc: "Outdoor badminton court with wooden flooring and proper lighting.",
    },

    {
      name: "Canteen",
      type: "food",
      iconCoords: [530, 1328],
      coords: [
        [497.6, 1218.48],
        [497.6, 1446.46],
        [570.2, 1443.25],
        [572.16, 1442.59],
        [573.91, 1441.81],
        [575.1, 1440.59],
        [576.01, 1439.12],
        [576.44, 1437.19],
        [578.15, 1230.12],
        [578.9, 1226.37],
        [579.15, 1223.87],
        [578.15, 1221.75],
        [576.53, 1220.0],
        [574.65, 1219.37],
      ],
      images: [
        "images/canteen2.png",
        "images/canteen3.png",
        "images/canteen4.png",
      ],
      desc: "Campus food court with outlets like Amul,Mother Dairy and VegMorning Fresh.",
    },
    {
      name: "Fountain",
      type: "other",
      small: true,
      icon: ICONS.fountain,
      iconCoords: [418, 1259],
      coords: [
        [448.6, 1201.47],
        [394.6, 1199.47],
        [388.6, 1307.96],
        [391.1, 1318.46],
        [416.6, 1323.46],
        [445.1, 1321.96],
        [456.1, 1311.46],
        [455.1, 1215.97],
        [453.76, 1207.62],
        [452.01, 1204.06],
      ],
      images: ["images/fountain1.png", "images/fountain2.png"],
      desc: "fountain of NIT DELHI",
    },
    {
      name: "Entrance gate 1 ",
      type: "other",

      iconCoords: [130.329, 1346],
      coords: [
        [86.58, 1248.5],
        [86.58, 1434.0],
        [181.05, 1429.5],
        [180.05, 1245.0],
      ],
      images: ["images/entrance.png"],
      desc: "Enterance gate 1 of NIT DELHI",
    },
    {
      name: "Entrance gate 2 ",
      type: "other",
      iconCoords: [131.07, 713],
      coords: [
        [92.09, 620.5],
        [91.09, 809.5],
        [178.063, 808],
        [183.06, 618.5],
      ],
      images: ["images/entrance2.png"],
      desc: "entrance gate 2 of NIT DELHI",
    },

    {
      name: "H.K Cafe",
      type: "food",
      small: true,
      iconCoords: [690, 390],
      coords: [
        [678.28, 356.25],
        [678.15, 432.62],
        [715.78, 431.74],
        [717.28, 356.5],
      ],
      images: ["images/HK_cafe.png"],
      desc: "Modern green-themed café powered by Mountain Dew.",
    },

    {
      name: "Dept Of Mechanical Engineering",
      type: "academic",
      small: true,
      iconCoords: [528.27, 1189.5],
      coords: [
        [497.03, 1163.75],
        [497.53, 1216.75],
        [561.51, 1216.5],
        [563.76, 1163.75],
      ],
      images: ["images/mechanical dept.png"],
      desc: "Mechanical engineering department building.",
    },
    {
      name: "Startup Centre",
      small: true,
      type: "academic",
      iconCoords: [525.55, 1141.5],
      coords: [
        [495.28, 1109.75],
        [497.781, 1161.75],
        [563.76, 1160.5],
        [564.01, 1111],
      ],
      images: ["images/startup.png"],
      desc: "Startup centre of NIT DELHI",
    },

    {
      name: "Sports Courts",
      type: "sports",
      iconCoords: [632, 1164],
      coords: [
        [565.03, 1118.49],
        [566.1, 1208.98],
        [686.1, 1210.98],
        [687.6, 1117.49],
      ],
      images: ["images/sports court.png"],
      desc: "Courts for basketball and tennis sports.",
    },

    {
      name: "Mini Campus",
      type: "academic",
      iconCoords: [274, 1380],
      coords: [
        [282.9, 1335.74],
        [280.03, 1335.87],
        [277.9, 1335.37],
        [274.65, 1335.37],
        [273.03, 1335.37],
        [271.28, 1336.49],
        [268.4, 1338.87],
        [226.1, 1385.97],
        [224.83, 1388.75],
        [223.14, 1392.56],
        [221.64, 1397.0],
        [220.33, 1403.25],
        [220.01, 1407.74],
        [217.6, 1697.47],
        [234.1, 1711.97],
        [240.53, 1713.37],
        [247.28, 1712.49],
        [255.03, 1710.99],
        [263.53, 1707.99],
        [270.78, 1702.99],
        [451.8, 1450.99],
        [457.33, 1441.62],
        [460.64, 1433.75],
        [463.26, 1425.31],
        [464.76, 1416.0],
        [464.55, 1357.75],
        [462.55, 1352.75],
        [459.3, 1348.5],
        [456.3, 1344.25],
        [451.8, 1341.0],
        [448.8, 1338.75],
        [445.55, 1337.5],
        [442.05, 1336.5],
      ],
      images: ["images/minicampus.png"],
      desc: "Mini campus with labs and classrooms.",
    },
  ];

  /* ===== ADD POLYGONS ===== */
  function getPolygonCenter(coords) {
    let latSum = 0;
    let lngSum = 0;

    coords.forEach(([lat, lng]) => {
      latSum += lat;
      lngSum += lng;
    });

    return [
      latSum / coords.length,
      lngSum / coords.length
    ];
  }
  let polygons = [];

  buildings.forEach((b) => {
    if (!b.coords || b.coords.length === 0) return;

    // ===== POLYGON LAYER (unchanged logic) =====
    let polygonLayer;

    switch (b.type) {
    case "hostel":
      polygonLayer = hostelPolygons;
      break;
    case "food":
      polygonLayer = foodPolygons;
      break;
    case "academic":
      polygonLayer = academicPolygons;
      break;
    case "sports":
      polygonLayer = sportsPolygons;
      break;
    case "residential":
    case "other":
      polygonLayer = otherPolygons;
      break;
    default:
      polygonLayer = otherPolygons;
  }

    // ===== ADD POLYGON =====
    var poly = L.polygon(b.coords, {
      color: "transparent",
      fillOpacity: 0.01,
    }).addTo(polygonLayer);

    polygons.push({ poly, data: b });

    let position = getIconPosition(b);

    // ===== MARKER LAYER =====
    let markerLayer;

    switch (b.type) {
      case "hostel":
        markerLayer = hostelMarkers;
        break;
      case "food":
        markerLayer = foodMarkers;
        break;
      case "academic":
        markerLayer = academicMarkers;
        break;
      case "sports":
        markerLayer = sportsMarkers;
        break;
      case "other":
        markerLayer = otherMarkers;
        break;
      case "residential":
        markerLayer = otherMarkers;
        break;
      default:
        markerLayer = otherMarkers;
    }
    const center = getPolygonCenter(b.coords);
    allLocations[b.name] = center;
    // ===== ADD BUILDING ICON + HOVER =====
 let marker = null;

  if (b.showIcon !== false) {
      marker = L.marker(position, {
        icon: getPlaceIcon(b),
      })
        .addTo(markerLayer)
        .bindPopup(b.name);

      // ✅ CLICK → ZOOM + PANEL
      marker.on("click", function () {
        const center = getPolygonCenter(b.coords);

        map.flyTo(center, 1, {
          animate: true,
          duration: 0.8,
        });

        if (b.images) {
          setPanelData(b.name, b.desc || "", b.images);
        }
      });

      // 🔥 ICON HOVER
      marker.on("mouseover", function () {
        if (currentBuilding === b.name) return;

        currentBuilding = b.name;

        if (b.images) {
          setPanelData(b.name, b.desc || "", b.images);
        }
      });

      marker.on("mouseout", function () {
        currentBuilding = null;
      });
    }
    // ===== POLYGON EVENTS (ONLY ONE COPY) =====
    poly.on("mouseover", function () {
      if (currentBuilding === b.name) return;

      currentBuilding = b.name;

      poly.setStyle({
        color: "#00bcd4",
        weight: 2,
        fillColor: "#00bcd4",
        fillOpacity: 0.25,
      });

      setPanelData(b.name, b.desc, b.images);
    });

    poly.on("mouseout", function () {
      poly.setStyle({
        color: "transparent",
        fillOpacity: 0.01,
      });

      currentBuilding = null;
    });
  });

  // ===== DETECT OUTSIDE =====
  map.on("mousemove", function (e) {
    let insideAny = false;

    polygons.forEach((obj) => {
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
  document
    .getElementById("hostelToggle")
    .addEventListener("change", function (e) {
      toggleLayer(hostelMarkers, hostelPolygons, e.target.checked);
    });

  // 🍴 FOOD
  document
    .getElementById("canteenToggle")
    .addEventListener("change", function (e) {
      toggleLayer(foodMarkers, foodPolygons, e.target.checked);
    });

  // 🏫 ACADEMIC
  document
    .getElementById("academicToggle")
    .addEventListener("change", function (e) {
      toggleLayer(academicMarkers, academicPolygons, e.target.checked);
    });

  // ⚽ SPORTS
  document
    .getElementById("sportsToggle")
    .addEventListener("change", function (e) {
      toggleLayer(sportsMarkers, sportsPolygons, e.target.checked);
    });

  // 🌟 OTHER
  document
    .getElementById("otherToggle")
    .addEventListener("change", function (e) {
      toggleLayer(otherMarkers, otherPolygons, e.target.checked);
    });

  // ===== SUB FILTERS =====

  // 📚 LIBRARY (only affects markers)
  document
    .getElementById("libraryToggle")
    .addEventListener("change", function (e) {
      academicMarkers.eachLayer((layer) => {
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
  document.getElementById("gymToggle").addEventListener("change", function (e) {
    sportsMarkers.eachLayer((layer) => {
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
  document
    .getElementById("medicalToggle")
    .addEventListener("change", function (e) {
      otherMarkers.eachLayer((layer) => {
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
  document
    .getElementById("messToggle")
    .addEventListener("change", function (e) {
      foodMarkers.eachLayer((layer) => {
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
    h = h.toString().padStart(2, "0");
    m = m.toString().padStart(2, "0");
    s = s.toString().padStart(2, "0");

    if (clock) {
      clock.innerText = `${h}:${m} ${ampm}`;
    }
  }

  setInterval(updateClock, 1000);
  updateClock();
  let searchMarker;

  function searchLocation() {
    const input = document.getElementById("searchInput").value.toLowerCase();

    const found = Object.keys(allLocations).find(loc =>
      loc.toLowerCase().includes(input)
    );

    if (found) {
      const coords = allLocations[found];

      map.flyTo(coords, 1.5, {
        animate: true,
        duration: 1
      });

      if (searchMarker) {
        map.removeLayer(searchMarker);
      }

      searchMarker = L.circleMarker(coords, {
        radius: 12,
        color: "red",
        fillColor: "red",
        fillOpacity: 0.5
      }).addTo(map);

      setPanelData(found, "Location found", []);
    } else {
      alert("Location not found");
    }
  }
  function populateDropdowns() {
    const from = document.getElementById("from");
    const to = document.getElementById("to");

    from.innerHTML = '<option disabled selected>From</option>';
    to.innerHTML = '<option disabled selected>To</option>';

    Object.keys(allLocations).forEach(loc => {
      const option1 = document.createElement("option");
      option1.value = loc;
      option1.textContent = loc;

      const option2 = option1.cloneNode(true);

      from.appendChild(option1);
      to.appendChild(option2);
    });
  }
  populateDropdowns();

  /* ============================================================
   |  SMART ROAD-BASED NAVIGATION SYSTEM                        |
   |  ─────────────────────────────────────────────────────     |
   |  HOW TO EDIT THIS FILE:                                    |
   |                                                            |
   |  1. ROAD_NODES — key intersections on campus roads         |
   |     Format: "KEY": [y, x]   ← same pixel system as icons  |
   |     Add a new node: "MY_NODE": [y, x],                     |
   |                                                            |
   |  2. ROAD_EDGES — which nodes connect to each other         |
   |     Format: ["KEY_A", "KEY_B"]                             |
   |     Every edge is BIDIRECTIONAL (two-way)                  |
   |                                                            |
   |  3. LOCATION_ENTRIES — maps a place name → nearest node    |
   |     If a place is missing from this list it auto-snaps     |
   |     to whichever road node is geometrically closest.       |
   |                                                            |
   |  TIP: Open map in browser, enable "Show Roads" button,     |
   |       click map to log [y, x] coords to console, then      |
   |       paste them here.                                     |
   ============================================================ */

  /* ────────────────────────────────────────────────────────────
     STEP 1 ─ ROAD NODES
     Each entry is a named intersection / waypoint on a campus road.
     Coordinates are [y, x] in pixel space, same as your markers.
  ──────────────────────────────────────────────────────────── */
  const ROAD_NODES = {

    // ── LEFT PERIMETER ROAD  (runs top → bottom on the west side) ──
    "L_TOP":   [95,  185],   // Top-left corner of campus road
    "L_MID":   [490, 185],   // Mid-left — main T-junction
    "L_BOT":   [720, 185],   // Lower-left — near Shivalik / Sagar

    // ── TOP HORIZONTAL ROAD  (runs west → east along the north) ───
    "T_W":     [95,  300],   // Top-west, in front of Academic Block
    "T_C":     [95,  460],   // Top-centre
    "T_G2":    [95,  713],   // Aligned with Gate 2 (north end)
    "T_R":     [95,  960],   // Top-right junction
    "T_FR":    [95, 1346],   // Far-right top, near Gate 1

    // ── ENTRANCE GATES ─────────────────────────────────────────────
    "GATE_1":  [130, 1346],  // Main entrance  (Gate 1, top-right)
    "GATE_2":  [131,  713],  // Side entrance  (Gate 2, top-centre)

    // ── CENTRAL HORIZONTAL ROAD  (runs at y ≈ 490) ────────────────
    "M_W":     [490,  300],  // Mid-west, east of Admin Block
    "M_C":     [490,  516],  // Mid-centre — north of Football Ground
    "M_G2":    [490,  713],  // Aligned with Gate 2 (mid level)
    "M_R":     [490,  960],  // Mid-right junction

    // ── SOUTH FOOTBALL-GROUND ROAD  (runs at y ≈ 720) ─────────────
    "S_W":     [720,  460],  // South-west of football ground
    "S_E":     [720,  680],  // South-east of football ground

    // ── RIGHT-SIDE AREA  (Canteen / Sports Courts / Mini Campus) ───
    "R_TOP":   [250, 1120],  // Top of right-area road
    "R_MCMP":  [250, 1346],  // Mini-campus road junction
    "R_MID":   [490, 1120],  // Near Startup Centre / Mech Dept
    "R_CNT":   [490, 1346],  // Near Canteen & Fountain
    "R_SPT":   [640, 1120],  // Sports courts side-road

  };

  /* ────────────────────────────────────────────────────────────
     STEP 2 ─ ROAD EDGES
     List every road segment as a pair of node keys.
     All connections are two-way — you only need to list each once.
  ──────────────────────────────────────────────────────────── */
  const ROAD_EDGES = [

    // Left perimeter (vertical)
    ["L_TOP", "L_MID"],
    ["L_MID", "L_BOT"],

    // Top road (west → east)
    ["L_TOP", "T_W"],
    ["T_W",   "T_C"],
    ["T_C",   "T_G2"],
    ["T_G2",  "T_R"],
    ["T_R",   "T_FR"],

    // Gate connections
    ["T_G2",  "GATE_2"],   // Gate 2 drop-in from top road
    ["GATE_2","M_G2"],     // Gate 2 connects to central road
    ["T_FR",  "GATE_1"],   // Gate 1 drop-in from top road
    ["GATE_1","R_MCMP"],   // Gate 1 connects to mini-campus road

    // Central road (west → east, at y ≈ 490)
    ["L_MID", "M_W"],
    ["M_W",   "M_C"],
    ["M_C",   "M_G2"],
    ["M_G2",  "M_R"],

    // Vertical connectors (top road ↕ central road)
    ["T_W",   "M_W"],
    ["T_C",   "M_C"],
    ["T_G2",  "M_G2"],

    // South football-ground road (at y ≈ 720)
    ["L_BOT", "S_W"],
    ["S_W",   "S_E"],
    ["M_C",   "S_W"],      // North → south of ground (west side)
    ["M_G2",  "S_E"],      // North → south of ground (east side)

    // Right-side area connections
    ["T_R",   "R_TOP"],
    ["R_TOP", "R_MCMP"],
    ["R_MCMP","R_MID"],
    ["R_MID", "R_CNT"],
    ["R_MID", "R_SPT"],
    ["M_R",   "R_MID"],    // Central road → right area

  ];

  /* ────────────────────────────────────────────────────────────
     STEP 3 ─ LOCATION ENTRIES
     Maps each place name (must match exactly) to its nearest
     road node key. Edit this if a route looks wrong — just
     change the node key to a closer one.
  ──────────────────────────────────────────────────────────── */
  const LOCATION_ENTRIES = {

    // Academic
    "Academic Block":                "T_W",
    "Admin Block":                   "L_TOP",
    "Library":                       "L_TOP",
    "Nescafe":                       "L_TOP",
    "Dept Of Mechanical Engineering":"R_MID",
    "Startup Centre":                "R_MID",

    // Hostels
    "Shivalik Hostel":               "L_BOT",
    "Sagar Apartment":               "L_BOT",
    "Yamuna Hostel":                 "R_MCMP",
    "Dhauladhar Hostel":             "R_MCMP",

    // Food & Cafes
    "Mess1":                         "L_BOT",
    "Mess2":                         "R_MCMP",
    "Canteen":                       "R_CNT",
    "H.K Cafe":                      "S_W",

    // Sports
    "Football Ground":               "M_C",
    "Yoga court 1":                  "M_C",
    "Yoga court 2":                  "M_C",
    "Volley ball court 1":           "M_C",
    "Volley ball court 2":           "M_C",
    "Badminton court":               "R_MCMP",
    "Mini Campus Gym":               "R_MCMP",
    "Sports Courts":                 "R_SPT",

    // Other
    "Health Centre":                 "R_MCMP",
    "Fountain":                      "R_CNT",
    "Directors House":               "M_G2",
    "Entrance gate 1 ":              "GATE_1",
    "Entrance gate 2 ":              "GATE_2",
    "Mini Campus":                   "R_MCMP",

  };


  /* ============================================================
     GRAPH BUILDER
     Converts ROAD_NODES + ROAD_EDGES into an adjacency list.
     Each edge weight = Euclidean pixel distance between nodes.
  ============================================================ */
  function buildGraph() {
    const graph = {};

    // Initialise every node with an empty neighbour list
    Object.keys(ROAD_NODES).forEach(k => { graph[k] = []; });

    // Add bidirectional edges with distance weights
    ROAD_EDGES.forEach(([a, b]) => {
      if (!ROAD_NODES[a] || !ROAD_NODES[b]) {
        console.warn(`[Road] Unknown node in edge: ${a} — ${b}`);
        return;
      }
      const [ay, ax] = ROAD_NODES[a];
      const [by, bx] = ROAD_NODES[b];
      const dist = Math.sqrt((ay - by) ** 2 + (ax - bx) ** 2);
      graph[a].push({ node: b, cost: dist });
      graph[b].push({ node: a, cost: dist });
    });

    return graph;
  }

  const roadGraph = buildGraph();


  /* ============================================================
     DIJKSTRA PATHFINDING
     Returns array of node keys from start → end, or null if
     no path exists.
  ============================================================ */
  function dijkstra(graph, startKey, endKey) {
    if (startKey === endKey) return [startKey];

    const dist = {};
    const prev = {};
    const visited = new Set();
    const queue = [];   // [{ node, cost }]

    Object.keys(graph).forEach(k => {
      dist[k] = Infinity;
      prev[k] = null;
    });

    dist[startKey] = 0;
    queue.push({ node: startKey, cost: 0 });

    while (queue.length > 0) {
      // Grab the cheapest unvisited node
      queue.sort((a, b) => a.cost - b.cost);
      const { node } = queue.shift();

      if (visited.has(node)) continue;
      visited.add(node);
      if (node === endKey) break;

      for (const { node: nb, cost } of graph[node]) {
        if (visited.has(nb)) continue;
        const newCost = dist[node] + cost;
        if (newCost < dist[nb]) {
          dist[nb] = newCost;
          prev[nb] = node;
          queue.push({ node: nb, cost: newCost });
        }
      }
    }

    // Reconstruct path by walking prev[] backwards
    const path = [];
    let cur = endKey;
    while (cur !== null) {
      path.unshift(cur);
      cur = prev[cur];
    }

    return path[0] === startKey ? path : null;  // null = unreachable
  }


  /* ============================================================
     HELPER — resolve a place name to its road node key
  ============================================================ */
  function getEntryNode(name) {
    // 1. Exact match in LOCATION_ENTRIES
    if (LOCATION_ENTRIES[name]) return LOCATION_ENTRIES[name];

    // 2. Case-insensitive fuzzy match
    const lower = name.toLowerCase();
    for (const key of Object.keys(LOCATION_ENTRIES)) {
      if (key.toLowerCase().includes(lower) || lower.includes(key.toLowerCase().trim())) {
        return LOCATION_ENTRIES[key];
      }
    }

    // 3. Geometric fallback — nearest road node by pixel distance
    const coords = allLocations[name];
    if (!coords) return null;

    let nearest = null;
    let minD = Infinity;
    Object.entries(ROAD_NODES).forEach(([key, [ny, nx]]) => {
      const d = Math.sqrt((coords[0] - ny) ** 2 + (coords[1] - nx) ** 2);
      if (d < minD) { minD = d; nearest = key; }
    });
    return nearest;
  }


  /* ============================================================
     ROUTE LAYERS — kept as module-level variables so clearRoute()
     can remove them from any scope.
  ============================================================ */
  let routeLine        = null;
  let routeStartDot    = null;
  let routeEndDot      = null;
  let movingDot        = null;
  let routeAnimTimer   = null;
  let roadVizLayer     = null;   // optional: show the road graph


  /* ============================================================
     CLEAR ROUTE — removes all route visuals and hides the panel
  ============================================================ */
  function clearRoute() {
    [routeLine, routeStartDot, routeEndDot, movingDot].forEach(l => {
      if (l) map.removeLayer(l);
    });
    routeLine = routeStartDot = routeEndDot = movingDot = null;

    if (routeAnimTimer) { clearInterval(routeAnimTimer); routeAnimTimer = null; }

    const panel = document.getElementById("routeInfoPanel");
    if (panel) panel.style.display = "none";
  }
  window.clearRoute = clearRoute;


  /* ============================================================
     ANIMATE ROUTE — smooth dot that interpolates between waypoints
     and loops continuously until clearRoute() is called.
  ============================================================ */
  function animateRoute(coords) {
    if (movingDot) map.removeLayer(movingDot);
    if (routeAnimTimer) clearInterval(routeAnimTimer);

    movingDot = L.circleMarker(coords[0], {
      radius: 7,
      color: "#fff",
      fillColor: "#16a34a",
      fillOpacity: 1,
      weight: 2.5,
    }).addTo(map);

    let seg = 0;   // current segment index
    let t   = 0;   // progress within segment [0 … 1]

    // Speed: completes each pixel in ~0.05 s  →  ~20 px/s
    const PX_PER_FRAME = 5;
    const FRAME_MS     = 30;

    routeAnimTimer = setInterval(() => {
      if (seg >= coords.length - 1) { seg = 0; t = 0; return; }  // loop

      const [ay, ax] = coords[seg];
      const [by, bx] = coords[seg + 1];
      const segLen = Math.sqrt((by - ay) ** 2 + (bx - ax) ** 2);
      const step   = segLen > 0 ? PX_PER_FRAME / segLen : 1;

      t += step;
      if (t >= 1) { t = 0; seg++; return; }

      movingDot.setLatLng([ay + (by - ay) * t, ax + (bx - ax) * t]);
    }, FRAME_MS);
  }


  /* ============================================================
     ROUTE INFO PANEL — shows distance, walk time, and via label
  ============================================================ */
  function showRoutePanel(from, to, meters, minutes, viaLabel) {
    let panel = document.getElementById("routeInfoPanel");

    if (!panel) {
      panel = document.createElement("div");
      panel.id = "routeInfoPanel";
      Object.assign(panel.style, {
        position:       "fixed",
        bottom:         "24px",
        left:           "280px",
        zIndex:         "7000",
        background:     "rgba(255,255,255,0.97)",
        backdropFilter: "blur(14px)",
        borderRadius:   "16px",
        padding:        "14px 18px",
        boxShadow:      "0 8px 28px rgba(0,0,0,0.16)",
        minWidth:       "310px",
        border:         "1px solid #e5e7eb",
        fontFamily:     "'Inter', sans-serif",
        transition:     "0.3s",
      });
      document.body.appendChild(panel);
    }

    panel.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
        <div style="font-weight:700;font-size:15px;color:#1e293b;">🗺 Navigation</div>
        <button
          onclick="clearRoute()"
          style="border:none;background:#f1f5f9;border-radius:8px;
                 padding:4px 12px;cursor:pointer;font-size:12px;color:#64748b;
                 font-weight:600;">
          ✕ Clear
        </button>
      </div>

      <div style="font-size:13px;color:#475569;margin-bottom:12px;
                  display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
        <span style="color:#2563eb;font-weight:600;">🔵 ${from}</span>
        <span style="color:#94a3b8;font-size:16px;">→</span>
        <span style="color:#dc2626;font-weight:600;">🔴 ${to}</span>
      </div>

      <div style="display:flex;gap:10px;">
        <div style="flex:1;text-align:center;background:#eff6ff;
                    border-radius:12px;padding:10px 6px;">
          <div style="font-size:20px;font-weight:800;color:#2563eb;">~${meters} m</div>
          <div style="font-size:11px;color:#64748b;margin-top:2px;">distance</div>
        </div>
        <div style="flex:1;text-align:center;background:#f0fdf4;
                    border-radius:12px;padding:10px 6px;">
          <div style="font-size:20px;font-weight:800;color:#16a34a;">${minutes} min</div>
          <div style="font-size:11px;color:#64748b;margin-top:2px;">walking</div>
        </div>
        <div style="flex:1;text-align:center;background:#faf5ff;
                    border-radius:12px;padding:10px 6px;">
          <div style="font-size:17px;font-weight:700;color:#7c3aed;">${viaLabel}</div>
          <div style="font-size:11px;color:#64748b;margin-top:2px;">via</div>
        </div>
      </div>

      <div style="margin-top:10px;font-size:11px;color:#94a3b8;text-align:center;">
        🟢 Follow the green dot
      </div>
    `;

    panel.style.display = "block";
  }


  /* ============================================================
     DRAW ROUTE — main function called by the Navigate button
  ============================================================ */
  function drawRoute() {
    const from = document.getElementById("from").value;
    const to   = document.getElementById("to").value;

    if (!from || !to || from === "From" || to === "To") {
      alert("Please select both locations.");
      return;
    }
    if (from === to) {
      alert("Start and destination are the same.");
      return;
    }

    clearRoute();

    const startCoords = allLocations[from];
    const endCoords   = allLocations[to];

    if (!startCoords || !endCoords) {
      alert("Location not found in the map.");
      return;
    }

    // ── Resolve road-network entry nodes ──────────────────────
    const startNode = getEntryNode(from);
    const endNode   = getEntryNode(to);

    if (!startNode || !endNode) {
      alert("Could not connect these locations to the road network.");
      return;
    }

    // ── Find shortest road path via Dijkstra ──────────────────
    let nodeKeys  = [];
    let roadCoords = [];

    if (startNode !== endNode) {
      nodeKeys = dijkstra(roadGraph, startNode, endNode);
      if (!nodeKeys) {
        console.warn("[Nav] No road path found — falling back to straight line");
        nodeKeys = [startNode, endNode];
      }
      roadCoords = nodeKeys.map(k => ROAD_NODES[k]);
    } else {
      roadCoords = [ROAD_NODES[startNode]];
    }

    // ── Build full route: location → entry → road → exit → location ──
    const fullRoute = [
      startCoords,
      ROAD_NODES[startNode],
      ...roadCoords,
      ROAD_NODES[endNode],
      endCoords,
    ];

    // De-duplicate consecutive identical points
    const deduped = fullRoute.filter((pt, i) =>
      i === 0 ||
      pt[0] !== fullRoute[i - 1][0] ||
      pt[1] !== fullRoute[i - 1][1]
    );

    // ── Draw route polyline ───────────────────────────────────
    routeLine = L.polyline(deduped, {
      color:     "#2563eb",
      weight:    5,
      lineCap:   "round",
      lineJoin:  "round",
      opacity:   0.88,
    }).addTo(map);

    // Start marker — blue circle
    routeStartDot = L.circleMarker(startCoords, {
      radius:      10,
      color:       "#fff",
      fillColor:   "#2563eb",
      fillOpacity: 1,
      weight:      3,
    }).addTo(map);

    // End marker — red circle
    routeEndDot = L.circleMarker(endCoords, {
      radius:      10,
      color:       "#fff",
      fillColor:   "#dc2626",
      fillOpacity: 1,
      weight:      3,
    }).addTo(map);

    // Fit map to the route with comfortable padding
    map.fitBounds(routeLine.getBounds(), { padding: [70, 70] });

    // ── Animate the green dot ─────────────────────────────────
    animateRoute(deduped);

    // ── Calculate approximate distance & walk time ────────────
    let totalPx = 0;
    for (let i = 1; i < deduped.length; i++) {
      const [ay, ax] = deduped[i - 1];
      const [by, bx] = deduped[i];
      totalPx += Math.sqrt((by - ay) ** 2 + (bx - ax) ** 2);
    }
    // Rough scale: campus ≈ 500 m wide, image 1920 px → 0.26 m/px
    const meters  = Math.round(totalPx * 0.26);
    const minutes = Math.max(1, Math.ceil(meters / 80)); // 80 m/min walking

    // ── Determine "via" label from road node keys ─────────────
    let viaLabel = "campus road";
    if (nodeKeys.some(k => k.startsWith("T_"))) viaLabel = "top road";
    if (nodeKeys.some(k => k.startsWith("M_"))) viaLabel = "main road";
    if (nodeKeys.some(k => k.startsWith("R_"))) viaLabel = "east road";
    if (nodeKeys.includes("GATE_1") || nodeKeys.includes("GATE_2")) viaLabel = "gate road";

    showRoutePanel(from, to, meters, minutes, viaLabel);
  }


  /* ============================================================
     OPTIONAL DEBUG — toggle the road graph overlay on the map
     Wired to the "Show Roads" button added in map.html sidebar.
  ============================================================ */
  function toggleRoadViz() {
    const btn = document.getElementById("showRoadsBtn");

    if (roadVizLayer) {
      map.removeLayer(roadVizLayer);
      roadVizLayer = null;
      if (btn) btn.textContent = "🛣 Show Roads";
      return;
    }

    roadVizLayer = L.layerGroup().addTo(map);

    // Draw edges as dashed grey lines
    ROAD_EDGES.forEach(([a, b]) => {
      if (!ROAD_NODES[a] || !ROAD_NODES[b]) return;
      L.polyline([ROAD_NODES[a], ROAD_NODES[b]], {
        color:     "#94a3b8",
        weight:    2,
        dashArray: "5, 5",
        opacity:   0.7,
      }).addTo(roadVizLayer);
    });

    // Draw node dots with labels
    Object.entries(ROAD_NODES).forEach(([key, coords]) => {
      L.circleMarker(coords, {
        radius:      5,
        color:       "#2563eb",
        fillColor:   "#2563eb",
        fillOpacity: 0.8,
        weight:      1,
      })
        .bindTooltip(key, { permanent: false, direction: "top" })
        .addTo(roadVizLayer);
    });

    if (btn) btn.textContent = "🛣 Hide Roads";
  }
  window.toggleRoadViz = toggleRoadViz;


  /* ============================================================
     EXPOSE GLOBALS
  ============================================================ */
  window.drawRoute      = drawRoute;
  window.searchLocation = searchLocation;
});
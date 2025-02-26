//document.addEventListener("DOMContentLoaded", function () {
//    const container = document.getElementById("sketch-container");
//    const width = container.clientWidth;
//    const height = container.clientHeight;

//    const svg = d3.select("#sketch-container")
//        .append("svg")
//        .attr("width", width)
//        .attr("height", height)
//        .call(d3.zoom().scaleExtent([0.2, 8]).on("zoom", zoomed))
//        .append("g");

//    let zoom = d3.zoom().scaleExtent([0.2, 8]).on("zoom", zoomed);
//    let svgContainer = d3.select("svg").call(zoom);

//    d3.xml("data/map_v2.svg").then(data => {
//        const importedNode = document.importNode(data.documentElement, true);
//        svg.node().appendChild(importedNode);
//        fitToContainer();
//        enableBuildingClick(); 
//    }).catch(error => console.error("Error loading SVG:", error));

//    function zoomed(event) {
//        svg.attr("transform", event.transform);
//    }

//    function fitToContainer() {
//        const bbox = svg.node().getBBox();
//        const scale = Math.min(width / bbox.width, height / bbox.height) * 0.9;
//        const translateX = (width - bbox.width * scale) / 2;
//        const translateY = (height - bbox.height * scale) / 2;

//        svgContainer.transition().duration(500)
//            .call(zoom.transform, d3.zoomIdentity.translate(translateX, translateY).scale(scale));

//        zoom.scaleExtent([scale * 0.5, 8]);
//    }

//    function enableBuildingClick() {
//        d3.json("../cleaned_data/palaiseau_student_housing.json")
//            .then(housingData => {
//                console.log("Housing Data Loaded:", housingData);

//                // Select paths that represent student housing (blue fill)
//                svg.selectAll("path")
//                    .filter(function () {
//                        let fillColor = d3.select(this).style("fill") || this.getAttribute("fill");
//                        return fillColor === "rgb(0, 0, 255)" || fillColor.toLowerCase() === "#0000ff"; // Convert to lowercase for consistency
//                    })
//                    .style("cursor", "pointer")
//                    .each(function (d, i) {
//                        // Assign data to paths (assuming order is consistent)
//                        if (housingData.features[i]) {
//                            d3.select(this).datum(housingData.features[i].properties);
//                        }
//                    })
//                    .on("click", function (event, d) {
//                        if (d) {
//                            showInfo(event, d);
//                        } else {
//                            console.warn("No data found for this building.");
//                        }
//                    });

//            })
//            .catch(error => console.error("Error loading housing data:", error));
//    }

//    function showInfo(event, buildingData) {
//        // Select the info container
//        const infoContainer = d3.select("#info-container");

//        // Update the text with building details
//        d3.select("#info-text").html(`<strong>Location:</strong> ${buildingData.town}<br><strong>Rent:</strong> ${buildingData.info}`);

//        // Make the container visible
//        infoContainer.style("display", "block");
//    }

//    document.getElementById("zoom-in").addEventListener("click", function () {
//        svgContainer.transition().call(zoom.scaleBy, 1.2);
//    });

//    document.getElementById("zoom-out").addEventListener("click", function () {
//        svgContainer.transition().call(zoom.scaleBy, 0.8);
//    });

//    window.addEventListener("resize", () => {
//        const newWidth = container.clientWidth;
//        const newHeight = container.clientHeight;
//        d3.select("svg").attr("width", newWidth).attr("height", newHeight);
//        fitToContainer();
//    });
//});




//----------------------------------------------------------------------------//
//---------------------- BEST VERSION ----------------------------------------//
//----------------------------------------------------------------------------//

document.addEventListener("DOMContentLoaded", function () {
    const container = document.getElementById("sketch-container");
    const width = container.clientWidth;
    const height = container.clientHeight;

    const svg = d3.select("#sketch-container")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .call(d3.zoom().scaleExtent([0.2, 8]).on("zoom", zoomed))
        .append("g");

    let zoom = d3.zoom().scaleExtent([0.2, 8]).on("zoom", zoomed);
    let svgContainer = d3.select("svg").call(zoom);

    d3.xml("data/map_v2.svg").then(data => {
        const importedNode = document.importNode(data.documentElement, true);
        svg.node().appendChild(importedNode);
        fitToContainer();
        enableBuildingClick(); 
    }).catch(error => console.error("Error loading SVG:", error));

    function zoomed(event) {
        svg.attr("transform", event.transform);
    }

    function fitToContainer() {
        const bbox = svg.node().getBBox();
        const scale = Math.min(width / bbox.width, height / bbox.height) * 0.9;
        const translateX = (width - bbox.width * scale) / 2;
        const translateY = (height - bbox.height * scale) / 2;

        svgContainer.transition().duration(500)
            .call(zoom.transform, d3.zoomIdentity.translate(translateX, translateY).scale(scale));

        zoom.scaleExtent([scale * 0.5, 8]);
    }

    function enableBuildingClick() {
        d3.json("../cleaned_data/student_housing.json")
            .then(housingData => {
                console.log("Housing Data Loaded:", housingData);

                // Select paths that represent student housing (blue fill)
                svg.selectAll("path")
                    .filter(function () {
                        let fillColor = d3.select(this).style("fill") || this.getAttribute("fill");
                        return fillColor === "rgb(0, 0, 255)" || fillColor.toLowerCase() === "#0000ff"; // Convert to lowercase for consistency
                    })
                    .style("cursor", "pointer")
                    .each(function (d, i) {
                        // Assign data to paths (assuming order is consistent)
                        if (housingData.features[i]) {
                            d3.select(this).datum(housingData.features[i].properties);
                        }
                    })
                    .on("click", function (event, d) {
                        // Get the datum associated with the clicked element (building)
                        const buildingData = d3.select(this).datum();
                        if (buildingData) {
                            showInfo(event, buildingData);
                        } else {
                            console.warn("No data found for this building.");
                        }
                    });

            })
            .catch(error => console.error("Error loading housing data:", error));
    }

    function showInfo(event, buildingData) {
        // Select the info container
        const infoContainer = d3.select("#info-container");

        // Update the text with building details
        d3.select("#info-text").html(`
            <strong>Location:</strong> ${buildingData.town}<br>
            <strong>Rent:</strong> ${buildingData.info}
        `);

        // Make the container visible
        infoContainer.style("display", "block");
    }

    document.getElementById("zoom-in").addEventListener("click", function () {
        svgContainer.transition().call(zoom.scaleBy, 1.2);
    });

    document.getElementById("zoom-out").addEventListener("click", function () {
        svgContainer.transition().call(zoom.scaleBy, 0.8);
    });

    window.addEventListener("resize", () => {
        const newWidth = container.clientWidth;
        const newHeight = container.clientHeight;
        d3.select("svg").attr("width", newWidth).attr("height", newHeight);
        fitToContainer();
    });
});

//----------------------------------------------------------------------------//
//----------------------------------------------------------------------------//
//----------------------------------------------------------------------------//




//document.addEventListener("DOMContentLoaded", function () {
//    const container = document.getElementById("sketch-container");
//    const width = container.clientWidth;
//    const height = container.clientHeight;

//    const svg = d3.select("#sketch-container")
//        .append("svg")
//        .attr("width", width)
//        .attr("height", height)
//        .call(d3.zoom().scaleExtent([0.2, 8]).on("zoom", zoomed))
//        .append("g");

//    let zoom = d3.zoom().scaleExtent([0.2, 8]).on("zoom", zoomed);
//    let svgContainer = d3.select("svg").call(zoom);

//    d3.xml("data/map.svg").then(data => {
//        const importedNode = document.importNode(data.documentElement, true);
//        svg.node().appendChild(importedNode);
//        fitToContainer();
//        enableBuildingClick(); 
//    }).catch(error => console.error("Error loading SVG:", error));

//    function zoomed(event) {
//        svg.attr("transform", event.transform);
//    }

//    function fitToContainer() {
//        const bbox = svg.node().getBBox();
//        const scale = Math.min(width / bbox.width, height / bbox.height) * 0.9;
//        const translateX = (width - bbox.width * scale) / 2;
//        const translateY = (height - bbox.height * scale) / 2;

//        svgContainer.transition().duration(500)
//            .call(zoom.transform, d3.zoomIdentity.translate(translateX, translateY).scale(scale));

//        zoom.scaleExtent([scale * 0.5, 8]);
//    }

//    function enableBuildingClick() {
//        // Dynamically load different JSON files for housing data
//        const housingFiles = [
//            "../cleaned_data/bures_student_housing.json",
//            "../cleaned_data/gif_student_housing.json",
//            "../cleaned_data/orsay_student_housing.json",
//            "../cleaned_data/massy_student_housing.json",
//            "../cleaned_data/palaiseau_student_housing.json"
//        ];

//        housingFiles.forEach(file => {
//            d3.json(file)
//                .then(housingData => {
//                    console.log(`Housing Data Loaded from: ${file}`, housingData);

//                    // Select paths that represent student housing (blue fill)
//                    svg.selectAll("path")
//                        .filter(function () {
//                            let fillColor = d3.select(this).style("fill") || this.getAttribute("fill");
//                            return fillColor === "rgb(0, 0, 255)" || fillColor.toLowerCase() === "#0000ff"; // Convert to lowercase for consistency
//                        })
//                        .style("cursor", "pointer")
//                        .each(function (d, i) {
//                            // Assign data to paths (assuming order is consistent)
//                            if (housingData.features[i]) {
//                                d3.select(this).datum(housingData.features[i].properties);
//                            }
//                        })
//                        .on("click", function (event, d) {
//                            if (d) {
//                                showInfo(event, d);
//                            } else {
//                                console.warn("No data found for this building.");
//                            }
//                        });
//                })
//                .catch(error => console.error(`Error loading housing data from ${file}:`, error));
//        });
//    }


    
//    function showInfo(event, buildingData) {
//        // Select the info container
//        const infoContainer = d3.select("#info-container");
    
//        // Check if buildingData is available and has the required properties
//        if (buildingData && buildingData.town && buildingData.info) {
//            // Get the address or set it to "Unknown" if missing
//            const address = buildingData.address || "Unknown";
    
//            // Update the text with building details
//            d3.select("#info-text").html(
//                `<strong>Location:</strong> ${buildingData.town}<br>
//                <strong>Rent:</strong> ${buildingData.info}<br>
//                <strong>Address:</strong> ${address}`
//            );
//        } else {
//            // If no data is available, display a fallback message
//            d3.select("#info-text").html(
//                "Unfortunately, right now we don't have information about these housing options. We will add these details as soon as possible."
//            );
//        }
    
//        // Make the container visible
//        infoContainer.style("display", "block");
//    }
    

//    document.getElementById("zoom-in").addEventListener("click", function () {
//        svgContainer.transition().call(zoom.scaleBy, 1.2);
//    });

//    document.getElementById("zoom-out").addEventListener("click", function () {
//        svgContainer.transition().call(zoom.scaleBy, 0.8);
//    });

//    window.addEventListener("resize", () => {
//        const newWidth = container.clientWidth;
//        const newHeight = container.clientHeight;
//        d3.select("svg").attr("width", newWidth).attr("height", newHeight);
//        fitToContainer();
//    });
//});


//document.addEventListener("DOMContentLoaded", function () {
//    // Set up the SVG container
//    const container = document.getElementById("sketch-container");
//    const width = container.clientWidth;
//    const height = container.clientHeight;

//    const svg = d3.select("#sketch-container")
//        .append("svg")
//        .attr("width", width)
//        .attr("height", height)
//        .call(d3.zoom().scaleExtent([0.2, 8]).on("zoom", zoomed))
//        .append("g");

//    let zoom = d3.zoom().scaleExtent([0.2, 8]).on("zoom", zoomed);
//    let svgContainer = d3.select("svg").call(zoom);

//    // Define projection to convert latitude/longitude to SVG coordinates
//    const projection = d3.geoMercator()
//        .center([2.25, 48.71])  // Center of your map in latitude/longitude
//        .scale(100000)  // Adjust scale to fit your map
//        .translate([width / 2, height / 2]);

//    // Load the SVG map
//    d3.xml("data/map.svg").then(data => {
//        console.log("✅ SVG map loaded");
//        const importedNode = document.importNode(data.documentElement, true);
//        svg.node().appendChild(importedNode);
//        fitToContainer();
//        enableBuildingClick();
//    }).catch(error => console.error("❌ Error loading SVG:", error));

//    // Zoom function
//    function zoomed(event) {
//        svg.attr("transform", event.transform);
//    }

//    // Fit the SVG map to the container
//    function fitToContainer() {
//        const bbox = svg.node().getBBox();
//        const scale = Math.min(width / bbox.width, height / bbox.height) * 0.9;
//        const translateX = (width - bbox.width * scale) / 2;
//        const translateY = (height - bbox.height * scale) / 2;

//        svgContainer.transition().duration(500)
//            .call(zoom.transform, d3.zoomIdentity.translate(translateX, translateY).scale(scale));

//        zoom.scaleExtent([scale * 0.5, 8]);
//    }

//    // Global variable to store housing data
//    let allHousingData = [];

//    // Enable click interaction for blue buildings
//    function enableBuildingClick() {
//        console.log("📌 enableBuildingClick started");
//        const housingFile = "../cleaned_data/student_housing.json";

//        // Load the JSON file
//        d3.json(housingFile)
//            .then(data => {
//                allHousingData = data.features; // Store globally
//                console.log("✅ Student housing data loaded:", allHousingData);

//                // Select all paths in the SVG with blue fill (representing student housing)
//                svg.selectAll("path")
//                    .filter(function () {
//                        let fillColor = d3.select(this).style("fill") || this.getAttribute("fill");
//                        return fillColor === "rgb(0, 0, 255)" || fillColor.toLowerCase() === "#0000ff";
//                    })
//                    .style("cursor", "pointer")
//                    .on("click", function (event) {
//                        const [mouseX, mouseY] = d3.pointer(event, svg.node());
//                        const clickedCoords = projection.invert([mouseX, mouseY]); // Convert click to lat/lon
//                        console.log("📍 Clicked on path:", clickedCoords);

//                        // Find matching building using geometry centroid coordinates
//                        let matchedBuilding = allHousingData.find(building => {
//                            if (building.geometry && building.geometry.centroid) {
//                                let centroid = [building.geometry.centroid.x, building.geometry.centroid.y]; // Use centroid directly
//                                let centroidLatLon = projection.invert(centroid);

//                                console.log(`🏠 Checking building at ${centroidLatLon}, Clicked at ${clickedCoords}`);

//                                return (
//                                    Math.abs(clickedCoords[0] - centroidLatLon[0]) < 0.0005 &&
//                                    Math.abs(clickedCoords[1] - centroidLatLon[1]) < 0.0005
//                                ); // Adjust this threshold if needed
//                            }
//                            return false;
//                        });

//                        if (matchedBuilding) {
//                            console.log("✅ Match found!", matchedBuilding.properties);
//                            showInfo(event, matchedBuilding.properties);
//                        } else {
//                            console.warn("⚠️ No match found for this building.");
//                            d3.select("#info-text").html("No information available.");
//                        }
//                    });
//            })
//            .catch(error => console.error("❌ Error loading student housing data:", error));
//    }

//    // Display building information
//    function showInfo(event, buildingData) {
//        console.log("✅ showInfo called with building data:", buildingData);
//        const infoContainer = d3.select("#info-container");

//        // If building has missing address, set to "Unknown"
//        const address = buildingData.address ? buildingData.address : "Unknown";

//        console.log(`ℹ️ Showing info for ${buildingData.town}:`, buildingData);

//        d3.select("#info-text").html(
//            `<strong>Location:</strong> ${buildingData.town}<br>
//             <strong>Rent:</strong> ${buildingData.info}<br>
//             <strong>Address:</strong> ${address}`
//        );

//        infoContainer.style("display", "block");
//    }

//    // Zoom in and out buttons
//    document.getElementById("zoom-in").addEventListener("click", function () {
//        svgContainer.transition().call(zoom.scaleBy, 1.2);
//    });

//    document.getElementById("zoom-out").addEventListener("click", function () {
//        svgContainer.transition().call(zoom.scaleBy, 0.8);
//    });

//    // Handle window resize
//    window.addEventListener("resize", () => {
//        const newWidth = container.clientWidth;
//        const newHeight = container.clientHeight;
//        d3.select("svg").attr("width", newWidth).attr("height", newHeight);
//        fitToContainer();
//    });
//});

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

    // Define projection to convert geographic coordinates to SVG space
    const projection = d3.geoMercator()
        .center([2.25, 48.71])  // Adjust center to match your map
        .scale(100000)  // Adjust scale for your map
        .translate([width / 2, height / 2]);

    d3.xml("data/map.svg").then(data => {
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

    let allHousingData = []; // Declare globally for accessibility

    function enableBuildingClick() {
        const housingFile = "../cleaned_data/student_housing.json";
    
        // Load the JSON file
        d3.json(housingFile)
            .then(data => {
                allHousingData = data.features; // Store globally
                console.log("✅ Student housing data loaded:", allHousingData);
    
                // Select all paths in the SVG with blue fill (representing student housing)
                svg.selectAll("path")
                    .filter(function () {
                        let fillColor = d3.select(this).style("fill") || this.getAttribute("fill");
                        return fillColor === "rgb(0, 0, 255)" || fillColor.toLowerCase() === "#0000ff";
                    })
                    .style("cursor", "pointer")
                    .on("click", function (event) {
                        const clickedPath = d3.select(this);
                        const pathBBox = this.getBBox(); // Get bounding box of path
    
                        console.log("📌 Clicked on path, BBox:", pathBBox);
    
                        // Find the closest housing data point using BBox
                        const closestBuilding = findClosestBuilding(pathBBox);
    
                        if (closestBuilding) {
                            console.log("🏠 Matched housing:", closestBuilding.properties);
                            showInfo(event, closestBuilding.properties);
                        } else {
                            console.warn("⚠️ No matching housing found for clicked path.");
                            d3.select("#info-text").html(
                                "Unfortunately, right now we don't have information about these housing options. We will add these details as soon as possible."
                            );
                        }
                    });
            })
            .catch(error => console.error("❌ Error loading student housing data:", error));
    }
    
    
    function findClosestBuilding(pathBBox) {
        let closest = null;
        let minDistance = Infinity;
    
        allHousingData.forEach(building => {
            if (building.geometry.type === "Polygon") {
                // Calculate centroid of the polygon
                let coordinates = building.geometry.coordinates[0]; // Outer ring of the polygon
                let centroid = getPolygonCentroid(coordinates);
    
                // Convert to SVG space (adjust as needed)
                let [x, y] = convertGeoToSvg(centroid);
    
                // Calculate distance from path's center
                let pathCenterX = pathBBox.x + pathBBox.width / 2;
                let pathCenterY = pathBBox.y + pathBBox.height / 2;
                let distance = Math.sqrt(Math.pow(x - pathCenterX, 2) + Math.pow(y - pathCenterY, 2));
    
                if (distance < minDistance) {
                    minDistance = distance;
                    closest = building;
                }
            }
        });
    
        return closest;
    }

    function getPolygonCentroid(coordinates) {
        let xSum = 0, ySum = 0, count = coordinates.length;
        
        coordinates.forEach(coord => {
            xSum += coord[0]; // Longitude
            ySum += coord[1]; // Latitude
        });
    
        return [xSum / count, ySum / count]; // Return centroid
    }

    function convertGeoToSvg(geoCoords) {
        let projection = d3.geoMercator().scale(50000).center([2.2, 48.7]); // Adjust scaling
        return projection(geoCoords);
    }
    
    
    
    function showInfo(event, buildingData) {
        const infoContainer = d3.select("#info-container");
    
        // If building has missing address, set to "Unknown"
        const address = buildingData.address ? buildingData.address : "Unknown";
    
        console.log(`ℹ️ Showing info for ${buildingData.town}:`, buildingData);
    
        d3.select("#info-text").html(
            `<strong>Location:</strong> ${buildingData.town}<br>
             <strong>Rent:</strong> ${buildingData.info}<br>
             <strong>Address:</strong> ${address}`
        );
    
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
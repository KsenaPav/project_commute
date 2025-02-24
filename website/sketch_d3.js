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
    d3.json("../cleaned_data/bures_student_housing.json")
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
                    if (d) {
                        showInfo(event, d);
                    } else {
                        console.warn("No data found for this building.");
                    }
                });

        })
        .catch(error => console.error("Error loading housing data:", error));
}
    

	

function showInfo(event, buildingData) {
    const infoContainer = d3.select("#info-container");
    
    // Clear previous info
    infoContainer.html("");

    // Append new information
    infoContainer.append("div")
        .attr("class", "info-box")
        .style("padding", "10px")
        .style("border", "1px solid black")
        .style("background", "white")
        .style("margin-top", "10px")
        .html(`
            <h3>Student Housing Information</h3>
            <p><strong>Name:</strong> ${buildingData.name || "Unknown"}</p>
            <p><strong>Address:</strong> ${buildingData.address || "N/A"}</p>
            <p><strong>Details:</strong> ${buildingData.info || "No additional details available."}</p>
        `);
}

    function displayPopup(x, y, info) {
        let popup = d3.select("#popup");
        if (popup.empty()) {
            popup = d3.select("body").append("div")
                .attr("id", "popup")
                .style("position", "absolute")
                .style("background", "white")
                .style("border", "1px solid black")
                .style("padding", "10px")
                .style("display", "none");
        }

        popup.style("left", `${x + 10}px`)
            .style("top", `${y + 10}px`)
            .html(`<strong>Student Housing Info:</strong><br>${info}`)
            .style("display", "block");

        setTimeout(() => popup.style("display", "none"), 5000); // Auto-hide after 5 seconds
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

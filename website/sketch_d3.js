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
        enableBuildingClick(); // Enable click detection after loading the SVG
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
		// Load the student housing JSON file
		d3.json("../cleaned_data/bures_student_housing.json").then(housingData => {
            svg.selectAll("*") // Select all elements in the SVG
                .filter(function () {
                    const element = d3.select(this);

                    // Try to get fill color
                    let fillColor = element.attr("fill") || element.style("fill"); // Try both attr & style
                    if (!fillColor) {
                        // If fill is still null, get computed style
                        fillColor = window.getComputedStyle(this).getPropertyValue("fill");
                    }

                    console.log("Detected Fill Color:", fillColor);

                    return fillColor === "blue" || fillColor === "#0000ff"; // Match blue buildings
                })
                .style("cursor", "pointer")
                .on("click", function (event, d) {
                    const clickedPolygon = d3.select(this);
                    showInfo(event, clickedPolygon, housingData);
                });
        })
        .catch(error => console.error("Error loading housing data:", error));
	}
	

    function showInfo(event, clickedPolygon, housingData) {
        const polygonCoords = clickedPolygon.attr("d"); // Get polygon path data
        if (!polygonCoords) return;

        // Match the clicked polygon to the JSON geometry
        const matchingEntry = housingData.find(entry =>
            entry.geometry && polygonCoords.includes(entry.geometry) // Simple match check
        );

        if (matchingEntry) {
            displayPopup(event.pageX, event.pageY, matchingEntry.info);
        }
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

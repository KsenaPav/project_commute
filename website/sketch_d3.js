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

    console.log("Loading SVG map...");
    d3.xml("data/map.svg").then(data => {
        console.log("SVG map loaded successfully.");
        const importedNode = document.importNode(data.documentElement, true);
        svg.node().appendChild(importedNode);
        fitToContainer();
        enableBuildingClick(); 
    }).catch(error => console.error("Error loading SVG:", error));

    function zoomed(event) {
        console.log("Zoom event triggered with scale: " + event.transform.k);
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

        console.log(`Fit to container: scale ${scale}, translateX ${translateX}, translateY ${translateY}`);
    }

    function enableBuildingClick() {
        console.log("Loading housing data...");
        d3.json("../cleaned_data/student_housing.json")
            .then(housingData => {
                console.log("Housing Data Loaded:", housingData);

                svg.selectAll("path")
                    .filter(function () {
                        let fillColor = d3.select(this).style("fill") || this.getAttribute("fill");
                        return fillColor === "rgb(0, 0, 255)" || fillColor.toLowerCase() === "#0000ff"; 
                    })
                    .style("cursor", "pointer")
                    .each(function (d, i) {
                        if (housingData.features[i]) {
                            console.log(`Binding data to building ${i}:`, housingData.features[i].properties);
                            d3.select(this).datum(housingData.features[i].properties);
                        } else {
                            console.log(`No housing data found for building ${i}`);
                        }
                    })
                    .on("click", function (event, d) {
                        console.log("Path clicked.");
                        const buildingData = d3.select(this).datum();
                        if (buildingData) {
                            console.log("Building data for clicked element:", buildingData);
                            showInfo(event, buildingData);
                        } else {
                            console.warn("No data found for this building.");
                            showInfo(event, null);
                        }
                    });

            })
            .catch(error => console.error("Error loading housing data:", error));
    }

    function showInfo(event, buildingData) {
        console.log("Displaying information for building:", buildingData);

        const infoContainer = d3.select("#info-container");

        if (buildingData) {
            d3.select("#info-text").html(`
                <strong>Location:</strong> ${buildingData.town}<br>
                <strong>Rent:</strong> ${buildingData.info}
            `);
        } else {
            d3.select("#info-text").html(
                "Unfortunately, right now we don't have information about these housing options. We will add these details as soon as possible."
            );
        }

        infoContainer.style("display", "block");

        console.log("Info displayed:", buildingData ? buildingData.town : "No data available");
    }

    document.getElementById("zoom-in").addEventListener("click", function () {
        console.log("Zooming in...");
        svgContainer.transition().call(zoom.scaleBy, 1.2);
    });

    document.getElementById("zoom-out").addEventListener("click", function () {
        console.log("Zooming out...");
        svgContainer.transition().call(zoom.scaleBy, 0.8);
    });

    window.addEventListener("resize", () => {
        console.log("Window resized.");
        const newWidth = container.clientWidth;
        const newHeight = container.clientHeight;
        d3.select("svg").attr("width", newWidth).attr("height", newHeight);
        fitToContainer();
    });
});
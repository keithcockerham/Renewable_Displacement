async function loadJsonData(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to load ${url}: ${response.statusText}`);
    }
    return await response.json();
}

// Generic Granger chart creator
async function createGrangerChart(containerId, dataUrl, title, subtitle, yRange) {
    try {
        const raw = await loadJsonData(dataUrl);

        const MIN_P = 1e-18;   // or 1e-16 if you prefer
        const x = raw.map(d => d["Lag"]);
        const y = raw.map(d => {
            let p = d["F-test P-value"];
            if (!p || p <= 0) p = MIN_P;  // guard against 0 / null
            return p;
        });

        const data = [
            {
                x: x,
                y: y,
                type: "scatter",
                mode: "lines+markers",
                name: "F-test p-value",
                line: { width: 2 },
                marker: { size: 6 }
            },
            {
                x: [Math.min(...x), Math.max(...x)],
                y: [0.05, 0.05],
                type: "scatter",
                mode: "lines",
                name: "0.05 threshold",
                line: {
                    width: 1,
                    dash: "dash",
                    color: "red"
                }
            }
        ];

        const layout = {
            title: { text: title, font: { size: 18 } },
            xaxis: {
                title: "Lag (months)",
                dtick: 1,
                zeroline: false
            },
            yaxis: {
                title: "F-test p-value (log scale)",
                type: "log",
                // yRange is [bottomExponent, topExponent], e.g. [-18, 0]
                range: yRange || undefined,
            },
            shapes: [
                {
                    type: "rect",
                    xref: "paper",
                    yref: "y",
                    x0: 0,
                    x1: 1,
                    y0: 0,
                    y1: 0.05,
                    fillcolor: "rgba(0,150,0,0.05)",
                    line: { width: 0 }
                }
            ],
            margin: { l: 60, r: 20, t: 60, b: 50 },
            legend: { orientation: "h", y: -0.2 },
            annotations: subtitle
                ? [{
                    text: subtitle,
                    xref: "paper",
                    yref: "paper",
                    x: 0,
                    y: 1.1,
                    showarrow: false,
                    font: { size: 12, color: "#4A5568" },
                    align: "left"
                }]
                : [],
            paper_bgcolor: "white",
            plot_bgcolor: "white"
        };

        const config = {
            responsive: true,
            displayModeBar: false
        };

        Plotly.newPlot(containerId, data, layout, config);

    } catch (err) {
        console.error(`Error creating chart for ${containerId}:`, err);
    }
}


// === Attach charts to DOM ===
document.addEventListener("DOMContentLoaded", function () {

    // Renewables → Gas
    if (document.getElementById("grangerGasChart")) {
        createGrangerChart(
            "grangerGasChart",
            "data/ftest_gas.json",
            "Granger Test: Do Renewables Predict Natural Gas?",
            "Lower p-values indicate displacement-style predictive power",
            [-18, 0]   // 1e-18 to 1
        );
    }

    // Renewables → Coal: much smaller dynamic range
    if (document.getElementById("grangerCoalChart")) {
        createGrangerChart(
            "grangerCoalChart",
            "data/ftest_coal.json",
            "Granger Test: Do Renewables Predict Coal?",
            "Coal shows weak or no displacement signal",
            [-4, 0]    // 1e-4 to 1 (tweak to taste)
        );
    }

});
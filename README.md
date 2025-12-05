# **Renewables Displacement Analysis**
### *Does Growth in Solar + Wind Generation Displace Fossil Fuels in the U.S. Power Sector?*  
**Data Source:** U.S. Energy Information Administration (EIA) Monthly Electricity Generation Series  
**License:** Public Domain (U.S. Gov)

---

## **Overview**

This project analyzes 25 years of U.S. electricity generation data to investigate whether increases in renewable energy (solar and wind) *displace* fossil fuel generation—specifically natural gas, petroleum liquids, and coal.

Using time-series methods including:

- Preprocessing of 1.3GB EIA data into structured time series  
- National-level monthly aggregation  
- Growth-rate differencing  
- Granger causality testing  
- Rolling correlations  
- Visualization of long-run generation trends  

…the project evaluates whether renewable growth **predicts** changes in fossil fuel generation in a statistically meaningful way.

---

## **Data Directory**

### **Extracted National-Level Series**
After processing and filtering for relevant fuels, the dataset contains monthly MWh generation for:

| Code | Description |
|------|-------------|
| **SUN** | Utility-scale solar generation |
| **WND** | Wind generation |
| **NG** | Natural gas generation |
| **PEL** | Petroleum liquids generation |
| **COW** | Coal generation |

A combined **renewables** variable is constructed:

```
renew = SUN + WND
```

A differenced (growth-rate) dataset is created:

```
dts = ts.diff().dropna()
```

### **Granger Causality Results**
Stored in `/data/`:

- `ftest_gas.json`
- `ftest_coal.json`

---

## **Methods Summary**

### **1. Raw Parsing & Cleaning**
- Loaded 1.3GB semi-structured `.txt`
- Extracted metadata + period/value arrays
- Removed empty columns
- Dropped incomplete series

### **2. Filtering for Electricity Generation**
Kept rows where:

```
geoset_id starts with "ELEC.GEN"
iso3166 == "USA-99"
```

### **3. National Pivot Table**
Constructed:

```
period | SUN | WND | NG | PEL | COW
```

Converted period (YYYYMM) → datetime index.

### **4. Growth Rates**
```
dts = ts.diff().dropna()
```

### **5. Statistical Tests**
- Rolling correlations  
- Granger causality (lags 1–12)  
- (Exploratory only) VAR impulse responses  

### **6. Interactive Visualizations**
Rendered via Plotly in `/docs/results.html`.

---

## **Key Findings**

### ✅ Coal is NOT Granger-caused by renewables  
Consistent with long-run structural decline; p-values mostly > 0.05.

### ⚠️ Natural Gas IS Granger-caused by renewables  
Many lags produce p-values near zero:

> Renewable growth helps *predict* natural gas generation changes.

Predictive ≠ strictly causal.

### ⚠️ Petroleum liquids show no meaningful displacement signal.

### ❗ No statistical model demonstrates full causal displacement  
Most evidence supports:

> Renewables exhibit partial displacement-like predictive effects on natural gas, but do not strictly replace fossil fuels in a causal sense.

---

## **Reproducing the Analysis**

Install:

```
python>=3.10
pandas>=2.0
statsmodels>=0.14
matplotlib>=3.8
plotly>=5.0
numpy>=1.26
```

Run preprocessing notebooks:

```
/notebooks/renewable_displacement.ipynb

```

---

## **License**

U.S. Government data (public domain).  
Original analysis & code © 2025 Keith.  


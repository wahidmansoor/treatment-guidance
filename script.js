const molecularMarkerMap = {
  "Breast Cancer": ["ER+/PR+", "HER2+", "Triple Negative"],
  "Colorectal Cancer": ["MSI-High", "KRAS Mutant", "BRAF Mutant"],
  "Lung Cancer": ["EGFR", "ALK", "PD-L1"]
};

function updateMarkers() {
  const type = document.getElementById('cancerType').value;
  const markerContainer = document.getElementById('markersContainer');
  markerContainer.innerHTML = '';

  if (type && molecularMarkerMap[type]) {
    molecularMarkerMap[type].forEach(marker => {
      const div = document.createElement('div');
      div.innerHTML = `<input type="checkbox" value="${marker}" id="${marker}" /> 
                       <label for="${marker}">${marker}</label>`;
      markerContainer.appendChild(div);
    });
    document.getElementById('markerSection').style.display = 'block';
  } else {
    document.getElementById('markerSection').style.display = 'none';
  }
}

document.getElementById('cancerType').addEventListener('change', updateMarkers);

function saveData() {
  const data = gatherInput();
  localStorage.setItem('treatment-guidance', JSON.stringify(data));
  alert('Data saved!');
}

function loadData() {
  const data = JSON.parse(localStorage.getItem('treatment-guidance'));
  if (!data) return;

  document.getElementById('cancerType').value = data.cancerType;
  updateMarkers();
  data.molecularMarkers.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.checked = true;
  });

  document.getElementById('stage').value = data.stage;
  document.getElementById('intent').value = data.intent;
  document.getElementById('ihc').value = data.ihc;
  document.getElementById('tumor').value = data.tumor;
  alert('Data loaded!');
}

function clearData() {
  localStorage.removeItem('treatment-guidance');
  location.reload();
}

function gatherInput() {
  const selectedMarkers = Array.from(document.querySelectorAll('#markersContainer input:checked')).map(el => el.value);
  return {
    cancerType: document.getElementById('cancerType').value,
    molecularMarkers: selectedMarkers,
    stage: document.getElementById('stage').value,
    intent: document.getElementById('intent').value,
    ihc: document.getElementById('ihc').value,
    tumor: document.getElementById('tumor').value
  };
}

function generateRecommendations() {
  const data = gatherInput();
  let recommendation = '';

  if (data.cancerType === 'Breast Cancer') {
    if (data.molecularMarkers.includes('HER2+')) {
      recommendation = `TCH regimen (Docetaxel, Carboplatin, Trastuzumab) is recommended.`;
    } else {
      recommendation = `Consider AC-T regimen for HER2-negative breast cancer.`;
    }
  } else if (data.cancerType === 'Lung Cancer') {
    if (data.molecularMarkers.includes('EGFR')) {
      recommendation = `EGFR-targeted therapy like Osimertinib is suitable.`;
    } else {
      recommendation = `Platinum-doublet chemotherapy may be considered.`;
    }
  } else {
    recommendation = `Please consult guidelines for ${data.cancerType}.`;
  }

  document.getElementById('output').innerText = `Recommended Treatment: ${recommendation}`;
}

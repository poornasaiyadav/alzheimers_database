// Global variable to store CSV data
let csvData = [];

// On DOM load, attach event listeners
document.addEventListener('DOMContentLoaded', () => {
  loadCSV();

  // Search tool event listener
  document.getElementById('searchButton').addEventListener('click', searchGene);

  // Tools Menu Buttons event listeners
  document.getElementById('blastMenuBtn').addEventListener('click', () => {
    showToolInCenter('blast');
  });
  document.getElementById('keggMenuBtn').addEventListener('click', () => {
    showToolInCenter('kegg');
  });
  document.getElementById('primerMenuBtn').addEventListener('click', () => {
    showToolInCenter('primer');
  });
  document.getElementById('translateMenuBtn').addEventListener('click', () => {
    showToolInCenter('translate');
  });
  document.getElementById('complementMenuBtn').addEventListener('click', () => {
    showToolInCenter('complement');
  });
  document.getElementById('uniprotMenuBtn').addEventListener('click', () => {
    showToolInCenter('uniprot');
  });
  document.getElementById('chemblMenuBtn').addEventListener('click', () => {
    showToolInCenter('chembl');
  });
});

/**
 * Load CSV file from 'alzheimers_data.csv'
 */
function loadCSV() {
  fetch('alzheimers_data.csv')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.text();
    })
    .then(data => {
      csvData = parseCSV(data);
      console.log('CSV Data loaded:', csvData);
    })
    .catch(error => {
      console.error('Error loading CSV:', error);
    });
}

/**
 * Parse CSV data into an array of objects
 */
function parseCSV(data) {
  const lines = data.split('\n').filter(line => line.trim() !== '');
  const headers = lines[0].split(',').map(header => header.trim());
  return lines.slice(1).map(line => {
    const values = line.split(',').map(value => value.trim());
    let rowObject = {};
    headers.forEach((header, index) => {
      rowObject[header] = values[index];
    });
    return rowObject;
  });
}

/**
 * Search tool: Filter CSV data based on the search term and open results
 * in a new window with the output in a formatted HTML table.
 */
function searchGene() {
  const searchTerm = document.getElementById('geneSearch').value.trim().toLowerCase();
  if (!searchTerm) {
    alert('Please enter a search term.');
    return;
  }

  // Filter the CSV data based on the search term
  const results = csvData.filter(row => {
    const gene = row.gene ? row.gene.toLowerCase() : "";
    const variantId = row.variant_id ? row.variant_id.toLowerCase() : "";
    const rsId = row.rs_id ? row.rs_id.toLowerCase() : "";
    const chr = row.chr ? row.chr.toLowerCase() : "";
    return (
      gene.includes(searchTerm) ||
      variantId.includes(searchTerm) ||
      rsId.includes(searchTerm) ||
      chr.includes(searchTerm)
    );
  });

  // Build the HTML for search results in a table format
  let htmlContent = `<h2>Search Results for "${searchTerm}"</h2>`;
  if (results.length === 0) {
    htmlContent += `<p>No results found.</p>`;
  } else {
    htmlContent += `<table>
                      <thead>
                        <tr>`;
    // Get headers from the first result object
    const headers = Object.keys(results[0]);
    headers.forEach(header => {
      htmlContent += `<th>${header}</th>`;
    });
    htmlContent += `   </tr>
                      </thead>
                      <tbody>`;
    // Add table rows for each result
    results.forEach(row => {
      htmlContent += `<tr>`;
      headers.forEach(header => {
        htmlContent += `<td>${row[header]}</td>`;
      });
      htmlContent += `</tr>`;
    });
    htmlContent += `</tbody></table>`;
  }

  // Open a new window and write the HTML content with a table structure
  const newWindow = window.open("", "_blank");
  newWindow.document.write(`
    <html>
      <head>
        <title>Search Results</title>
        <link rel="stylesheet" href="styles.css" />
        <style>
          body {
            padding: 20px;
            background-color: var(--light-bg);
            font-family: var(--primary-font);
          }
          h2 {
            text-align: center;
            margin-bottom: 20px;
          }
          table {
            margin: 20px auto;
            width: 90%;
            border-collapse: collapse;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 10px;
            text-align: left;
          }
          th {
            background-color: var(--table-header-bg);
            color: var(--table-header-color);
          }
          tr:nth-child(even) {
            background-color: #f2f2f2;
          }
        </style>
      </head>
      <body>
        ${htmlContent}
      </body>
    </html>
  `);
  newWindow.document.close();
}

/**
 * Show a specific tool in the center "dynamicContent" area
 */
function showToolInCenter(toolName) {
  const dynamicContentDiv = document.getElementById('dynamicContent');

  if (toolName === 'blast') {
    dynamicContentDiv.innerHTML = `
      <h2>BLAST Tool</h2>
      <label for="blastSeq">Enter DNA/Protein Sequence (FASTA format):</label>
      <textarea id="blastSeq" rows="6" style="width:100%;" placeholder="Paste sequence..."></textarea>
      <br/><br/>
      <button onclick="runBLAST()">Run BLAST</button>
      <div id="blastResults"></div>
    `;
  } else if (toolName === 'kegg') {
    dynamicContentDiv.innerHTML = `
      <h2>KEGG Tool</h2>
      <label for="keggInputDynamic">Enter KEGG ID:</label>
      <input type="text" id="keggInputDynamic" placeholder="e.g., hsa:10458" style="width:100%;" />
      <br/><br/>
      <button onclick="openKEGGDynamic()">Open KEGG</button>
      <div id="keggResultsDynamic"></div>
    `;
  } else if (toolName === 'primer') {
    dynamicContentDiv.innerHTML = `
      <h2>Primer Designing Tool</h2>
      <label for="primerSeq">Enter Target DNA Sequence:</label>
      <textarea id="primerSeq" rows="6" style="width:100%;" placeholder="Paste sequence..."></textarea>
      <br/><br/>
      <button onclick="designPrimersDynamic()">Design Primers</button>
      <div id="primerResultsDynamic"></div>
    `;
  } else if (toolName === 'translate') {
    dynamicContentDiv.innerHTML = `
      <h2>Transcription &amp; Translation</h2>
      <label for="transSeq">Enter DNA Sequence:</label>
      <textarea id="transSeq" rows="6" style="width:100%;" placeholder="Paste sequence..."></textarea>
      <br/><br/>
      <button onclick="transcribeDNADynamic()">Transcribe to RNA</button>
      <button onclick="translateDNADynamic()">Translate to Protein</button>
      <div id="transResultsDynamic"></div>
    `;
  } else if (toolName === 'complement') {
    dynamicContentDiv.innerHTML = `
      <h2>Complement &amp; Reverse Complement</h2>
      <label for="compSeq">Enter DNA Sequence:</label>
      <textarea id="compSeq" rows="6" style="width:100%;" placeholder="Paste sequence..."></textarea>
      <br/><br/>
      <button onclick="complementDNADynamic()">Complement</button>
      <button onclick="reverseComplementDNADynamic()">Reverse Complement</button>
      <div id="compResultsDynamic"></div>
    `;
  } else if (toolName === 'uniprot') {
    dynamicContentDiv.innerHTML = `
      <h2>UniProt</h2>
      <label for="uniInputDynamic">Enter UniProt ID or keyword:</label>
      <input type="text" id="uniInputDynamic" placeholder="e.g., P01308" style="width:100%;" />
      <br/><br/>
      <button onclick="openUniProtDynamic()">Open UniProt</button>
    `;
  } else if (toolName === 'chembl') {
    dynamicContentDiv.innerHTML = `
      <h2>ChEMBL</h2>
      <label for="chemblInputDynamic">Enter ChEMBL ID or keyword:</label>
      <input type="text" id="chemblInputDynamic" placeholder="e.g., CHEMBL25" style="width:100%;" />
      <br/><br/>
      <button onclick="openChEMBLDynamic()">Open ChEMBL</button>
    `;
  }
}

/**
 * BLAST Tool - dynamic
 */
function runBLAST() {
  const seq = document.getElementById('blastSeq').value.trim();
  if (!seq) {
    alert("Please enter a sequence.");
    return;
  }
  const blastURL = `https://blast.ncbi.nlm.nih.gov/Blast.cgi?CMD=Put&QUERY=${encodeURIComponent(seq)}&DATABASE=nr&PROGRAM=blastp`;
  document.getElementById('blastResults').innerHTML = `
    <p>Running BLAST... <a href="${blastURL}" target="_blank">View Results on NCBI BLAST</a></p>
  `;
}

/**
 * KEGG Tool - dynamic
 */
function openKEGGDynamic() {
  const keggId = document.getElementById('keggInputDynamic').value.trim();
  if (!keggId) {
    alert("Please enter a KEGG ID.");
    return;
  }
  const keggURL = `https://www.genome.jp/dbget-bin/www_bget?${keggId}`;
  document.getElementById('keggResultsDynamic').innerHTML = `
    <p>Opening KEGG page... <a href="${keggURL}" target="_blank">View ${keggId} on KEGG</a></p>
  `;
}

/**
 * Primer Designing - dynamic
 */
function designPrimersDynamic() {
  const seq = document.getElementById('primerSeq').value.trim();
  if (!seq) {
    alert("Please enter a DNA sequence.");
    return;
  }
  const primerLength = 20;
  if (seq.length < primerLength * 2) {
    alert("Sequence is too short for designing primers.");
    return;
  }
  const forwardPrimer = seq.substring(0, primerLength);
  const reversePrimer = seq.substring(seq.length - primerLength);
  document.getElementById('primerResultsDynamic').innerHTML = `
    <h3>Designed Primers</h3>
    <p><strong>Forward Primer:</strong> ${forwardPrimer}</p>
    <p><strong>Reverse Primer:</strong> ${reversePrimer}</p>
  `;
}

/**
 * Transcription & Translation - dynamic
 */
function transcribeDNADynamic() {
  let seq = document.getElementById('transSeq').value.trim().toUpperCase().replace(/\s+/g, '');
  if (!seq) {
    alert("Please enter a DNA sequence.");
    return;
  }
  let rnaSeq = seq.replace(/T/g, 'U');
  document.getElementById('transResultsDynamic').innerHTML = `
    <h3>Transcribed RNA Sequence</h3>
    <p>${rnaSeq}</p>
  `;
}

function translateDNADynamic() {
  let seq = document.getElementById('transSeq').value.trim().toUpperCase().replace(/\s+/g, '');
  if (!seq) {
    alert("Please enter a DNA sequence.");
    return;
  }
  if (seq.includes('T')) {
    seq = seq.replace(/T/g, 'U');
  }
  const codonTable = {
    'UUU': 'F', 'UUC': 'F', 'UUA': 'L', 'UUG': 'L',
    'CUU': 'L', 'CUC': 'L', 'CUA': 'L', 'CUG': 'L',
    'AUU': 'I', 'AUC': 'I', 'AUA': 'I', 'AUG': 'M',
    'GUU': 'V', 'GUC': 'V', 'GUA': 'V', 'GUG': 'V',
    'UCU': 'S', 'UCC': 'S', 'UCA': 'S', 'UCG': 'S',
    'CCU': 'P', 'CCC': 'P', 'CCA': 'P', 'CCG': 'P',
    'ACU': 'T', 'ACC': 'T', 'ACA': 'T', 'ACG': 'T',
    'GCU': 'A', 'GCC': 'A', 'GCA': 'A', 'GCG': 'A',
    'UAU': 'Y', 'UAC': 'Y', 'UAA': '*', 'UAG': '*',
    'CAU': 'H', 'CAC': 'H', 'CAA': 'Q', 'CAG': 'Q',
    'AAU': 'N', 'AAC': 'N', 'AAA': 'K', 'AAG': 'K',
    'GAU': 'D', 'GAC': 'D', 'GAA': 'E', 'GAG': 'E',
    'UGU': 'C', 'UGC': 'C', 'UGA': '*', 'UGG': 'W',
    'CGU': 'R', 'CGC': 'R', 'CGA': 'R', 'CGG': 'R',
    'AGU': 'S', 'AGC': 'S', 'AGA': 'R', 'AGG': 'R',
    'GGU': 'G', 'GGC': 'G', 'GGA': 'G', 'GGG': 'G'
  };
  let protein = "";
  for (let i = 0; i < seq.length - 2; i += 3) {
    const codon = seq.substring(i, i + 3);
    protein += codonTable[codon] || 'X';
  }
  document.getElementById('transResultsDynamic').innerHTML = `
    <h3>Translated Protein Sequence</h3>
    <p>${protein}</p>
  `;
}

/**
 * Complement & Reverse Complement - dynamic
 */
function complementDNADynamic() {
  let seq = document.getElementById('compSeq').value.trim().toUpperCase().replace(/\s+/g, '');
  if (!seq) {
    alert("Please enter a DNA sequence.");
    return;
  }
  let comp = seq.split('').map(n => {
    switch(n) {
      case 'A': return 'T';
      case 'T': return 'A';
      case 'C': return 'G';
      case 'G': return 'C';
      default: return 'N';
    }
  }).join('');
  document.getElementById('compResultsDynamic').innerHTML = `
    <h3>Complement</h3>
    <p>${comp}</p>
  `;
}

function reverseComplementDNADynamic() {
  let seq = document.getElementById('compSeq').value.trim().toUpperCase().replace(/\s+/g, '');
  if (!seq) {
    alert("Please enter a DNA sequence.");
    return;
  }
  let comp = seq.split('').map(n => {
    switch(n) {
      case 'A': return 'T';
      case 'T': return 'A';
      case 'C': return 'G';
      case 'G': return 'C';
      default: return 'N';
    }
  }).join('');
  let revComp = comp.split('').reverse().join('');
  document.getElementById('compResultsDynamic').innerHTML = `
    <h3>Reverse Complement</h3>
    <p>${revComp}</p>
  `;
}

/**
 * UniProt - dynamic
 */
function openUniProtDynamic() {
  const inputVal = document.getElementById('uniInputDynamic').value.trim();
  if (!inputVal) {
    alert("Please enter a UniProt ID or keyword.");
    return;
  }
  const url = `https://www.uniprot.org/uniprot/?query=${encodeURIComponent(inputVal)}`;
  window.open(url, "_blank");
}

/**
 * ChEMBL - dynamic
 */
function openChEMBLDynamic() {
  const inputVal = document.getElementById('chemblInputDynamic').value.trim();
  if (!inputVal) {
    alert("Please enter a ChEMBL ID or keyword.");
    return;
  }
  const url = `https://www.ebi.ac.uk/chembl/compound_report_card/${encodeURIComponent(inputVal)}`;
  window.open(url, "_blank");
}

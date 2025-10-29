// ============================================================
// integrity.js - Verificación de Integridad (Checksum + SRI)
// ============================================================

// ---------- CHECKSUM ----------
async function calculateHashes() {
  const fileInput = document.getElementById("fileInput");
  const textInput = document.getElementById("textInput");
  const resultDiv = document.getElementById("checksumResult");

  let data;
  let fileName = "";

  if (fileInput.files.length > 0) {
    const file = fileInput.files[0];
    fileName = file.name;
    data = await file.arrayBuffer();
  } else if (textInput.value.trim()) {
    data = new TextEncoder().encode(textInput.value);
    fileName = "Texto ingresado manualmente";
  } else {
    resultDiv.innerHTML = `
      <div class="result danger">
        <h3>⚠️ Error:</h3><p>Selecciona un archivo o escribe texto.</p>
      </div>`;
    return;
  }

  resultDiv.innerHTML = `
    <div class="result warning"><h3>⏳ Calculando hashes...</h3></div>`;

  try {
    const hashes = {};
    for (const alg of ["SHA-256", "SHA-384", "SHA-512"]) {
      const buffer = await crypto.subtle.digest(alg, data);
      hashes[alg] = Array.from(new Uint8Array(buffer))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    }

    resultDiv.innerHTML = `
      <div class="result success">
        <h3>✅ Hashes calculados (${fileName})</h3>
        ${Object.entries(hashes)
          .map(
            ([alg, hash]) => `
          <p><strong>${alg}:</strong></p>
          <div class="hash-output" onclick="copyToClipboard('${hash}')">${hash}</div>`
          )
          .join("")}
        <p class="note">💡 Haz clic en un hash para copiarlo.</p>
      </div>`;
  } catch (error) {
    resultDiv.innerHTML = `
      <div class="result danger"><h3>❌ Error:</h3><p>${error.message}</p></div>`;
  }
}

function clearChecksum() {
  document.getElementById("fileInput").value = "";
  document.getElementById("textInput").value = "";
  document.getElementById("checksumResult").innerHTML = "";
}

// Copiar hash con un clic
function copyToClipboard(text) {
  navigator.clipboard.writeText(text);
  alert("✅ Hash copiado al portapapeles.");
}

// ---------- SRI ----------
async function generateSRI() {
  const url = document.getElementById("cdnUrl").value.trim();
  const resultDiv = document.getElementById("sriResult");

  if (!url) {
    resultDiv.innerHTML = `
      <div class="result danger"><h3>⚠️ URL requerida</h3></div>`;
    return;
  }

  resultDiv.innerHTML = `
    <div class="result warning"><h3>⏳ Descargando recurso...</h3></div>`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("No se pudo descargar el recurso.");
    const content = await res.arrayBuffer();

    const hash = await crypto.subtle.digest("SHA-384", content);
    const base64 = btoa(String.fromCharCode(...new Uint8Array(hash)));
    const tag = url.endsWith(".css") ? "link" : "script";
    const attr = tag === "link" ? "href" : "src";

    resultDiv.innerHTML = `
      <div class="result success">
        <h3>✅ SRI generado</h3>
        <div class="code-box" onclick="copyToClipboard('sha384-${base64}')">
          &lt;${tag} ${attr}="${url}" 
          integrity="sha384-${base64}" 
          crossorigin="anonymous"&gt;
          ${tag === "script" ? "&lt;/script&gt;" : ""}
        </div>
        <p class="note">💡 Haz clic para copiar el atributo integrity.</p>
      </div>`;
  } catch (err) {
    resultDiv.innerHTML = `
      <div class="result danger"><h3>❌ Error:</h3><p>${err.message}</p></div>`;
  }
}

function testSRI() {
  const resultDiv = document.getElementById("sriResult");
  resultDiv.innerHTML = `
    <div class="result warning"><h3>🧪 Probando SRI...</h3></div>`;

  const script = document.createElement("script");
  script.src = "https://code.jquery.com/jquery-3.6.0.slim.min.js";
  script.integrity = "sha384-HASHINCORRECTO";
  script.crossOrigin = "anonymous";

  script.onload = () => {
    resultDiv.innerHTML = `
      <div class="result danger">
        <h3>❌ Error: SRI falló, el script se cargó (hash inválido).</h3>
      </div>`;
  };
  script.onerror = () => {
    resultDiv.innerHTML = `
      <div class="result success">
        <h3>✅ SRI activo: el script fue bloqueado por integridad inválida.</h3>
      </div>`;
  };

  document.head.appendChild(script);
}

// ---------- COMPARACIÓN DE HASHES ----------
function verifyIntegrity() {
  const calc = document.getElementById("calculatedHash").value.trim().toLowerCase();
  const exp = document.getElementById("expectedHash").value.trim().toLowerCase();
  const resultDiv = document.getElementById("integrityResult");

  resultDiv.innerHTML = ""; // limpiar resultados anteriores

  if (!calc || !exp) {
    resultDiv.innerHTML = `
      <div class="result danger">
        <h3>⚠️ Ingrese ambos hashes.</h3>
      </div>`;
    return;
  }

  const match = calc === exp;
  const resultHTML = document.createElement("div");
  resultHTML.classList.add("result", match ? "success" : "danger");

  if (match) {
    resultHTML.innerHTML = `
      <h3>✅ Integridad confirmada</h3>
      <p>Los hashes coinciden. El archivo es íntegro.</p>`;
  } else {
    resultHTML.innerHTML = `
      <h3>❌ Integridad comprometida</h3>
      <p>Los hashes no coinciden. El archivo fue alterado.</p>`;
  }

  resultDiv.appendChild(resultHTML);
}

// ---------- LIMPIAR CAMPOS ----------
function clearIntegrity() {
  document.getElementById("calculatedHash").value = "";
  document.getElementById("expectedHash").value = "";
  document.getElementById("integrityResult").innerHTML = "";
}

const preguntas = [
    { q: "¿Qué tecnología dominó tu infancia?", ops: ["Radio/Vinilo", "TV color/Walkman", "PC/Internet Dial-up", "Smartphones/Apps"], pts: [1,2,3,4] },
    { q: "¿Cómo buscabas información escolar?", ops: ["Enciclopedias", "Bibliotecas", "Google/Wikipedia", "TikTok/ChatGPT"], pts: [1,2,3,4] },
    { q: "¿Medio favorito de comunicación?", ops: ["Carta/Fijo", "SMS/Llamada", "WhatsApp", "Video-mensajes"], pts: [1,2,3,4] },
    { q: "¿Qué opinas del trabajo remoto?", ops: ["Innecesario", "Difícil de adaptar", "Muy útil", "Indispensable"], pts: [1,2,3,4] },
    { q: "¿Cuál fue tu primer celular?", ops: ["No tuve", "Ladrillo analógico", "Blackberry/iPhone 1", "Android/iPhone moderno"], pts: [1,2,3,4] },
    { q: "¿Cómo escuchas música hoy?", ops: ["Radio/CDs", "Descargas MP3", "Spotify/YouTube", "Streaming Hi-Fi"], pts: [1,2,3,4] },
    { q: "¿Relación con las redes sociales?", ops: ["No me interesan", "Uso Facebook", "Uso Instagram", "Vivo en TikTok"], pts: [1,2,3,4] },
    { q: "¿Qué haces si te pierdes?", ops: ["Pregunto a alguien", "Uso mapa físico", "Uso Waze/Maps", "Comparto ubicación real"], pts: [1,2,3,4] },
    { q: "¿Cómo prefieres comprar ropa?", ops: ["Sastrería/Local", "Centro comercial", "Tiendas Online", "Dropshipping/Segunda mano"], pts: [1,2,3,4] },
    { q: "¿Principal fuente de noticias?", ops: ["Diarios impresos", "Noticiero TV", "Portales web", "Hilos de X / Reels"], pts: [1,2,3,4] },
    { q: "¿Postura ante la ecología?", ops: ["No es prioridad", "Reciclo a veces", "Es muy importante", "Soy activista"], pts: [1,2,3,4] },
    { q: "¿Cómo pides comida?", ops: ["Cocino siempre", "Llamo al local", "Web del restaurante", "Apps (Rappi/Uber)"], pts: [1,2,3,4] },
    { q: "¿Qué juguete te marcó?", ops: ["Canicas/Madera", "Consolas 8-bit", "Tamagotchi/Play2", "iPad/Roblox"], pts: [1,2,3,4] },
    { q: "¿Relación con el dinero?", ops: ["Efectivo", "Cheques/Tarjeta", "Transferencia", "Crypto/Nequi"], pts: [1,2,3,4] },
    { q: "¿Mayor preocupación hoy?", ops: ["Pensión", "Estabilidad laboral", "Salud mental", "Futuro del planeta"], pts: [1,2,3,4] }
];

let currentIndex = 0, currentScore = 0, chart;
let database = JSON.parse(localStorage.getItem('generacionesDB')) || [];

window.onload = updateUI;

function iniciarQuiz() {
    const n = document.getElementById('userName').value;
    const e = document.getElementById('userEmail').value;
    if(!n || !e) return alert("Por favor, completa tus datos de registro.");
    
    document.getElementById('step-1').classList.add('hidden');
    document.getElementById('step-2').classList.remove('hidden');
    renderQuestion();
}

function renderQuestion() {
    const p = preguntas[currentIndex];
    document.getElementById('pregunta-titulo').innerText = p.q;
    document.getElementById('meta-info').innerText = `Pregunta ${currentIndex + 1} de 15`;
    
    const container = document.getElementById('opciones');
    container.innerHTML = "";
    p.ops.forEach((op, i) => {
        const btn = document.createElement('button');
        btn.innerText = op;
        btn.onclick = () => handleAnswer(p.pts[i]);
        container.appendChild(btn);
    });
}

function handleAnswer(p) {
    currentScore += p;
    currentIndex++;
    if(currentIndex < preguntas.length) renderQuestion();
    else finish();
}

function finish() {
    let gen = "";
    // Escala de puntos: 15 (mínimo) a 60 (máximo)
    if(currentScore <= 22) gen = "Baby Boomer";
    else if(currentScore <= 38) gen = "Generación X";
    else if(currentScore <= 50) gen = "Millennial";
    else gen = "Gen Z";

    database.push({
        nombre: document.getElementById('userName').value,
        sexo: document.getElementById('userGender').value,
        gen: gen
    });

    localStorage.setItem('generacionesDB', JSON.stringify(database));
    updateUI();
    alert(`Clasificación completada: Eres ${gen}`);
    location.reload(); 
}

function updateUI() {
    const tbody = document.querySelector('#tabla-informe tbody');
    tbody.innerHTML = database.map(u => `
        <tr><td>${u.nombre}</td><td>${u.sexo}</td><td><strong>${u.gen}</strong></td></tr>
    `).join('');
    
    document.getElementById('contador').innerText = `Participantes registrados: ${database.length} / 10`;
    renderChart();
}

function renderChart() {
    const ctx = document.getElementById('canvasGrafico').getContext('2d');
    const counts = { "Baby Boomer": 0, "Generación X": 0, "Millennial": 0, "Gen Z": 0 };
    database.forEach(u => counts[u.gen]++);

    if(chart) chart.destroy();
    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(counts),
            datasets: [{
                label: 'Total por Generación',
                data: Object.values(counts),
                backgroundColor: ['#1e293b', '#6366f1', '#10b981', '#f59e0b']
            }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });
}

function borrarDatos() {
    if(confirm("¿Deseas eliminar todo el historial de encuestados?")) {
        localStorage.removeItem('generacionesDB');
        database = [];
        updateUI();
    }
}
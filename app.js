// app.js
document.addEventListener("DOMContentLoaded", () => {
    // La Historia y Configuración de las Islas
    const storyData = [
        {
            name: "Isla del Abandono",
            x: 15, y: 80, // Porcentajes de posición
            title: "Día 1: El Inicio",
            text: "De joven quería buscar aventuras, ser parte de algo. Era parte de un grupo, sentía que pertenecía... hasta que me dejaron. Allí, en la Isla del Abandono, me di cuenta de que mi viaje tendría que ser en solitario por estos mares inciertos.",
            btnText: "Zarpar Solo",
            icon: `<svg viewBox="0 0 100 100" style="filter: drop-shadow(1px 1px 1px rgba(0,0,0,0.3));"><path d="M20 20 Q 50 45 80 80 M80 20 Q 50 55 20 80" stroke="var(--route-red)" stroke-width="8" stroke-linecap="round" fill="none" style="filter: url(#ink-bleed);"/></svg>`
        },
        {
            name: "El Refugio Fugaz",
            x: 45, y: 55,
            title: "Día 45: Una Luz Falsa",
            text: "Estuve mucho tiempo solo, a la deriva, hasta que alguien me ayudó. Al pisar el Refugio Fugaz pensé que la vida sería más fácil a partir de entonces, que las aguas se calmarían...",
            btnText: "Levantar Anclas",
            icon: `<svg viewBox="0 0 100 100" style="filter: drop-shadow(1px 1px 1px rgba(0,0,0,0.3));"><path d="M20 20 Q 50 45 80 80 M80 20 Q 50 55 20 80" stroke="var(--route-red)" stroke-width="8" stroke-linecap="round" fill="none" style="filter: url(#ink-bleed);"/></svg>`
        },
        {
            name: "Ojo de la Tormenta",
            x: 80, y: 70,
            title: "Día 89: El Naufragio",
            text: "...Hasta que todo se acabó. Un huracán implacable destruyó el barco. Quedé varado en esta isla desierta. Me tomó mucho tiempo, esfuerzo y dolor, pero al fin logré recuperar el valor para construir una pequeña balsa y seguir.",
            btnText: "Volver al Mar",
            icon: `<svg viewBox="0 0 100 100" style="filter: drop-shadow(1px 1px 1px rgba(0,0,0,0.3));"><path d="M20 20 Q 50 45 80 80 M80 20 Q 50 55 20 80" stroke="var(--route-red)" stroke-width="8" stroke-linecap="round" fill="none" style="filter: url(#ink-bleed);"/></svg>`
        },
        {
            name: "Aguas Muertas",
            x: 75, y: 25,
            title: "Día 210: La Resignación",
            text: "Volví a estar solo por un tiempo que pareció eterno. Las aguas estaban quietas, vacías. Cuando ya no soplaba el viento, decidí rendirme. Acepté que estaría solo y que ese sería mi destino.",
            btnText: "Mirar al Horizonte",
            icon: `<svg viewBox="0 0 100 100" style="filter: drop-shadow(1px 1px 1px rgba(0,0,0,0.3));"><path d="M20 20 Q 50 45 80 80 M80 20 Q 50 55 20 80" stroke="var(--route-red)" stroke-width="8" stroke-linecap="round" fill="none" style="filter: url(#ink-bleed);"/></svg>`
        },
        {
            name: "La Isla del Tesoro",
            x: 25, y: 18,
            title: "El Fin de la Búsqueda",
            text: "Y entonces, justo cuando había aceptado la soledad... te encontré. Toda la tormenta, el abandono y la tristeza cobraron sentido. La encontré a ella, encontré mi tesoro.",
            btnText: "Descubrir Tesoro",
            icon: `<svg viewBox="0 0 100 100" style="filter: drop-shadow(1px 1px 2px rgba(0,0,0,0.5));"><path d="M20 20 Q 50 45 80 80 M80 20 Q 50 55 20 80" stroke="#8b0000" stroke-width="12" stroke-linecap="round" fill="none" style="filter: url(#ink-bleed);"/></svg>`
        }
    ];

    let currentStage = 0;
    let drawnPaths = [];

    // Elementos del DOM
    const islandsContainer = document.getElementById("islands-container");
    const ship = document.getElementById("pirate-ship");
    const svgCanvas = document.getElementById("path-svg");
    
    const diaryOverlay = document.getElementById("diary-overlay");
    const diaryTitle = document.getElementById("diary-title");
    const diaryText = document.getElementById("diary-text");
    const nextBtn = document.getElementById("next-btn");

    // Inicializar el mapa
    function initMap() {
        storyData.forEach((island, index) => {
            const el = document.createElement("div");
            el.className = `island ${index === 0 ? "active" : "locked"}`;
            el.id = `island-${index}`;
            el.style.left = `${island.x}%`;
            el.style.top = `${island.y}%`;
            
            el.innerHTML = `
                <div class="island-icon">${island.icon}</div>
                <div class="island-name">${island.name}</div>
            `;
            
            el.addEventListener("click", () => {
                if (index === currentStage && el.classList.contains("active")) {
                    openDiary(index);
                }
            });
            
            islandsContainer.appendChild(el);
        });

        // Posición inicial del barco
        updateShipPosition(currentStage);
        
        // Redibujar rutas al redimensionar la ventana (para que sea responsivo)
        window.addEventListener("resize", () => renderPaths(false));
        
        // Mostrar el primer diario después de un pequeño retraso para que se aprecie el mapa
        setTimeout(() => {
            openDiary(0);
            renderPaths(false); // Fuerza el renderizado de la luz inicial en la isla 1
        }, 1500);
    }

    function updateShipPosition(index) {
        const data = storyData[index];
        ship.style.left = `${data.x}%`;
        ship.style.top = `${data.y}%`;
    }

    // Genera partículas de luciérnagas
    function spawnFireflies() {
        const container = document.getElementById("fireflies-container");
        if (!container) return;
        
        const count = 45; // Número de luciérnagas
        for (let i = 0; i < count; i++) {
            const firefly = document.createElement("div");
            firefly.classList.add("firefly");
            
            // Valores aleatorios para posición, retraso y duración
            const left = Math.random() * 100;
            const delay = Math.random() * 4; // Empiezan a aparecer en los primeros 4 seg
            const duration = 6 + Math.random() * 6; // Entre 6 y 12 segundos flotando
            
            firefly.style.left = `${left}%`;
            firefly.style.animationDelay = `${delay}s`;
            firefly.style.animationDuration = `${duration}s`;
            
            container.appendChild(firefly);
        }
    }

    function openDiary(index) {
        const data = storyData[index];
        diaryTitle.innerText = data.title;
        diaryText.innerHTML = data.text; /* Usar innerHTML para poder renderizar SVG inline y <br> */
        nextBtn.innerText = data.btnText;

        // Mostrar las fotos asomándose si es la última etapa
        const photosContainer = document.getElementById("hidden-photos-container");
        if (index === storyData.length - 1) {
            photosContainer.innerHTML = `
                <img src="ima/IMG-20260122-WA0156.jpg" class="diary-photo photo-1">
                <img src="ima/IMG-20260215-WA0036.jpg" class="diary-photo photo-2">
                <img src="ima/IMG-20260228-WA0182.jpg" class="diary-photo photo-3">
                <img src="ima/IMG-20260418-WA0059.jpg" class="diary-photo photo-4">
            `;
            setTimeout(() => {
                photosContainer.classList.add("visible");
            }, 300);
        } else {
            photosContainer.classList.remove("visible");
            photosContainer.innerHTML = "";
        }

        diaryOverlay.classList.remove("hidden");
    }

    nextBtn.addEventListener("click", () => {
        diaryOverlay.classList.add("hidden");
        
        if (currentStage === storyData.length - 1) {
            // ¡Etapa final! Revelar las fotos de fondo
            document.body.classList.add("treasure-found");
            document.getElementById("treasure-photos").classList.add("visible");
            
            // Ocultar el barco
            setTimeout(() => {
                ship.style.opacity = "0";
            }, 1000);
            spawnFireflies();
            return;
        }

        // Marcar la isla actual como completada
        const currentIslandEl = document.getElementById(`island-${currentStage}`);
        currentIslandEl.classList.remove("active");
        
        const nextStage = currentStage + 1;
        
        // Dibujar la ruta animada
        drawAnimatedPath(currentStage, nextStage);
        
        // Mover el barco después de un pequeño retraso
        setTimeout(() => {
            updateShipPosition(nextStage);
            
            // Hacer que la isla empiece a aparecer a mitad del trayecto
            setTimeout(() => {
                const nextIslandEl = document.getElementById(`island-${nextStage}`);
                nextIslandEl.classList.remove("locked");
            }, 1000);
            
            // Esperar a que el barco llegue a la nueva isla para activarla
            setTimeout(() => {
                const nextIslandEl = document.getElementById(`island-${nextStage}`);
                nextIslandEl.classList.add("active");
                currentStage = nextStage;
            }, 3000);
            
        }, 500);
    });

    function drawAnimatedPath(fromIdx, toIdx) {
        drawnPaths.push({ from: fromIdx, to: toIdx });
        // Redibujar todo, pero la última línea será la animada
        renderPaths(true);
    }

    function renderPaths(animateLast = false) {
        svgCanvas.innerHTML = ""; // Limpiar lienzo de ruta
        const fogHoles = document.getElementById("fog-holes");
        if (fogHoles) fogHoles.innerHTML = ""; // Limpiar lienzo de niebla
        
        const w = svgCanvas.clientWidth;
        const h = svgCanvas.clientHeight;
        
        // Luz inicial en la primera isla (siempre presente)
        if (fogHoles) {
            const startNode = storyData[0];
            const startCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            startCircle.setAttribute("cx", (startNode.x / 100) * w);
            startCircle.setAttribute("cy", (startNode.y / 100) * h);
            startCircle.setAttribute("r", "160");
            startCircle.setAttribute("fill", "black");
            fogHoles.appendChild(startCircle);
        }
        
        drawnPaths.forEach((pathData, index) => {
            const from = storyData[pathData.from];
            const to = storyData[pathData.to];
            
            // Calcular posiciones en píxeles basándose en los porcentajes
            const x1 = (from.x / 100) * w;
            const y1 = (from.y / 100) * h;
            const x2 = (to.x / 100) * w;
            const y2 = (to.y / 100) * h;
            
            // --- Dibuja el corredor de luz en la niebla ---
            if (fogHoles) {
                const fogLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
                fogLine.setAttribute("x1", x1);
                fogLine.setAttribute("y1", y1);
                fogLine.setAttribute("x2", x2);
                fogLine.setAttribute("y2", y2);
                fogLine.setAttribute("stroke", "black");
                fogLine.setAttribute("stroke-width", "280"); // Línea gruesa para crear un corredor ancho
                fogLine.setAttribute("stroke-linecap", "round");
                
                if (animateLast && index === drawnPaths.length - 1) {
                    const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
                    fogLine.style.strokeDasharray = length;
                    fogLine.style.strokeDashoffset = length;
                    
                    fogHoles.appendChild(fogLine);
                    fogLine.getBoundingClientRect(); // Reflow para la animación
                    
                    fogLine.style.transition = "stroke-dashoffset 3s ease-in-out";
                    fogLine.style.strokeDashoffset = "0";
                } else {
                    fogHoles.appendChild(fogLine);
                }
            }
            
            // --- Dibuja la línea roja de la ruta ---
            const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
            line.setAttribute("x1", x1);
            line.setAttribute("y1", y1);
            line.setAttribute("x2", x2);
            line.setAttribute("y2", y2);
            line.setAttribute("stroke", "var(--route-red)");
            line.setAttribute("stroke-width", "4");
            line.setAttribute("stroke-dasharray", "8, 12");
            line.setAttribute("class", "route-line");
            line.style.filter = "url(#ink-bleed)";
            
            // Si es la última línea de ruta roja y se pidió animación
            if (animateLast && index === drawnPaths.length - 1) {
                const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
                line.style.strokeDasharray = length;
                line.style.strokeDashoffset = length;
                
                svgCanvas.appendChild(line);
                
                // Forzar un reflow para que el navegador registre el dashoffset inicial
                line.getBoundingClientRect();
                
                // Animar dibujado (3s igual que el barco)
                line.style.transition = "stroke-dashoffset 3s ease-in-out";
                line.style.strokeDashoffset = "0";
                
                // Restaurar el patrón de guiones normal al finalizar
                setTimeout(() => {
                    line.style.transition = "none";
                    line.style.strokeDasharray = "8, 8";
                }, 3000);
            } else {
                svgCanvas.appendChild(line);
            }
        });
    }
    
    // Transición del mensaje final
    const finalNextBtn = document.getElementById("final-next-btn");
    if (finalNextBtn) {
        finalNextBtn.addEventListener("click", () => {
            const msg1 = document.getElementById("final-msg-1");
            const msg2 = document.getElementById("final-msg-2");
            
            // Fade out msg 1
            msg1.style.transition = "opacity 1.5s ease-in-out";
            msg1.style.opacity = "0";
            
            setTimeout(() => {
                msg1.style.display = "none";
                msg2.style.display = "block";
                
                // Forzar reflow
                msg2.getBoundingClientRect();
                
                msg2.style.opacity = "1";
            }, 1500); // Esperar a que desparezca para mostrar el otro
        });
    }

    initMap();
});

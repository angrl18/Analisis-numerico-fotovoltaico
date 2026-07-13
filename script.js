console.log("Aplicación cargada correctamente");
// Valor de la resistencia shunt utilizada en el experimento
const resistenciaShunt = 0.1; // ohmios
let graficaPotencia;

// Datos experimentales medidos
let datosExperimentales = [
    { hora: "12:14", voltajePanel: 9.63, voltajeShunt: 0.0357 },
    { hora: "12:19", voltajePanel: 9.99, voltajeShunt: 0.0492 },
    { hora: "12:24", voltajePanel: 9.73, voltajeShunt: 0.0428 },
    { hora: "12:29", voltajePanel: 9.97, voltajeShunt: 0.0506 },
    { hora: "12:34", voltajePanel: 9.92, voltajeShunt: 0.0486 },
    { hora: "12:39", voltajePanel: 9.87, voltajeShunt: 0.0469 },
    { hora: "12:44", voltajePanel: 9.81, voltajeShunt: 0.0449 },
    { hora: "12:49", voltajePanel: 9.82, voltajeShunt: 0.0446 },
    { hora: "12:54", voltajePanel: 9.75, voltajeShunt: 0.0421 },
    { hora: "12:59", voltajePanel: 8.84, voltajeShunt: 0.0120 },
    { hora: "13:04", voltajePanel: 8.94, voltajeShunt: 0.0129 },
    { hora: "13:09", voltajePanel: 8.84, voltajeShunt: 0.0101 },
    { hora: "13:14", voltajePanel: 9.71, voltajeShunt: 0.0390 },
    { hora: "13:19", voltajePanel: 8.97, voltajeShunt: 0.0146 },
    { hora: "13:24", voltajePanel: 9.54, voltajeShunt: 0.0332 },
    { hora: "13:29", voltajePanel: 8.96, voltajeShunt: 0.0137 },
    { hora: "13:34", voltajePanel: 8.91, voltajeShunt: 0.0119 },
    { hora: "13:39", voltajePanel: 8.82, voltajeShunt: 0.0095 },
    { hora: "13:44", voltajePanel: 8.75, voltajeShunt: 0.0077 },
    { hora: "13:49", voltajePanel: 8.74, voltajeShunt: 0.0072 }
];
const datosOriginales = datosExperimentales.map(
    (dato) => ({ ...dato })
);
// Calcula la corriente y la potencia de cada medición
function calcularCorrienteYPotencia() {
    datosExperimentales.forEach((dato) => {
        dato.corriente =
            dato.voltajeShunt / resistenciaShunt;

        dato.potencia =
            dato.voltajePanel * dato.corriente;
    });
}

calcularCorrienteYPotencia();
// Función para mostrar los datos dentro de la tabla HTML
function mostrarTabla() {
    const cuerpoTabla = document.getElementById("tabla-datos");

    cuerpoTabla.innerHTML = "";

    datosExperimentales.forEach((dato) => {
        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td>${dato.hora}</td>
            <td>${dato.voltajePanel.toFixed(2)}</td>
            <td>${dato.voltajeShunt.toFixed(4)}</td>
            <td>${dato.corriente.toFixed(3)}</td>
            <td>${dato.potencia.toFixed(3)}</td>
        `;

        cuerpoTabla.appendChild(fila);
    });
}

// Función para mostrar la gráfica
function mostrarGrafica() {
    const horas = datosExperimentales.map((dato) => dato.hora);
    const potencias = datosExperimentales.map((dato) => dato.potencia);

    const contexto = document
        .getElementById("grafica-potencia")
        .getContext("2d");
        if (graficaPotencia) {
    graficaPotencia.destroy();
}

    graficaPotencia = new Chart(contexto, {
        type: "line",

        data: {
            labels: horas,

            datasets: [
                {
                    label: "Potencia del panel (W)",
                    data: potencias,
                    borderWidth: 2,
                    tension: 0.2,
                    pointRadius: 4
                }
            ]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,

            plugins: {
                title: {
                    display: true,
                    text: "Potencia generada por el sistema fotovoltaico"
                }
            },

            scales: {
                x: {
                    title: {
                        display: true,
                        text: "Hora"
                    }
                },

                y: {
                    beginAtZero: true,

                    title: {
                        display: true,
                        text: "Potencia (W)"
                    }
                }
            }
        }
    });
}

// Ejecuta las funciones cuando la página termina de cargar
document.addEventListener("DOMContentLoaded", () => {
    mostrarTabla();
    mostrarGrafica();
    cargarIntervalosRaices();
    cargarPuntosDerivacion();
    cargarIntervalosIntegracion();
});
// Muestra u oculta el módulo de interpolación
function mostrarModuloInterpolacion() {
    const modulo = document.getElementById("modulo-interpolacion");

    modulo.classList.toggle("oculto");
}
// Convierte una hora HH:MM o HH:MM:SS a minutos
function convertirHoraAMinutos(hora) {
    const partes = hora.split(":");

    const horas = Number(partes[0]);
    const minutos = Number(partes[1]);
    const segundos = Number(partes[2] || 0);

    return horas * 60 + minutos + segundos / 60;
}

// Calcula la interpolación lineal
function calcularInterpolacion() {
    const horaIngresada =
        document.getElementById("hora-interpolacion").value;

    const metodo =
        document.getElementById("metodo-interpolacion").value;

    const resultado =
        document.getElementById("resultado-interpolacion");

    if (!horaIngresada) {
        resultado.innerHTML =
            "<p>Ingrese una hora válida.</p>";
        return;
    }

    const tiempoBuscado =
        convertirHoraAMinutos(horaIngresada);

    for (let i = 0; i < datosExperimentales.length - 1; i++) {
        const t1 = convertirHoraAMinutos(
            datosExperimentales[i].hora
        );

        const t2 = convertirHoraAMinutos(
            datosExperimentales[i + 1].hora
        );

        if (tiempoBuscado >= t1 && tiempoBuscado <= t2) {
            const p1 = datosExperimentales[i].potencia;
            const p2 = datosExperimentales[i + 1].potencia;

            if (metodo === "lineal") {
                const potenciaInterpolada =
                    p1 +
                    ((p2 - p1) / (t2 - t1)) *
                    (tiempoBuscado - t1);
                marcarPuntoInterpolado(
                  horaIngresada,
                  potenciaInterpolada,
                  "Lineal"
                   );

                resultado.innerHTML = `
                    <h3>Resultado de interpolación lineal</h3>

                    <p>
                        Intervalo utilizado:
                        <strong>
                            ${datosExperimentales[i].hora}
                            -
                            ${datosExperimentales[i + 1].hora}
                        </strong>
                    </p>

                    <p>
                        Potencia estimada:
                        <strong>
                            ${potenciaInterpolada.toFixed(4)} W
                        </strong>
                    </p>
                `;

                return;
            }

            if (metodo === "lagrange") {
                let inicio = i - 1;

    if (inicio < 0) {
        inicio = 0;
    }

    if (inicio + 4 > datosExperimentales.length) {
        inicio = datosExperimentales.length - 4;
    }

    const datosSeleccionados =
        datosExperimentales.slice(inicio, inicio + 4);

    const puntos = datosSeleccionados.map((dato) => ({
        x: convertirHoraAMinutos(dato.hora),
        y: dato.potencia
    }));

    const potenciaInterpolada =
        interpolacionLagrange(puntos, tiempoBuscado);
        marcarPuntoInterpolado(
            horaIngresada,
            potenciaInterpolada,
            "Lagrange"
      );

    const horasUsadas =
        datosSeleccionados
            .map((dato) => dato.hora)
            .join(", ");

    resultado.innerHTML = `
        <h3>Resultado de interpolación de Lagrange</h3>

        <p>
            Puntos utilizados:
            <strong>${horasUsadas}</strong>
        </p>

        <p>
            Hora estimada:
            <strong>${horaIngresada}</strong>
        </p>

        <p>
            Potencia estimada:
            <strong>
                ${potenciaInterpolada.toFixed(4)} W
            </strong>
        </p>
    `;

    return;
}

    resultado.innerHTML = `
        <p>
            La hora ingresada está fuera del intervalo
            experimental de 12:14 a 13:49.
        </p>
    `;
}}}
// Interpolación de Lagrange usando cuatro puntos cercanos
function interpolacionLagrange(puntos, x) {
    let resultado = 0;

    for (let i = 0; i < puntos.length; i++) {
        let termino = puntos[i].y;

        for (let j = 0; j < puntos.length; j++) {
            if (i !== j) {
                termino *=
                    (x - puntos[j].x) /
                    (puntos[i].x - puntos[j].x);
            }
        }

        resultado += termino;
    }

    return resultado;
}
function marcarPuntoInterpolado(hora, potencia, metodo) {
    if (!graficaPotencia) {
        return;
    }

    const nuevoPunto = {
        x: hora,
        y: potencia
    };

    // Elimina un punto interpolado anterior, si existe
    if (graficaPotencia.data.datasets.length > 1) {
        graficaPotencia.data.datasets.pop();
    }

    graficaPotencia.data.datasets.push({
        label: `Punto interpolado (${metodo})`,
        data: [nuevoPunto],
        showLine: false,
        pointRadius: 8,
        pointHoverRadius: 10,
        borderWidth: 2
    });

    graficaPotencia.update();
}
// Muestra u oculta el módulo de raíces
function mostrarModuloRaices() {
    const modulo = document.getElementById("modulo-raices");
    modulo.classList.toggle("oculto");
}


// Carga los intervalos formados por mediciones consecutivas
function cargarIntervalosRaices() {
    const selector = document.getElementById("intervalo-raiz");

    if (!selector) {
        return;
    }

    selector.innerHTML = "";

    for (let i = 0; i < datosExperimentales.length - 1; i++) {
        const opcion = document.createElement("option");

        opcion.value = i;
        opcion.textContent =
            `${datosExperimentales[i].hora} - ` +
            `${datosExperimentales[i + 1].hora}`;

        selector.appendChild(opcion);
    }
}


// Potencia interpolada linealmente dentro de un intervalo
function potenciaLineal(t, t1, t2, p1, p2) {
    return p1 + ((p2 - p1) / (t2 - t1)) * (t - t1);
}


// Convierte minutos decimales nuevamente a formato HH:MM:SS
function convertirMinutosAHora(minutosTotales) {
    const horas = Math.floor(minutosTotales / 60);
    const minutosRestantes = minutosTotales - horas * 60;
    const minutos = Math.floor(minutosRestantes);

    let segundos =
        Math.round((minutosRestantes - minutos) * 60);

    let horasFinales = horas;
    let minutosFinales = minutos;

    if (segundos === 60) {
        segundos = 0;
        minutosFinales++;
    }

    if (minutosFinales === 60) {
        minutosFinales = 0;
        horasFinales++;
    }

    return (
        String(horasFinales).padStart(2, "0") +
        ":" +
        String(minutosFinales).padStart(2, "0") +
        ":" +
        String(segundos).padStart(2, "0")
    );
}


// Método de Bisección
function calcularRaiz() {
    const potenciaObjetivo = Number(
        document.getElementById("potencia-objetivo").value
    );

    const indiceIntervalo = Number(
        document.getElementById("intervalo-raiz").value
    );

    const metodoRaiz =
    document.getElementById("metodo-raiz").value;

    const resultado =
        document.getElementById("resultado-raiz");

    if (!Number.isFinite(potenciaObjetivo)) {
        resultado.innerHTML =
            "<p>Ingrese una potencia válida.</p>";
        return;
    }

    const dato1 = datosExperimentales[indiceIntervalo];
    const dato2 = datosExperimentales[indiceIntervalo + 1];

    const tInicial = convertirHoraAMinutos(dato1.hora);
    const tFinal = convertirHoraAMinutos(dato2.hora);

    let a = tInicial;
    let b = tFinal;

    const p1 = dato1.potencia;
    const p2 = dato2.potencia;
    // f(t) = P(t) - Potencia objetivo
    const funcion = (t) =>
        potenciaLineal(
            t,
            tInicial,
            tFinal,
            p1,
            p2
        ) - potenciaObjetivo;

    let fa = funcion(a);
    let fb = funcion(b);

    // Bisección requiere cambio de signo
    if (fa * fb > 0) {
        resultado.innerHTML = `
            <h3>No existe una raíz en el intervalo seleccionado</h3>

            <p>
                Potencia inicial:
                <strong>${p1.toFixed(4)} W</strong>
            </p>

            <p>
                Potencia final:
                <strong>${p2.toFixed(4)} W</strong>
            </p>

            <p>
                La potencia objetivo de
                <strong>${potenciaObjetivo.toFixed(4)} W</strong>
                no se encuentra entre estos valores.
            </p>
        `;

        return;
    }

    // Si la potencia objetivo coincide con un extremo
    if (Math.abs(fa) < 0.000001) {
        resultado.innerHTML = `
            <h3>Resultado del método de Bisección</h3>
            <p>
                La potencia objetivo se alcanza a las
                <strong>${dato1.hora}:00</strong>.
            </p>
        `;
        return;
    }

    if (Math.abs(fb) < 0.000001) {
        resultado.innerHTML = `
            <h3>Resultado del método de Bisección</h3>
            <p>
                La potencia objetivo se alcanza a las
                <strong>${dato2.hora}:00</strong>.
            </p>
        `;
        return;
    }
    if (metodoRaiz === "newton") {
    const pendiente = (p2 - p1) / (tFinal - tInicial);

    if (Math.abs(pendiente) < 1e-12) {
        resultado.innerHTML = `
            <h3>No se puede aplicar Newton-Raphson</h3>
            <p>
                La pendiente de la potencia en el intervalo
                seleccionado es prácticamente cero.
            </p>
        `;
        return;
    }

    let tActual = (tInicial + tFinal) / 2;
    const tolerancia = 0.000001;
    const maxIteraciones = 100;
    let iteraciones = 0;
    let error = Infinity;

    while (
        error > tolerancia &&
        iteraciones < maxIteraciones
    ) {
        const tNuevo =
            tActual - funcion(tActual) / pendiente;

        error = Math.abs(tNuevo - tActual);
        tActual = tNuevo;
        iteraciones++;
    }

    if (
        tActual < tInicial ||
        tActual > tFinal
    ) {
        resultado.innerHTML = `
            <h3>Resultado fuera del intervalo</h3>
            <p>
                Newton-Raphson encontró un valor fuera del intervalo
                seleccionado. Elija otro intervalo o use Bisección.
            </p>
        `;
        return;
    }

    const potenciaCalculada =
        potenciaLineal(
            tActual,
            tInicial,
            tFinal,
            p1,
            p2
        );

    const horaResultado =
        convertirMinutosAHora(tActual);

    resultado.innerHTML = `
        <h3>Resultado del método de Newton-Raphson</h3>

        <p>
            Intervalo utilizado:
            <strong>
                ${dato1.hora} - ${dato2.hora}
            </strong>
        </p>

        <p>
            Potencia objetivo:
            <strong>
                ${potenciaObjetivo.toFixed(4)} W
            </strong>
        </p>

        <p>
            Instante aproximado:
            <strong>${horaResultado}</strong>
        </p>

        <p>
            Potencia calculada:
            <strong>
                ${potenciaCalculada.toFixed(4)} W
            </strong>
        </p>

        <p>
            Número de iteraciones:
            <strong>${iteraciones}</strong>
        </p>
    `;

    return;
}
    const tolerancia = 0.000001;
    const maxIteraciones = 100;

    let puntoMedio;
    let fMedio;
    let iteraciones = 0;

    while (
        Math.abs(b - a) > tolerancia &&
        iteraciones < maxIteraciones
    ) {
        puntoMedio = (a + b) / 2;
        fMedio = funcion(puntoMedio);

        if (fa * fMedio < 0) {
            b = puntoMedio;
            fb = fMedio;
        } else {
            a = puntoMedio;
            fa = fMedio;
        }

        iteraciones++;
    }

    puntoMedio = (a + b) / 2;

    const potenciaCalculada =
        potenciaLineal(
            puntoMedio,
            tInicial,
            tFinal,
            p1,
            p2
        );

    const horaResultado =
        convertirMinutosAHora(puntoMedio);

    resultado.innerHTML = `
        <h3>Resultado del método de Bisección</h3>

        <p>
            Intervalo utilizado:
            <strong>
                ${dato1.hora} - ${dato2.hora}
            </strong>
        </p>

        <p>
            Potencia objetivo:
            <strong>
                ${potenciaObjetivo.toFixed(4)} W
            </strong>
        </p>

        <p>
            Instante aproximado:
            <strong>${horaResultado}</strong>
        </p>

        <p>
            Potencia calculada:
            <strong>
                ${potenciaCalculada.toFixed(4)} W
            </strong>
        </p>

        <p>
            Número de iteraciones:
            <strong>${iteraciones}</strong>
        </p>
    `;
}
// Muestra u oculta el módulo de derivación
function mostrarModuloDerivacion() {
    const modulo =
        document.getElementById("modulo-derivacion");

    modulo.classList.toggle("oculto");
}


// Carga las horas experimentales en el selector
function cargarPuntosDerivacion() {
    const selector =
        document.getElementById("punto-derivacion");

    if (!selector) {
        return;
    }

    selector.innerHTML = "";

    datosExperimentales.forEach((dato, indice) => {
        const opcion = document.createElement("option");

        opcion.value = indice;
        opcion.textContent = dato.hora;

        // Selecciona inicialmente las 12:34
        if (dato.hora === "12:34") {
            opcion.selected = true;
        }

        selector.appendChild(opcion);
    });
}


// Calcula la derivada numérica
function calcularDerivacion() {
    const indice = Number(
        document.getElementById("punto-derivacion").value
    );

    const metodo =
        document.getElementById("metodo-derivacion").value;

    const resultado =
        document.getElementById("resultado-derivacion");

    const ultimoIndice =
        datosExperimentales.length - 1;

    let derivada;
    let formula;
    let puntosUsados;

    // Diferencia progresiva
    if (metodo === "progresiva") {
        if (indice === ultimoIndice) {
            resultado.innerHTML = `
                <h3>No se puede aplicar diferencia progresiva</h3>

                <p>
                    El último dato no tiene una medición posterior.
                </p>
            `;
            return;
        }

        const tActual = convertirHoraAMinutos(
            datosExperimentales[indice].hora
        );

        const tSiguiente = convertirHoraAMinutos(
            datosExperimentales[indice + 1].hora
        );

        const pActual =
            datosExperimentales[indice].potencia;

        const pSiguiente =
            datosExperimentales[indice + 1].potencia;

        derivada =
            (pSiguiente - pActual) /
            (tSiguiente - tActual);

        formula =
            "(Pᵢ₊₁ − Pᵢ)/(tᵢ₊₁ − tᵢ)";

        puntosUsados =
            `${datosExperimentales[indice].hora} y ` +
            `${datosExperimentales[indice + 1].hora}`;
    }

    // Diferencia regresiva
    if (metodo === "regresiva") {
        if (indice === 0) {
            resultado.innerHTML = `
                <h3>No se puede aplicar diferencia regresiva</h3>

                <p>
                    El primer dato no tiene una medición anterior.
                </p>
            `;
            return;
        }

        const tAnterior = convertirHoraAMinutos(
            datosExperimentales[indice - 1].hora
        );

        const tActual = convertirHoraAMinutos(
            datosExperimentales[indice].hora
        );

        const pAnterior =
            datosExperimentales[indice - 1].potencia;

        const pActual =
            datosExperimentales[indice].potencia;

        derivada =
            (pActual - pAnterior) /
            (tActual - tAnterior);

        formula =
            "(Pᵢ − Pᵢ₋₁)/(tᵢ − tᵢ₋₁)";

        puntosUsados =
            `${datosExperimentales[indice - 1].hora} y ` +
            `${datosExperimentales[indice].hora}`;
    }

    // Diferencia centrada
    if (metodo === "centrada") {
        if (indice === 0 || indice === ultimoIndice) {
            resultado.innerHTML = `
                <h3>No se puede aplicar diferencia centrada</h3>

                <p>
                    Se necesita un dato anterior y uno posterior.
                </p>
            `;
            return;
        }

        const tAnterior = convertirHoraAMinutos(
            datosExperimentales[indice - 1].hora
        );

        const tSiguiente = convertirHoraAMinutos(
            datosExperimentales[indice + 1].hora
        );

        const pAnterior =
            datosExperimentales[indice - 1].potencia;

        const pSiguiente =
            datosExperimentales[indice + 1].potencia;

        derivada =
            (pSiguiente - pAnterior) /
            (tSiguiente - tAnterior);

        formula =
            "(Pᵢ₊₁ − Pᵢ₋₁)/(tᵢ₊₁ − tᵢ₋₁)";

        puntosUsados =
            `${datosExperimentales[indice - 1].hora} y ` +
            `${datosExperimentales[indice + 1].hora}`;
    }

    const derivadaHora = derivada * 60;

    let interpretacion;

    if (derivada > 0.0001) {
        interpretacion =
            "La potencia estaba aumentando.";
    } else if (derivada < -0.0001) {
        interpretacion =
            "La potencia estaba disminuyendo.";
    } else {
        interpretacion =
            "La potencia se mantenía aproximadamente constante.";
    }

    resultado.innerHTML = `
        <h3>Resultado de derivación numérica</h3>

        <p>
            Hora evaluada:
            <strong>
                ${datosExperimentales[indice].hora}
            </strong>
        </p>

        <p>
            Método:
            <strong>${metodo}</strong>
        </p>

        <p>
            Puntos utilizados:
            <strong>${puntosUsados}</strong>
        </p>

        <p>
            Fórmula:
            <strong>${formula}</strong>
        </p>

        <p>
            Derivada:
            <strong>
                ${derivada.toFixed(6)} W/min
            </strong>
        </p>

        <p>
            Equivalente:
            <strong>
                ${derivadaHora.toFixed(4)} W/h
            </strong>
        </p>

        <p>
            Interpretación:
            <strong>${interpretacion}</strong>
        </p>
    `;
}
// Muestra u oculta el módulo de integración
function mostrarModuloIntegracion() {
    const modulo =
        document.getElementById("modulo-integracion");

    modulo.classList.toggle("oculto");
}


// Carga las horas inicial y final
function cargarIntervalosIntegracion() {
    const selectorInicio =
        document.getElementById("inicio-integracion");

    const selectorFin =
        document.getElementById("fin-integracion");

    if (!selectorInicio || !selectorFin) {
        return;
    }

    selectorInicio.innerHTML = "";
    selectorFin.innerHTML = "";

    datosExperimentales.forEach((dato, indice) => {
        const opcionInicio =
            document.createElement("option");

        const opcionFin =
            document.createElement("option");

        opcionInicio.value = indice;
        opcionInicio.textContent = dato.hora;

        opcionFin.value = indice;
        opcionFin.textContent = dato.hora;

        selectorInicio.appendChild(opcionInicio);
        selectorFin.appendChild(opcionFin);
    });

    selectorInicio.value = 0;
    selectorFin.value =
        datosExperimentales.length - 1;
}


// Integración mediante Trapecio compuesto
function integrarTrapecio(datos) {
    let energiaWMin = 0;

    for (let i = 0; i < datos.length - 1; i++) {
        const t1 =
            convertirHoraAMinutos(datos[i].hora);

        const t2 =
            convertirHoraAMinutos(datos[i + 1].hora);

        const h = t2 - t1;

        energiaWMin +=
            (h / 2) *
            (datos[i].potencia +
             datos[i + 1].potencia);
    }

    return energiaWMin;
}


// Simpson 1/3 para un número par de intervalos
function simpsonUnTercio(datos) {
    const numeroIntervalos = datos.length - 1;

    const t1 =
        convertirHoraAMinutos(datos[0].hora);

    const t2 =
        convertirHoraAMinutos(datos[1].hora);

    const h = t2 - t1;

    let suma =
        datos[0].potencia +
        datos[datos.length - 1].potencia;

    for (let i = 1; i < datos.length - 1; i++) {
        if (i % 2 === 0) {
            suma += 2 * datos[i].potencia;
        } else {
            suma += 4 * datos[i].potencia;
        }
    }

    return (h / 3) * suma;
}


// Simpson 3/8 para tres intervalos
function simpsonTresOctavos(datos) {
    const t1 =
        convertirHoraAMinutos(datos[0].hora);

    const t2 =
        convertirHoraAMinutos(datos[1].hora);

    const h = t2 - t1;

    return (
        (3 * h / 8) *
        (
            datos[0].potencia +
            3 * datos[1].potencia +
            3 * datos[2].potencia +
            datos[3].potencia
        )
    );
}


// Integración mediante Simpson compuesto
function integrarSimpson(datos) {
    const numeroIntervalos = datos.length - 1;

    // Si existe un número par de intervalos,
    // se aplica Simpson 1/3 en todo el intervalo.
    if (numeroIntervalos % 2 === 0) {
        return {
            energia: simpsonUnTercio(datos),
            descripcion: "Simpson 1/3 compuesto"
        };
    }

    // Si el número de intervalos es impar,
    // se usa Simpson 1/3 y Simpson 3/8.
    if (numeroIntervalos >= 3) {
        const cantidadPrimerBloque =
            numeroIntervalos - 3;

        let energia = 0;
        let descripcion;

        if (cantidadPrimerBloque > 0) {
            const datosUnTercio =
                datos.slice(0, cantidadPrimerBloque + 1);

            energia +=
                simpsonUnTercio(datosUnTercio);

            descripcion =
                "Simpson 1/3 y Simpson 3/8";
        } else {
            descripcion = "Simpson 3/8";
        }

        const datosTresOctavos =
            datos.slice(datos.length - 4);

        energia +=
            simpsonTresOctavos(datosTresOctavos);

        return {
            energia,
            descripcion
        };
    }

    return null;
}


// Calcula la energía del intervalo seleccionado
function calcularIntegracion() {
    const indiceInicio = Number(
        document.getElementById("inicio-integracion").value
    );

    const indiceFin = Number(
        document.getElementById("fin-integracion").value
    );

    const metodo =
        document.getElementById("metodo-integracion").value;

    const resultado =
        document.getElementById("resultado-integracion");

    if (indiceFin <= indiceInicio) {
        resultado.innerHTML = `
            <h3>Intervalo no válido</h3>

            <p>
                La hora final debe ser posterior a la hora inicial.
            </p>
        `;
        return;
    }

    const datosSeleccionados =
        datosExperimentales.slice(
            indiceInicio,
            indiceFin + 1
        );

    const numeroIntervalos =
        datosSeleccionados.length - 1;

    let energiaWMin;
    let nombreMetodo;

    if (metodo === "trapecio") {
        energiaWMin =
            integrarTrapecio(datosSeleccionados);

        nombreMetodo =
            "Regla compuesta del Trapecio";
    }

    if (metodo === "simpson") {
        const resultadoSimpson =
            integrarSimpson(datosSeleccionados);

        if (!resultadoSimpson) {
            resultado.innerHTML = `
                <h3>No se puede aplicar Simpson</h3>

                <p>
                    Se necesitan al menos tres subintervalos
                    cuando el número de intervalos es impar.
                </p>
            `;
            return;
        }

        energiaWMin =
            resultadoSimpson.energia;

        nombreMetodo =
            resultadoSimpson.descripcion;
    }

    // Conversión de W·min a Wh
    const energiaWh = energiaWMin / 60;

    const energiaKWh = energiaWh / 1000;

    const duracionMinutos =
        convertirHoraAMinutos(
            datosSeleccionados[
                datosSeleccionados.length - 1
            ].hora
        ) -
        convertirHoraAMinutos(
            datosSeleccionados[0].hora
        );

    const potenciaPromedio =
        energiaWMin / duracionMinutos;

    resultado.innerHTML = `
        <h3>Resultado de integración numérica</h3>

        <p>
            Método aplicado:
            <strong>${nombreMetodo}</strong>
        </p>

        <p>
            Intervalo:
            <strong>
                ${datosSeleccionados[0].hora}
                -
                ${datosSeleccionados[
                    datosSeleccionados.length - 1
                ].hora}
            </strong>
        </p>

        <p>
            Número de subintervalos:
            <strong>${numeroIntervalos}</strong>
        </p>

        <p>
            Duración:
            <strong>
                ${duracionMinutos.toFixed(2)} min
            </strong>
        </p>

        <p>
            Energía generada:
            <strong>
                ${energiaWh.toFixed(6)} Wh
            </strong>
        </p>

        <p>
            Energía en kilovatios-hora:
            <strong>
                ${energiaKWh.toFixed(9)} kWh
            </strong>
        </p>

        <p>
            Potencia promedio:
            <strong>
                ${potenciaPromedio.toFixed(4)} W
            </strong>
        </p>
    `;
}
function cargarArchivoCSV() {
    const entradaArchivo =
        document.getElementById("archivo-csv");

    const mensaje =
        document.getElementById("mensaje-csv");

    const archivo = entradaArchivo.files[0];

    if (!archivo) {
        mensaje.textContent =
            "Seleccione primero un archivo CSV.";
        return;
    }

    const lector = new FileReader();

    lector.onload = function (evento) {
        try {
            const contenido =
                evento.target.result.trim();

            const lineas =
                contenido.split(/\r?\n/);

            if (lineas.length < 2) {
                throw new Error(
                    "El archivo no contiene suficientes datos."
                );
            }

            const encabezados = lineas[0]
                .split(",")
                .map((texto) =>
                    texto.trim().toLowerCase()
                );

            const indiceHora =
                encabezados.indexOf("hora");

            const indiceVoltajePanel =
                encabezados.indexOf("voltajepanel");

            const indiceVoltajeShunt =
                encabezados.indexOf("voltajeshunt");

            if (
                indiceHora === -1 ||
                indiceVoltajePanel === -1 ||
                indiceVoltajeShunt === -1
            ) {
                throw new Error(
                    "Las columnas deben llamarse: " +
                    "hora, voltajePanel y voltajeShunt."
                );
            }

            const nuevosDatos = [];

            for (let i = 1; i < lineas.length; i++) {
                if (!lineas[i].trim()) {
                    continue;
                }

                const columnas =
                    lineas[i].split(",");

                const hora =
                    columnas[indiceHora].trim();

                const voltajePanel = Number(
                    columnas[indiceVoltajePanel]
                );

                const voltajeShunt = Number(
                    columnas[indiceVoltajeShunt]
                );

                if (
                    !hora ||
                    !Number.isFinite(voltajePanel) ||
                    !Number.isFinite(voltajeShunt)
                ) {
                    throw new Error(
                        `Dato inválido en la fila ${i + 1}.`
                    );
                }

                nuevosDatos.push({
                    hora,
                    voltajePanel,
                    voltajeShunt
                });
            }

            if (nuevosDatos.length < 2) {
                throw new Error(
                    "Se necesitan al menos dos mediciones."
                );
            }

            nuevosDatos.sort(
                (a, b) =>
                    convertirHoraAMinutos(a.hora) -
                    convertirHoraAMinutos(b.hora)
            );

            datosExperimentales = nuevosDatos;

            actualizarAplicacion();

            mensaje.textContent =
                `Se cargaron correctamente ` +
                `${datosExperimentales.length} mediciones.`;

        } catch (error) {
            mensaje.textContent =
                `Error: ${error.message}`;
        }
    };

    lector.onerror = function () {
        mensaje.textContent =
            "No se pudo leer el archivo.";
    };

    lector.readAsText(archivo);
}
function restaurarDatosOriginales() {
    datosExperimentales =
        datosOriginales.map((dato) => ({ ...dato }));

    actualizarAplicacion();

    document.getElementById("mensaje-csv").textContent =
        "Se restauraron las mediciones originales.";
}
function actualizarAplicacion() {
    calcularCorrienteYPotencia();

    mostrarTabla();
    mostrarGrafica();

    cargarIntervalosRaices();
    cargarPuntosDerivacion();
    cargarIntervalosIntegracion();

    limpiarResultados();
}
function limpiarResultados() {
    const cajas = [
        "resultado-interpolacion",
        "resultado-raiz",
        "resultado-derivacion",
        "resultado-integracion"
    ];

    cajas.forEach((id) => {
        const elemento =
            document.getElementById(id);

        if (elemento) {
            elemento.innerHTML =
                "Aquí aparecerá el resultado.";
        }
    });
}
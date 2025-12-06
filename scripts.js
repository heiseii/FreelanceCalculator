// ========================================
// CALCULADORA FREELANCER ARGENTINA
// script.js - Toda la lógica
// ========================================

// Variables globales
let grafico = null;

// ========================================
// INICIALIZACIÓN
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    inicializarApp();
});

function inicializarApp() {
    // Cargar fecha actual
    mostrarFechaActual();
    
    // Obtener cotización del dólar
    obtenerDolar();
    
    // Configurar modo oscuro
    configurarModoOscuro();
    
    // Event Listeners
    configurarEventListeners();
    
    console.log('✅ Calculadora Freelancer inicializada');
}

// ========================================
// CONFIGURACIÓN DE EVENT LISTENERS
// ========================================

function configurarEventListeners() {
    // Formulario calculadora
    const formCalculadora = document.getElementById('calculadoraForm');
    formCalculadora.addEventListener('submit', function(e) {
        e.preventDefault();
        calcular();
    });
    
    // Formulario comparación
    const formComparacion = document.getElementById('comparacionForm');
    formComparacion.addEventListener('submit', function(e) {
        e.preventDefault();
        calcularComparacion();
    });
    
    // Botón actualizar dólar
    const btnActualizarDolar = document.getElementById('actualizarDolar');
    btnActualizarDolar.addEventListener('click', obtenerDolar);
    
    // Tabs
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            cambiarTab(tabName);
        });
    });
    
    // Modo oscuro
    const darkModeToggle = document.getElementById('darkModeToggle');
    darkModeToggle.addEventListener('click', toggleModoOscuro);
}

// ========================================
// FECHA ACTUAL
// ========================================

function mostrarFechaActual() {
    const fechaElement = document.getElementById('fechaActual');
    const fecha = new Date();
    const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
    fechaElement.textContent = fecha.toLocaleDateString('es-AR', opciones);
}

// ========================================
// COTIZACIÓN DEL DÓLAR
// ========================================

async function obtenerDolar() {
    const dolarInput = document.getElementById('dolarBlue');
    const dolarFecha = document.getElementById('dolarFecha');
    
    try {
        dolarFecha.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Actualizando...';
        
        const response = await fetch('https://dolarapi.com/v1/dolares/blue');
        const data = await response.json();
        
        dolarInput.value = data.venta;
        dolarFecha.innerHTML = `<i class="fas fa-check-circle"></i> Actualizado: ${new Date().toLocaleString('es-AR')}`;
        dolarFecha.style.color = 'var(--success)';
        
    } catch (error) {
        console.error('Error al obtener dólar:', error);
        dolarInput.value = 1200;
        dolarFecha.innerHTML = '<i class="fas fa-exclamation-circle"></i> Usando valor estimado';
        dolarFecha.style.color = 'var(--warning)';
    }
}

// ========================================
// CALCULADORA PRINCIPAL
// ========================================

function calcular() {
    // Obtener valores del formulario
    const salarioDeseado = parseFloat(document.getElementById('salarioDeseado').value) || 0;
    const horasMes = parseFloat(document.getElementById('horasMes').value) || 160;
    const gastosMensuales = parseFloat(document.getElementById('gastosMensuales').value) || 0;
    const monotributo = parseFloat(document.getElementById('monotributo').value) || 0;
    const dolarBlue = parseFloat(document.getElementById('dolarBlue').value) || 1200;

    // Validación
    if (salarioDeseado <= 0 || horasMes <= 0) {
        alert('⚠️ Por favor completá todos los campos con valores válidos');
        return;
    }

    // Cálculos
    const vacaciones = salarioDeseado / 12; // 1 mes de vacaciones al año
    const totalMensual = salarioDeseado + gastosMensuales + monotributo + vacaciones;
    
    const tarifaHoraPesos = totalMensual / horasMes;
    const tarifaHoraDolares = tarifaHoraPesos / dolarBlue;
    
    const proyectoMensualPesos = totalMensual;
    const proyectoMensualDolares = proyectoMensualPesos / dolarBlue;
    
    const ingresoAnual = totalMensual * 12;
    const ingresoAnualDolares = ingresoAnual / dolarBlue;
    
    const proyectoSemanal = totalMensual / 4;
    const proyectoSemanalDolares = proyectoSemanal / dolarBlue;

    // Mostrar resultados
    mostrarResultados({
        tarifaHoraPesos,
        tarifaHoraDolares,
        proyectoMensualPesos,
        proyectoMensualDolares,
        ingresoAnual,
        ingresoAnualDolares,
        proyectoSemanal,
        proyectoSemanalDolares,
        salarioDeseado,
        gastosMensuales,
        monotributo,
        vacaciones,
        totalMensual
    });
}

function mostrarResultados(datos) {
    // Mostrar sección de resultados
    const resultadosDiv = document.getElementById('resultados');
    resultadosDiv.classList.remove('hidden');
    
    // Rellenar valores
    document.getElementById('tarifaHoraPesos').textContent = `$${formatNumber(datos.tarifaHoraPesos)}`;
    document.getElementById('tarifaHoraDolares').textContent = `USD ${datos.tarifaHoraDolares.toFixed(2)}/hora`;
    
    document.getElementById('proyectoMensualPesos').textContent = `$${formatNumber(datos.proyectoMensualPesos)}`;
    document.getElementById('proyectoMensualDolares').textContent = `USD ${formatNumber(datos.proyectoMensualDolares)}`;
    
    document.getElementById('ingresoAnual').textContent = `$${formatNumber(datos.ingresoAnual)}`;
    document.getElementById('ingresoAnualDolares').textContent = `USD ${formatNumber(datos.ingresoAnualDolares)}`;
    
    document.getElementById('proyectoSemanal').textContent = `$${formatNumber(datos.proyectoSemanal)}`;
    document.getElementById('proyectoSemanalDolares').textContent = `USD ${formatNumber(datos.proyectoSemanalDolares)}`;
    
    // Desglose
    document.getElementById('desgloseSalario').textContent = `$${formatNumber(datos.salarioDeseado)}`;
    document.getElementById('desgloseGastos').textContent = `$${formatNumber(datos.gastosMensuales)}`;
    document.getElementById('desgloseMonotributo').textContent = `$${formatNumber(datos.monotributo)}`;
    document.getElementById('desgloseVacaciones').textContent = `$${formatNumber(datos.vacaciones)}`;
    document.getElementById('desgloseTotal').textContent = `$${formatNumber(datos.totalMensual)}`;
    
    // Crear gráfico
    crearGrafico(datos.salarioDeseado, datos.gastosMensuales, datos.monotributo, datos.vacaciones);
    
    // Scroll suave a resultados
    resultadosDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ========================================
// GRÁFICO
// ========================================

function crearGrafico(salario, gastos, monotributo, vacaciones) {
    const ctx = document.getElementById('graficoDistribucion');
    
    // Destruir gráfico anterior si existe
    if (grafico) {
        grafico.destroy();
    }

    grafico = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Salario Neto', 'Gastos Operativos', 'Monotributo', 'Vacaciones'],
            datasets: [{
                data: [salario, gastos, monotributo, vacaciones],
                backgroundColor: [
                    'rgba(99, 102, 241, 0.8)',   // indigo
                    'rgba(245, 158, 11, 0.8)',   // amber
                    'rgba(139, 92, 246, 0.8)',   // purple
                    'rgba(16, 185, 129, 0.8)'    // green
                ],
                borderWidth: 3,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        font: { size: 12 }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const porcentaje = ((context.parsed / total) * 100).toFixed(1);
                            return `${context.label}: $${formatNumber(context.parsed)} (${porcentaje}%)`;
                        }
                    }
                }
            }
        }
    });
}

// ========================================
// COMPARACIÓN EMPLEADO VS FREELANCER
// ========================================

function calcularComparacion() {
    const salarioBruto = parseFloat(document.getElementById('salarioEmpleado').value) || 0;
    
    if (salarioBruto <= 0) {
        alert('⚠️ Ingresá un salario válido');
        return;
    }

    // EMPLEADO - Descuentos legales
    const jubilacion = salarioBruto * 0.11;      // 11%
    const obraSocial = salarioBruto * 0.03;      // 3%
    const ley19032 = salarioBruto * 0.03;        // 3%
    const salarioNeto = salarioBruto - jubilacion - obraSocial - ley19032;
    const aguinaldo = salarioBruto * 2;          // 2 sueldos al año
    const totalAnualEmpleado = (salarioNeto * 12) + aguinaldo;

    // FREELANCER - Para igualar ingreso neto
    const salarioDeseadoFreelancer = salarioNeto;
    const gastosMensuales = 100000;
    const monotributo = 13924; // Categoría B por defecto
    const vacaciones = salarioDeseadoFreelancer / 12;
    const totalMensualFreelancer = salarioDeseadoFreelancer + gastosMensuales + monotributo + vacaciones;
    const totalAnualFreelancer = totalMensualFreelancer * 12;

    // Mostrar resultados
    mostrarComparacion({
        // Empleado
        salarioBruto,
        jubilacion,
        obraSocial,
        ley19032,
        salarioNeto,
        aguinaldo,
        totalAnualEmpleado,
        // Freelancer
        totalMensualFreelancer,
        monotributo,
        gastosMensuales,
        vacaciones,
        salarioDeseadoFreelancer,
        totalAnualFreelancer
    });
}

function mostrarComparacion(datos) {
    const resultadosDiv = document.getElementById('resultadosComparacion');
    resultadosDiv.classList.remove('hidden');
    
    // Empleado
    document.getElementById('compEmpleadoBruto').textContent = `$${formatNumber(datos.salarioBruto)}`;
    document.getElementById('compEmpleadoJubilacion').textContent = `-$${formatNumber(datos.jubilacion)}`;
    document.getElementById('compEmpleadoObraSocial').textContent = `-$${formatNumber(datos.obraSocial)}`;
    document.getElementById('compEmpleadoLey').textContent = `-$${formatNumber(datos.ley19032)}`;
    document.getElementById('compEmpleadoNeto').textContent = `$${formatNumber(datos.salarioNeto)}`;
    document.getElementById('compEmpleadoAguinaldo').textContent = `$${formatNumber(datos.aguinaldo)}`;
    document.getElementById('compEmpleadoTotalAnual').textContent = `$${formatNumber(datos.totalAnualEmpleado)}`;
    
    // Freelancer
    document.getElementById('compFreelancerBruto').textContent = `$${formatNumber(datos.totalMensualFreelancer)}`;
    document.getElementById('compFreelancerMonotributo').textContent = `-$${formatNumber(datos.monotributo)}`;
    document.getElementById('compFreelancerGastos').textContent = `-$${formatNumber(datos.gastosMensuales)}`;
    document.getElementById('compFreelancerVacaciones').textContent = `-$${formatNumber(datos.vacaciones)}`;
    document.getElementById('compFreelancerNeto').textContent = `$${formatNumber(datos.salarioDeseadoFreelancer)}`;
    document.getElementById('compFreelancerTotalAnual').textContent = `$${formatNumber(datos.totalAnualFreelancer)}`;
    
    // Conclusión
    const diferencia = datos.totalAnualFreelancer - datos.totalAnualEmpleado;
    const porcentajeMas = ((diferencia / datos.totalAnualEmpleado) * 100).toFixed(1);
    
    const conclusion = `Para tener el mismo ingreso neto mensual ($${formatNumber(datos.salarioNeto)}) que un empleado con salario bruto de $${formatNumber(datos.salarioBruto)}, un freelancer debe facturar $${formatNumber(datos.totalMensualFreelancer)} por mes. Esto representa un ${porcentajeMas}% más anual, ya que el freelancer debe cubrir sus propios gastos operativos, monotributo y días sin trabajo.`;
    
    document.getElementById('conclusionComparacion').textContent = conclusion;
    
    // Scroll suave
    resultadosDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ========================================
// TABS
// ========================================

function cambiarTab(tabName) {
    // Ocultar todos los contenidos
    const allTabs = document.querySelectorAll('.tab-content');
    allTabs.forEach(tab => tab.classList.remove('active'));
    
    // Remover clase active de todos los botones
    const allBtns = document.querySelectorAll('.tab-btn');
    allBtns.forEach(btn => btn.classList.remove('active'));
    
    // Mostrar contenido seleccionado
    const targetTab = document.getElementById(`tab${tabName.charAt(0).toUpperCase() + tabName.slice(1)}`);
    targetTab.classList.add('active');
    
    // Activar botón seleccionado
    const targetBtn = document.querySelector(`[data-tab="${tabName}"]`);
    targetBtn.classList.add('active');
}

// ========================================
// MODO OSCURO
// ========================================

function configurarModoOscuro() {
    // Verificar si hay preferencia guardada
    const modoGuardado = localStorage.getItem('modoOscuro');
    
    if (modoGuardado === 'true') {
        document.body.classList.remove('light-mode');
        document.body.classList.add('dark-mode');
        actualizarIconoModoOscuro(true);
    }
}

function toggleModoOscuro() {
    const body = document.body;
    const isDark = body.classList.contains('dark-mode');
    
    if (isDark) {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
        localStorage.setItem('modoOscuro', 'false');
        actualizarIconoModoOscuro(false);
    } else {
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
        localStorage.setItem('modoOscuro', 'true');
        actualizarIconoModoOscuro(true);
    }
}

function actualizarIconoModoOscuro(isDark) {
    const icon = document.querySelector('#darkModeToggle i');
    if (isDark) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
}

// ========================================
// UTILIDADES
// ========================================

function formatNumber(num) {
    return Math.round(num).toLocaleString('es-AR');
}
/* app.js — Landing Page Inmobiliaria · Corporativo Diamante */

// ─── CONFIGURACIÓN ──────────────────────────────────────────────
// Cambia este número por el WhatsApp real de la inmobiliaria
// Formato: código de país + número sin espacios ni guiones
const WA_NUMBER = '529211533939';
// ────────────────────────────────────────────────────────────────

// Función global para seleccionar un desarrollo desde el mapa o tarjeta y hacer scroll al formulario
window.selectDevelopment = function (devName) {
  const devSelect = document.getElementById('cDevelopment');
  if (devSelect) {
    for (let i = 0; i < devSelect.options.length; i++) {
      if (devSelect.options[i].text.includes(devName) || devSelect.options[i].value.toLowerCase() === devName.toLowerCase()) {
        devSelect.selectedIndex = i;
        break;
      }
    }
  }
  const contactSection = document.getElementById('contacto') || document.querySelector('.contact');
  if (contactSection) {
    contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => {
      document.getElementById('cName')?.focus();
    }, 400);
  }
};

document.addEventListener('DOMContentLoaded', () => {

  /* ── Año dinámico en footer ── */
  const yearEl = document.getElementById('currentYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ── Toast helper ── */
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');
  let toastTimer = null;

  function showToast(msg, isError = false) {
    if (!toast) return;
    toastMsg.textContent = msg;
    toast.classList.toggle('toast--error', isError);
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 5000);
  }

  /* ── Formulario → WhatsApp ── */
  const form = document.getElementById('contactForm');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Leer campos
      const name = document.getElementById('cName')?.value.trim() || '';
      const phone = document.getElementById('cPhone')?.value.trim() || '';
      const service = document.getElementById('cService')?.value || '';
      const development = document.getElementById('cDevelopment')?.value || '';
      const msg = document.getElementById('cMsg')?.value.trim() || '';

      // ── Validación ──
      if (!name) {
        showToast('Por favor ingresa tu nombre.', true);
        document.getElementById('cName')?.focus();
        return;
      }
      if (!phone) {
        showToast('Ingresa tu teléfono o WhatsApp para que podamos contactarte.', true);
        document.getElementById('cPhone')?.focus();
        return;
      }

      // ── Mapear servicio a texto legible ──
      const serviceLabels = {
        compra: 'Comprar una propiedad',
        venta: 'Vender mi propiedad',
        fraccionamiento: 'Fraccionamientos / Lotes',
        otro: 'Otro',
        '': 'No especificado',
      };
      const serviceText = serviceLabels[service] ?? service;

      // ── Armar el mensaje de WhatsApp ──
      const waLines = [
        `*Nombre:* ${name}`,
        `*Teléfono:* ${phone}`,
      ];

      if (development) {
        waLines.push(`*Desarrollo de interés:* ${development}`);
      } else if (service) {
        waLines.push(`*Servicio de interés:* ${serviceText}`);
      }

      if (msg) {
        waLines.push(`*Mensaje:* ${msg}`);
      }

      const waText = waLines.join('\n');

      // ── Abrir WhatsApp ──
      const waUrl = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(waText)}`;

      // Mostrar toast de confirmación
      showToast(`¡Listo, ${name}! Abriendo WhatsApp...`);

      // Pequeño delay para que el usuario vea el toast antes de salir
      setTimeout(() => {
        window.open(waUrl, '_blank', 'noopener,noreferrer');
        form.reset();
      }, 800);
    });
  }

  /* ── Inicializar Mapa Interactivo con Leaflet si existe #map ── */
  const mapEl = document.getElementById('map');
  if (mapEl && typeof L !== 'undefined') {
    // Coordenadas iniciales (vista general de México centrada hacia Veracruz / Golfo)
    const map = L.map('map').setView([19.5, -95.5], 6);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    const developments = [
      {
        name: 'La jolla residencial',
        location: 'Coatzacoalcos, Ver.',
        lat: 18.144362,
        lng: -94.537650,
        type: 'Lotes Residenciales',
        img: 'assets/jolla.jpg',
      },

      {
        name: 'Rio Sur',
        location: 'Coatzacoalcos, Ver.',
        lat: 18.107007042493816,
        lng: -94.56920007869213,
        type: 'Lotes Residenciales',
        img: 'assets/rio sur.jpg',
      },

      {
        name: 'Madeiras Residencial',
        location: 'Coatzacoalcos, Ver.',
        lat: 18.133320493154372,
        lng: -94.47969044611061,
        type: 'Lotes Residenciales',
        img: 'assets/madeira.jpg',
      }
    ];



    developments.forEach(dev => {
      const marker = L.marker([dev.lat, dev.lng]).addTo(map);
      const popupHtml = `
        <div class="map-popup-card">
          <img src="${dev.img}" alt="${dev.name}" class="map-popup-img">
          <div class="map-popup-body">
            <span class="map-popup-type">${dev.type}</span>
            <div class="map-popup-title">${dev.name}</div>
            <div class="map-popup-loc">📍 ${dev.location}</div>
            <button class="map-popup-btn" onclick="selectDevelopment('${dev.name}')">Solicitar información</button>
          </div>
        </div>
      `;
      marker.bindPopup(popupHtml);
    });
  }

  /* ── Scroll suave para todos los anchors internos ── */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

});


/* app.js — Landing Page Inmobiliaria · Corporativo Diamante */

// ─── CONFIGURACIÓN ──────────────────────────────────────────────
// Cambia este número por el WhatsApp real de la inmobiliaria
// Formato: código de país + número sin espacios ni guiones
const WA_NUMBER = '529211533939';
// ────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {

  /* ── Año dinámico en footer ── */
  const yearEl = document.getElementById('currentYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ── Toast helper ── */
  const toast    = document.getElementById('toast');
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
      const name    = document.getElementById('cName')?.value.trim()    || '';
      const phone   = document.getElementById('cPhone')?.value.trim()   || '';
      const service = document.getElementById('cService')?.value        || '';
      const msg     = document.getElementById('cMsg')?.value.trim()     || '';

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
        compra:           'Comprar una propiedad',
        venta:            'Vender mi propiedad',
        fraccionamiento:  'Fraccionamientos / Lotes',
        otro:             'Otro',
        '':               'No especificado',
      };
      const serviceText = serviceLabels[service] ?? service;

      // ── Armar el mensaje de WhatsApp ──
      const waText = [
        `Hola, me contacté desde el sitio web.`,
        ``,
        `*Nombre:* ${name}`,
        `*Teléfono:* ${phone}`,
        `*Servicio de interés:* ${serviceText}`,
        msg ? `*Mensaje:* ${msg}` : null,
      ]
        .filter(line => line !== null)
        .join('\n');

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

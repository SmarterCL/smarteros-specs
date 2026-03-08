/**
 * SmarterOS v5 - Identity Engine
 * RUT Enrichment Service (SII/CMF Lookup)
 * 
 * Enriquece RUT con datos de:
 * - SII (razón social, giro)
 * - CMF (datos financieros)
 * - Rutificador empresarial
 */

const RutEngine = require('./rut-engine');

class RutEnrichment {
  constructor(options = {}) {
    this.siiEndpoint = options.siiEndpoint || 'https://www.sii.cl/cgi-bin/consulta/cons_emp.cgi';
    this.cache = new Map();
    this.cacheTTL = options.cacheTTL || 3600000; // 1 hora
  }

  /**
   * Enriquece RUT con datos de empresa
   * @param {string} rut - RUT de la empresa
   * @returns {Promise<Object>} - Datos enriquecidos
   */
  async enrich(rut) {
    const parsed = RutEngine.parse(rut);

    if (!parsed.valid) {
      throw new Error(`RUT inválido: ${rut}`);
    }

    // Check cache
    const cached = this.cache.get(parsed.formatted);
    if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
      return { ...cached.data, fromCache: true };
    }

    // Simular consulta a SII (en producción: API real)
    const data = await this.querySII(parsed.body);

    // Guardar en cache
    this.cache.set(parsed.formatted, {
      data,
      timestamp: Date.now()
    });

    return { ...data, fromCache: false };
  }

  /**
   * Consulta datos al SII (simulado)
   * En producción: usar API oficial o servicio tercero
   * @param {number} rutBody - Cuerpo del RUT
   * @returns {Promise<Object>} - Datos de la empresa
   */
  async querySII(rutBody) {
    // SIMULACIÓN - En producción usar API real
    // Ejemplos de APIs:
    // - https://api.rutificador.cl/
    // - https://www.buscador-empresas.cl/
    // - SII oficial (requiere certificado)

    // Datos mock para testing
    const mockData = {
      78233417: {
        rut: '78.233.417-4',
        razon_social: 'SMARTER SPA',
        nombre_fantasia: 'SmarterOS',
        giro: 'Servicios de software y consultoría TI',
        actividad_economica: '620100 - Actividades de programación informática',
        tipo_persona: 'Jurídica',
        direccion: 'Av. Principal 123',
        region: 'Metropolitana',
        comuna: 'Santiago',
        estado: 'Activo',
        fecha_inicio: '2020-01-15'
      },
      76123456: {
        rut: '76.123.456-K',
        razon_social: 'ECOCUPON SPA',
        nombre_fantasia: 'Ecocupon',
        giro: 'Comercio electrónico de cupones de descuento',
        actividad_economica: '479110 - Comercio al por menor por internet',
        tipo_persona: 'Jurídica',
        direccion: 'Calle Falsa 456',
        region: 'Metropolitana',
        comuna: 'Providencia',
        estado: 'Activo',
        fecha_inicio: '2019-06-20'
      }
    };

    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 500));

    return mockData[rutBody] || {
      rut: RutEngine.format(rutBody.toString(), true),
      razon_social: 'Persona Natural',
      tipo_persona: 'Natural',
      estado: 'No encontrado en SII',
      nota: 'Datos no disponibles - usar API real en producción'
    };
  }

  /**
   * Determina tipo de cliente (empresa vs persona)
   * @param {Object} enrichedData - Datos enriquecidos
   * @returns {string} - 'empresa' o 'persona'
   */
  static getCustomerType(enrichedData) {
    if (enrichedData.tipo_persona === 'Jurídica') {
      return 'empresa';
    }
    return 'persona';
  }

  /**
   * Prepara datos para facturación SII
   * @param {Object} enrichedData - Datos enriquecidos
   * @returns {Object} - Datos listos para SII
   */
  static prepareForSII(enrichedData) {
    return {
      rut: enrichedData.rut,
      razon_social: enrichedData.razon_social || enrichedData.nombre_fantasia,
      giro: enrichedData.giro,
      direccion: enrichedData.direccion,
      comuna: enrichedData.comuna,
      region: enrichedData.region,
      tipo_persona: enrichedData.tipo_persona,
      email: enrichedData.email,
      telefono: enrichedData.telefono
    };
  }

  /**
   * Limpia cache
   * @param {string} rut - RUT específico o undefined para todo
   */
  clearCache(rut) {
    if (rut) {
      const parsed = RutEngine.parse(rut);
      this.cache.delete(parsed.formatted);
    } else {
      this.cache.clear();
    }
  }
}

module.exports = RutEnrichment;

/**
 * SmarterOS v5 - Identity Engine
 * RUT Chile Validation & Normalization
 * 
 * Pipeline: input → clean → validate → enrich → event
 */

class RutEngine {
  /**
   * Limpia el RUT de caracteres especiales
   * Ej: "12.345.678-5" → "12345678-5"
   * @param {string} rut - RUT en cualquier formato
   * @returns {string|null} - RUT limpio o null
   */
  static clean(rut) {
    if (rut === null || rut === undefined) return null;
    if (typeof rut !== 'string' && typeof rut !== 'number') return null;
    
    const str = rut.toString().trim();
    if (str === '') return null;

    return str
      .replace(/\./g, '')
      .replace(/-/g, '')
      .replace(/\s/g, '')
      .toUpperCase();
  }

  /**
   * Formatea RUT estándar chileno
   * Ej: "123456785" → "12.345.678-5"
   * @param {string} rut - RUT sin formato
   * @returns {string|null} - RUT formateado
   */
  static format(rut, withDots = true) {
    const clean = this.clean(rut);

    if (!clean || clean.length < 2) return null;

    const body = clean.slice(0, -1);
    const dv = clean.slice(-1);

    if (withDots) {
      // Con puntos: 12.345.678-5
      const bodyWithDots = body.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      return `${bodyWithDots}-${dv}`;
    }

    // Sin puntos: 12345678-5
    return `${body}-${dv}`;
  }

  /**
   * Valida dígito verificador (algoritmo módulo 11)
   * @param {string} rut - RUT a validar
   * @returns {boolean} - true si es válido
   */
  static validate(rut) {
    const clean = this.clean(rut);

    if (!clean || clean.length < 2) return false;
    if (!/^\d+[0-9Kk]$/.test(clean)) return false;

    const body = clean.slice(0, -1);
    const dv = clean.slice(-1).toUpperCase();

    let sum = 0;
    let multiplier = 2;

    for (let i = body.length - 1; i >= 0; i--) {
      sum += parseInt(body[i]) * multiplier;
      multiplier = multiplier === 7 ? 2 : multiplier + 1;
    }

    const mod = 11 - (sum % 11);

    let calculatedDV;
    if (mod === 11) calculatedDV = '0';
    else if (mod === 10) calculatedDV = 'K';
    else calculatedDV = mod.toString();

    return dv === calculatedDV;
  }

  /**
   * Extrae el dígito verificador
   * @param {string} rut - RUT
   * @returns {string|null} - DV o null
   */
  static getDV(rut) {
    const clean = this.clean(rut);
    if (!clean || clean.length < 2) return null;
    return clean.slice(-1).toUpperCase();
  }

  /**
   * Obtiene el cuerpo del RUT (sin DV)
   * @param {string} rut - RUT
   * @returns {string|null} - Cuerpo numérico
   */
  static getBody(rut) {
    const clean = this.clean(rut);
    if (!clean || clean.length < 2) return null;
    return clean.slice(0, -1);
  }

  /**
   * Pipeline completo de procesamiento
   * @param {string} rut - RUT en cualquier formato
   * @returns {Object} - Resultado del procesamiento
   */
  static parse(rut) {
    const input = rut;
    const cleaned = this.clean(rut);
    const formatted = this.format(rut, false); // 12345678-5
    const formattedWithDots = this.format(rut, true); // 12.345.678-5
    const valid = this.validate(rut);
    const body = this.getBody(rut);
    const dv = this.getDV(rut);

    return {
      input,
      cleaned,
      formatted,
      formattedWithDots,
      valid,
      body: body ? parseInt(body) : null,
      dv,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Valida y normaliza RUT para base de datos
   * @param {string} rut - RUT de entrada
   * @returns {Object} - RUT listo para guardar
   */
  static normalizeForDB(rut) {
    const parsed = this.parse(rut);

    if (!parsed.valid) {
      throw new Error(`RUT inválido: ${rut}`);
    }

    return {
      rut: parsed.formatted, // 12345678-5
      rut_numeric: parsed.body, // 12345678
      dv: parsed.dv, // 5
      formatted: parsed.formattedWithDots // 12.345.678-5
    };
  }

  /**
   * Genera RUT aleatorio válido (para testing)
   * @returns {string} - RUT válido aleatorio
   */
  static generateRandom() {
    // Generar cuerpo de 8 dígitos
    let body = '';
    for (let i = 0; i < 8; i++) {
      body += Math.floor(Math.random() * 10);
    }

    // Calcular DV
    let sum = 0;
    let multiplier = 2;

    for (let i = body.length - 1; i >= 0; i--) {
      sum += parseInt(body[i]) * multiplier;
      multiplier = multiplier === 7 ? 2 : multiplier + 1;
    }

    const mod = 11 - (sum % 11);
    let dv;
    if (mod === 11) dv = '0';
    else if (mod === 10) dv = 'K';
    else dv = mod.toString();

    return this.format(body + dv, false);
  }
}

module.exports = RutEngine;

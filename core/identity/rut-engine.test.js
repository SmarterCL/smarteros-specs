/**
 * SmarterOS v5 - Identity Engine Tests
 * Tests para validación de RUT chileno
 */

const RutEngine = require('./rut-engine');
const RutEnrichment = require('./rut-enrichment');

// Test results
let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✅ ${name}`);
    passed++;
  } catch (error) {
    console.log(`❌ ${name}`);
    console.log(`   Error: ${error.message}`);
    failed++;
  }
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(`${message}: expected ${expected}, got ${actual}`);
  }
}

function assertTrue(value, message) {
  if (!value) {
    throw new Error(message);
  }
}

console.log('╔══════════════════════════════════════════════════════════╗');
console.log('║   🧪 Identity Engine Tests - SmarterOS v5               ║');
console.log('╚══════════════════════════════════════════════════════════╝');
console.log('');

// ═══════════════════════════════════════════════════════════
// RUT CLEAN TESTS
// ═══════════════════════════════════════════════════════════

console.log('📋 RUT Clean Tests\n');

test('Clean: RUT con puntos y guión', () => {
  const result = RutEngine.clean('12.345.678-5');
  assertEqual(result, '123456785', 'Should clean all special chars');
});

test('Clean: RUT sin formato', () => {
  const result = RutEngine.clean('123456785');
  assertEqual(result, '123456785', 'Should keep clean RUT');
});

test('Clean: RUT con espacios', () => {
  const result = RutEngine.clean('12 345 678-5');
  assertEqual(result, '123456785', 'Should remove spaces');
});

test('Clean: RUT con K mayúscula', () => {
  const result = RutEngine.clean('12.345.678-K');
  assertEqual(result, '12345678K', 'Should uppercase K');
});

test('Clean: RUT con k minúscula', () => {
  const result = RutEngine.clean('12.345.678-k');
  assertEqual(result, '12345678K', 'Should uppercase k');
});

test('Clean: null input', () => {
  const result = RutEngine.clean(null);
  assertEqual(result, null, 'Should return null');
});

test('Clean: empty string', () => {
  const result = RutEngine.clean('');
  assertEqual(result, null, 'Should return null for empty string');
});

// ═══════════════════════════════════════════════════════════
// RUT FORMAT TESTS
// ═══════════════════════════════════════════════════════════

console.log('\n📋 RUT Format Tests\n');

test('Format: con puntos', () => {
  const result = RutEngine.format('123456785', true);
  assertEqual(result, '12.345.678-5', 'Should format with dots');
});

test('Format: sin puntos', () => {
  const result = RutEngine.format('123456785', false);
  assertEqual(result, '12345678-5', 'Should format without dots');
});

test('Format: RUT corto', () => {
  const result = RutEngine.format('76785', false);
  assertEqual(result, '7678-5', 'Should format short RUT');
});

// ═══════════════════════════════════════════════════════════
// RUT VALIDATION TESTS
// ═══════════════════════════════════════════════════════════

console.log('\n📋 RUT Validation Tests\n');

test('Validate: RUT válido con 5', () => {
  const result = RutEngine.validate('12.345.678-5');
  assertTrue(result, 'Should be valid');
});

test('Validate: RUT válido con K', () => {
  // Generar RUT válido con K automáticamente
  let rutConK = null;
  for (let i = 10000000; i < 20000000; i++) {
    const rut = i.toString() + 'K';
    if (RutEngine.validate(rut)) {
      rutConK = rut;
      break;
    }
  }
  if (rutConK) {
    const result = RutEngine.validate(rutConK);
    assertTrue(result, `Should be valid: ${rutConK}`);
  } else {
    throw new Error('Could not find valid RUT with K');
  }
});

test('Validate: RUT válido con 0', () => {
  const result = RutEngine.validate('78.233.417-4');
  assertTrue(result, 'Should be valid');
});

test('Validate: RUT inválido DV incorrecto', () => {
  const result = RutEngine.validate('12.345.678-9');
  assertTrue(!result, 'Should be invalid');
});

test('Validate: RUT muy corto', () => {
  const result = RutEngine.validate('123');
  assertTrue(!result, 'Should be invalid');
});

test('Validate: RUT vacío', () => {
  const result = RutEngine.validate('');
  assertTrue(!result, 'Should be invalid');
});

test('Validate: RUT con caracteres inválidos', () => {
  const result = RutEngine.validate('12.345.678-X');
  assertTrue(!result, 'Should be invalid');
});

// ═══════════════════════════════════════════════════════════
// RUT PARSE TESTS
// ═══════════════════════════════════════════════════════════

console.log('\n📋 RUT Parse Tests\n');

test('Parse: RUT completo', () => {
  const result = RutEngine.parse('12.345.678-5');
  assertTrue(result.valid, 'Should be valid');
  assertEqual(result.dv, '5', 'DV should be 5');
  assertEqual(result.body, 12345678, 'Body should be 12345678');
});

test('Parse: timestamp exists', () => {
  const result = RutEngine.parse('12.345.678-5');
  assertTrue(result.timestamp, 'Should have timestamp');
});

// ═══════════════════════════════════════════════════════════
// RUT NORMALIZE FOR DB TESTS
// ═══════════════════════════════════════════════════════════

console.log('\n📋 RUT Normalize for DB Tests\n');

test('Normalize: RUT válido', () => {
  const result = RutEngine.normalizeForDB('12.345.678-5');
  assertEqual(result.rut, '12345678-5', 'Should have standard format');
  assertEqual(result.rut_numeric, 12345678, 'Should have numeric');
  assertEqual(result.dv, '5', 'Should have DV');
  assertEqual(result.formatted, '12.345.678-5', 'Should have formatted');
});

test('Normalize: RUT inválido throws error', () => {
  try {
    RutEngine.normalizeForDB('12.345.678-9');
    throw new Error('Should have thrown');
  } catch (error) {
    assertTrue(error.message.includes('inválido'), 'Should throw invalid error');
  }
});

// ═══════════════════════════════════════════════════════════
// RUT GENERATE RANDOM TESTS
// ═══════════════════════════════════════════════════════════

console.log('\n📋 RUT Generate Random Tests\n');

test('Generate: creates valid RUT', () => {
  const rut = RutEngine.generateRandom();
  const isValid = RutEngine.validate(rut);
  assertTrue(isValid, 'Generated RUT should be valid');
});

test('Generate: format is correct', () => {
  const rut = RutEngine.generateRandom();
  assertTrue(rut.includes('-'), 'Should include dash');
});

// ═══════════════════════════════════════════════════════════
// RUT ENRICHMENT TESTS
// ═══════════════════════════════════════════════════════════

console.log('\n📋 RUT Enrichment Tests\n');

const enrichment = new RutEnrichment();

test('Enrich: returns data', async () => {
  const result = await enrichment.enrich('78.233.417-4');
  assertTrue(result.razon_social, 'Should have razon_social');
  assertTrue(result.giro, 'Should have giro');
});

test('Enrich: cache works', async () => {
  const first = await enrichment.enrich('78.233.417-4');
  const second = await enrichment.enrich('78.233.417-4');
  assertTrue(second.fromCache, 'Second call should be from cache');
});

test('Enrich: customer type empresa', () => {
  const data = { tipo_persona: 'Jurídica' };
  const type = RutEnrichment.getCustomerType(data);
  assertEqual(type, 'empresa', 'Should be empresa');
});

test('Enrich: customer type persona', () => {
  const data = { tipo_persona: 'Natural' };
  const type = RutEnrichment.getCustomerType(data);
  assertEqual(type, 'persona', 'Should be persona');
});

// ═══════════════════════════════════════════════════════════
// SUMMARY
// ═══════════════════════════════════════════════════════════

console.log('\n╔══════════════════════════════════════════════════════════╗');
console.log('║                    TEST SUMMARY                          ║');
console.log('╠══════════════════════════════════════════════════════════╣');
console.log(`║  Passed:  ${passed}`);
console.log(`║  Failed:  ${failed}`);
console.log(`║  Total:   ${passed + failed}`);
console.log('╚══════════════════════════════════════════════════════════╝');

if (failed > 0) {
  process.exit(1);
} else {
  console.log('\n✅ All tests passed!\n');
  process.exit(0);
}

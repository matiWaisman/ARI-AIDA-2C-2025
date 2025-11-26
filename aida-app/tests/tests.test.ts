import assert from 'assert';

try {
  assert.strictEqual(1, 1);
  console.log('✓ Test pasado: 1 es igual a 1');
} catch (error) {
  console.error('✗ Test falló:', error);
  process.exit(1);
}


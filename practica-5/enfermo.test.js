const test = require('node:test');
const assert = require('node:assert/strict');

const { procesarVenta } = require('./enfermo');

test('rechaza una venta con datos incorrectos', () => {
    const resultado = procesarVenta('', 'Perfume', 1, 1000, 'NORMAL');

    assert.deepEqual(resultado, {
        error: 'Datos incorrectos'
    });
});

test('calcula correctamente una venta para cliente NORMAL', () => {
    const resultado = procesarVenta(
        'Maria',
        'Perfume',
        2,
        1000,
        'NORMAL'
    );

    assert.equal(resultado.descuento, 0);
    assert.equal(resultado.impuesto, 300);
    assert.equal(resultado.total, 2300);
});

test('aplica 20% de descuento a un cliente VIP', () => {
    const resultado = procesarVenta(
        'Ana',
        'Maquillaje',
        2,
        1000,
        'VIP'
    );

    assert.equal(resultado.descuento, 400);
    assert.equal(resultado.impuesto, 240);
    assert.equal(resultado.total, 1840);
});

test('aplica 10% de descuento a un cliente FRECUENTE', () => {
    const resultado = procesarVenta(
        'Carlos',
        'Reloj',
        2,
        1000,
        'FRECUENTE'
    );

    assert.equal(resultado.descuento, 200);
    assert.equal(resultado.impuesto, 270);
    assert.equal(resultado.total, 2070);
});

test('clasifica una venta superior a 5000 como Venta grande', () => {
    const resultado = procesarVenta(
        'Jose',
        'Laptop',
        1,
        6000,
        'NORMAL'
    );

    assert.equal(resultado.mensaje, 'Venta grande');
});
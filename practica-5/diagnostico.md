# Diagnóstico de Refactorización - Práctica 5

## Objetivo

El objetivo de esta práctica fue identificar problemas de calidad en un código funcional y aplicar técnicas de refactorización en pasos pequeños, manteniendo el comportamiento original mediante pruebas automatizadas.

## Diagnóstico

| # | Problema detectado | Principio afectado | Refactor aplicado |
|---|---|---|---|
| 1 | Variables con nombres poco descriptivos como `c`, `p`, `cant` y `tipo` | Clean Code - nombres significativos | Se reemplazaron por `cliente`, `producto`, `cantidad` y `tipoCliente`. |
| 2 | Uso de números mágicos como `0.20`, `0.10`, `0.15` y `5000` | Clean Code / mantenibilidad | Se crearon constantes con nombres descriptivos para descuentos, impuesto y límite de venta grande. |
| 3 | La función principal calculaba directamente los descuentos | SRP - Single Responsibility Principle | Se extrajo la función `calcularDescuento()`. |
| 4 | La lógica de negocio estaba mezclada con la presentación mediante `console.log()` | SRP / separación de responsabilidades | Se creó la función `mostrarResumenVenta()`. |
| 5 | `procesarVenta()` realizaba demasiados cálculos y decisiones | SRP / Clean Code | Se extrajeron `calcularImpuesto()` y `clasificarVenta()`, simplificando la función principal. |
| 6 | Existía una cadena de condicionales para determinar descuentos | Clean Code - simplificación de flujo | Se utilizaron retornos tempranos dentro de `calcularDescuento()`. |

## Pruebas

Antes de iniciar la refactorización se crearon pruebas automatizadas utilizando el módulo nativo `node:test` y `node:assert/strict`.

Las pruebas verifican:

- Rechazo de ventas con datos incorrectos.
- Cálculo de ventas para clientes normales.
- Descuento del 20% para clientes VIP.
- Descuento del 10% para clientes frecuentes.
- Clasificación de ventas mayores a 5000 como ventas grandes.

Después de cada refactor se ejecutaron nuevamente las pruebas para comprobar que el comportamiento del sistema no cambiara.

Resultado final:

- Tests: 5
- Pass: 5
- Fail: 0

## Principios aplicados

Durante la refactorización se aplicaron conceptos de Clean Code y SOLID, especialmente el principio de responsabilidad única (SRP). También se utilizaron técnicas como Extract Function, nombres significativos, eliminación de números mágicos, constantes y early return.

## Conclusión

La refactorización permitió mejorar la legibilidad, mantenibilidad y separación de responsabilidades sin modificar el comportamiento observable del programa. Las pruebas automatizadas permitieron realizar cada cambio con seguridad y comprobar que el sistema continuara funcionando correctamente.
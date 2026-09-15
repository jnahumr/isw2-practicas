const DESCUENTO_VIP = 0.20;
const DESCUENTO_FRECUENTE = 0.10;
const TASA_IMPUESTO = 0.15;
const LIMITE_VENTA_GRANDE = 5000;

function calcularDescuento(subtotal, tipoCliente) {
    if (tipoCliente === "VIP") {
        return subtotal * DESCUENTO_VIP;
    }

    if (tipoCliente === "FRECUENTE") {
        return subtotal * DESCUENTO_FRECUENTE;
    }

    return 0;
}

function calcularImpuesto(subtotalConDescuento) {
    return subtotalConDescuento * TASA_IMPUESTO;
}

function clasificarVenta(total) {
    return total > LIMITE_VENTA_GRANDE
        ? "Venta grande"
        : "Venta normal";
}

function mostrarResumenVenta(resultado) {
    console.log("Cliente: " + resultado.cliente);
    console.log("Producto: " + resultado.producto);
    console.log("Cantidad: " + resultado.cantidad);
    console.log(
        "Subtotal con descuento: " +
        (resultado.total - resultado.impuesto)
    );
    console.log("Impuesto: " + resultado.impuesto);
    console.log("Total: " + resultado.total);
    console.log(resultado.mensaje);
}

function procesarVenta(cliente, producto, cantidad, precio, tipoCliente) {
    if (!cliente || !producto || cantidad <= 0 || precio <= 0) {
        return { error: "Datos incorrectos" };
    }

    const subtotal = cantidad * precio;
    const descuento = calcularDescuento(subtotal, tipoCliente);
    const subtotalConDescuento = subtotal - descuento;
    const impuesto = calcularImpuesto(subtotalConDescuento);
    const total = subtotalConDescuento + impuesto;
    const mensaje = clasificarVenta(total);

    const resultado = {
        cliente: cliente,
        producto: producto,
        cantidad: cantidad,
        descuento: descuento,
        impuesto: impuesto,
        total: total,
        mensaje: mensaje
    };

    mostrarResumenVenta(resultado);

    return resultado;
}

module.exports = { procesarVenta };
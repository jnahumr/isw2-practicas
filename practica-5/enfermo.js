const DESCUENTO_VIP = 0.20;
const DESCUENTO_FRECUENTE = 0.10;
const TASA_IMPUESTO = 0.15;
const LIMITE_VENTA_GRANDE = 5000;

function calcularDescuento(total, tipoCliente) {
    if (tipoCliente === "VIP") {
        return total * DESCUENTO_VIP;
    }

    if (tipoCliente === "FRECUENTE") {
        return total * DESCUENTO_FRECUENTE;
    }

    return 0;
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

    let total = cantidad * precio;

    const descuento = calcularDescuento(total, tipoCliente);

    total = total - descuento;

    const impuesto = total * TASA_IMPUESTO;
    total = total + impuesto;

    let mensaje = "";

    if (total > LIMITE_VENTA_GRANDE) {
        mensaje = "Venta grande";
    } else {
        mensaje = "Venta normal";
    }

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
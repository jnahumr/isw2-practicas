const DESCUENTO_VIP = 0.20;
const DESCUENTO_FRECUENTE = 0.10;
const TASA_IMPUESTO = 0.15;
const LIMITE_VENTA_GRANDE = 5000;

function procesarVenta(cliente, producto, cantidad, precio, tipoCliente) {
    if (!cliente || !producto || cantidad <= 0 || precio <= 0) {
        return { error: "Datos incorrectos" };
    }

    let total = cantidad * precio;
    let descuento = 0;

    if (tipoCliente === "VIP") {
        descuento = total * DESCUENTO_VIP;
    } else if (tipoCliente === "FRECUENTE") {
        descuento = total * DESCUENTO_FRECUENTE;
    } else if (tipoCliente === "NORMAL") {
        descuento = 0;
    }

    total = total - descuento;

    let impuesto = total * TASA_IMPUESTO;
    total = total + impuesto;

    let mensaje = "";

    if (total > LIMITE_VENTA_GRANDE) {
        mensaje = "Venta grande";
    } else {
        mensaje = "Venta normal";
    }

    console.log("Cliente: " + cliente);
    console.log("Producto: " + producto);
    console.log("Cantidad: " + cantidad);
    console.log("Subtotal con descuento: " + (total - impuesto));
    console.log("Impuesto: " + impuesto);
    console.log("Total: " + total);
    console.log(mensaje);

    return {
        cliente: cliente,
        producto: producto,
        cantidad: cantidad,
        descuento: descuento,
        impuesto: impuesto,
        total: total,
        mensaje: mensaje
    };
}

module.exports = { procesarVenta };
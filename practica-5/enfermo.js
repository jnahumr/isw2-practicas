function procesarVenta(cliente, producto, cantidad, precio, tipoCliente) {
    if (!cliente || !producto || cantidad <= 0 || precio <= 0) {
        return { error: "Datos incorrectos" };
    }

    let total = cantidad * precio;
    let descuento = 0;

    if (tipoCliente === "VIP") {
        descuento = total * 0.20;
    } else if (tipoCliente === "FRECUENTE") {
        descuento = total * 0.10;
    } else if (tipoCliente === "NORMAL") {
        descuento = 0;
    }

    total = total - descuento;

    let impuesto = total * 0.15;
    total = total + impuesto;

    let mensaje = "";

    if (total > 5000) {
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
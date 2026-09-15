function procesarVenta(c, p, cant, precio, tipo) {
    if (!c || !p || cant <= 0 || precio <= 0) {
        return { error: "Datos incorrectos" };
    }

    let total = cant * precio;
    let descuento = 0;

    if (tipo === "VIP") {
        descuento = total * 0.20;
    } else if (tipo === "FRECUENTE") {
        descuento = total * 0.10;
    } else if (tipo === "NORMAL") {
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

    console.log("Cliente: " + c);
    console.log("Producto: " + p);
    console.log("Cantidad: " + cant);
    console.log("Subtotal con descuento: " + (total - impuesto));
    console.log("Impuesto: " + impuesto);
    console.log("Total: " + total);
    console.log(mensaje);

    return {
        cliente: c,
        producto: p,
        cantidad: cant,
        descuento: descuento,
        impuesto: impuesto,
        total: total,
        mensaje: mensaje
    };
}

module.exports = { procesarVenta };

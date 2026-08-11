# Antes — God Object

```js
// God Object: la clase Pedido hace TODO en un solo método de ~40 líneas.

class Pedido {
  constructor(cliente, items) {
    this.cliente = cliente;
    this.items = items; // [{ nombre, precio, cantidad, stockDisponible }]
  }

  procesar() {
    // 1) Validar stock
    for (const item of this.items) {
      if (item.cantidad > item.stockDisponible) {
        throw new Error(`Sin stock suficiente de ${item.nombre}`);
      }
    }

    // 2) Calcular total con ISV (15% Honduras)
    let subtotal = 0;
    for (const item of this.items) {
      subtotal += item.precio * item.cantidad;
    }
    const isv = subtotal * 0.15;
    const total = subtotal + isv;

    // 3) Guardar en la base de datos (SQL clavado aquí adentro)
    const conexion = new ConexionMySQL("localhost", "root", "1234", "tienda");
    conexion.ejecutar(
      `INSERT INTO pedidos (cliente, total) VALUES ('${this.cliente.nombre}', ${total})`
    );
    const pedidoId = conexion.ultimoIdInsertado();

    // 4) Imprimir el ticket
    console.log("=========== TICKET ===========");
    console.log(`Pedido #${pedidoId}`);
    console.log(`Cliente: ${this.cliente.nombre}`);
    for (const item of this.items) {
      console.log(`${item.cantidad} x ${item.nombre} .... ${item.precio * item.cantidad}`);
    }
    console.log(`Subtotal: L ${subtotal}`);
    console.log(`ISV (15%): L ${isv}`);
    console.log(`TOTAL: L ${total}`);
    console.log("==============================");

    // 5) Enviar WhatsApp al cliente (HTTP clavado aquí adentro)
    const http = new ClienteHTTP();
    http.post("https://api.whatsapp.com/send", {
      telefono: this.cliente.telefono,
      mensaje: `Hola ${this.cliente.nombre}, tu pedido #${pedidoId} por L ${total} fue recibido. ¡Gracias!`
    });

    return pedidoId;
  }
}
```

Este método tiene **cinco motivos distintos para cambiar**: la regla de stock,
la tasa de ISV, el motor de base de datos, el formato del ticket y el canal de
notificación. Todo mezclado en una sola clase.
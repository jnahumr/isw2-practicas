# Después — Refactor aplicando S y D

```js
// Refactor: S (una responsabilidad por pieza) + D (persistencia y
// notificación se inyectan como abstracciones, no se instancian adentro).

// ---------- Entidad (solo datos) ----------
class Pedido {
  constructor(cliente, items) {
    this.cliente = cliente;
    this.items = items;
  }
}

// ---------- S: cada pieza, una sola responsabilidad ----------

class ValidadorStock {
  validar(items) {
    for (const item of items) {
      if (item.cantidad > item.stockDisponible) {
        throw new Error(`Sin stock suficiente de ${item.nombre}`);
      }
    }
  }
}

class CalculadoraTotal {
  constructor(tasaIsv = 0.15) { this.tasaIsv = tasaIsv; }
  calcular(items) {
    const subtotal = items.reduce((acc, i) => acc + i.precio * i.cantidad, 0);
    const isv = subtotal * this.tasaIsv;
    return { subtotal, isv, total: subtotal + isv };
  }
}

class GeneradorTicket {
  generar(pedido, montos, pedidoId) {
    let t = `Pedido #${pedidoId} - ${pedido.cliente.nombre}\n`;
    for (const i of pedido.items) {
      t += `${i.cantidad} x ${i.nombre} .... ${i.precio * i.cantidad}\n`;
    }
    t += `Subtotal: L ${montos.subtotal}\nISV: L ${montos.isv}\nTOTAL: L ${montos.total}`;
    return t;
  }
}

// ---------- D: contratos (abstracciones / puertos) ----------
// El orquestador depende de ESTAS interfaces, no de MySQL ni WhatsApp.
// interface RepositorioPedidos { guardar(pedido, total) -> pedidoId }
// interface NotificadorCliente { notificar(cliente, mensaje) }

// ---------- Detalles concretos (implementaciones) ----------

class RepositorioPedidosMySQL /* implements RepositorioPedidos */ {
  constructor(conexion) { this.conexion = conexion; }
  guardar(pedido, total) {
    this.conexion.ejecutar(
      `INSERT INTO pedidos (cliente, total) VALUES ('${pedido.cliente.nombre}', ${total})`
    );
    return this.conexion.ultimoIdInsertado();
  }
}

class NotificadorWhatsApp /* implements NotificadorCliente */ {
  constructor(http) { this.http = http; }
  notificar(cliente, mensaje) {
    this.http.post("https://api.whatsapp.com/send", { telefono: cliente.telefono, mensaje });
  }
}

// ---------- Orquestador: recibe TODO inyectado ----------

class ProcesadorPedido {
  constructor(validador, calculadora, generadorTicket, repositorio, notificador) {
    this.validador = validador;
    this.calculadora = calculadora;
    this.generadorTicket = generadorTicket;
    this.repositorio = repositorio;   // <-- D: abstracción inyectada
    this.notificador = notificador;   // <-- D: abstracción inyectada
  }

  procesar(pedido) {
    this.validador.validar(pedido.items);
    const montos = this.calculadora.calcular(pedido.items);
    const pedidoId = this.repositorio.guardar(pedido, montos.total);
    const ticket = this.generadorTicket.generar(pedido, montos, pedidoId);
    this.notificador.notificar(
      pedido.cliente,
      `Hola ${pedido.cliente.nombre}, tu pedido #${pedidoId} por L ${montos.total} fue recibido.`
    );
    return { pedidoId, ticket };
  }
}

// ---------- Composición: aquí se "cablean" las dependencias ----------
const procesador = new ProcesadorPedido(
  new ValidadorStock(),
  new CalculadoraTotal(0.15),
  new GeneradorTicket(),
  new RepositorioPedidosMySQL(new ConexionMySQL(/* ... */)),
  new NotificadorWhatsApp(new ClienteHTTP())
);
// procesador.procesar(new Pedido(cliente, items));
```

Clave del diseño: `ProcesadorPedido` **no menciona** ni MySQL ni WhatsApp;
solo recibe abstracciones por su constructor. Cambiar de motor de BD o de canal
de notificación no obliga a tocar la lógica del pedido.
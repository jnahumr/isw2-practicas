# Notas — Principios aplicados

## S — Single Responsibility (SRP), Principio Aplicado el #2 del decálogo ("una función, una responsabilidad")
1. Antes, Pedido validaba, calculaba, guardaba, imprimía y notificaba: 5 motivos de cambio en una sola pieza.
2. Separé cada tarea en su clase (ValidadorStock, CalculadoraTotal, GeneradorTicket, repositorio y notificador).
3. Ahora cada clase tiene un único motivo de cambio: si cambia la tasa de ISV, solo toco CalculadoraTotal.
4. Baja el acoplamiento y cada pieza se puede probar de forma aislada.
5. El método de 40 líneas quedó como un orquestador legible que solo coordina el flujo.

## D — Dependency Inversion (DIP), principio aplicado el #9 del decálogo ("diseñá para el cambio: dependencias hacia adentro")
1. Antes, Pedido instanciaba directo ConexionMySQL y ClienteHTTP (dependía de detalles concretos).
2. Ahora ProcesadorPedido depende de las abstracciones RepositorioPedidos y NotificadorCliente.
3. Las implementaciones concretas (MySQL, WhatsApp) se inyectan por constructor.
4. Puedo cambiar MySQL por Postgres, o WhatsApp por email, sin tocar la lógica de negocio.
5. En pruebas puedo inyectar un repositorio y un notificador falsos (mocks) sin BD real.
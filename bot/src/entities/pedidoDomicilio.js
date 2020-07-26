
class PedidoDomicilio {
  constructor(contenido, direccion, precio, idUsuario, idConversacion) {
      this.contenido = contenido;
      this.direccion = direccion;
      this.precio = precio;
      //this data is util for reply
      this.idUsuario = idUsuario;
      this.idConversacion = idConversacion;
  }
}

module.exports.PedidoDomicilio = PedidoDomicilio;
//MODAL
$('.modal-trigger').leanModal();
$("#msj").hide();

$(function () {
	var compraComercio = $("#compra_comercio"),
		compraPrecio = $("#compra_precio"),
		compraProducto = $("#compra_producto"),
		compraCliente = $("#compra_cliente"),
		compraCantidad = $("#compra_cantidad"),
		compraFecha = $("#compra_fecha"),
		compraBtnIniciar = $("#compra_iniciar"),
		compraBtnGuardar = $("#compra_guardar"),
		tablaBodyPedidos = $("#tabla_body_pedidos"),
		divPedidos = $("#div_pedidos");

	compraManager.init({
		compraComercio: compraComercio,
		compraPrecio: compraPrecio,
		compraCliente: compraCliente,
		compraCantidad: compraCantidad,
		compraProducto: compraProducto,
		compraFecha: compraFecha,
		compraBtnIniciar: compraBtnIniciar,
		compraBtnGuardar: compraBtnGuardar,
		tablaBodyPedidos: tablaBodyPedidos,
		divPedidos: divPedidos,
	});

	$('#compra_guardar').click(function(event){
		event.preventDefault();
		compraManager.savePedido();
	});

	$(tablaBodyPedidos).on('click','.remove_pedido',function(event){
		event.preventDefault();
		pedido_id = $(this).attr('id');
		$("#modal"+pedido_id).hide();
		$("#modal"+pedido_id).parent().append('<i class="fa fa-spinner fa-spin fa-lg fa-fw"></i>');
		fila = $(this).parent().parent().parent().parent();
		compraManager.removePedido(pedido_id,fila);
	});



	$("#msj").click(function(event){
		$(this).hide(500);
	});

	$("#compra_iniciar").click(function(event){
		compraManager.save();
	});

});

var compraManager = {
	init: function(opt) {
		this.opt = opt;
	},
	save: function() {
		var opt = this.opt;
		var valid = true;
		var msj = $("#msj");
		if (opt.compraPrecio.val() == "") {
			var alert_box_error = $("#alert_box_error");
			alert_box_error.show();
			msj.show();
			msj.html("No se selecciono un precio.");
			valid = false;
		}
		if (opt.compraComercio.val() == "") {
			var alert_box_error = $("#alert_box_error");
			alert_box_error.show();
			msj.show();
			msj.html("No se selecciono un comercio.");
			valid = false;
		}
		if (valid) {
			$("#form_compra").submit();
		}
	},
	savePedido: function() {
		var msj = $("#msj");
		var opt = this.opt;
		var valid = true;
		var current_user_id = opt.compraCliente.val();
		if (opt.compraProducto.val() == "") {
			msj.show();
			msj.attr('class','card red white-text');
			msj.html("<h5>Ingrese un producto.</h5>");
			valid = false;
		}
		if (opt.compraCantidad.val() == "") {
			msj.show();
			msj.attr('class','card red white-text');
			msj.html("<h5>Ingrese una cantidad.</h5>");
			valid = false;
		}
		if ((opt.compraCantidad.val() < 1) || (opt.compraCantidad.val() > 15)) {
			msj.show();
			msj.attr('class','card red white-text');
			msj.html("<h5>Ingrese una cantidad entre 1 y 15.</h5>");
			valid = false;
		}
		if (valid) {
			$('#compra_guardar').hide();
			$('#compra_guardar').parent().append('<i class="fa fa-spinner fa-spin fa-3x fa-fw" id="compra_loading" style="margin-left:20px; margin-top: 6px;"></i>');
			$.ajax({
				url: Routing.generate('compra_pedido_save'),
				type: 'POST',
				data: {
					cliente: opt.compraCliente.val(),
					producto: opt.compraProducto.val(),
					cantidad: opt.compraCantidad.val(),
					compra: $("#compra_id").val()
				},
				success: function(data, txt, jqXHR) {
					opt.compraCantidad.empty();
					if (jqXHR.status == 204) {
						msj.show();
						msj.attr('class','card red white-text');
						msj.html("<h5>Hay un problema con los datos solicitados.</h5>");
					}
					if (jqXHR.status == 200) {
						opt.tablaBodyPedidos.empty();
						var data1 = $.parseJSON(data.pedidos);
						$.each(data1, function( index, value ) {
							enlace = '';
							if ((value.cliente.id == current_user_id) && (value.pago == false)) {
								enlace = `
										<a class="modal-trigger" href="#modal-trigger`+value.id+`" id="modal`+value.id+`"><i class="material-icons">delete</i></a>
										<div id="modal-trigger`+value.id+`" class="modal" style="z-index: 1003; opacity: 1; transform: scaleX(1); top: 10%;">
											<div class="modal-content">
												<h4>¿ELIMINAR?</h4>
												<p>Seguro desea eliminar `+ value.producto.descripcion +` x `+ value.cantidad +` unidades.</p>
											</div>
											<div class="modal-footer">
												<a href="#!" class=" modal-action modal-close waves-effect waves-green btn-flat remove_pedido" id="`+value.id+`" >Eliminar</a>
												<a href="#!" class=" modal-action modal-close waves-effect waves-green btn-flat">Cancelar</a>
											</div>
										</div>
								`;
							}
							if ((value.cliente.id == current_user_id) && (value.pago == true)) {
								enlace = '<div class="chip green white-text">Pago</div>';
							}
							opt.tablaBodyPedidos.append("<tr><td>" + value.cliente.apellido +', ' + value.cliente.nombre + "</td><td>" + value.producto.descripcion + "</td><td>" + value.cantidad + "</td><td>"+enlace+"</td></tr>");
							$('.modal-trigger').leanModal();
						});
						$("#precio").html(data.precio);
						msj.show();
						msj.attr('class','card green white-text');;
						msj.html("<h5>Se cargo el pedido.</h5>");
						$("#compra_loading").remove();
						$('#compra_guardar').show();
					}
				},
				error: function(jqXHR) {
					if (jqXHR.status == 409) {
						msj.show();
						msj.attr('class','card red white-text');
						msj.html("<h5>Ha ocurrido un error. La compra se encuentra finalizada.</h5>");
					} else {
						msj.show();
						msj.attr('class','card red white-text');
						msj.html("<h5>Ha ocurrido un error. Vuelva a intentarlo más tarde.</h5>");
					}
					$("#compra_loading").remove();
					$('#compra_guardar').show();
				}
			});
		}
	},
	removePedido: function(pedidoId, tr) {
		var msj = $("#msj");
		$.ajax({
			url: Routing.generate('remove_pedido'),
			type: 'POST',
			data: {
				pedidoId : pedidoId
			},
			success: function(data, txt, jqXHR) {
				if (jqXHR.status == 204) {
					msj.show();
					msj.attr('class','card red white-text');
					msj.html("<h5>Hay un problema con los datos solicitados.</h5>");
				}
				if (jqXHR.status == 200) {
					$("#precio").html(data.precio);
					tr.remove();
				}
				msj.show();
				msj.attr('class','card red white-text');
				msj.html("<h5>Pedido Eliminado.</h5>");
			},
			error: function(jqXHR) {
				if (jqXHR.status == 409) {
					msj.show();
					msj.attr('class','card red white-text');
					msj.html("<h5>Ha ocurrido un error. La compra se encuentra finalizada.</h5>");
				} else {
					msj.show();
					msj.attr('class','card red white-text');
					msj.html("<h5>Ha ocurrido un error. Vuelva a intentarlo más tarde.</h5>");
				}
			}
		});
	}
}

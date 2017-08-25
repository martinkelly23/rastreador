var pedidosActuales;
var cliente;
var botonPagar;

$(function () {
	var tablaBodyPedidos = $("#tablaBodyPedidos"),
			alert_box_error = $("#alert_box_error");
			alert_box_success = $("#alert_box_success");

	pagoManager.init({
		tablaBodyPedidos: tablaBodyPedidos,
		alert_box_error: alert_box_error,
		alert_box_success: alert_box_success,
	});


	$(tablaBodyPedidos).on('click','.pagar',function(event){
		cliente = $(this).attr('clienteId');
		botonPagar = $(this);
		pagoManager.getPedidos(cliente);
		modal = `<div id="modal-trigger" class="modal" style="z-index: 1003; opacity: 1; transform: scaleX(1); top: 10%;">
					<div class="modal-content">
						<div id="contenido-modal"><i class="fa fa-spinner fa-spin fa-2x fa-fw"></i>Cargando pedidos...</div>
						<div class="modal-footer">
							<a href="#!" class=" modal-action modal-close btn waves-effect waves-light " id="pagar_pedidos">Pagar</a>
							<a href="#!" class=" modal-action modal-close waves-effect waves-green btn-flat">Cancelar</a>
						</div>
					</div>
					`;
					$("#modal_container").html(modal);
					$('.modal-trigger').leanModal();
					$("#modal-trigger").openModal();
	});

	$("#modal_container").on('click','#pagar_pedidos',function(event){
		$(".pagar").attr("disabled",true);
		botonPagar.hide();
		botonPagar.parent().append('<i class="fa fa-spinner fa-spin fa-lg fa-fw" id="pago_loading"></i>');
		pagoManager.pagar();
	});

});

function show_mensaje(mensaje, tipo) {
	$("#alert_box_"+tipo).show();
	$("#msj_"+tipo).html(mensaje);
}

var pagoManager = {
	init: function(opt) {
		this.opt = opt;
	},
	pagar: function(){
		var msj;
		var opt = this.opt;
		$.ajax({
			url: Routing.generate('pagar_pedidos'),
			type: 'POST',
			data: {
				pedidos: pedidosActuales
			},
			success: function(data, txt, jqXHR) {
				if (jqXHR.status == 204) {
					show_mensaje("Hay un problema con los datos solicitados.", "error");
				}
				if (jqXHR.status == 200) {
					$("#fila"+cliente).remove();
					show_mensaje("Se han registrado los pagos.", "success");
				}
				$(".pagar").attr("disabled",false);
			},
			error: function(jqXHR) {
				show_mensaje("Hay un problema con los datos solicitados.", "error");
				$(".pagar").attr("disabled",false);
				$("#pago_loading").remove();
				botonPagar.show();

			}
		});
	},
	getPedidos: function(clienteId){
		pedidosActuales = [];
		var msj;
		var opt = this.opt;
		$.ajax({
			url: Routing.generate('get_pedidos'),
			type: 'POST',
			data: {
				cliente: clienteId
			},
			success: function(data, txt, jqXHR) {
				if (jqXHR.status == 204) {
					show_mensaje("Hay un problema con los datos solicitados.", "error");
				}
				if (jqXHR.status == 200) {
					pedidos = $.parseJSON(data.pedidos);

					//modal = `<div id="modal-trigger" class="modal" style="z-index: 1003; opacity: 1; transform: scaleX(1); top: 10%;">
					//<div class="modal-content">
					modal = `<table class="responsive-table striped centered">
					<thead>
					<tr>
						<th>Pedidos</th>
						<th>Cantidad</th>
						<th>Precio</th>
					</tr>
					</thead>
					`;
					cantTotal = 0;
					$.each(pedidos, function( index, value ) {
						modal += '<tr><td>' + value.producto.descripcion +` </td><td> `+ value.cantidad + ' </td><td> $'+(value.cantidad*data.precio)+' </td>';
						cantTotal += value.cantidad;
						pedidosActuales.push(value.id); 
					});
					modal +=`
					<tr style="background-color:#77b5f5"><td><b>Monto a pagar</b></td><td><b>`+cantTotal+`</b></td><td><b>$`+ (cantTotal*data.precio) +`</b></td></tr>
					</table></div>`;
					$("#contenido-modal").html(modal);
					
				}
			},
			error: function(jqXHR) {
				show_mensaje("Hay un problema con los datos solicitados.", "error");
			}
		});
	}
}

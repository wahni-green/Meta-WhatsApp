// Copyright (c) 2022, Wahni IT Solutions and contributors
// For license information, please see license.txt

frappe.ui.form.on("Sales Invoice", {
	refresh: function (frm) {
		if (!frm.doc.__islocal) {
			frm.add_custom_button(__("Whatsapp Message"), () => {
				send_sms(frm);
			}, __("Send"));
		}

	}
})

function send_sms(frm) {
	let d = new frappe.ui.Dialog({
		title: __("Whatsapp Message"),
		fields: [
			{
				label: __("To"),
				fieldtype: "Data",
				reqd: 1,
				fieldname: "recipient",
				default: frm.doc.contact_mobile ? frm.doc.contact_mobile : "",
			},
			{
				label: __("Template"),
				fieldtype: "Link",
				reqd: 1,
				options: "WhatsApp Message Template",
				fieldname: "template",
				get_query: function () {
					return {
						filters: {
							"document": frm.doc.doctype
						}
					};
				}
			},
			{
				label: __("Select Print Format"),
				fieldtype: "Link",
				fieldname: "print_format",
				options: "Print Format",
				reqd: 1,
				get_query: function () {
					return {
						filters: {
							'doc_type': frm.doc.doctype,
							'disabled': 0
						}
					}
				}
			}
		],
		primary_action_label: __("Send"),
		primary_action(values) {
			frappe.call({
				method: "meta.tasks.send_sales_msg",
				args: {
					"data": values,
					"doctype": frm.doc.doctype,
					"docname": frm.doc.name,
					"customer": frm.doc.customer
				},
				freeze: true,
				freeze_message: (__('Sending WhatsApp Message.!!'))
			});
			d.hide();
		},
		secondary_action_label: __("Discard"),
		secondary_action() {
			d.hide();
		},
		minimizable: true
	});
	d.show();
}

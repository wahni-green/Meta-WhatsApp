// Copyright (c) 2022, Niyaz and contributors
// For license information, please see license.txt

frappe.ui.form.on('WhatsApp Cloud API Settings', {
	refresh: function (frm) {
		if (frm.doc.access_token && frm.doc.phone_number_id) {
			frm.add_custom_button('Verify Token', () => {
				frappe.prompt({
					label: 'WhatsApp Number',
					fieldname: 'phone_number',
					fieldtype: 'Data',
					default: "919605440757",
					reqd: 1
				}, (values) => {
					send_verify_message(frm, values.phone_number)
				})
			}).addClass("btn-primary");
		}
	}
});

function send_verify_message(frm, phone_number) {
	frm.call({
		method: 'send_test_message',
		args: {
			"phone_number": phone_number
		},
		callback: function (r) {
			if (r && r.message) {
				frappe.msgprint({
					title: __('Success'),
					message: __("WhatsApp Account successfully configured. <br> Message ID : {0}", [r.message])
				});
			}
		},
		freeze: true,
		freeze_message: ('Sending WhatsApp test Message.!!')
	});
}
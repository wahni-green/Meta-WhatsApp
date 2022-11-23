frappe.provide('frappe.ui.form');
frappe.provide('frappe.model.docinfo');

$(document).ready(function () {
    frappe.ui.form.Controller = Class.extend({
        init: function (opts) {
            $.extend(this, opts);
            let ignored_doctype_list = ["DocType", "Customize Form"]
            frappe.ui.form.on(this.frm.doctype, {
                refresh(frm) {
                    if (!ignored_doctype_list.includes(frm.doc.doctype)) {
                        frm.page.add_menu_item(__('Send via WhatsApp'), function () { send_sms(frm); });
                    }
                }
            });
        }
    });
});

function send_sms(frm) {
    if (frm.is_dirty()) {
        frappe.throw(__('You have unsaved changes. Save before send.'))
    }
    else {
        create_recipients_dailog(frm);
    }
}

function create_recipients_dailog(frm) {
    let d = new frappe.ui.Dialog({
        title: frm.doc.doctype + " : " + frm.doc.name,
        fields: [
            {
                label: __("To"),
                fieldtype: "MultiSelect",
                reqd: 1,
                fieldname: "recipients",
                default: "919605440757",
            },
            {
                label: __("Message"),
                fieldtype: "Small Text",
                fieldname: "message",
                length: 700,
                default: "Hellow World!"
            },
            {
                label: __("Attach Document Print"),
                fieldtype: "Check",
                fieldname: "attach_document_print"
            },
            {
                label: __("Select Print Format"),
                fieldtype: "Link",
                fieldname: "print_format",
                options: "Print Format",
                depends_on: "eval: doc.attach_document_print",
                mandatory_depends_on: "eval: doc.attach_document_print",
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
            dialog_primary_action(frm, values)
            d.hide();
        },
        secondary_action_label: __("Discard"),
        secondary_action() {
            d.hide();
        },
        size: 'large',
        minimizable: true
    });
    d.show();
}

function dialog_primary_action(frm, values) {
    frappe.call({
        method: "meta.tasks.send_whatsapp_msg",
        args: {
            "doctype": frm.doc.doctype,
            "docname": frm.doc.name,
            "args": values
        },
        freeze: true,
        freeze_message: ('Sending WhatsApp Message.!!')
    });
}
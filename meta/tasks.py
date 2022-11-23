import json
import re

import frappe
from frappe import _
from frappe.utils import get_url

from meta.pdf_utils import create_folder, get_pdf_data, save_and_attach
from meta.whatsapp_utils import WhatsAppAPI


@frappe.whitelist()
def send_sales_msg(data, doctype, docname, customer):
    if data and isinstance(data, str):
        data = json.loads(data)
    recipient = re.sub("[^0-9]", "", data["recipient"])
    template = data["template"]
    print_format = data["print_format"] if "print_format" in data else "Standard"

    if print_format:
        doctype = doctype
        docname = docname
        title = docname
        print_format = print_format
        doctype_folder = create_folder(_(doctype), "Home")
        title_folder = create_folder(title, doctype_folder)
        pdf_data = get_pdf_data(doctype, docname, print_format)
        file_ref = save_and_attach(pdf_data, doctype, docname, title_folder)
        pdf_link = file_ref.file_url
        file_name = file_ref.file_name
        pdf_url = f"{get_url()}:8002{pdf_link}"
        # pdf_url = get_url(pdf_link)

    components_dict = [
        {
            "type": "header",
            "parameters": [
                {
                    "type": "document",
                    "document": {"link": pdf_url, "filename": file_name},
                }
            ],
        },
        {
            "type": "body",
            "parameters": [
                {"type": "text", "text": customer},
                {"type": "text", "text": file_name},
            ],
        },
    ]

    WhatsAppAPI().send_msg(
        recipient=recipient, template=template, components_dict=components_dict
    )

import frappe
from frappe.core.doctype.file.file import create_new_folder
from frappe.utils.file_manager import save_file


def create_folder(folder, parent):
    """Make sure the folder exists and return it's name."""
    new_folder_name = "/".join([parent, folder])

    if not frappe.db.exists("File", new_folder_name):
        create_new_folder(folder, parent)

    return new_folder_name

def get_pdf_data(doctype, name, print_format=None):
    """Document -> HTML -> PDF."""
    if print_format:
        html = frappe.get_print(doctype, name, print_format)
    else:
        html = frappe.get_print(doctype, name)
    return frappe.utils.pdf.get_pdf(html)

def save_and_attach(content, to_doctype, to_name, folder):
    """
    Save content to disk and create a File document.
    File document is linked to another document.
    """
    file_name = "{}.pdf".format(to_name.replace(" ", "-").replace("/", "-"))
    file_url = save_file(file_name, content, to_doctype, to_name, folder=folder, is_private=0)
    return file_url
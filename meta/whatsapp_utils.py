import re

import frappe
import requests
from frappe.utils import nowdate
from frappe.utils.password import get_decrypted_password


class WhatsAppAPI:
	def __init__(self):
		self.access_token = get_decrypted_password("WhatsApp Cloud API Settings", "WhatsApp Cloud API Settings", "access_token")
		self.api_base_url = frappe.db.get_single_value("WhatsApp Cloud API Settings", "base_url")
		self.phone_number_id = frappe.db.get_single_value("WhatsApp Cloud API Settings", "phone_number_id")
		self.endpoint = f"{self.api_base_url}/{self.phone_number_id}/messages"

	def send_msg(self, recipient, template, components_dict):
		recipient = re.sub('[^0-9]', '', recipient)
		response_data = {
			"messaging_product": "whatsapp",
			"to": recipient,
			"type": 'template',
		}

		response_data["template"] = {
			"name": frappe.db.get_value("WhatsApp Message Template", template, "template_name"),
			"language": {
				"code": frappe.db.get_value("WhatsApp Message Template", template, "language_code")
			},
			"components": components_dict
		}

		response = requests.post(
			self.endpoint,
			json=response_data,
			headers={
				"Authorization": "Bearer " + self.access_token,
				"Content-Type": "application/json",
			},
		)

		if response.ok:
			id = response.json().get("messages")[0]["id"]
			self.create_sms_log(recipient, template, id)
			frappe.msgprint(str("Your message has been sent successfully"))
		else:
			frappe.msgprint(response.json().get("error").get("message"))

	def create_sms_log(self, recipient, template, id):
		sl = frappe.new_doc("SMS Log")
		sl.sent_on = nowdate()
		sl.sender_name = frappe.session.user
		sl.message = template
		sl.requested_numbers = id
		sl.no_of_sent_sms = 1
		sl.sent_to = recipient
		sl.flags.ignore_permissions = True
		sl.save()
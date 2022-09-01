from setuptools import setup, find_packages

with open("requirements.txt") as f:
	install_requires = f.read().strip().split("\n")

# get version from __version__ variable in meta/__init__.py
from meta import __version__ as version

setup(
	name="meta",
	version=version,
	description="Cloud API Integration",
	author="Niyaz",
	author_email="niyaz@wahni.com",
	packages=find_packages(),
	zip_safe=False,
	include_package_data=True,
	install_requires=install_requires
)

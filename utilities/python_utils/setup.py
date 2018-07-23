from setuptools import setup
import sys

if sys.version_info < (3,6):
    sys.exit('Python>=3.6 required.')

setup(
    name='patientpop_patientpop_utils',
    version='0.1',
    url='https://www.patientpop.com',
    license='MIT',
    author='Jason Lane',
    author_email='jason.lane@patientpop.com',
    description='Set of utilities for Patientpop Python development',
    install_requires=[
        'boto3'
    ]
)

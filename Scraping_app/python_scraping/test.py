import requests

base_url = 'http://localhost:3000/content/rabies'

response_disease = requests.get(base_url).json()

print('name')

print(response_disease)
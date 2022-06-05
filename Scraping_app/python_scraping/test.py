import requests
import re

def cleanhtml(raw_html):
  cleanimg = re.compile('<img .*?>')
  cleantextimg = re.sub(cleanimg, '', raw_html)
  cleana = re.compile('<a .*?>')
  cleantexta = re.sub(cleana, '', cleantextimg)
  cleanaend = re.compile('((<\/)a(>))')
  cleantextaend = re.sub(cleanaend, '', cleantexta)
  return cleantextaend

base_url = 'http://localhost:3000/content/rabies'

response_disease = requests.get(base_url).json()

result = cleanhtml(response_disease['content'])

print(result)
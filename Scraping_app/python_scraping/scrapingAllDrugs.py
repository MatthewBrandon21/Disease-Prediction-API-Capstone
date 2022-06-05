import requests
import csv
import datetime
import re

now = datetime.datetime.now()

def cleanhtml(raw_html):
  cleanimg = re.compile('<img .*?>')
  cleantextimg = re.sub(cleanimg, '', raw_html)
  cleana = re.compile('<a .*?>')
  cleantexta = re.sub(cleana, '', cleantextimg)
  cleanaend = re.compile('((<\/)a(>))')
  cleantextaend = re.sub(cleanaend, '', cleantexta)
  return cleantextaend

write = csv.writer(open('result_data/drugs.csv', 'w', newline=''))
table_header = ['name', 'other_name', 'slug', 'desc', 'excerpt', 'img', 'updatedAt', 'createdAt']
write.writerow(table_header)

base_url = 'http://localhost:3000/'
drugs_list_url = 'http://localhost:3000/obat'

response_drugs_list = requests.get(drugs_list_url).json()
drugs_list = response_drugs_list['data']

for item in drugs_list:
    name = item['title']
    slug = item['permalink']
    updatedAt = now.strftime("%Y/%m/%d %H:%M:%S")
    createdAt = now.strftime("%Y/%m/%d %H:%M:%S")
    drug_url = base_url + 'content/' + item['permalink']
    response_drug = requests.get(drug_url).json()
    if(requests.get(drug_url).status_code == 200):
        excerpt = 'Summary'
        try:
            excerpt = response_drug['excerpt']
        except:
            excerpt = 'Summary'
        
        desc = 'Description'
        try:
            desc = cleanhtml(response_drug['content'])
        except:
            desc = 'Description'
        
        img = 'https://storage.googleapis.com/diseases-prediction-bucket/diseases-prediction-default-thumbnail.jpg'
        try:
            img = response_drug['img']
        except:
            img = 'https://storage.googleapis.com/diseases-prediction-bucket/diseases-prediction-default-thumbnail.jpg'
        
        write = csv.writer(open('result_data/drugs.csv', 'a', encoding="utf-8", newline=''))
        table_header = [name, name, slug, desc, excerpt, img, updatedAt, createdAt]
        write.writerow(table_header)
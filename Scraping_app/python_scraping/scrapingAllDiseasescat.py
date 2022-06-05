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

diseases_cat = ['virus', 'kanker', 'jantung', 'otak', 'psikologi', 'defisiensi', 'infeksi', 'mata', 'pencernaan']

base_diseases_list_url = 'http://localhost:3000/penyakitcat/'

write = csv.writer(open('result_data/disease_category_link.csv', 'w', newline=''))
table_header = ['disease_name', 'disease_slug', 'disease_category_slug', 'updatedAt', 'createdAt']
write.writerow(table_header)

for category in diseases_cat:
    diseases_list_url = 'http://localhost:3000/penyakitcat/' + category
    response_diseases_list = requests.get(diseases_list_url).json()
    diseases_list = response_diseases_list['data']
    for item in diseases_list:
        name = item['title']
        slug = item['permalink']
        updatedAt = now.strftime("%Y/%m/%d %H:%M:%S")
        createdAt = now.strftime("%Y/%m/%d %H:%M:%S")
        write = csv.writer(open('result_data/disease_category_link.csv', 'a', encoding="utf-8", newline=''))
        table_header = [name, slug, category, updatedAt, createdAt]
        write.writerow(table_header)
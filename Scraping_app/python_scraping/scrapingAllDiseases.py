import requests
import csv
import datetime

now = datetime.datetime.now()

write = csv.writer(open('result_data/diseases.csv', 'w', newline=''))
table_header = ['name', 'other_name', 'slug', 'desc', 'excerpt', 'img', 'updatedAt', 'createdAt']
write.writerow(table_header)

base_url = 'http://localhost:3000/'
diseases_list_url = 'http://localhost:3000/penyakit'

response_diseases_list = requests.get(diseases_list_url).json()
diseases_list = response_diseases_list['data']

for item in diseases_list:
    name = item['title']
    slug = item['permalink']
    updatedAt = now.strftime("%Y/%m/%d %H:%M:%S")
    createdAt = now.strftime("%Y/%m/%d %H:%M:%S")
    disease_url = base_url + 'content/' + item['permalink']
    response_disease = requests.get(disease_url).json()
    if(requests.get(disease_url).status_code == 200):
        excerpt = response_disease['excerpt']
        desc = response_disease['content']
        img = response_disease['img']
        write = csv.writer(open('result_data/diseases.csv', 'a', encoding="utf-8", newline=''))
        table_header = [name, name, slug, desc, excerpt, img, updatedAt, createdAt]
        write.writerow(table_header)
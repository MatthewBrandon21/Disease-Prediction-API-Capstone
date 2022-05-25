import pandas as pd
import re
import unidecode
import requests
import csv
import datetime

now = datetime.datetime.now()

write = csv.writer(open('result_data/diseases_dataset.csv', 'w', newline=''))
table_header = ['name', 'other_name', 'slug', 'desc', 'excerpt', 'img', 'updatedAt', 'createdAt']
write.writerow(table_header)

base_url = 'http://localhost:3000/'

def slugify(text):
    text = unidecode.unidecode(text).lower()
    return re.sub(r'[\W_]+', '-', text)

drugReviews = pd.read_csv('drugsComTrain_raw.tsv', delimiter='\t',encoding='utf-8')

diseases= drugReviews['condition']
noduplicate_diseases = diseases.drop_duplicates(keep='first')

for item in noduplicate_diseases:
    name = item
    try:
        slug = slugify(item)
    except:
        pass
    updatedAt = now.strftime("%Y/%m/%d %H:%M:%S")
    createdAt = now.strftime("%Y/%m/%d %H:%M:%S")
    disease_url = base_url + 'content/' + slug
    response_disease = requests.get(disease_url).json()
    if(requests.get(disease_url).status_code == 200):
        excerpt = 'default excerpt'
        try:
            excerpt = response_disease['excerpt']
        except:
            excerpt = 'default excerpt'
        
        desc = 'default content'
        try:
            desc = response_disease['content']
        except:
            desc = 'default content'
        

        img = 'default.jpg'
        try:
            img = response_disease['img']
        except:
            img = 'default.jpg'
        write = csv.writer(open('result_data/diseases_dataset.csv', 'a', encoding="utf-8", newline=''))
        table_header = [name, name, slug, desc, excerpt, img, updatedAt, createdAt]
        write.writerow(table_header)

drugReviewsTest = pd.read_csv('drugsComTest_raw.tsv', delimiter='\t',encoding='utf-8')

diseasestest= drugReviewsTest['condition']
noduplicate_diseasestest = diseasestest.drop_duplicates(keep='first')

for item in noduplicate_diseasestest:
    name = item
    try:
        slug = slugify(item)
    except:
        pass
    updatedAt = now.strftime("%Y/%m/%d %H:%M:%S")
    createdAt = now.strftime("%Y/%m/%d %H:%M:%S")
    disease_url = base_url + 'content/' + slug
    response_disease = requests.get(disease_url).json()
    if(requests.get(disease_url).status_code == 200):
        excerpt = 'default excerpt'
        try:
            excerpt = response_disease['excerpt']
        except:
            excerpt = 'default excerpt'
        
        desc = 'default content'
        try:
            desc = response_disease['content']
        except:
            desc = 'default content'
        

        img = 'default.jpg'
        try:
            img = response_disease['img']
        except:
            img = 'default.jpg'
        write = csv.writer(open('result_data/diseases_dataset.csv', 'a', encoding="utf-8", newline=''))
        table_header = [name, name, slug, desc, excerpt, img, updatedAt, createdAt]
        write.writerow(table_header)
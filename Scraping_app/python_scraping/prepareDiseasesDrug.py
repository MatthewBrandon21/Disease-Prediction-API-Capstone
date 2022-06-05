import pandas as pd
from googletrans import Translator
import datetime
import re
import unidecode
import csv

now = datetime.datetime.now()

write = csv.writer(open('result_data/disease_drugs_modif.csv', 'w', newline=''))
table_header = ['drugs_name', 'drugs_slug', 'diseases_name', 'diseases_slug', 'createdAt', 'updatedAt']
write.writerow(table_header)

def slugify(text):
    text = unidecode.unidecode(text).lower()
    return re.sub(r'[\W_]+', '-', text)

penterjemah = Translator()

drugReviews = pd.read_csv('drugsComTrainTest_raw.tsv', delimiter = '\t',encoding='utf-8')
noduplicate_diseases = drugReviews.drop_duplicates(subset=['drugName','condition'], keep='first')
clean_diseases = noduplicate_diseases.dropna()

for i in clean_diseases.itertuples():
    drugs_name = i[2]
    drugs_slug = drugs_name
    try:
        drugs_slug = slugify(drugs_name)
    except:
        drugs_slug = drugs_name
    diseases_name = i[3]
    diseases_slug = diseases_name
    try:
        diseases_slug = slugify(diseases_name)
    except:
        diseases_slug = diseases_name
    updatedAt = now.strftime("%Y/%m/%d %H:%M:%S")
    createdAt = now.strftime("%Y/%m/%d %H:%M:%S")
    write = csv.writer(open('result_data/disease_drugs_modif.csv', 'a', encoding="utf-8", newline=''))
    table_header = [drugs_name, drugs_slug, diseases_name, diseases_slug, createdAt, updatedAt]
    write.writerow(table_header)
print("record inserted")

for i in clean_diseases.itertuples():
    drugs_name = i[2]
    drugs_slug = drugs_name
    try:
        drugs_slug = slugify(drugs_name)
    except:
        drugs_slug = drugs_name
    diseases_name = i[3]
    try:
        hasil = penterjemah.translate(i[3], dest='id', src='en')
        diseases_name = hasil.text
    except:
        diseases_name = i[3]
    diseases_slug = diseases_name
    try:
        diseases_slug = slugify(diseases_name)
    except:
        diseases_slug = diseases_name
    updatedAt = now.strftime("%Y/%m/%d %H:%M:%S")
    createdAt = now.strftime("%Y/%m/%d %H:%M:%S")
    write = csv.writer(open('result_data/disease_drugs_modif.csv', 'a', encoding="utf-8", newline=''))
    table_header = [drugs_name, drugs_slug, diseases_name, diseases_slug, createdAt, updatedAt]
    write.writerow(table_header)
print("record inserted")
import pandas as pd
from googletrans import Translator
import mysql.connector
import datetime
import re
import unidecode

now = datetime.datetime.now()

mydb = mysql.connector.connect(
  host="localhost",
  user="root",
  password="",
  database="diseases_prediction_db"
)

def slugify(text):
    text = unidecode.unidecode(text).lower()
    return re.sub(r'[\W_]+', '-', text)

penterjemah = Translator()

drugReviews = pd.read_csv('drugsComTrainTest_raw.tsv', delimiter = '\t',encoding='utf-8')
noduplicate_diseases = drugReviews.drop_duplicates(subset=['drugName','condition'], keep='first')
clean_diseases = noduplicate_diseases.dropna()

for i in clean_diseases.itertuples():
    drugs_name = i[2]
    drugs_slug = i[2]
    try:
        drugs_slug = slugify(drugs_name)
    except:
        drugs_slug = i[2]
    diseases_name = i[3]
    diseases_other_name = i[3]
    try:
        hasil = penterjemah.translate(i[3], dest='id', src='en')
        diseases_name = hasil.text
    except:
        diseases_name = i[3]
    diseases_slug = i[3]
    diseases_other_slug = i[3]
    try:
        diseases_slug = slugify(diseases_name)
    except:
        diseases_slug = i[3]
    try:
        diseases_other_slug = slugify(diseases_other_name)
    except:
        diseases_other_slug = i[3]
    updatedAt = now.strftime("%Y/%m/%d %H:%M:%S")
    createdAt = now.strftime("%Y/%m/%d %H:%M:%S")
    mycursor = mydb.cursor()
    sql = "INSERT INTO diseases_drugs (drugs_name, drugs_slug, diseases_name, diseases_slug, diseases_other_name, diseases_other_slug, createdAt, updatedAt) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"
    val = (drugs_name, drugs_slug, diseases_name, diseases_slug, diseases_other_name, diseases_other_slug, createdAt, updatedAt)
    mycursor.execute(sql, val)
    mydb.commit()
print("record inserted")
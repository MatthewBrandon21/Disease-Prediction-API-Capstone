import pandas as pd
from googletrans import Translator
import mysql.connector

mydb = mysql.connector.connect(
  host="localhost",
  user="root",
  password="",
  database="diseases_prediction_db"
)

penterjemah = Translator()

drugReviews = pd.read_csv('result_data/diseases.csv', delimiter = ',',encoding='utf-8')

for i in drugReviews.itertuples():
    name = i[1]
    other_name = i[2]
    try:
        hasil = penterjemah.translate(i[2], dest='en', src='id')
        other_name = hasil.text
    except:
        other_name = i[2]
    slug = i[3]
    description = i[4]
    excerpt = i[5]
    img = i[6]
    updatedAt = i[7]
    createdAt = i[8]
    mycursor = mydb.cursor()
    sql = "INSERT INTO diseases (name, other_name, slug, description, excerpt, img, createdAt, updatedAt) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"
    val = (name, other_name, slug, description, excerpt, img, createdAt, updatedAt)
    mycursor.execute(sql, val)
    mydb.commit()
print("record inserted")
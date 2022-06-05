import pandas as pd
import mysql.connector

mydb = mysql.connector.connect(
  host="localhost",
  user="root",
  password="",
  database="diseases_prediction_db"
)

drugReviews = pd.read_csv('result_data/disease_drugs_modif.csv', delimiter = ',',encoding='utf-8')
noduplicate_diseases = drugReviews.drop_duplicates(subset=['drugs_name','drugs_slug','diseases_name','diseases_slug'], keep='first')
clean_diseases = noduplicate_diseases.dropna()

for i in clean_diseases.itertuples():
    drugs_name = i[1]
    drugs_slug = i[2]
    diseases_name = i[3]
    diseases_slug = i[4]
    updatedAt = i[5]
    createdAt = i[6]
    mycursor = mydb.cursor()
    sql = "INSERT INTO diseases_drugs (drugs_name, drugs_slug, diseases_name, diseases_slug, createdAt, updatedAt) VALUES (%s, %s, %s, %s, %s, %s)"
    val = (drugs_name, drugs_slug, diseases_name, diseases_slug, createdAt, updatedAt)
    mycursor.execute(sql, val)
    mydb.commit()
print("record inserted")
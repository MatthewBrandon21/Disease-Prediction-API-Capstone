import pandas as pd
import mysql.connector

mydb = mysql.connector.connect(
  host="localhost",
  user="root",
  password="",
  database="diseases_prediction_db"
)

drugReviews = pd.read_csv('result_data/disease_category_link.csv', delimiter = ',',encoding='utf-8')

for i in drugReviews.itertuples():
    disease_name = i[1]
    disease_slug = i[2]
    disease_category_slug = i[3]
    updatedAt = i[4]
    createdAt = i[5]
    mycursor = mydb.cursor()
    sql = "INSERT INTO diseases_categories_link (disease_name, disease_slug, disease_category_slug, createdAt, updatedAt) VALUES (%s, %s, %s, %s, %s)"
    val = (disease_name, disease_slug, disease_category_slug, createdAt, updatedAt)
    mycursor.execute(sql, val)
    mydb.commit()
print("record inserted")
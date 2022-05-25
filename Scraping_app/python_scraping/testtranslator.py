from googletrans import Translator
penterjemah = Translator()
hasil = penterjemah.translate('Halo! kalian apa kabar?', dest='de')
print(hasil.text)
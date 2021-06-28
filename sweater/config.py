import os

from flask import Flask

from sweater.DB import DBChat, DBUser

SECRET_KEY = os.urandom(24)
MAX_AGE = 60 * 60 * 24 * 365  # 1 год

app = Flask(__name__)
app.config['SECRET_KEY'] = SECRET_KEY
app.config['JSON_AS_ASCII'] = False

dbChat = DBChat()
dbUser = DBUser()

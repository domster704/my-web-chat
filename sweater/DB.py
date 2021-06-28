import hashlib
import sqlite3
import os

import psycopg2

tableNameChat = "chat"
tableNameUsers = "users"


class DBChat:
	def __init__(self):
		self.db = psycopg2.connect(
			database="d7fb91qksc0h36",
			user="xrwlvxrfpizqbt",
			password="4f8ca8216680cfde5f604e50d590cf1b44d4b4ff84a56866f54bd91e776b095b",
			host="ec2-63-33-239-176.eu-west-1.compute.amazonaws.com",
			port="5432"
		)
		# self.db = psycopg2.connect("postgres://edudccfcivygbi:910729fe0bdc2ff2e65435194c79db6884be9edb51f5b43a1ff14ba59955c179@ec2-54-74-77-126.eu-west-1.compute.amazonaws.com:5432/d3rm2noa9pim3r")
		# self.db = sqlite3.connect("myDB.db", check_same_thread=False)
		self.cursor = self.db.cursor()
		self.cursor.execute("ROLLBACK")
		self.cursor.execute(f'''CREATE TABLE IF NOT EXISTS {tableNameChat} (
						fromWho TEXT,
						content TEXT,
						toWho TEXT);''')
		self.db.commit()

	def makeMessage(self, fromWho, message, to):
		self.cursor.execute(f'''INSERT INTO {tableNameChat} (fromWho, content, toWho) values(%s, %s, %s)''',
							(fromWho, message, to))
		self.db.commit()

	def showMessage(self, client):
		a = []
		self.cursor.execute(f'SELECT content, toWho FROM {tableNameChat} WHERE fromWho=%s', (client,))
		a.append(self.cursor.fetchall())
		self.cursor.execute(f'SELECT content, fromWho FROM {tableNameChat} WHERE toWho=%s', (client,))
		a.append(self.cursor.fetchall())
		return a

	def showOneMessage(self, fromWho, toWho):
		print(fromWho, toWho)
		try:
			self.cursor.execute(
				f'select content, fromWho from {tableNameChat} where (fromWho=%s and toWho=%s) or (toWho=%s and fromWho=%s)',
				(fromWho, toWho, fromWho, toWho))
			return self.cursor.fetchall()
		except Exception as e:
			print(e)
			return []

	# def changeContent(self, name, password, content):
	# 	"""Меняем контент на новую ссылку и цену"""
	# 	hash_password = self.hashPassword(password)
	# 	try:
	# 		self.cursor.execute(f'''UPDATE {tableName} SET content=%s WHERE name=%s and password=%s''',
	# 							(content, name, hash_password))
	# 		self.db.commit()
	# 		return "True"
	# 	except Exception as e:
	# 		print(e)
	# 		return "False"

	def showALL(self):
		self.cursor.execute("ROLLBACK")
		self.cursor.execute(f"SELECT * from {tableNameChat}")
		return self.cursor.fetchall()


class DBUser:
	def __init__(self):
		self.db = psycopg2.connect(
			database="d4oed1qeuui5rn",
			user="pgdjwlfyejamox",
			password="6a95b359dbd448d573bf8e0a9786d66fb6f99b42dd0834dc07342cb0490f6102",
			host="ec2-54-155-254-112.eu-west-1.compute.amazonaws.com",
			port="5432"
		)
		# self.db = sqlite3.connect('users.db')
		self.cursor = self.db.cursor()
		# self.cursor.execute("ROLLBACK")
		self.cursor.execute(f'''CREATE TABLE IF NOT EXISTS {tableNameUsers} (
						id serial unique PRIMARY KEY,
						name TEXT,
						password TEXT,
						salt TEXT,
						content TEXT NOT NULL,
						username TEXT NULL);''')
		self.db.commit()

	@staticmethod
	def hashPassword(password, salt=None):
		"""Хеширование паролей"""
		pswHash = hashlib.sha1(password.encode('utf-8')).hexdigest()
		return pswHash

	def authorise(self, name, password):
		"""Вход в аккаунт, смотрим пользователя в базе данных"""
		hash_password = self.hashPassword(password)
		self.cursor.execute(f'''SELECT password FROM {tableNameUsers} WHERE name=%s''', (name,))
		cur = self.cursor.fetchone()[0]
		print(cur, hash_password)
		try:
			if cur == hash_password:
				return True
		except Exception as e:
			print(e)
			# print("User doesn't exist")
			return False

	def addUser(self, name, password, username):
		"""Добавление пользователя в базу данных"""
		try:
			hash_password = self.hashPassword(password)
			self.cursor.execute(f"INSERT INTO {tableNameUsers} (name, password, salt, content, username) VALUES (%s, %s, %s, %s, %s)",
								(name, hash_password, "", "", username))
			self.db.commit()

			return self.getId(name, password)
		except:
			return False

	def getNickById(self, id):
		self.cursor.execute(f'select username from {tableNameUsers} where id={id}')
		return self.cursor.fetchone()[0]

	def getId(self, name, password):
		"""Получаем контент (последняя введённая ссылка пользователем + цена)"""
		# self.cursor.execute(f'''SELECT password FROM {tableNameUsers} WHERE name=%s''', (name,))
		try:
			hash_password = self.hashPassword(password)
			self.cursor.execute(f'''SELECT id FROM {tableNameUsers} WHERE name=%s and password=%s''',
								(name, hash_password))
			content = self.cursor.fetchone()[0]
			return str(content)
		except Exception as e:
			print(e)
			return "None"

	def printALL(self):
		# self.cursor.execute("ROLLBACK")
		self.cursor.execute(f"SELECT * from {tableNameUsers}")
		rows = self.cursor.fetchall()
		print(rows)

	def getAllUser(self):
		self.cursor.execute(f'SELECT username from {tableNameUsers}')
		return self.cursor.fetchall()


if __name__ == '__main__':
	db = DBUser()
	# db.addUser('Linker4', 'dan28dan', 'Гриша')
	# db.cursor.execute('delete from users')
	# db.db.commit()
	# print(db.getId('Linker4', 'dan28dan'))
	db.printALL()


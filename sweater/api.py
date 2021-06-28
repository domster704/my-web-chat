from flask import request, jsonify, session, make_response, url_for, redirect

from sweater.config import dbChat, app, dbUser, MAX_AGE


@app.route("/sendMessage", methods=['POST', 'GET'])
def makeMessage():
	if request.method == 'POST':
		data = dict(request.form)
		print(data)
		dbChat.makeMessage(data['from'], data['message'], data['to'])
		return data['message']


@app.route("/showMessage", methods=['POST', 'GET'])
def showMessage():
	if request.method == 'POST':
		data = dict(request.form)
		message_list = dbChat.showOneMessage(data['from'], data['to'])
		return jsonify(message_list)


@app.route('/getAllUser', methods=['GET', 'POST'])
def getAllUser():
	# print(dbUser.getAllUser())
	if request.method == 'GET':
		a = []
		data = dbUser.getAllUser()
		for i in data:
			a.append(i[0])
		print(a)
		return jsonify(tuple(a))


# Пока не используется
@app.route("/changeName", methods=['POST', 'GET'])
def changeName():
	if request.method == 'POST':
		data = dict(request.form)
		session['nick'] = data['name']

		return "OK"


@app.route('/getNewMessage', methods=['POST', 'GET'])
def checkNewMessages():
	if request.method == 'POST':
		data = dict(request.form)
		# print(dbChat.showOneMessage(data['from'], data['to']))
		message_list = dbChat.showOneMessage(data['from'], data['to'])
		if message_list[int(data['messagesSize']):]:
			return jsonify(message_list[int(data['messagesSize']):])
		else:
			return 'similar'


@app.route('/register', methods=['POST', 'GET'])
def checkReg():
	if request.method == 'POST':
		data = request.form
		var = dbUser.addUser(data['login'], data['psw1'], data['nick'])
		print(var)
		if var:
			session['idUser'] = int(var)
			res = make_response(redirect(url_for('main', idUser=session['idUser'])))
			res.set_cookie('logged', 'yes')
			res.set_cookie('id', str(session['idUser']), max_age=MAX_AGE)
			dbUser.printALL()
			return res
		else:
			return redirect(url_for('register_page'))


@app.route('/login', methods=['POST', 'GET'])
def checkLogin():
	if request.method == 'POST':
		data = request.form
		var = dbUser.authorise(data['login'], data['psw1'])
		if var is True:
			if 'idUser' not in session:
				session['idUser'] = int(dbUser.getId(data['login'], data['psw1']))

			res = make_response(redirect(url_for('main', idUser=session['idUser'])))
			res.set_cookie('logged', 'yes', max_age=MAX_AGE)
			res.set_cookie('id', str(session['idUser']), max_age=MAX_AGE)
			return res
		else:
			return redirect(url_for('register_page'))

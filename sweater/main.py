from flask import render_template

from sweater.api import *


@app.route("/")
def register_page():
	# if request.cookies.get('logged'):
	# 	if request.cookies.get('logged') == 'yes':
	# 		return redirect('main')
	return render_template('auth.html')


@app.route("/profile/<int:idUser>/messages")
def main(idUser):
	global currentName
	if request.cookies.get('id'):
		session['idUser'] = int(request.cookies.get('id'))

	if 'idUser' in session and session['idUser'] == idUser:
		session['nick'] = dbUser.getNickById(int(session['idUser']))
		message_list = dbChat.showMessage(session['nick'])

		listNameTo = set()
		for i in message_list[0]:
			listNameTo.add(i[1])

		listNameFrom = set()
		for i in message_list[1]:
			listNameFrom.add(i[1])

		listName = listNameTo | listNameFrom

		allUsers = []
		for i in dbUser.getAllUser():
			allUsers.append(i[0])

		return render_template('index.html',
							   name=session['nick'],
							   names=listName,
							   allUsers=allUsers)
	else:
		return redirect(url_for('register_page'))


if __name__ == "__main__":
	app.run(host="0.0.0.0", port=80, debug=True)

var net = require('net')
var fs = require('fs')
var colors = require('colors')
var server = net.createServer()
var contacts = JSON.parse(fs.readFileSync('./contacts.json'))

server.on('connection', function(client) {
	console.log('client connected')
	client.write(colors.rainbow('Welcome to Contacts 2.0'))
	client.write("\n")
	client.setEncoding('utf8')
	client.on('data', function(stringFromClient) {

		var clientRequestArray = stringFromClient.split(" ")

		function help() {
			client.write(colors.green('adding contact syntax: a name phoneNumber email\n'))
			client.write(colors.blue('display contact syntax: d name\n'))
			client.write(colors.red('remove contact syntax: r name\n'))
			client.write(colors.rainbow('\nHelp displayed\n'))
			client.end()
		}

		function displayContact() {
			var nameToShow = clientRequestArray[1].trim()
			for (var i = 0; i < contacts.length; i++) {
				if (contacts[i].name === nameToShow) {
					client.write(colors.green('Name: ' + contacts[i].name + '\n'))
					client.write(colors.blue('Number: ' + contacts[i].number) + '\n')
					client.write(colors.yellow('email: ' + contacts[i].email) + '\n')
				}
			}
			fs.writeFile('./contacts.json', JSON.stringify(contacts), function(err) {
				if (err) console.log(err)
			})
			client.write(colors.rainbow("Contact displayed\n"))
			client.end()
		}

		function addContact() {
			var nameToAdd = clientRequestArray[1].trim()
			var numberToAdd = clientRequestArray[2].trim()
			var emailToAdd = clientRequestArray[3].trim()
			contacts.push({
				name: nameToAdd,
				number: numberToAdd,
				email: emailToAdd
			})
			fs.writeFile('./contacts.json', JSON.stringify(contacts), function(err) {
				if (err) console.log(err)
			})
			client.write(colors.green("Contact added\n"))
			client.end()
		}

		function removeContact() {
			var nameToRemove = clientRequestArray[1].trim()
			for (var i = 0; i < contacts.length; i++) {
				if (contacts[i].name === nameToRemove) {
					contacts.splice(i, 1)
				}
			}
			fs.writeFile('./contacts.json', JSON.stringify(contacts), function(err) {
				if (err) console.log(err)
			})
			client.write(colors.red("Contact removed\n"))
			client.end()
		}

		switch (clientRequestArray[0].trim()) {
			case 'a':
				addContact()
				break
			case 'd':
				displayContact()
				break
			case 'r':
				removeContact()
				break
			case 'h':
				help()
				break
		}
	})
})
server.listen(8124, function() {
	console.log(colors.rainbow('Listening on port 8124'));
})
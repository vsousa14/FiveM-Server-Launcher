const axios = require('axios');

const DEFAULT_OPTIONS = {
	timeout: 10000
};

class Server {
	constructor(ip, options) {
		if (!ip) throw Error('Please provide a server IP in config.json');

		this.ip = ip.replace(/"/g, '');
		this.options = Object.assign(DEFAULT_OPTIONS, options);
	}

    //returns total of connected players
	getPlayersCounter() {
		return new Promise((send, err) => {
			axios
				.get(`https://servers-frontend.fivem.net/api/servers/single/${this.ip}`,{headers: { 'User-Agent': 'cfx-api' } }, { timeout: this.options.timeout })
				.then(function(body) {
					let players = body.data.Data.players;
					send(players.length);
				})
				.catch(function(error) {
					err(error);
				});
		});
	}

    // returns the playerlist
	getPlayersList() {
		return new Promise((send, err) => {
			axios
				.get(`https://servers-frontend.fivem.net/api/servers/single/${this.ip}`,{headers: { 'User-Agent': 'cfx' } }, { timeout: this.options.timeout })
				.then(function(body) {
					let players = body.data.Data.players;
					send(players);
				})
				.catch(function(error) {
					err(error);
				});
		});
	}	

    //returns true or false
	getServerStatus() {
		return new Promise((send, err) => {
			axios
				.get(`https://servers-frontend.fivem.net/api/servers/single/${this.ip}`,{headers: { 'User-Agent': 'cfx' } }, { timeout: this.options.timeout })
				.then(function(body) {
					let server_status = {
						online: true,
					}
					send(server_status);
				})
				.catch(function(error) {
					let server_status = {
						online: false,
						url: error.config.url,
						method: error.config.method
					}
					if (error.response == undefined) send(server_status)
				});
		});
	}

    getMaxPlayers() {
		return new Promise((send, err) => {
			axios
				.get(`https://servers-frontend.fivem.net/api/servers/single/${this.ip}`,{headers: { 'User-Agent': 'cfx' } }, { timeout: this.options.timeout })
				.then(function(body) {
					let maxClients = body.data.Data.vars.sv_maxClients;
					send(maxClients);
				})
				.catch(function(error) {
					err(error);
				});
		});
	}

}

module.exports = Server;
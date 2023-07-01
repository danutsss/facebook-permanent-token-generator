const tokenForm = document.querySelector("#generateTokenForm");
const appId = document.querySelector("#appId");
const appSecret = document.querySelector("#appSecret");
const userToken = document.querySelector("#userToken");
const result = document.querySelector("#result");

tokenForm.onsubmit = (e) => generateToken(e);

const generateToken = (e) => {
	// Prevent the form from reloading the page.
	e.preventDefault();

	const API_URL = "https://graph.facebook.com/v17.0";
	const APP_ID = appId.value;
	const APP_SECRET = appSecret.value;
	const USER_TOKEN = userToken.value;

	let tokenObj = {
		id: "",
		token: "",
	};

	axios
		.get(
			API_URL +
				"/oauth/access_token?grant_type=fb_exchange_token&client_id=" +
				APP_ID +
				"&client_secret=" +
				APP_SECRET +
				"&fb_exchange_token=" +
				USER_TOKEN
		)
		.then((response) => {
			tokenObj.token = response.data.access_token;
			return tokenObj;
		})
		.then((tokenObj) => {
			axios
				.get(API_URL + "/me?access_token=" + tokenObj.token)
				.then((response) => {
					tokenObj.id = response.data.id;
					return tokenObj;
				})
				.then((tokenObj) => {
					axios
						.get(
							API_URL +
								"/" +
								tokenObj.id +
								"/accounts?access_token=" +
								tokenObj.token
						)
						.then((response) => {
							result.classList.add("valid");
							result.style.display = "block";
							result.innerHTML = `Your permanent token is: <strong>${response.data.data[0].access_token}</strong>`;
						})
						.catch((error) => {
							throw new Error(error);
						});
				})
				.catch((error) => {
					throw new Error(error);
				});
		})
		.catch((error) => {
			throw new Error(error);
		});
};

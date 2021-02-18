function http_error_handler(error, id = null) {
	console.log('id error:', id);
	const __ERROR_STATUS__ = error.status
	try {
		if (error.data.detail) {
			alert(error.data.detail);
		}
		else {
			alert('Il y a eu une erreur, veuillez réessayer');
		}
	}
	catch (e) {
		console.log(e);
		console.log(__ERROR_STATUS__)
		if (__ERROR_STATUS__ == '400') {
			alert('Formulaire incomplet');
		}
		else {
			alert('Il y a eu une erreur, veuillez réessayer');
		}
	}
}

function error_to_show(msg = 'Il y a eu une erreur, veuillez recommencer dans un instant') {
	alert(msg);
}

export default { http_error_handler, error_to_show };
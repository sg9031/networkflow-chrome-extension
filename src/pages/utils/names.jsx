function get_vanityname_from_url(url) {
	const uri = url.split('/')[4];
	return (remove_accent(uri.split('-')[0] + uri.split('-')[1]));
}

function remove_accent(str) {
	str = str.replaceAll('é', 'e');
	str = str.replaceAll('è', 'e');
	str = str.replaceAll('à', 'a');
	str = str.replaceAll('ù', 'u');
	str = str.replaceAll('î', 'i');
	str = str.replaceAll('â', 'a');
	str = str.replaceAll('ô', 'o');
	str = str.replaceAll('û', 'u');
	return (str)
}

export default { get_vanityname_from_url, remove_accent };
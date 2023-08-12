exports.handler = async (event, context) => {

    const payload = event.body

    const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${payload}`;     
    
    let response = await fetch(url)

    let info = await response.json()

    let bool = true

    if (info.title == "No Definitions Found") {
        bool = false
    }
    
    if (payload == "PETES") {
        bool = true
    }

    return {
		statusCode: 200,
		body: JSON.stringify(bool),
	}
}
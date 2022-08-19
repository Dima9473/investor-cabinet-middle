const defaulFetchtOptions: RequestInit = {
    method: 'GET'
}


const fetchData = async (url: string, options: RequestInit = defaulFetchtOptions) => {
    const data = await fetch(url, options)
        .then((response) => response.json())

    return data
}
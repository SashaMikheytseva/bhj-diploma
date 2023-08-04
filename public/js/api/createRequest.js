/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
    let xhr = new XMLHttpRequest();
    let formData = new FormData();
    let url = options.url;
    let data = options.data;
    let method = options.method;
    let callback = options.callback;
    xhr.responseType = 'json';

    
    if (method === 'GET') {
        url += '?';
        for (let key in data) {
            url += `${key}=${data[key]}&`;
        }
        url = url.slice(0, -1);
    } else if (method !== 'GET') {
        for (let key in data) {
            formData.append(key, data[key]);
        }
    }

    try {
        xhr.open(method, url);
        if (formData) {
            xhr.send(formData);
        } else {
            xhr.send();
        }
        xhr.addEventListener('load', () => {
            if (xhr.DONE && xhr.status === 200) {
                callback(null, xhr.response);
            }
        });
    } catch (err) {
        callback(err, xhr.response);
    }
}

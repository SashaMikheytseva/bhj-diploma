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

    xhr.open(method, url);
    xhr.send(formData);

    try {
        xhr.addEventListener('load', () => {
            if (xhr.DONE && xhr.status === 200) {
                callback(xhr.response.error, xhr.response);
            }
        });
    } catch (error) {
        callback(error);
    }
}

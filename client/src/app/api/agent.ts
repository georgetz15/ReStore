import axios, {AxiosError, AxiosResponse} from "axios";
import {toast} from "react-toastify";
import {router} from "../router/Routes";

const sleep = () => new Promise(resolve => setTimeout(resolve, 500));

axios.defaults.baseURL = 'http://localhost:5000/api/'
axios.defaults.withCredentials = true;

const responseBody = (res: AxiosResponse) => res.data

axios.interceptors.response.use(
    async response => {
        await sleep();
        return response;
    },
    (error: AxiosError) => {
        const {data, status} = error.response as AxiosResponse
        switch (status) {
            case 400:
                if (data.errors) {
                    const modelStateErrors: string[] = [];
                    for (const key in data.errors) {
                        if (data.errors[key]) {
                            modelStateErrors.push(data.errors[key]);
                        }
                    }
                    throw modelStateErrors.flat();
                }
                toast.error(data.title)
                break;
            case 401:
                toast.error(data.title)
                break;
            case 500:
                router.navigate('/server-error', {state: {error: data}})
                break;
            default:
                break;
        }

        console.log(`caught by interceptor: ${error}`)
        return Promise.reject(error.response)
    }
)

const requests = {
    get: (url: string) => axios.get(url).then(responseBody),
    post: (url: string, body: object) => axios.post(url, body).then(responseBody),
    put: (url: string, body: object) => axios.put(url, body).then(responseBody),
    delete: (url: string) => axios.delete(url).then(responseBody),
}

const Catalog = {
    list: () => requests.get('products'),
    details: (id: number) => requests.get(`products/${id}`),
}

const Buggy = {
    get400Error: () => requests.get('Buggy/bad-request'),
    get401Error: () => requests.get('Buggy/unauthorised'),
    get404Error: () => requests.get('Buggy/not-found'),
    get500Error: () => requests.get('Buggy/server-error'),
    getValidationError: () => requests.get('Buggy/validation-error'),
}

const Basket = {
    get: () => requests.get('basket'),
    addItem: (productId: number, quantity = 1) => requests.post(`basket?productId=${productId}&quantity=${quantity}`, {}),
    removeItem: (productId: number, quantity = 1) => requests.delete(`basket?productId=${productId}&quantity=${quantity}`)
}

const agent = {
    Catalog,
    Buggy,
    Basket
}

export default agent
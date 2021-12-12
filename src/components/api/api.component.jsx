import React from 'react'
import DisplayLocation from "../display-location/display-location.component";
import CustomMap from "../custom-map/custom-map.component";
import {ErrorBoundary} from 'react-error-boundary'
import ErrorDisplay from "../error-display/error-display.component";
import { SearchContext } from '../../pages/homepage/homepage.component'
import './api.styles.scss'

const geoipifyApiKey = 'at_qFM0HXjTjEnGQOvmlxW4qk2bXkYF6'

const myHeader = new Headers({
    'Content-Type': 'application/x-www-form-urlencoded',
})
const init = {
    method: 'GET',
    headers: myHeader,
    mode: 'cors',
}

const reducer = (state, action) => {
    switch (action.type) {
        case 'fetching':
            return {status: 'fetching', data: null, error: null}
        case 'done':
            return {status: 'done', data: action.payload, error: null}
        case 'fail':
            return {status: 'fail', data: null, error: action.error}
        default:
            throw new Error('Action forbidden')
    }
}

const useFetchData = () => {
    const [state, dispatch] = React.useReducer(reducer, {
        data: null,
        error: null,
        status: 'idle',
    })

    const {data, error, status} = state

    const execute = React.useCallback(promise => {
        dispatch({type: 'fetching'})

        promise
            .then(search => dispatch({type: 'done', payload: search}))
            .catch(error => dispatch({type: 'fail', error}))
    }, [])

    return {data, error, status, execute}
}

const useFindSearchLocation = search => {
    const {data, error, status, execute} = useFetchData()
    React.useEffect(() => {
        if (!search) {
            return
        }
        if((search.split(".").length - 1) === 3)  {
            execute(fetchIpAddress(search))
        } else if(search.includes('@')) {
            execute(fetchMail(search))
        } else {
            execute(fetchDomain(search))
        }
    }, [search, execute])
    return {data, error, status}
}

const fetchIpAddress = ipAddress => {
    const url = `https://geo.ipify.org/api/v2/country,city?apiKey=${geoipifyApiKey}&ipAddress=${ipAddress}`;
    return fetch(url, init)
        .then(response => response.json())
        .then(json => {
            return json
        })
        .catch(error => {
            return Promise.reject(
                new Error(`No location found for IP "${ipAddress}"`),
            )
        }) // ERROR DU JSON()
        .catch(error => {
            return Promise.reject(
                new Error(`No location found for IP "${ipAddress}"`),
            )
        }) // ERROR APPEL API
}

const fetchDomain = domain => {
    const url = `https://geo.ipify.org/api/v2/country,city?apiKey=${geoipifyApiKey}&domain=${domain}`;
    return fetch(url, init)
        .then(response => response.json())
        .then(json => {
            return json
        })
        .catch(error => {
            return Promise.reject(
                new Error(`No location found for domain "${domain}"`),
            )
        }) // ERROR DU JSON()
        .catch(error => {
            return Promise.reject(
                new Error(`No location found for domain "${domain}"`),
            )
        }) // ERROR APPEL API
}

const fetchMail = mail => {
    const url = `https://geo.ipify.org/api/v2/country,city?apiKey=${geoipifyApiKey}&mail=${mail}`;
    console.log(url)
    return fetch(url, init)
        .then(response => response.json())
        .then(json => {
                return json
        })
        .catch(error => {
            return Promise.reject(
                new Error(`No location found for mail "${mail}"`),
            )
        }) // ERROR DU JSON()
        .catch(error => {
            return Promise.reject(
                new Error(`No location found for mail "${mail}"`),
            )
        }) // ERROR APPEL API
}


const Api = () => {
    const [searchValue] = React.useContext(SearchContext)
    const state = useFindSearchLocation(searchValue)
    const {data, error, status} = state

    if (status === 'fail') {
        throw error
    } else if (status === 'idle') {
        return ''
    }else if (status === 'fetching') {
        return 'Loading ...'
    } else if (status === 'done') {
        return (
            <ErrorBoundary key={searchValue} FallbackComponent={ErrorDisplay}>
                <DisplayLocation data={data}/>
                <CustomMap data={data}/>
            </ErrorBoundary>
        )
    }
}

export default Api;
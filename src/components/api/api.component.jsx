import React from 'react'
import DisplayLocation from "../display-location/display-location.component";
import CustomMap from "../custom-map/custom-map.component";
import {ErrorBoundary} from 'react-error-boundary'
import ErrorDisplay from "../error-display/error-display.component";
import { SearchContext } from '../../pages/homepage/homepage.component'
import './api.styles.scss'

const geoipifyApiKey = 'at_ZTsSILvFUvs89LLRtIyZzcJpOE14b'

const myHeader = new Headers({
    'Content-Type': 'application/x-www-form-urlencoded',
})
const init = {
    method: 'GET',
    headers: myHeader,
    mode: 'cors',
}

const SearchCacheContext = React.createContext()

const searchCacheReducer = (state, action) => {
    const ttl = 1_000 * 10
    const expire = Date.now() * ttl
    switch (action.type) {
        case 'ADD_SEARCH_IP': return {...state, [action.search]: {data: action.data, expire}}

        case 'ADD_SEARCH_MAIL': return {...state, [action.search]: {data: action.data, expire}}

        case 'ADD_SEARCH_DOMAIN': return {...state, [action.search]: {data: action.data, expire}}

        default: throw new Error(`impossible action type: ${action.type}`)
    }
}

const SearchCacheProvider = props => {
    const [cache, dispatch] = React.useReducer(searchCacheReducer,{})
    return <SearchCacheContext.Provider value={[cache, dispatch]} {...props} />
}

const useSearchCache = () => {
    const context = React.useContext(SearchCacheContext)
    if(!context) {
        throw new Error('useSearchCache must be used with SearchCacheProvider')
    }
    return context
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

    const setData = React.useCallback(
        data => dispatch({type: 'done', payload: data}),
        [dispatch],
    )

    return {data, error, status, execute, setData}
}

const useFindSearchLocation = search => {
    const [cache, dispatch] = useSearchCache()

    React.useDebugValue(cache)

    const {data, error, status, execute, setData} = useFetchData()
    React.useEffect(() => {
        if (!search) {
            return
        } else if (
            cache[search]?.data &&
            Date.now() < cache[search].expire
        ) {
            setData(cache[search].data)
        } else if((search.split(".").length - 1) === 3)  {
            execute(
                fetchIpAddress(search).then(data => {
                    dispatch({type: 'ADD_SEARCH_IP', search, data})
                    return data
                }),
            )
        } else if(search.includes('@')) {
            execute(fetchMail(search).then(data => {
                dispatch({type: 'ADD_SEARCH_MAIL', search, data})
                return data
            }),)
        } else {
            execute(fetchDomain(search).then(data => {
                dispatch({type: 'ADD_SEARCH_DOMAIN', search, data})
                return data
            }),)
        }
    }, [search, execute, cache, setData, dispatch])
    return {data, error, status}
}

const fetchIpAddress = ipAddress => {
    const url = `https://geo.ipify.org/api/v2/country,city?apiKey=${geoipifyApiKey}&ipAddress=${ipAddress}`;
    return fetch(url, init)
        .then(response => response.json())
        .then(json => {
            if(json.code) {
                return Promise.reject(
                    new Error(`"${json.code} : ${json.messages}"`),
                )
            }
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
            if(json.code) {
                return Promise.reject(
                    new Error(`"${json.code} : ${json.messages}"`),
                )
            }
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

const fetchMail = email => {
    const url = `https://geo.ipify.org/api/v2/country,city?apiKey=${geoipifyApiKey}&email=${email}`;
    return fetch(url, init)
        .then(response => response.json())
        .then(json => {
            if(json.code) {
                return Promise.reject(
                    new Error(`"${json.code} : ${json.messages}"`),
                )
            }
            return json
        })
        .catch(error => {
            return Promise.reject(
                new Error(`No location found for mail "${email}"`),
            )
        }) // ERROR DU JSON()
        .catch(error => {
            return Promise.reject(
                new Error(`No location found for mail "${email}"`),
            )
        }) // ERROR APPEL API
}

const Display = ({searchValue}) => {
    const state = useFindSearchLocation(searchValue)
    const {data, error, status} = state

    if (status === 'fail') {
        throw error
    } else if (status === 'idle') {
        return ''
    }else if (status === 'fetching') {
        return <CustomMap data={data} spinner={true}/>
    } else if (status === 'done') {
        return (
            <>
                <DisplayLocation data={data}/>
                <CustomMap data={data} spinner={false}/>
            </>
        )
    }
}

const Api = () => {
    const [searchValue] = React.useContext(SearchContext)
    return (
        <SearchCacheProvider>
            <ErrorBoundary key={searchValue} FallbackComponent={ErrorDisplay}>
               <Display searchValue={searchValue}/>
            </ErrorBoundary>
        </SearchCacheProvider>
    )
}

export default Api;
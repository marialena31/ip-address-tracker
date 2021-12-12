import React from 'react'
import DisplayLocation from "../display-location/display-location.component";
import CustomMap from "../custom-map/custom-map.component";
import { SearchContext } from '../../pages/homepage/homepage.component'

import './api.styles.scss'

const apiKey = 'at_qFM0HXjTjEnGQOvmlxW4qk2bXkYF6'

const Api = () => {
    const [searchValue, setSearchValue] = React.useContext(SearchContext)
    const [error, setError] = React.useState(null);
    const [isLoaded, setIsLoaded] = React.useState(false);
    const [data, setData] = React.useState(null);
    let query = 'ipAddress';

    React.useEffect(() => {
        if (!searchValue) {
            return
        }
        if((searchValue.split(".").length - 1) === 3)  {
            query = 'ipAddress'
        } else if(searchValue.includes('@')) {
            query = 'email'
        } else {
            query = 'domain'
        }
        const url = `https://geo.ipify.org/api/v2/country,city?apiKey=${apiKey}&${query}=${searchValue}`;
        fetch(url)
            .then(res => res.json())
            .then(
                (result) => {
                    setData(result);
                    setIsLoaded(true);
                    setError(false);
                },

                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            )

    }, [searchValue])

    if (error) {
        return <div>Erreur : {error.message}</div>;
    } else if (!isLoaded) {
        return <div>Chargement...</div>;
    } else {
        return (
            <>
                <DisplayLocation data={data}/>
                <CustomMap data={data}/>
            </>
        )
    }
}

export default Api;
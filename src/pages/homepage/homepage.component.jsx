import React from 'react';
import Header from '../../components/header/header.component'
import Api from "../../components/api/api.component";

export const SearchContext = React.createContext('')

const Homepage = () => {
    const [searchValue, setSearchValue] = React.useState('')
    const value = [searchValue, setSearchValue]
    return (
        <SearchContext.Provider value={value} >
                <Header />
                <Api />
        </SearchContext.Provider>
    )
}

export default Homepage;
import React from 'react'
import { SearchContext } from '../../pages/homepage/homepage.component'

import './search-form.styles.scss'

const SearchForm = () => {
    const [setSearchValue] = React.useContext(SearchContext)
    const [searchText, setSearchText] = React.useState('')
    const handleSubmit = event => {
        event.preventDefault();
        setSearchValue(searchText)
    }

    return (
        <form className='search-form' onSubmit={handleSubmit}>
                <input name="input-search" className={`search-form__text-input`} type="text" value={searchText} placeholder="Search for any IP address (put IP before address) or domain" onChange={e => setSearchText(e.target.value)}></input>
                <input className="search-form__btn" type="submit" />
        </form>
    )
}
export default SearchForm;
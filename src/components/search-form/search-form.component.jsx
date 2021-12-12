import React from 'react'
import { SearchContext } from '../../pages/homepage/homepage.component'
import {ErrorBoundary} from 'react-error-boundary'
import ErrorDisplay from "../error-display/error-display.component";

import './search-form.styles.scss'

const SearchForm = () => {
    const [, setSearchValue] = React.useContext(SearchContext)
    const [value, setValue] = React.useState('')
    const inputRef  = React.useRef()

    React.useLayoutEffect(() => {
        inputRef.current.focus()
    })

    return (
        <ErrorBoundary key={value} FallbackComponent={ErrorDisplay}>
            <div className='search-form' >
                <input ref={inputRef} name="input-search" className={`search-form__text-input`} type="text" value={value} placeholder="Search for any IP address, mail or domain" onChange={e => setValue(e.target.value)}></input>
                <input className="search-form__btn" type="submit" onClick={() => setSearchValue(value)}/>
            </div>
        </ErrorBoundary>
    )
}
export default SearchForm;
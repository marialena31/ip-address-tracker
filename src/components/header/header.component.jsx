import React from 'react'

import SearchForm from "../search-form/search-form.component";

import './header.styles.scss'

const Header = () => {
    return (
        <div className="header">
            <h1 className="header__heading1">IP Address Tracker</h1>
            <SearchForm />
        </div>
    )
}

export default Header;
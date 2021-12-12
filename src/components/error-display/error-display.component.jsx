import React from 'react'

function ErrorDisplay({error}) {
    return (
        <div style={{color: 'red'}}>
            Une erreur est survenue lors de la recherche :{' '}
            <pre style={{color: 'grey'}}> Détail : {error.message}</pre>
        </div>
    )
}

export default ErrorDisplay;
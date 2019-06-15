import React from 'react';

export const Detail = (props) => {

    const [details, setDetails] = React.useState(undefined);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const url = `https://api.github.com/repos/${props.nom}/${props.repos}`;
        const fetchUrl = () => {
            fetch(url)
                .then(response => response.json())
                .then(response => {
                    setDetails(response);
                    setLoading(false);
                })
        };
        fetchUrl();
    }, []);

    if (loading) {
        return (<div>Loading...</div>);
    } else {
        return (<div>
            <p> <i className="fas fa-file-signature" /> Name: {details.name}</p>
            <p><i className="fas fa-file-signature" /> Full Name: {details.full_name}</p>
            <p><i className="fas fa-language" /> Language: {details.language}</p>
            <p><i className="far fa-address-card" /> Propriétaire: {details.owner.login}</p>
            <p><i className="fas fa-book-open" /> Description: {details.description}</p>
            <p><i className="far fa-star" /> Star Count: {details.stargazers_count}</p>
            <p><i className="fas fa-code-branch" /> Forks Count: {details.forks_count}</p>
        </div>);
    }

}
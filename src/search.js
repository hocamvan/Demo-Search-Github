import React from 'react';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import './search.scss';
import { Loader } from './service/loader';
import { Detail } from './service/detail';
import {
    SortingState,
    IntegratedSorting,
    PagingState,
    SearchState,
    IntegratedFiltering,
    CustomPaging,
    RowDetailState

} from '@devexpress/dx-react-grid';
import {
    Grid,
    Table,
    Toolbar,
    SearchPanel,
    PagingPanel,
    TableHeaderRow,
    TableRowDetail
} from '@devexpress/dx-react-grid-bootstrap4';

export const Search = () => {

    const columns = [
        { name: 'id', title: 'ID de dépôt' },
        { name: 'name', title: 'Name' },
        { name: 'html_url', title: 'URL de dépôt' },
        { name: 'stargazers_count', title: 'Star count' },
        { name: 'forks_count', title: 'Forks count' }
    ]
    const tableColumnExtensions = [
        { columnName: 'id', align: 'center' },
        { columnName: 'name', align: 'center' },
        { columnName: 'html_url', align: 'center' },
        { columnName: 'stargazers_count', align: 'center' },
        { columnName: 'forks_count', align: 'center' },
    ]

    const [text, setText] = React.useState('');
    const [data, setData] = React.useState(undefined);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [check, setCheck] = React.useState(false);
    const [langague, setLangague] = React.useState('');
    const [sort, setSort] = React.useState('stars');

    const [currentPage, setCurrentPage] = React.useState(-1);
    const [pageSize] = React.useState(20);
    const [totalCount, setTotalCount] = React.useState(0);

    React.useEffect(() => {
        setData(undefined);
        if (text && currentPage !== -1) {
            setLoading(true);
            const URL = getSearchUrl(currentPage + 1);
            fetch(URL)
                .then(response => response.json())
                .then(response => {
                    setData(response.items);
                    setLoading(false);
                    const count = Math.min(1000, response.total_count); // GitHub permet seulement 1000 pages
                    setTotalCount(count);
                })
                .catch(() => {
                    setError(true);
                });
        }
    }, [currentPage])

    React.useEffect(() => { setCurrentPage(-1); }, [text, langague, sort, check])

    const getSearchUrl = (page) => {
        return langague && sort ?
            `https://api.github.com/search/repositories?q=${text}+language:${langague}&sort=${sort}&order=desc&page=${page}&per_page=${pageSize}`
            : `https://api.github.com/search/repositories?q=${text}&page=${page}&per_page=${pageSize}`;
    }

    const handleOnSubmit = (e) => {
        e.preventDefault();
        setCurrentPage(0);
    }

    const handleOnChange = (e) => {
        e.preventDefault();
        setText(e.target.value);
    }

    const handleOnChangeLangague = (e) => {
        e.preventDefault();
        setLangague(e.target.value);
    }

    const popover = (
        <Popover id="popover-basic" title="Guide">
            - Pour faire trier cliquer sur le nom de colonne<br />
            - Le search bar permet de rechercher dans le tableau de résultats<br />
            - Le paneau de pagination est en bas du tableau
        </Popover>
    )

    const handleCheck = () => {
        setCheck(!check);
    }

    const handleChangeSort = (e) => {
        e.preventDefault();
        setSort(e.target.value)
    }

    const handleCurrentPageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const TableComponent = ({ ...restProps }) => (
        <Table.Table
            {...restProps}
            className="table-striped"
        />
    )

    const RowDetail = ({ row }) => (
        <Detail nom={row.owner.login} repos={row.name} />
    )

    const Cell = (props) => {
        const { row, column } = props;
        if (column.name === 'html_url') {
            return <Table.Cell>
                <a href={row.html_url}>{row.html_url}</a>
            </Table.Cell>
        }
        return <Table.Cell {...props} />;
    }

    return (
        <div className='search'>
            <div className='title'>
                <h2>Recherche des dépôts de GitHub</h2>
            </div>
            <form className='champsSearch' onSubmit={handleOnSubmit}>
                <input type='text' placeholder='Nom de dépôt' value={text} onChange={handleOnChange} />
                {check &&
                    <div>
                        <input type='text' placeholder='Langague' value={langague} onChange={handleOnChangeLangague} />
                        <label>
                            Sort by
                            <select value={sort} onChange={handleChangeSort}>
                                <option value="stars">Stars</option>
                                <option value="forks">Forks</option>
                            </select>
                        </label>
                    </div>
                }
                <button type='submit'>Recherche</button>
            </form>
            <div className='champsAvance'>
                <input type="checkbox" defaultChecked={check} onChange={handleCheck} />
                <label for="scales">Recherche avancée</label>
            </div>
            {loading &&
                <div>
                    <Loader />
                </div>
            }
            {error &&
                <div>
                    <h3>Error de loading</h3>
                </div>
            }
            {data &&
                <div>
                    <h4>Cliquer sur <i className="fas fa-arrow-right" /> dans tableau pour les détails, pour les autres fonctionalités ...
                    <OverlayTrigger className='tooltip' trigger="hover" placement="right" overlay={popover}>
                            <i className="fas fa-info-circle" />
                        </OverlayTrigger>
                    </h4>
                    <div className='card'>
                        <Grid
                            rows={data}
                            columns={columns}
                        >
                            <RowDetailState
                                defaultExpandedRowIds={[]}
                            />
                            <SortingState
                                defaultSorting={[{ columnName: sort === 'stars' ? 'stargazers_count' : 'forks_count', direction: 'desc' }]}
                            />
                            <IntegratedSorting />
                            <SearchState />
                            <IntegratedFiltering />
                            <PagingState
                                currentPage={currentPage}
                                onCurrentPageChange={handleCurrentPageChange}
                                pageSize={pageSize}
                            />
                            <CustomPaging
                                totalCount={totalCount}
                            />
                            <Table
                                cellComponent={Cell}
                                columnExtensions={tableColumnExtensions}
                                tableComponent={TableComponent}
                            />
                            <TableHeaderRow showSortingControls />
                            <TableRowDetail
                                contentComponent={RowDetail}
                            />
                            <Toolbar />
                            <SearchPanel />
                            <PagingPanel />
                        </Grid>
                    </div>
                </div>
            }
        </div>
    )
}

import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import './Chart.css'
import {
    API_KEY,
    API_URL,
} from '../config';

const Chart = ({ searchInput }) => {

    const [search, setSearch] = useState(searchInput);
    const [stockChartXValues, setStockChartXValues] = useState([]);
    const [stockChartX2Values, setStockChartX2Values] = useState([]);
    const [stockChartYValues, setStockChartYValues] = useState([]);
    const [stockChartY2Values, setStockChartY2Values] = useState([]);

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            setSearch(event.target.value);
        }
    };
    function getArrayOfDates(startDate, endDate) {
        const dateArray = [];
        const currentDate = new Date(startDate);

        while (currentDate <= endDate) {
            dateArray.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return dateArray;
    }
    useEffect(() => {
        fetchStock();

    }, [search]);


    const handleClick = () => {

        fetch('http://localhost:5000/api', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ data: { "time": stockChartXValues, "data": stockChartYValues } }),
        })
            .then(response => response.json())
            .then(data => {
                setStockChartY2Values(data['mvg']);
                setStockChartX2Values(data['time']);

            })
            .catch(error => console.error('Error:', error));

            console.log("hello world")

    }


    const fetchStock = () => {
       


        const startDate = new Date('2023-5-20');
        const endDate = new Date('2023-10-25');

        let stockChartXValuesFunction = getArrayOfDates(startDate, endDate);;


        const startTime = startDate.getTime();
        const endTime = endDate.getTime();

        const url = `${'https://finnhub.io/api/v1'}/stock/candle?symbol=${search}&resolution=${'D'}&from=${startTime}&to=${endTime}&token=${API_KEY}`

        fetch(url)
            .then(function (response) {

                return response.json();
            })
            .then(function (data) {

                setStockChartXValues(stockChartXValuesFunction);
                setStockChartYValues(data.o);
            });

            setStockChartY2Values([]);
            setStockChartX2Values([]);
    
    };


    return (
        <div>
            <div>
                <div className='head-container'>
                    <div className='cmptitle'>
                        {search}
                    </div>
                    <div className='search-bar'>
                        <input
                            type="text"
                            placeholder="Search..."
                            onKeyUp={handleKeyPress}
                        />
                    </div>
                </div>

                <div className='plot-container'>
                    <Plot className='plot'
                        data={[
                            {
                                x: stockChartXValues,
                                y: stockChartYValues,
                                type: 'scatter',
                                mode: 'lines',
                                marker: { color: 'red' },
                                line: { color: '#17BECF' },
                            },
                            {
                                x: stockChartX2Values,
                                y: stockChartY2Values,
                                type: 'scatter',
                                mode: 'lines',
                                marker: { color: 'red' },
                                line: { color: '#FF0000' },
                            }
                        ]}
                        layout={{
                            width: 1000,
                            height: 480,
                            yaxis: { fixedrange: false, autorange: true },
                            xaxis: {
                                fixedrange: true,
                                rangeselector: {
                                    buttons: [
                                        {
                                            count: 1,
                                            label: '1d',
                                            step: 'day',
                                            stepmode: 'backward'
                                        },
                                        {
                                            count: 5,
                                            label: '5d',
                                            step: 'day',
                                            stepmode: 'backward'
                                        },
                                        {
                                            count: 1,
                                            label: '1m',
                                            step: 'month',
                                            stepmode: 'backward'
                                        },
                                        {
                                            count: 3,
                                            label: '3m',
                                            step: 'month',
                                            stepmode: 'backward'
                                        },
                                        { step: 'all' }
                                    ]
                                },
                            },
                        }}
                        config={
                            { displayModeBar: false, }
                        }
                    />
                </div>
                <button
                    onClick={handleClick}
                    className="custom-button"
                >
                    Predict
                </button>
            </div>
        </div>
    );
};

export default Chart;
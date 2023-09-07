import React, { useState, useEffect, useRef } from "react";
import { Platform, StyleSheet, TextInput, Button  } from 'react-native';


function Grid(props) {
    const data = props.data;
    const [showAll, setShowAll] = useState(false);
    const displayData = showAll ? data : data.slice(0, 6);

    const gridContainerRef = useRef(null);

    //console.log(gridContainerRef);

    useEffect(() => {
        if (!showAll && gridContainerRef.current) {
            const topOfGrid = gridContainerRef.current.offsetTop;
            if (window.pageYOffset !== 0) {
                window.scrollTo({
                    top: topOfGrid - 210,
                    behavior: "smooth"
                });
            }
        }
    }, [showAll, gridContainerRef]);



    const headerSize = {
        fontSize: '20px'
    };

    const parSize = {
        fontSize: '15px',
        color: '#0583a0'

    };

    function handleGridItemClick(event, urlz, titlez) {
        const notebookUrl = urlz;
        const wtitle = `${titlez} - Code`;

        const notebookWindow = window.open(notebookUrl, wtitle, 'height=800,width=1200');

        const timer = setInterval(() => {
            if (notebookWindow && notebookWindow.document) {
                clearInterval(timer);
                notebookWindow.document.title = wtitle;
            }
        }, 100);

    }


    function handleReadme(event, readmez, titlez) {
        event.stopPropagation();

        const nbreadme = readmez;
        const nbreadmeTitle = `${titlez} - Readme`;

        const nbreadmeWindow = window.open(nbreadme, nbreadmeTitle, 'height=800,width=1200');

        const timer = setInterval(() => {
            if (nbreadmeWindow && nbreadmeWindow.document) {
                clearInterval(timer);
                nbreadmeWindow.document.title = nbreadmeTitle;
            }
        }, 100);


    }

    //localstorage??



    return (
        <div className="gridContainerWrapper">
            <div className="gridContainer" ref={gridContainerRef}>
                {displayData.map(item => (
                    <div className="gridItem" key={item.id} onClick={(event) => handleGridItemClick(event, item.url, item.title)}>
                        <br />
                        <a style={headerSize}>{item.title}
                            <br />
                            <p style={parSize}> {item.info} </p>
                        </a>
                        <div className="buttonWrapper" key={item.id}>
                            <button className="gridButtonBox" onClick={(event) => handleReadme(event, item.readme, item.title)}>Readme</button>
                        </div>
                    </div>
                ))}
            </div>
            <div className="gridButtonContainer">
                {!showAll && (
                    <button className="buttonSM" onClick={() => setShowAll(true)}>Show More</button>
                )}
                {showAll && (
                    <button className="buttonSL" onClick={() => setShowAll(false)}>Show Less</button>
                )}
            </div>
        </div>
    );
};

const styles = StyleSheet.create({
    gridContainer: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, minmax(240px, 1fr))',
        gridTemplateRows: 'repeat(3, minmax(240px, 1fr))',
        gridGap: 35,
      },
      gridContainerWrapper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 35,
      },
      gridButtonContainer: {
        marginTop: '1em',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
      },
      gridItem: {
        width: 240,
        height: 240,
        position: 'relative',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        padding: 10,
        backgroundColor: '#052d3a',
      },
      gridItemHover: {
        transform: [{ scale: 1.1 }],
      },
      buttonSM: {
        marginTop: '-240%',
        backgroundColor: '#052d3a',
        color: '#ffb703',
        fontSize: 18,
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        
        borderColor: '#ffb703',
      },
      buttonSL: {
        marginTop: '50%',
        backgroundColor: '#052d3a',
        color: '#ffb703',
        fontSize: 18,
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ffb703',
      },

      buttonWrapper: {
        alignSelf: 'center',
        textAlign: 'center',
        marginTop: 'auto',
      },
      gridButtonBox: {
        backgroundColor: '#052d3a',
        color: '#ffb703',
        padding: 5,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ffb703',
      },
    });


export default Grid;
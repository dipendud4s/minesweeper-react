import React from 'react';

class Board extends React.Component {
    countClick = 0;
    constructor(props) {
        super(props);
        this.state = {
            gameOver: false,
            list: this.getItemList(props.rows, props.columns),
            ...props
        };
        this.addMines();
    }
    getItemList(rows, cols) {
        let data = {};
        for (let i = 0; i < rows; i++){
            for (let j = 0; j < cols; j++){
                data[i+','+j] = {
                    id: i+','+j,
                    x: i,
                    y: j,
                    mineCount: 0,
                    isMine: false,
                    isOpen: false,
                };
            }
        }
        return data;
    }
    addMines() {
        // Add mines randomly
        for (let i = 0; i < this.state.mines; i++) {
            var row = Math.floor(Math.random() * this.state.rows);
            var col = Math.floor(Math.random() * this.state.columns);
            if (this.state.list[row + ',' + col].isMine) {
                // here it need to be decrease to maintain the total number of mines
                i--;
            } else {
                this.state.list[row + ',' + col].isMine = true;
            }
        }
    }
    onItemClick(data) {
        // if already open it should not click
        if (!data.isOpen) {
            if (data.isMine) {
                this.handleGameOver();
            } else {
                let list = this.state.list;
                list[data.x+','+data.y].isOpen = true;
                list[data.x+','+data.y].mineCount = this.getMineCount(data.x, data.y);

                if (list[data.x+','+data.y].mineCount === 0) {
                    // then click through the neighbours recursively
                    for (var i = Math.max(data.x-1,0); i <= Math.min(data.x+1, this.state.rows-1); i++) {
                        for(var j = Math.max(data.y-1,0); j <= Math.min(data.y+1, this.state.columns-1); j++) {
                            this.onItemClick(this.state.list[i + ',' + j]);
                        }
                    }
                }
                
                // change the state
                this.setState({
                    list: list,
                });
                // it should have better approch so that the clicks value can be shown to user as well
                this.countClick++;
            }
            
        }
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        // check if player wins 
        if ( ((this.state.rows * this.state.columns) - this.countClick) == this.state.mines) {
            alert('😃 You Win!!!');
        }
    }
    getMineCount(x, y) {
        let mineCount = 0;
        for (var i = Math.max(x-1,0); i <= Math.min(x+1, this.state.rows-1); i++) {
            for(var j = Math.max(y-1,0); j <= Math.min(y+1, this.state.columns-1); j++) {
                if (this.state.list[i + ',' + j].isMine) {
                    mineCount++;
                }
            }
        }
        return mineCount;
    }
    handleGameOver() {
        this.setState({
            gameOver: true,
        });
        alert("😢 Game Over!!");
    }
    render() {
        return (
            <div className={"board "+ (this.state.gameOver ? "over": "")} style={{ gridTemplateColumns : `repeat(${this.props.columns}, 1fr)`}}>
                {
                    Object.values(this.state.list).map((item) => {
                        return (
                            <div className={"item " + (item.isOpen ? "open" : "") + " " + ( this.state.gameOver && item.isMine ? "mine" : "")} key={item.id} 
                            onClick={() => this.onItemClick(item)}>
                                <span>{item.isOpen ? item.mineCount : ''}</span>
                            </div>
                        );
                    })
                }
            </div>
        )
    }
}

export default Board;

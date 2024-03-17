import * as React from "react";
import "../../css/game-styling.css";

const Game = () => {
  return (
    <>
      <div className="game">
        <div className="game-container">
          <div className="ai-analysis">
            <h5>AI analysis</h5>
          </div>
          <div className="main">
            <div className="opponent-card">
              <h3>Opponent</h3>
            </div>
            <div className="board">
              <div className="board-row">
                <div className="board-col">-</div>
                <div className="board-col">1</div>
                <div className="board-col">-</div>
                <div className="board-col">2</div>
                <div className="board-col">-</div>
                <div className="board-col">3</div>
                <div className="board-col">-</div>
                <div className="board-col">4</div>
              </div>
              <div className="board-row">
                <div className="board-col">5</div>
                <div className="board-col">-</div>
                <div className="board-col">6</div>
                <div className="board-col">-</div>
                <div className="board-col">7</div>
                <div className="board-col">-</div>
                <div className="board-col">8</div>
                <div className="board-col">-</div>
              </div>
              <div className="board-row">
                <div className="board-col">-</div>
                <div className="board-col">9</div>
                <div className="board-col">-</div>
                <div className="board-col">10</div>
                <div className="board-col">-</div>
                <div className="board-col">11</div>
                <div className="board-col">-</div>
                <div className="board-col">12</div>
              </div>
              <div className="board-row">
                <div className="board-col">13</div>
                <div className="board-col">-</div>
                <div className="board-col">14</div>
                <div className="board-col">-</div>
                <div className="board-col">15</div>
                <div className="board-col">-</div>
                <div className="board-col">16</div>
                <div className="board-col">-</div>
              </div>
              <div className="board-row">
                <div className="board-col">-</div>
                <div className="board-col">17</div>
                <div className="board-col">-</div>
                <div className="board-col">18</div>
                <div className="board-col">-</div>
                <div className="board-col">19</div>
                <div className="board-col">-</div>
                <div className="board-col">20</div>
              </div>
              <div className="board-row">
                <div className="board-col">21</div>
                <div className="board-col">-</div>
                <div className="board-col">22</div>
                <div className="board-col">-</div>
                <div className="board-col">23</div>
                <div className="board-col">-</div>
                <div className="board-col">24</div>
                <div className="board-col">-</div>
              </div>
              <div className="board-row">
                <div className="board-col">-</div>
                <div className="board-col">25</div>
                <div className="board-col">-</div>
                <div className="board-col">26</div>
                <div className="board-col">-</div>
                <div className="board-col">27</div>
                <div className="board-col">-</div>
                <div className="board-col">28</div>
              </div>
              <div className="board-row">
                <div className="board-col">29</div>
                <div className="board-col">-</div>
                <div className="board-col">30</div>
                <div className="board-col">-</div>
                <div className="board-col">31</div>
                <div className="board-col">-</div>
                <div className="board-col">32</div>
                <div className="board-col">-</div>
              </div>
            </div>
            <div className="player-card">
              <h3>Player</h3>
            </div>
          </div>
          <div className="history">
            <h5>History</h5>
          </div>
        </div>
      </div>
      {/* Footer Section */}
      <div className="footer-section">Made by Daniyal Ashraf Khan</div>
    </>
  );
};

export default Game;

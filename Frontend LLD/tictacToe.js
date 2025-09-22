import { useState } from "react";

const TicTacToe = ({ size = 3 }) => {
  const N = size;
  const [winner, setWinner] = useState("");
  const [isXNext, setIsXNext] = useState(true);
  const emptyBoard = Array.from({ length: N }, () => Array(N).fill(null));
  const [board, setBoard] = useState(emptyBoard);

  const getWinner = (board, r, c) => {
    const player = board[r][c];
    if (board[r].every((cell) => cell === player)) return player;
    if (board.every((row) => row[0] === player)) return player;
    if (r == c && board.every((row, index) => row[index] == player))
      return player;
    if (
      r + c == N - 1 &&
      board.every((row, index) => row[N - 1 - index] == player)
    )
      return player;
  };
  const handleClick = (e) => {
    const { id } = e.target.dataset;
    if (!id) return;
    const [r, c] = id.split("_");
    if (board[r][c]) return;
    let newBoard = board.map((row, i) =>
      row.map((cell, j) => (i == r && c == j ? (isXNext ? "X" : "O") : cell))
    );
    setBoard(newBoard);
    setIsXNext((prev) => !prev);
    const res = getWinner(newBoard, r, c);
    if (res) {
      setWinner(res);
    }
  };
  const handleReset = () => {
    setBoard(emptyBoard);
    setIsXNext(true);
  };
  return (
    <div>
      <h2>Tic tac toe</h2>
      <div className="board" onClick={handleClick}>
        {board.map((row, i) => (
          <div className="row" key={i} style={{ display: "flex" }}>
            {row.map((cell, j) => (
              <div
                className="col"
                key={`cell_${i}_${j}`}
                data-id={`${i}_${j}`}
                style={{
                  backgroundColor: "grey",
                  height: "4rem",
                  width: "4rem",
                  border: "1px solid black",
                  margin: ".3rem",
                  borderRadius: ".5rem",
                  fontSize: "2rem",
                  textAlign: "center",
                }}
              >
                {cell ? cell : ""}
              </div>
            ))}
          </div>
        ))}
      </div>
      <h4>Next: {isXNext ? "X" : "0"}</h4>
      <h3>
        Winner : {winner ? winner : board.flat().every(Boolean) ? "Draw" : ""}
      </h3>
      <button onClick={handleReset}>Reset</button>
    </div>
  );
};

export default TicTacToe;

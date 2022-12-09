import React, { useState } from "react";
function Pokemon(props) {
  const [isOpen, setIsOpen] = useState(false);

  let modal = "";
  if (isOpen) {
    modal = (
      <div className="modal">
        <div className="modal-inner">
          <div className="modal-header"></div>
          <div className="modal-introduction">
            <h2>{props.name}</h2>
            <p>{props.introduction}</p>
          </div>
          <button
            onClick={() => {
              handleClick();
            }}
            className="modal-close-btn"
          >
            Tutup
          </button>
        </div>
      </div>
    );
  }
  function handleClick() {
    setIsOpen(!isOpen);
  }

  return (
    <div
      className="pokemon-content"
      onClick={() => {
        handleClick();
      }}
    >
      <div className="pokemon-item">
        <p>{props.name}</p>

        <img src={props.image} />
      </div>
      {modal}
    </div>
  );
}
export default Pokemon;

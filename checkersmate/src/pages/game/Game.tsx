import * as React from 'react';
import '../../css/game-styling.css';
import Navbar from '../../components/navbar/Navbar';

const Game = () => {
  function MyButton() {
    function handleClick() {
      alert('You clicked me!');
    }

    return (
      <button onClick={handleClick}>
        Click me!
      </button>
    )
  }
  
  const user= {
    name: 'Hedy Lamar',
    imageUrl: 'https://i.imgur.com/yXOvdOSs.jpg',
    imageSize: 90,
  };
  
  const products = [
    {title: 'Cabbage', isFruit: false, id: 1},
    {title: 'Garlic', isFruit: false, id: 2},
    {title: 'Apple', isFruit: false, id: 3},
  ]
  
  const listItems = products.map(product => 
    <li 
      key={product.id}
      style={{
        color: product.isFruit? 'magenta' :   'darkgreen'
      }}
    >
      {product.title}
    </li>
    );

  return (
    <>
      <Navbar/>
      <h1>Welcome to my app</h1>

      <h1>Home</h1>
      <p>hello there <br /> how u doin</p>
      <h1>
        {user.name}
      </h1>
      <img 
        className="avatar" 
        src={user.imageUrl}
        alt='lol'
        style={{
          width: user.imageSize,
          height: user.imageSize
        }}
      />

       <ul>{listItems}</ul>

        <MyButton/>

    </>
  );
};

export default Game;
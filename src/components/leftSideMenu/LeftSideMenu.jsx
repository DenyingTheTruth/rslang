import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import routes from '../../constants/routes';
import StoreContext from '../../app/store';
import './leftSideMenu.scss';

const LeftSideMenu = () => {
  const context = useContext(StoreContext);

  return (
    <div className="left-side-menu mm-active">

      <div className="leftbar-user">
        <a href="">
          <img src="./images/england.png" alt="" height="42" className="rounded-circle shadow-sm" />
          <span className="leftbar-user-name">{context.userEmail}</span>
        </a>
      </div>

      <ul className="metismenu side-nav mm-show">
        <li className="side-nav-title side-nav-item" />

        <li className="side-nav-item">
          <Link to={routes.LANDING} className="side-nav-link">
            <i className="uil-home-alt" />
            <span> Главная </span>
          </Link>
        </li>

        <li className="side-nav-item">
          <Link to={routes.LANDING} className="side-nav-link">
            <i className="uil-graduation-hat" />
            <span> Учить слова </span>
          </Link>
        </li>

        <li className="side-nav-item">
          <Link to={routes.LANDING} className="side-nav-link">
            <i className="uil-dice-three" />
            <span> Мини-игры </span>
          </Link>
        </li>

        <li className="side-nav-item">
          <Link to={routes.LANDING} className="side-nav-link">
            <i className="uil-book-alt" />
            <span> Словарь </span>
          </Link>
        </li>

        <li className="side-nav-item">
          <Link to={routes.LANDING} className="side-nav-link">
            <i className="uil-chart" />
            <span> Статистика </span>
          </Link>
        </li>

        <li className="side-nav-item">
          <Link to={routes.LANDING} className="side-nav-link">
            <i className="uil-presentation-plus" />
            <span> Промо </span>
          </Link>
        </li>

        <li className="side-nav-item">
          <Link to={routes.TEAM} className="side-nav-link">
            <i className="uil-github-alt" />
            <span> О нас </span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default LeftSideMenu;
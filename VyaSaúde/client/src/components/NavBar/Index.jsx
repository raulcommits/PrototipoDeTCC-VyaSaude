import { Link, useLocation } from 'react-router-dom';
import styles from './NavBar.module.scss';

const NavBar = ({ items = [] }) => {
  const location = useLocation();

  // Função para verificar se a rota atual corresponde ao item
  const isActive = (href) => {
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        {items.map((item, index) => (
          <Link
            key={index}
            to={item.href}
            className={`{styles.item${isActive(item.href) ? 'active' : ''}}`}
            title={item.label}
          >
            {item.icon && <img src={item.icon} alt={item.label} className={styles.icon} />}
            <span className={styles.label}>{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default NavBar;

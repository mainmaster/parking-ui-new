import css from './NavList.module.scss'
import { ListGroup } from 'react-bootstrap'
import { NavLink, useLocation } from 'react-router-dom'
import cn from 'classnames'
import PropTypes from 'prop-types'

const NavList = ({ links }) => {
  const { pathname } = useLocation()

  const activeLink = (linkTo) => pathname === linkTo

  return (
    <ListGroup as="ul">
      {links.map((link) => (
        <ListGroup.Item
          as="li"
          className={cn(css.list_li, activeLink(link.to) && css.active)}
          active={pathname === link.to}
          key={link.id}
        >
          <NavLink
            to={link.to}
            className={cn(css.list_link, activeLink(link.to) && css.active)}
          >
            {link.name}
            <div>{link.icon}</div>
          </NavLink>
        </ListGroup.Item>
      ))}
    </ListGroup>
  )
}

NavList.propTypes = {
  links: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      to: PropTypes.string.isRequired,
      icon: PropTypes.node,
    }).isRequired
  ).isRequired,
}

export default NavList

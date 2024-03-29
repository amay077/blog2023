import React from "react";
import { Link } from "gatsby";
import github from "../img/social/github-icon.svg";
import mastodon from "../img/social/mastodon.svg";

const Navbar = class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
      navBarActiveClass: "",
    };
  }

  toggleHamburger() {
    // toggle the active boolean in the state
    this.setState(
      {
        active: !this.state.active,
      },
      // after state has been updated,
      () => {
        // set the class in state for the navbar accordingly
        this.state.active
          ? this.setState({
              navBarActiveClass: "is-active",
            })
          : this.setState({
              navBarActiveClass: "",
            });
      }
    );
  }

  render() {
    return (
      <nav
        className="navbar is-transparent"
        role="navigation"
        aria-label="main-navigation"
      >
        <div className="container">
          <div className="navbar-brand">
            <Link to="/" className="navbar-item" title="Logo">
              {/* <img src={logo} alt="Kaldi" style={{ width: "88px" }} /> */}
              {this.props.title}
            </Link>
            {/* Hamburger menu */}
            <div
              className={`navbar-burger burger ${this.state.navBarActiveClass}`}
              data-target="navMenu"
              role="menuitem"
              tabIndex={0}
              onKeyPress={() => this.toggleHamburger()}
              onClick={() => this.toggleHamburger()}
            >
              <span />
              <span />
              <span />
            </div>
          </div>
          <div
            id="navMenu"
            className={`navbar-menu ${this.state.navBarActiveClass}`}
          >
            <div className="navbar-start has-text-centered">
              {/* <Link className="navbar-item" to="/products">
                Products
              </Link> */}
              <Link className="navbar-item" to="/posts">
                Archives
              </Link>
              <Link className="navbar-item" to="/tags">
                Tags
              </Link>
              <Link className="navbar-item" to="/about">
                About
              </Link>
            </div>
            <div className="navbar-end has-text-centered">              
              <a
                className="navbar-item"
                href="https://github.com/amay077"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="icon">
                  <img src={github} alt="Github" />
                </span>
              </a>

              <a
                className="navbar-item"
                href="https://mastodon.cloud/@amay077"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="icon">
                  <img src={mastodon} alt="Mastodon" />
                </span>
              </a>

            </div>
            
          </div>
        </div>
      </nav>
    );
  }
};

export default Navbar;

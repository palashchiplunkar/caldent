import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import { signOut } from 'firebase/auth' 
import {auth } from "../firebase/firebaseConfig"
import { Link } from "react-router-dom";
import { useAuthValue } from "../AuthContext";

function NavComponent() {
  const { currentUser } = useAuthValue();
  return (
    <>
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="#home">Caldent</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="#home"><Link to="/" style={{textDecoration:"none",color:"white"}}>Home</Link></Nav.Link>
              {currentUser && <Nav.Link href="#features"><Link to="/calendar" style={{textDecoration:"none",color:"white"}}>My Calendar</Link></Nav.Link>}
              {/* <Nav.Link href="#pricing">About Us</Nav.Link> */}
            </Nav>
            {!currentUser ? (
              <>
                <Form className="d-flex">
                  <Link to={"/login"}>
                    <Button
                      variant="outline-success"
                      style={{ marginRight: "2vh" }}
                    >
                      Login
                    </Button>
                  </Link>
                </Form>
                <Form className="d-flex">
                  <Link to={"/signup"}>
                    <Button variant="outline-success">Sign Up</Button>
                  </Link>
                </Form>
              </>
            ) : (
              <>
                <Dropdown>
                  <Dropdown.Toggle variant="success" id="dropdown-basic">
                    {currentUser.email}
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item onClick={()=>signOut(auth)}>Log Out</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default NavComponent;

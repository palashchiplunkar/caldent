import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { auth, db } from "../firebase/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { signInWithEmailAndPassword } from "firebase/auth";
import Alert from "react-bootstrap/Alert";
import "../css/authStyles.css"
import { useNavigate } from "react-router-dom";
export default function Login() {
    const navigate=useNavigate();
    const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const validateForm = () => {
    let valid = true;

    if (email === "" || password === "") {
      valid = false;
      setError("Please Fill All the Fields");
    }
    return valid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (validateForm()) {
        signInWithEmailAndPassword(auth, email, password)
        .then((res) => {
            setMessage("Login Successfull");
            setShow(true);

            setEmail("");
            setPassword("");
            navigate("/")
        })
        .catch((err) => setError(err.message));
    }
  };
  return (
    <Container fluid="md" className="centerContainer">
      <Row>
        <Col>
          <h1>Login</h1>
          <p style={{ color: "red" }}>{error != "" ? error : null}</p>

          <Form>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="Enter email" value={email} onChange={(e)=>setEmail(e.target.value)}/>
              <Form.Text className="text-muted">
                We'll never share your email with anyone else.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
            </Form.Group>

            <Button variant="primary" type="submit" onClick={handleSubmit}>
              Submit
            </Button>
          </Form>
        </Col>
      </Row>
      <Row>
        {show && (
          <Alert variant="success" onClose={() => setShow(false)} dismissible>
            <Alert.Heading>{message}</Alert.Heading>
          </Alert>
        )}
      </Row>
    </Container>
  );
}

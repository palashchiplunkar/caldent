import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { auth, db } from "../firebase/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import Alert from "react-bootstrap/Alert";
import { Link } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

export default function SignUp() {
  const [name, setName] = useState("");
  const [usn, setUsn] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const validatePassword = () => {
    let isValid = true;
    if (password !== "" && cpassword !== "") {
      if (password !== cpassword) {
        isValid = false;
        setError("Passwords does not match");
        setShow(true);
      }
    }
    return isValid;
  };
  const validateForm = () => {
    let valid = true;

    if (email === "" || name === "" || usn === "") {
      valid = false;
      setError("Please Fill All the Fields");
    }
    return valid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (validatePassword() && validateForm()) {
      createUserWithEmailAndPassword(auth, email, password)
        .then((res) => {
          const collectionRef = doc(db, "users", res.user.uid);
          const data = {
            name: name,
            usn: usn,
            email: email,
          };
          setDoc(collectionRef, data)
            .then(function () {
              setMessage("Sign up Successfull");
              setShow(true);
              setName("");
              setEmail("");
              setUsn("");
              setPassword("");
              setCPassword("");
            })
            .catch(function (error) {
              setError(error);
            });
        })
        .catch((err) => setError(err.message));
    }
  };

  return (
    <Container fluid="md">
      <Row>
        <Col>
          <h1>Sign Up</h1>
          <p style={{ color: "red" }}>{error != "" ? error : null}</p>
          <Form>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>USN</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter USN"
                value={usn}
                onChange={(e) => setUsn(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Form.Text className="text-muted">
                We'll never share your email with anyone else.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={cpassword}
                onChange={(e) => setCPassword(e.target.value)}
              />
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
            <p>
              <Link to="/login">Click Here to Login</Link>
            </p>
          </Alert>
        )}
      </Row>
    </Container>
  );
}

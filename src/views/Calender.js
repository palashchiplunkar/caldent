import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react"; // must go before plugins
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import { Col, Container, Row } from "react-bootstrap";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { db } from "../firebase/firebaseConfig";
import emailjs from "emailjs-com";
import LoadingBar from "react-top-loading-bar";

import {
  Timestamp,
  addDoc,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { useAuthValue } from "../AuthContext";

export default function Calendar() {
  const calendarRef = React.createRef();
  const [progress, setProgress] = useState(0);

  const { currentUser } = useAuthValue();
  const [show, setShow] = useState(false);
  const [event, setEvent] = useState({
    eventName: "",
    eventDate: new Date(),
    allDay: "",
  });
  const [eventData, setEventData] = useState([]);

  const sendEmail = () => {
    const serviceID = "service_2gwutzn";
    const templateID = "template_7zogjia";
    const userID = "GmjLF2BcF3hWeEEeu";

    const templateParams = {
      to_email: currentUser.email,
      event_title: event.eventName,
      event_date: event.eventDate,
    };

    emailjs.send(serviceID, templateID, templateParams, userID).then(
      (response) => {
        console.log("Email sent:", response.status, response.text);
      },
      (error) => {
        console.log("Email failed:", error);
      }
    );
  };

  const getEventData = () => {
    setProgress(30);
    if (currentUser) {
      const collectionRef = collection(
        db,
        "events",
        currentUser.uid,
        "userEvents"
      );
      getDocs(collectionRef)
        .then((querySnapshot) => {
          const eventsArray = [];
          querySnapshot.forEach((doc) => {
            eventsArray.push({
              id: doc.id,
              allDay: doc.data().allDay,
              start: doc.data().eventDate.toDate(),
              title: doc.data().eventName,
            });
          });
          setProgress(100);
          console.log(eventsArray);
          setEventData(eventsArray);
        })
        .catch((error) => {
          setProgress(100);

          console.error("Error getting documents:", error);
        });
    }
  };

  useEffect(() => {
    getEventData();
  }, [currentUser]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleDateClick = (arg) => {
    handleShow();
    const argData = {
      eventDate: arg.date,
      allDay: arg.allDay,
    };
    console.log(argData);
    setEvent({ ...event, ...argData });
  };
  const handleEventSubmit = async () => {
    console.log(event);
    addDoc(collection(doc(db, "events", currentUser.uid), "userEvents"), event)
      .then((docRef) => {
        console.log("Event added with ID:", docRef.id);
        getEventData();
        sendEmail();
      })
      .catch((error) => {
        console.error("Error adding event:", error);
      });
    handleClose();
  };

  const handleEventClick = (arg) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      const docRef = doc(
        collection(db, "events", currentUser.uid, "userEvents"),
        arg.event.id
      );
      deleteDoc(docRef)
        .then(() => {
          console.log("Document deleted successfully!");
          getEventData();
        })
        .catch((error) => {
          console.error("Error deleting document: ", error);
        });
    }
  };

  return (
    <Container>
      <LoadingBar
        color="#f11946"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
        height={5}
      />
      <Row className="mt-3">
        <Col>
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            dateClick={handleDateClick}
            eventClick={handleEventClick}
            headerToolbar={{
              start: "dayGridMonth,timeGridWeek,timeGridDay",
              center: "title",
              end: "today prev,next",
            }}
            events={eventData}
          />
        </Col>
      </Row>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Event Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Event Name"
                autoFocus
                value={event.eventName}
                onChange={(e) =>
                  setEvent({ ...event, eventName: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleEventSubmit}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

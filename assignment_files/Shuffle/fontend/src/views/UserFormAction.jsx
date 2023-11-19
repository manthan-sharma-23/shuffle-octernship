import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";

export const UserFormAction = (props) => {
  const navigate = useNavigate();

  const { form_id } = useParams();
  const [username, setUsername] = useState("");
  const [response, setResponse] = useState([]);
  const [form, setForm] = useState(null);

  useEffect(() => {
    getUser();
    getForm();
  }, []);

  const getUser = () => {
    fetch(props.globalUrl + "/api/v1/getusers", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
    })
      .then((response) => {
        if (response.status !== 200) {
          // Ahh, this happens because they're not admin
          // window.location.pathname = "/workflows"
          return;
        }
        return response.json();
      })
      .then((responseJson) => {
        setUsername(responseJson[0].username);
      })
      .catch((error) => {
        toast(error.toString());
      });
  };

  const getForm = () => {
    fetch("http://localhost:3300/api/forms/" + form_id)
      .then((res) => res.json())
      .then((data) => {
        setForm(data[0]);
      });
  };

  const submitForm = () => {
    fetch("http://localhost:3300/api/survey/submit/" + form_id, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        response,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        toast(data.message);
        // navigate("/forms");
      });

    try {
      fetch(
        "http://localhost:5001/api/v1/hooks/webhook_a3133e13-75f5-40cc-b582-b3f0eecbba4a"
      )
        .then((response) => {
          // Handle the response here
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          // Handle the data here
          console.log(data);
        })
        .catch((error) => {
          // Handle errors here
          console.error("Error fetching data:", error);
        })
        .finally(() => {
          // Code to run regardless of success or failure
          console.log(
            "Fetch request completed, regardless of success or failure."
          );
        });
    } catch (error) {
      // This block will catch synchronous errors (e.g., syntax errors) outside the fetch block
      console.error("Caught an error outside fetch block:", error);
    }
  };

  return (
    <div
      style={{
        width: "100%",
        height: "auto",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "70%",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "start",
          alignItems: "center",
          padding: "1rem",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "20vh",

            display: "flex",
            flexDirection: "column",
            alignItems: "start",
            justifyContent: "center",
            paddingLeft: "1rem",
          }}
        >
          <div
            style={{
              width: "80%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h1>{form ? form.title : "*Form Title*"}</h1>
            <h4>{username}</h4>
          </div>
          <div
            style={{
              borderTop: "1px solid  gray",
              width: "80%",
              height: "1rem",
            }}
          />
        </div>
        <div
          style={{
            width: "100%",
            height: "calc(100% - 20vh)",
            paddingLeft: "1rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "start",
          }}
        >
          {form ? (
            form.form.map((F, index) => (
              <DisplayCard
                response={response}
                setResponse={setResponse}
                index={index}
                key={index}
                question={F.question}
              />
            ))
          ) : (
            <></>
          )}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            width: "90%",
            justifyContent: "end",
            marginTop: "3rem",
          }}
        >
          <button
            style={{
              width: "9.5rem",
              height: "3rem",
              fontSize: "17px",
              backgroundColor: "#FF8444",
              border: "1px solid black",
              borderRadius: "20px",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer",
            }}
            onClick={() => {
              submitForm();
            }}
          >
            Submit Form
          </button>
        </div>
      </div>
    </div>
  );
};

const DisplayCard = ({ response, setResponse, index, question }) => {
  const handleChange = (value) => {
    const updatedResponse = [...response];
    updatedResponse[index] = {
      question: question,
      answer: value,
    };
    setResponse(updatedResponse);
  };
  return (
    <div
      style={{
        width: "80%",
        height: "20vh",
        borderTop: index === 0 ? "none" : "2px solid #27292D",
        display: "flex",
        flexDirection: "column",
        alignItems: "start",
        justifyContent: "center",
        paddingLeft: "1rem",
      }}
    >
      <p
        style={{
          fontSize: "1.5rem",
          fontWeight: "bold",
        }}
      >
        {question}
      </p>
      <input
        placeholder="Enter your answer here"
        style={{
          fontSize: "1.5rem",
          backgroundColor: "transparent",
          border: "none",
          borderBottom: "1px solid gray",
          margin: ".5rem 0",
          color: "white",
        }}
        onChange={(e) => {
          handleChange(e.target.value);
        }}
      />
    </div>
  );
};

//run api calls at port -> 3001

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";

export const Forms = (props) => {
  const navigate = useNavigate();
  const Url = props.globalUrl;
  const [userForm, setUserForm] = useState([]);

  useEffect(() => {
    getUser();
    // You can call the hydrateFormHandler here if you want to do something with users when it changes.
  }, []);

  const addFormHandler = () => {
    navigate("/forms/build/");
  };

  const getUser = () => {
    fetch(Url + "/api/v1/getusers", {
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
        fetch("http://localhost:3300/api/forms", {
          method: "GET",
          headers: { username: responseJson[0].username },
        })
          .then((res) => res.json())
          .then((data) => {
            setUserForm(data.userForms);
          });
      })
      .catch((error) => {
        toast(error.toString());
      });
  };

  return (
    <div
      style={{
        width: "100vw",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          height: "30vh",
          width: "75%",
          padding: "10px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <h1 style={{ color: "white", fontSize: "4rem" }}>
          Form Build Project 101
        </h1>
        <h3 style={{ color: "#E8EAF6", position: "relative", bottom: "4rem" }}>
          build forms with just a click.
        </h3>
      </div>
      <div
        style={{
          minHeight: "70vh",
          width: "75%",
          padding: "2rem",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "20vw",
            border: "2px solid #FF8444",
            height: "27vh",
            margin: "15px 18px",
            cursor: "pointer",
            overflow: "hidden",
            borderRadius: "13px",
            fontSize: "4rem",
            color: "#1A1A1A",
          }}
          onClick={addFormHandler}
        >
          <div
            style={{
              height: "5rem",
              width: "5rem",
              backgroundColor: "grey",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "100%",
            }}
          >
            <i className="fa-solid fa-plus" />
          </div>
        </div>
        <div>
          <h1>Forms</h1>
          <div
            style={{
              display: "flex",
              justifyContent: "start",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            {userForm !== null ? (
              userForm.map((form) => {
                if (!form.isDraft) {
                  return <AddFormCard title={form.title} id={form._id} />;
                }
              })
            ) : (
              <></>
            )}
          </div>
        </div>
        <div>
          <h1>Drafts</h1>
          <div
            style={{
              display: "flex",
              justifyContent: "start",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            {userForm !== null ? (
              userForm.map((form) => {
                if (form.isDraft) {
                  return <AddFormCard title={form.title} id={form._id} />;
                }
              })
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const AddFormCard = ({ title, id }) => {
  const navigate = useNavigate();
  const openForm = () => {
    navigate(`/forms/${id}`);
  };
  const deleteForm = () => {
    fetch("http://localhost:3300/api/forms/delete/admin/" + id, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        window.location.reload();
        toast(data.message);
      });
  };
  const shareForm = () => {
    const url = window.location.origin + "/forms/survey/usr/" + id;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        toast("Link copied to clipboard");
      })
      .catch((err) => {
        toast("Unable to copy text to clipboard:");
      });
  };
  return (
    <div
      style={{
        display: "block",
        width: "18vw",
        border: ".7px solid #FF8444",
        height: "21vh",
        margin: "15px 18px",
        overflow: "hidden",
        borderRadius: "13px",
      }}
    >
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <p
          style={{
            fontSize: "1.7rem",
            width: "100%",
            height: "60%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            paddingLeft: ".5rem",
            cursor: "pointer",
          }}
          onClick={openForm}
        >
          {title}
        </p>
        <div
          style={{
            width: "100%",
            height: "40%",
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            fontSize: "1.4rem",
          }}
        >
          <i
            className="fa-solid fa-arrow-up-right-from-square"
            style={{ cursor: "pointer" }}
            onClick={openForm}
          />
          <i
            className="fa-solid fa-share"
            style={{ cursor: "pointer" }}
            onClick={shareForm}
          />
          <i
            className="fa-solid fa-trash"
            style={{ cursor: "pointer" }}
            onClick={deleteForm}
          />
        </div>
      </div>
    </div>
  );
};

export const FormBuilder = (props) => {
  const navigate = useNavigate();
  const [formTitle, setFormTitle] = useState("Form Title");
  const [addForm, setAddForm] = useState(false);
  const [user, setUser] = useState();
  const [formDetails, setFormDetails] = useState([]);

  useEffect(() => {
    getUser();
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
        setUser(responseJson[0]);
      })
      .catch((error) => {
        toast(error.toString());
      });
  };

  const createFormHandler = (isDraft) => {
    fetch("http://localhost:3300/api/forms/addform", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: formTitle,
        isDraft,
        username: user.username,
        form: formDetails,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setTimeout(() => {
          navigate("/forms");
        }, 1500);
      });
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100vw",
        height: "auto",
      }}
    >
      <div
        style={{
          width: "65vw",
          minHeight: "100vh",
          border: ".4px solid #FF8444",
          margin: "1rem 0",

          backgroundColor: "#27292D",
        }}
      >
        <div
          style={{
            height: "15vh",
            borderBottom: "1px solid gray",
            display: "flex",
            alignItems: "center",
          }}
        >
          <input
            style={{
              paddingLeft: "1rem",
              backgroundColor: "transparent",
              border: "none",
              focus: "none",
              color: "white",
              height: "100%",
              width: "60vw",
              fontSize: "3rem",
            }}
            value={formTitle}
            onChange={(e) => {
              setFormTitle(e.target.value);
            }}
          />
          <div
            style={{
              padding: "1.2rem",
              backgroundColor: "transparent",
              focus: "none",
              color: "white",
              height: "100%",
              width: "60vw",
              fontSize: "3rem",
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
              cursor: "pointer",
            }}
            onClick={() => {
              setAddForm(true);
            }}
          >
            <span
              style={{
                border: "1px solid white",
                width: "70px",
                height: "70px",
                padding: "10px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "white",
                backgroundColor: "#1A1A1A",
              }}
            >
              <i className="fa-solid fa-plus" />
            </span>
            <button
              style={{
                height: "70px",
                width: "130px",
                backgroundColor: "#1A1A1A",
                fontSize: "1.2rem",
                color: "white",
                border: "1px solid white",
                cursor: "pointer",
              }}
              onClick={() => createFormHandler(true)}
            >
              Save as Draft
            </button>
            <button
              style={{
                height: "70px",
                width: "130px",
                backgroundColor: "#1A1A1A",
                fontSize: "1.2rem",
                color: "white",
                border: "1px solid white",
                cursor: "pointer",
              }}
              onClick={() => createFormHandler(false)}
            >
              Create Form
            </button>
          </div>
        </div>
        <div
          style={{
            padding: "1rem",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          {formDetails !== null ? (
            formDetails.map((section, index) => {
              return (
                <QuestionCard
                  key={index}
                  question={section.question}
                  answer={section.answer}
                />
              );
            })
          ) : (
            <></>
          )}
        </div>
        <div
          style={{
            padding: "1rem",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {!addForm ? (
            <></>
          ) : (
            <FieldCardSelector setFormDetails={setFormDetails} />
          )}
        </div>
      </div>
    </div>
  );
};

const QuestionCard = ({ question, answer }) => {
  return (
    <div
      style={{
        display: "flex",
        border: ".3px solid white",
        backgroundColor: "#1A1A1A",
        width: "80%",
        height: "22vh",
        padding: ".4rem 1.5rem",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "start",
        margin: ".6rem 0",
      }}
    >
      <h2 style={{ fontSize: "1.5rem" }}>Question: {question}</h2>
      <h4 style={{ fontSize: "1.4rem" }}>answer: {answer}</h4>
    </div>
  );
};

const FieldCardSelector = ({ setFormDetails }) => {
  const [sections, setSections] = useState({
    question: "Enter the question you want to ask",
    answer: "",
  });
  const [defaultAnswerType, setDefaultAnswerType] = useState("Text");

  const createQuestionHandler = (section) => {
    setFormDetails((prevFormDetails) => [...prevFormDetails, section]);

    setSections({
      question: "Enter the question you want to ask",
      answer: "",
    });
  };

  const handleChange = (e, field) => {
    setSections((prevSections) => ({
      ...prevSections,
      [field]: e.target.value,
    }));
  };

  return (
    <div
      style={{
        border: ".4px solid white",
        width: "80%",
        height: "25vh",
        display: "flex",
        backgroundColor: "#1A1A1A",
      }}
    >
      <div style={{ width: "60%", height: "100%" }}>
        <div
          style={{
            display: "flex",
            padding: "1rem 1rem",
            flexDirection: "column",
            width: "100%",
            height: "100%",
          }}
        >
          <input
            value={sections.question}
            onChange={(e) => handleChange(e, "question")}
            style={{
              width: "80%",
              height: "25%",
              paddingLeft: ".2rem",
              backgroundColor: "transparent",
              border: "none",
              borderBottom: "1px solid grey",
              focus: "none",
              color: "white",
              fontSize: "1.5rem",
            }}
          />
          <div
            style={{
              // border:"2px solid white",
              width: "100%",
              height: "75%",
              display: "flex",
              justifyContent: "start",
              alignItems: "center",
              padding: "1rem",
            }}
          >
            {defaultAnswerType === "Text" ? (
              <input
                style={{
                  paddingLeft: ".2rem",
                  backgroundColor: "transparent",
                  border: "1px solid grey",
                  focus: "none",
                  color: "white",
                  fontSize: "1.2rem",
                  padding: "2.5px 6px",
                }}
                placeholder="Type the correct answer here"
                onChange={(e) => handleChange(e, "answer")}
              />
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
      <div
        style={{
          width: "40%",
          height: "100%",
          padding: "17px 10px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <select
          style={{
            width: "80%",
            height: "2.5rem",
            backgroundColor: "transparent",
            color: "white",
            padding: "0px 5px",
            fontSize: "1.3rem",
          }}
          onChange={(e) => {
            setDefaultAnswerType(e.target.value);
          }}
          value={defaultAnswerType}
        >
          <option value={"Text"}>Text</option>
          <option value={"MCQ"}>MCQ</option>
          <option value={"Multiple Correct"}>Multiple Correct</option>
        </select>
        <button
          style={{
            width: "55%",
            height: "2.5rem",
            backgroundColor: "#FF8444",
            color: "white",
            border: "1px solid black",
            padding: "0px 5px",
            fontSize: "1.15rem",
            cursor: "pointer",
            borderRadius: "20px",
          }}
          onClick={() => createQuestionHandler(sections)}
        >
          Create Question
        </button>
      </div>
    </div>
  );
};

export const UserForm = (props) => {
  const { form_id } = useParams();

  const [users, setUsers] = useState(null);

  useEffect(() => {
    getUser();
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
        setUsers(responseJson[0]);
      })
      .catch((error) => {
        toast(error.toString());
      });
  };

  return <FormEditor id={form_id} />;
};

const FormEditor = ({ id }) => {
  const [formDetails, setFormDetails] = useState(null);
  const navigate = useNavigate();
  const [addForm, setAddForm] = useState(false);

  useEffect(() => {
    getForm();
  }, []);

  const getForm = () => {
    fetch("http://localhost:3300/api/forms/" + id)
      .then((res) => res.json())
      .then((data) => setFormDetails(data[0]));
  };

  const createFormHandler = (isDraft) => {
    fetch("http://localhost:3300/api/forms/updateform/" + id, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...formDetails, isDraft }),
    })
      .then((res) => res.json())
      .then((data) => {
        toast(data.message);
        navigate("/forms");
      });
  };
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100vw",
        height: "auto",
      }}
    >
      <div
        style={{
          width: "65vw",
          minHeight: "100vh",
          border: ".4px solid #FF8444",
          margin: "1rem 0",

          backgroundColor: "#27292D",
        }}
      >
        <div
          style={{
            height: "15vh",
            borderBottom: "1px solid gray",
            display: "flex",
            alignItems: "center",
          }}
        >
          <input
            style={{
              paddingLeft: "1rem",
              backgroundColor: "transparent",
              border: "none",
              focus: "none",
              color: "white",
              height: "100%",
              width: "60vw",
              fontSize: "3rem",
            }}
            onChange={(e) => {
              setFormDetails({
                ...formDetails,
                title: e.target.value,
              });
            }}
            value={
              formDetails && formDetails.title !== null
                ? formDetails.title
                : "Enter form title here"
            }
          />
          <div
            style={{
              padding: "1.2rem",
              backgroundColor: "transparent",
              focus: "none",
              color: "white",
              height: "100%",
              width: "60vw",
              fontSize: "3rem",
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
              cursor: "pointer",
            }}
            onClick={() => {
              setAddForm(true);
            }}
          >
            <span
              style={{
                border: "1px solid white",
                width: "70px",
                height: "70px",
                padding: "10px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "white",
                backgroundColor: "#1A1A1A",
              }}
            >
              <i className="fa-solid fa-plus" />
            </span>
            <button
              style={{
                height: "70px",
                width: "130px",
                backgroundColor: "#1A1A1A",
                fontSize: "1.2rem",
                color: "white",
                border: "1px solid white",
                cursor: "pointer",
              }}
              onClick={() => createFormHandler(true)}
            >
              Save as Draft
            </button>
            <button
              style={{
                height: "70px",
                width: "130px",
                backgroundColor: "#1A1A1A",
                fontSize: "1.2rem",
                color: "white",
                border: "1px solid white",
                cursor: "pointer",
              }}
              onClick={() => createFormHandler(false)}
            >
              Create Form
            </button>
          </div>
        </div>
        <div
          style={{
            padding: "1rem",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          {formDetails !== null ? (
            formDetails.form.map((section, index) => {
              return (
                <QuestionCard
                  key={index}
                  question={section.question}
                  answer={section.answer}
                />
              );
            })
          ) : (
            <></>
          )}
        </div>
        <div
          style={{
            padding: "1rem",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {!addForm ? (
            <></>
          ) : (
            <FieldCard
              setFormDetails={setFormDetails}
              formDetails={formDetails}
            />
          )}
        </div>
      </div>
    </div>
  );
};
const FieldCard = ({ setFormDetails, formDetails }) => {
  const [sections, setSections] = useState({
    question: "Enter the question you want to ask",
    answer: "",
  });
  const [defaultAnswerType, setDefaultAnswerType] = useState("Text");

  const createQuestionHandler = (section) => {
    setFormDetails({
      ...formDetails,
      form: [...formDetails.form, section],
    });
    setSections({
      question: "Enter the question you want to ask",
      answer: "",
    });
  };

  const handleChange = (e, field) => {
    setSections((prevSections) => ({
      ...prevSections,
      [field]: e.target.value,
    }));
  };

  return (
    <div
      style={{
        border: ".4px solid white",
        width: "80%",
        height: "25vh",
        display: "flex",
        backgroundColor: "#1A1A1A",
      }}
    >
      <div style={{ width: "60%", height: "100%" }}>
        <div
          style={{
            display: "flex",
            padding: "1rem 1rem",
            flexDirection: "column",
            width: "100%",
            height: "100%",
          }}
        >
          <input
            value={sections.question}
            onChange={(e) => handleChange(e, "question")}
            style={{
              width: "80%",
              height: "25%",
              paddingLeft: ".2rem",
              backgroundColor: "transparent",
              border: "none",
              borderBottom: "1px solid grey",
              focus: "none",
              color: "white",
              fontSize: "1.5rem",
            }}
          />
          <div
            style={{
              // border:"2px solid white",
              width: "100%",
              height: "75%",
              display: "flex",
              justifyContent: "start",
              alignItems: "center",
              padding: "1rem",
            }}
          >
            {defaultAnswerType === "Text" ? (
              <input
                style={{
                  paddingLeft: ".2rem",
                  backgroundColor: "transparent",
                  border: "1px solid grey",
                  focus: "none",
                  color: "white",
                  fontSize: "1.2rem",
                  padding: "2.5px 6px",
                }}
                placeholder="Type the correct answer here"
                onChange={(e) => handleChange(e, "answer")}
              />
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
      <div
        style={{
          width: "40%",
          height: "100%",
          padding: "17px 10px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <select
          style={{
            width: "80%",
            height: "2.5rem",
            backgroundColor: "transparent",
            color: "white",
            padding: "0px 5px",
            fontSize: "1.3rem",
          }}
          onChange={(e) => {
            setDefaultAnswerType(e.target.value);
          }}
          value={defaultAnswerType}
        >
          <option value={"Text"}>Text</option>
          <option value={"MCQ"}>MCQ</option>
          <option value={"Multiple Correct"}>Multiple Correct</option>
        </select>
        <button
          style={{
            width: "55%",
            height: "2.5rem",
            backgroundColor: "#FF8444",
            color: "white",
            border: "1px solid black",
            padding: "0px 5px",
            fontSize: "1.15rem",
            cursor: "pointer",
            borderRadius: "20px",
          }}
          onClick={() => createQuestionHandler(sections)}
        >
          Create Question
        </button>
      </div>
    </div>
  );
};

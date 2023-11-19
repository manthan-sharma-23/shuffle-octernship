//run api calls at port -> 3001

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import * as Fa6 from "react-icons/fa6";
import * as Fa from "react-icons/fa";

export const Forms = (props) => {
  const navigate = useNavigate();
  const [userForm, setUserForm] = useState([]);

  useEffect(() => {
    getUser();
    // You can call the hydrateFormHandler here if you want to do something with users when it changes.
  }, []);

  const addFormHandler = () => {
    navigate("/forms/build/");
  };

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
          alignItems: "start",
          flexDirection: "column",
        }}
      >
        <h1
          style={{
            color: "white",
            fontSize: "4rem",
            height: "7rem",
            width: "100%",
            borderLeft: "4px solid #C51152",
            display: "flex",
            justifyContent: "start",
            alignItems: "center",
            paddingLeft: "1.3rem",
            marginLeft: "2rem",
          }}
        >
          Generate Forms In A Click
        </h1>
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
        <h1 style={{ borderLeft: "4px solid #7F00FF", paddingLeft: ".6rem" }}>
          Add Forms
        </h1>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "18vw",
            border: "1px solid gray",
            borderLeft: "2px solid white",
            borderRight: "2px solid white",
            height: "21vh",
            margin: "15px 18px",
            cursor: "pointer",
            overflow: "hidden",
            borderRadius: "13px",
            fontSize: "4rem",
            color: "#323438",
            backgroundColor: "#323438",
          }}
          onClick={addFormHandler}
        >
          <div
            style={{
              height: "5rem",
              width: "5rem",
              backgroundColor: "#B7B8BA",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "100%",
            }}
          >
            <Fa.FaPlus className="fa-solid fa-plus" />
          </div>
        </div>
        <div>
          <h1 style={{ borderLeft: "4px solid #3CBA54", paddingLeft: ".6rem" }}>
            Forms
          </h1>
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
                  return (
                    <AddFormCard
                      title={form.title}
                      id={form._id}
                      color={"#C51152"}
                      isDraft={form.isDraft}
                    />
                  );
                }
              })
            ) : (
              <></>
            )}
          </div>
        </div>
        <div>
          <h1 style={{ borderLeft: "4px solid #F4C20D", paddingLeft: ".6rem" }}>
            Drafts
          </h1>
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
                  return (
                    <AddFormCard
                      title={form.title}
                      id={form._id}
                      color={"#4885ED"}
                      isDraft={form.isDraft}
                    />
                  );
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

const AddFormCard = ({ title, id, color, isDraft }) => {
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
    if (isDraft) {
      toast("The form is not live yet !");
      return;
    }
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
        borderLeft: `2px solid ${color} `,
        borderRight: `2px solid ${color}`,
        height: "20vh",
        margin: "15px 18px",
        overflow: "hidden",
        borderRadius: "13px",
        backgroundColor: "#323438",
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
            height: "50%",
            color: "white",
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
            height: "50%",
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            fontSize: "1.4rem",
          }}
        >
          <Fa6.FaArrowRightToBracket
            style={{ cursor: "pointer" }}
            onClick={openForm}
          />
          <Fa6.FaShare
            style={{
              cursor: "pointer",
              color: isDraft ? "#1A1A1A" : "#B7B8BA",
            }}
            onClick={() => shareForm()}
          />
          <Fa6.FaTrash
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
  const [formDetails, setFormDetails] = useState({
    title: "Form Title",
    username: "",
    form: [],
  });
  const [addForm, setAddForm] = useState(false);
  const [user, setUser] = useState();

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
          return;
        }
        return response.json();
      })
      .then((responseJson) => {
        setUser(responseJson[0]);
        setFormDetails((prevFormDetails) => ({
          ...prevFormDetails,
          username: responseJson[0].username,
        }));
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
        ...formDetails,
        isDraft,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        toast("Form created successfully");
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
            value={formDetails.title}
            onChange={(e) => {
              setFormDetails((prevFormDetails) => ({
                ...prevFormDetails,
                title: e.target.value,
              }));
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
              <Fa.FaPlus />
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
                  index={index}
                  question={section.question}
                  answer={section.answer}
                  setFormDetails={setFormDetails}
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
          {addForm ? (
            <FieldCardSelector
              setAddForm={setAddForm}
              setFormDetails={setFormDetails}
            />
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
};

const QuestionCard = ({ question, answer, setFormDetails, index }) => {
  const [editStatus, setEditStatus] = useState(false);
  const removeElement = () => {
    setFormDetails((prevFormDetails) => {
      const updatedFormDetails = {
        ...prevFormDetails,
        form: [
          ...prevFormDetails.form.slice(0, index),
          ...prevFormDetails.form.slice(index + 1),
        ],
      };
      return updatedFormDetails;
    });
  };

  const handleQuestionChange = (e) => {
    setFormDetails((prevFormDetails) => {
      const updatedFormDetails = {
        ...prevFormDetails,
        form: prevFormDetails.form.map((item, i) => {
          if (i === index) {
            return {
              ...item,
              question: e.target.value,
            };
          }
          return item;
        }),
      };
      return updatedFormDetails;
    });
  };

  const handleAnswerChange = (e) => {
    setFormDetails((prevFormDetails) => {
      const updatedFormDetails = {
        ...prevFormDetails,
        form: prevFormDetails.form.map((item, i) => {
          if (i === index) {
            return {
              ...item,
              answer: e.target.value,
            };
          }
          return item;
        }),
      };
      return updatedFormDetails;
    });
  };

  if (editStatus) {
    return (
      <div
        style={{
          display: "flex",
          border: ".3px solid white",
          backgroundColor: "#1A1A1A",
          width: "80%",
          height: "22vh",
          padding: ".4rem 1.5rem",
          justifyContent: "center",
          alignItems: "center",
          margin: ".6rem 0",
        }}
      >
        <div
          style={{
            width: "70%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-around",
            alignItems: "start",
          }}
        >
          <input
            style={{
              fontSize: "1.5rem",
              backgroundColor: "transparent",
              color: "white",
              width: "100%",
              height: "3rem",
              paddingLeft: ".4rem",
              border: "1px solid gray",
            }}
            value={question}
            onChange={(e) => handleQuestionChange(e)}
          />

          <input
            style={{
              fontSize: "1.5rem",
              backgroundColor: "transparent",
              color: "white",
              width: "100%",
              height: "3rem",
              paddingLeft: ".4rem",
              border: "1px solid gray",
            }}
            value={answer}
            onChange={(e) => handleAnswerChange(e)}
          />
        </div>
        <div
          style={{
            width: "30%",
            height: "100%",
            display: "flex",
            justifyContent: "space-around",
            alignItems: "start",
            padding: "2%",
          }}
        >
          <Fa.FaCheck
            style={{
              backgroundColor: "#1A1A1A",
              width: "2.4rem",
              height: "2.4rem",
              padding: "6px",
              border: "1px solid white",
              marginBottom: ".5rem",
              cursor: "pointer",
            }}
            onClick={() => {
              setEditStatus((e) => !e);
            }}
          />
          <Fa6.FaTrash
            style={{
              backgroundColor: "#1A1A1A",
              width: "2.4rem",
              height: "2.4rem",
              padding: "6px",
              border: "1px solid white",
              cursor: "pointer",
            }}
            onClick={() => removeElement(index)}
          />
        </div>
      </div>
    );
  }
  return (
    <div
      style={{
        display: "flex",
        border: ".3px solid white",
        backgroundColor: "#1A1A1A",
        width: "80%",
        height: "22vh",
        padding: ".4rem 1.5rem",
        justifyContent: "center",
        alignItems: "center",
        margin: ".6rem 0",
      }}
    >
      <div
        style={{
          width: "70%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-around",
          alignItems: "start",
        }}
      >
        <h2
          style={{
            fontSize: "1.5rem",
          }}
        >
          {question}
        </h2>
        <h4 style={{ fontSize: "1.4rem" }}>{answer}</h4>
      </div>
      <div
        style={{
          width: "30%",
          height: "100%",
          display: "flex",
          justifyContent: "space-around",
          alignItems: "start",
          padding: "2%",
        }}
      >
        <Fa6.FaPen
          style={{
            backgroundColor: "#1A1A1A",
            width: "2.4rem",
            height: "2.4rem",
            padding: "6px",
            border: "1px solid white",
            marginBottom: ".5rem",
            cursor: "pointer",
          }}
          onClick={() => {
            setEditStatus((e) => !e);
          }}
        />
        <Fa6.FaTrash
          style={{
            backgroundColor: "#1A1A1A",
            width: "2.4rem",
            height: "2.4rem",
            padding: "6px",
            border: "1px solid white",
            cursor: "pointer",
          }}
          onClick={() => removeElement(index)}
        />
      </div>
    </div>
  );
};

const FieldCardSelector = ({ setFormDetails, setAddForm }) => {
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
        width: "100%",
        height: "auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
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
      <div
        style={{
          width: "5%",
          height: "25vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "start",
          alignItems: "start",
          paddingLeft: ".5rem",
        }}
      >
        <Fa6.FaTrash
          style={{
            backgroundColor: "#1A1A1A",
            width: "2.4rem",
            height: "2.4rem",
            padding: "9px",
            border: "1px solid white",
            marginBottom: ".5rem",
            cursor: "pointer",
          }}
          onClick={() => {
            setAddForm(false);
          }}
        />
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
      .then((data) => {
        console.log(data[0]);
        setFormDetails(data[0]);
      });
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
        toast("Form Updated Succesfully");
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
              <Fa.FaPlus />
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
                  index={index}
                  setFormDetails={setFormDetails}
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

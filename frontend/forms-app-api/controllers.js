const fs = require("fs");
const path = require("path");
const { format } = require("date-fns");

const formDataFilePath = path.resolve(__dirname, "./form_dataset.json");
const userDataFilePath = path.resolve(__dirname, "./user_response_set.json");

function generateId() {
  return Date.now() + Math.random().toString(36).substr(2, 5);
}

const getUserForms = (req, res) => {
  try {
    const userEmail = req.headers.username;

    if (!userEmail) {
      return;
    }
    const rawData = fs.readFileSync(formDataFilePath);
    const allForms = JSON.parse(rawData);

    const userForms = allForms.filter((form) => form.username === userEmail);
    return res.status(200).json({ userForms });
  } catch (error) {
    console.error("Error reading or parsing the data file:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
const getForm = (req, res) => {
  try {
    const { form_id } = req.params;

    const rawData = fs.readFileSync(formDataFilePath);
    const allForms = JSON.parse(rawData);

    const form = allForms.filter((form) => form._id === form_id);
    return res.status(200).json(form);
  } catch (error) {
    console.error("Error reading or parsing the data file:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const createForm = (req, res) => {
  try {
    // Read the content of the JSON file
    const rawData = fs.readFileSync(formDataFilePath);
    const allForms = JSON.parse(rawData);

    const { username, title, form, isDraft } = req.body;

    if (!username) {
      return;
    }

    const newFormId = generateId();
    const createdAt = new Date(); // Get the current date and time

    const formattedDate = format(createdAt, "yyyy-MM-dd HH:mm");

    const newForm = {
      username,
      title,
      _id: newFormId,
      isDraft,
      form,
      createdAt: formattedDate,
    };

    // Add the new form to the array
    allForms.push(newForm);

    // Write the updated data back to the file
    fs.writeFileSync(formDataFilePath, JSON.stringify(allForms, null, 2));

    return res
      .status(201)
      .json({ message: "Form added successfully", id: newForm._id });
  } catch (error) {
    console.error("Error reading or updating the data file:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
const deleteForm = (req, res) => {
  try {
    const { form_id } = req.params;
    const rawData = fs.readFileSync(formDataFilePath);
    const allForms = JSON.parse(rawData);

    const formIndex = allForms.findIndex((form) => form._id === form_id);

    if (formIndex !== -1) {
      const deletedForm = allForms.splice(formIndex, 1)[0];
      fs.writeFileSync(formDataFilePath, JSON.stringify(allForms, null, 2));

      res.status(200).json({
        message: "Form deleted successfully",
        deletedForm,
      });
    } else {
      res.status(404).json({ error: "Form not found" });
    }
  } catch (error) {
    console.error("Error deleting the form:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getResponseOfId = (req, res) => {
  try {
    const { form_id } = req.params;

    // Read responses from the file
    fs.readFile(userDataFilePath, "utf8", (err, data) => {
      if (err) {
        console.error("Error reading file:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      // Parse the JSON data
      const responses = JSON.parse(data);

      // Filter responses based on form_id
      const formResponses = responses.filter(
        (response) => response.form_id === form_id
      );

      return res.json(formResponses);
    });
  } catch (err) {
    console.log(err);
    res.json(err);
  }
};
const updateForm = async (req, res) => {
  try {
    const { form_id } = req.params;
    const formUpdates = req.body;

    const rawData = await fs.promises.readFile(formDataFilePath);
    const allForms = JSON.parse(rawData);

    const formIndex = allForms.findIndex((form) => form._id === form_id);

    if (formIndex !== -1) {
      allForms[formIndex] = {
        ...allForms[formIndex],
        ...formUpdates,
      };

      await fs.promises.writeFile(
        formDataFilePath,
        JSON.stringify(allForms, null, 2)
      );

      res.status(200).json({
        message: "Form updated successfully",
        updatedForm: allForms[formIndex],
      });
    } else {
      res.status(404).json({ error: "Form not found" });
    }
  } catch (error) {
    console.error("Error updating the form:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const submitForm = (req, res) => {
  try {
    const { form_id } = req.params;
    const formData = req.body;
    const _id = generateId();

    const rawData = fs.readFileSync(userDataFilePath);
    const allForms = JSON.parse(rawData);

    const createdAt = new Date();
    const submittedAt = format(createdAt, "yyyy-MM-dd HH:mm");

    allForms.push({ ...formData, submittedAt, form_id, _id });
    fs.writeFileSync(userDataFilePath, JSON.stringify(allForms, null, 2));

    // execBash(req, res);
    res.status(201).json({
      message: "Form submitted successfully",
      submittedForm: formData,
    });
  } catch (error) {
    console.error("Error submitting the form:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const getResponse = (req, res) => {
  try {
    const { response_id } = req.params;

    const rawData = fs.readFileSync(userDataFilePath);
    const allForms = JSON.parse(rawData);

    const form = allForms.filter((form) => form._id === response_id);
    return res.status(200).json(form[0]);
  } catch (error) {
    console.error("Error reading or parsing the data file:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getUserForms,
  createForm,
  getForm,
  updateForm,
  submitForm,
  deleteForm,
  getResponseOfId,
  getResponse,
};

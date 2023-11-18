const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const formDataFilePath = path.resolve(__dirname, "./form_dataset.json");
const userDataFilePath = path.resolve(__dirname, "./user_response_set.json");

//Run the shell script

const execBash = (req, res) => {
  const scriptPath = "./workFlow.sh";
  exec(`bash ${scriptPath}`, (error, stdout, stderr) => {
    if (error) {
      console.log(`Error: ${error.message}`);
    }
    if (stderr) {
      console.log(`Error: ${stderr}`);
    }
    console.log(`Output: ${stdout}`);
  });
};

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

const addForm = (req, res) => {
  try {
    // Read the content of the JSON file
    const rawData = fs.readFileSync(formDataFilePath);
    const allForms = JSON.parse(rawData);

    const { username, title, form, isDraft } = req.body;

    if (!username) {
      return;
    }

    const newFormId = generateId();

    const newForm = {
      username,
      title,
      _id: newFormId,
      isDraft,
      form,
    };

    // Add the new form to the array
    allForms.push(newForm);

    // Write the updated data back to the file
    fs.writeFileSync(formDataFilePath, JSON.stringify(allForms, null, 2));

    return res
      .status(201)
      .json({ message: "Form added successfully", newForm });
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

    allForms.push({ ...formData, form_id, _id });
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

module.exports = {
  getUserForms,
  addForm,
  getForm,
  updateForm,
  submitForm,
  deleteForm,
};

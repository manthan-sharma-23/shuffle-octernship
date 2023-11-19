export const ApiUrl = "http://localhost:3300";

const WorkflowUrl =
  "https://shuffler.io/api/v1/hooks/webhook_d9e7608f-a53d-4a1c-ab84-13fad10728ed";
export const workFlowTrigger = () => {
  try {
    fetch(WorkflowUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => {
        console.log("Fetch request executed.");
      });
  } catch (error) {
    console.error("Caught an error outside fetch block:", error);
  }
};


const form = document.getElementById("serviceForm");
const message = document.getElementById("message");

form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const requestData = {
        name: document.getElementById("name").value.trim(),
        room: Number(document.getElementById("room").value),
        service: document.getElementById("service").value,
        details: document.getElementById("details").value.trim()
    };

    message.textContent = "Submitting request...";

    try {
        const response = await fetch("/api/services", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestData)
        });

        const result = await response.json();
        message.textContent = result.message;

        if (response.ok) {
            form.reset();
        }
    } catch (error) {
        message.textContent =
            "Unable to connect. Please try again.";
    }
});

document.getElementById("room-select").addEventListener("change", function () {
    let selectedRoom = this.value;
    document.getElementById("room-number").textContent = "Room " + selectedRoom;
});

document.addEventListener("DOMContentLoaded", function () {
    const roomSelect = document.getElementById("room-select");

    roomSelect.addEventListener("change", function () {
        const selectedRoom = roomSelect.value;
        if (!selectedRoom) return;

        fetch("get_patient_data.php?room=" + encodeURIComponent(selectedRoom))
            .then(response => response.json())
            .then(data => {
                console.log("Data pasien:", data);

                if (!data.name) {
                    alert("No patient data found for room " + selectedRoom);
                    resetForm(); 
                    return;
                }

                document.getElementById("auto_name").textContent = data.name;
                document.getElementById("auto_place").textContent = data.birth_place;
                document.getElementById("auto_date").textContent = data.birth_date;
                document.getElementById("auto_gender").textContent = data.gender;
                document.getElementById("auto_blood").textContent = data.blood_type;
                document.getElementById("auto_age").textContent = data.age;
                document.getElementById("auto_phone").textContent = data.phone;
                document.getElementById("auto_address").textContent = data.address;

                let btnInput = document.getElementById("btn-input");
                let btnUpdate = document.getElementById("btn-update");
                let btnDelete = document.getElementById("btn-delete");
                let buttonGroup = document.getElementById("button-group");

                buttonGroup.style.display = "flex";

                if (data.name && data.name.trim() !== "") {
                    btnInput.style.display = "none";
                    btnUpdate.style.display = "inline-block";
                    btnDelete.style.display = "inline-block";
                } else {
                    btnInput.style.display = "inline-block";
                    btnUpdate.style.display = "none";
                    btnDelete.style.display = "none";
                }
            })
            .catch(error => {
                console.error("Error fetching patient data:", error);
                resetForm();
            });
    });

    document.getElementById("btn-input").addEventListener("click", inputPatient);
    document.getElementById("btn-update").addEventListener("click", updatePatient);
    document.getElementById("btn-delete").addEventListener("click", deletePatient);
});

function resetForm() {
    document.getElementById("auto_name").textContent = "-";
    document.getElementById("auto_place").textContent = "-";
    document.getElementById("auto_date").textContent = "-";
    document.getElementById("auto_gender").textContent = "-";
    document.getElementById("auto_blood").textContent = "-";
    document.getElementById("auto_age").textContent = "-";
    document.getElementById("auto_phone").textContent = "-";
    document.getElementById("auto_address").textContent = "-";

    let btnInput = document.getElementById("btn-input");
    let btnUpdate = document.getElementById("btn-update");
    let btnDelete = document.getElementById("btn-delete");
    let buttonGroup = document.getElementById("button-group");

    buttonGroup.style.display = "flex";
    btnInput.style.display = "inline-block";
    btnUpdate.style.display = "none";
    btnDelete.style.display = "none";
}

async function deletePatient() {
    let room = document.getElementById("room-select").value;

    if (!room) {
        alert("Please select a room first.");
        return;
    }

    if (!confirm("Are you sure you want to delete this patient?")) return;

    fetch("delete_patient.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ room })
    })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            resetForm();
        })
        .catch(error => console.error("Error delete data:", error));
}

function inputPatient() {
    let room = document.getElementById("room-select").value;
    let name = document.getElementById("patient-name").value;
    let birth_place = document.getElementById("birth-place").value;
    let birth_date = document.getElementById("birth-date").value;
    let gender = document.getElementById("gender").value;
    let blood_type = document.getElementById("blood-type").value;
    let age = document.getElementById("age").value;
    let phone = document.getElementById("phone").value;
    let address = document.getElementById("address").value;

    fetch("input_patient.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            room, name, birth_place, birth_date, gender, blood_type, age, phone, address
        })
    })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            location.reload(); 
        })
        .catch(error => console.error("Error input data:", error));
}

function updatePatient() {
    let room = document.getElementById("room-select").value;

    if (!room) {
        alert("Please select a room first.");
        return;
    }

    let name = document.getElementById("patient-name").value || document.getElementById("auto_name").textContent;
    let birth_place = document.getElementById("birth-place").value || document.getElementById("auto_place").textContent;
    let birth_date = document.getElementById("birth-date").value || document.getElementById("auto_date").textContent;
    let gender = document.getElementById("gender").value || document.getElementById("auto_gender").textContent;
    let blood_type = document.getElementById("blood-type").value || document.getElementById("auto_blood").textContent;
    let age = document.getElementById("age").value || document.getElementById("auto_age").textContent;
    let phone = document.getElementById("phone").value || document.getElementById("auto_phone").textContent;
    let address = document.getElementById("address").value || document.getElementById("auto_address").textContent;

    fetch("update_patient.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            room, name, birth_place, birth_date, gender, blood_type, age, phone, address
        })
    })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            location.reload(); // 🔥 Reload halaman agar data terbaru muncul
        })
        .catch(error => console.error("Error update data:", error));
}

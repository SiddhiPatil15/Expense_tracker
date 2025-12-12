let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

function formatDate() {
    let d = new Date();
    let day = d.toLocaleString("en-IN", { weekday: "long" });
    let date = d.getDate();
    let month = d.toLocaleString("en-IN", { month: "long" });

    return `${day}, ${date} ${month}`;
}

function displayExpenses() {
    let list = document.getElementById("list");
    let selfList = document.getElementById("selfList");

    list.innerHTML = "";
    selfList.innerHTML = "";

    let total = 0;
    let dues = {};

    expenses.forEach((item, index) => {
        total += Number(item.amount);

        // SELF EXPENSE → goes to selfList
        if (item.category === "self") {
            selfList.innerHTML += `
                <li>
                    <span>${item.title} - ₹${item.amount}<br><small>${item.date}</small></span>
                    <button onclick="deleteExpense(${index})">❌</button>
                </li>
            `;
        }

        // OTHER EXPENSE → dues + normal list
        else {
            if (item.person !== "") {
                dues[item.person] = (dues[item.person] || 0) + Number(item.amount);
            }

            list.innerHTML += `
                <li>
                    <span>${item.title} - ₹${item.amount}<br><small>${item.date}</small></span>
                    <button onclick="deleteExpense(${index})">❌</button>
                </li>
            `;
        }
    });

    document.getElementById("totalAmount").innerText = total;

    if (Object.keys(dues).length === 0) {
        document.getElementById("reminderText").innerText = "No pending dues 🎉";
    } else {
        let text = "You need to give:\n";
        for (let p in dues) {
            text += `• ${p}: ₹${dues[p]} \n`;
        }
        document.getElementById("reminderText").innerText = text;
    }
}

function addExpense() {
    let title = document.getElementById("title").value;
    let amount = document.getElementById("amount").value;
    let category = document.getElementById("category").value;
    let person = document.getElementById("person").value;

    if (title === "" || amount === "") {
        alert("Please enter title and amount");
        return;
    }

    let date = formatDate(); // add date

    expenses.push({ title, amount, category, person, date });
    localStorage.setItem("expenses", JSON.stringify(expenses));

    document.getElementById("title").value = "";
    document.getElementById("amount").value = "";
    document.getElementById("person").value = "";

    displayExpenses();
}

function deleteExpense(index) {
    expenses.splice(index, 1);
    localStorage.setItem("expenses", JSON.stringify(expenses));
    displayExpenses();
}

displayExpenses();

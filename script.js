// Function to generate a unique random 5-digit account number
function acctnumber() {
    let acctnum;
    do {
        acctnum = Math.floor(10000 + Math.random() * 90000).toString();
    } while (localStorage.getItem(acctnum));
    return acctnum;
}

// User Registration
function register() {
    const username = document.getElementById("uname");
    const email = document.getElementById("mail");
    const password = document.getElementById("pswd");
    const confirmpassword = document.getElementById("cpswd");

    let anum = acctnumber();

    const user = {
        uname: username.value,
        email: email.value,
        pass: password.value,
        cpass: confirmpassword ? confirmpassword.value : password.value,
        actnumber: anum,
        balance: 0,
        transactions: []
    };

    if (user.uname === "" || user.email === "" || user.pass === "") {
        alert("Please fill the form");
        return;
    }

    if (user.pass !== user.cpass) {
        alert("Passwords do not match");
        return;
    }

    localStorage.setItem(anum, JSON.stringify(user));
    alert("Registration successful! \nYour Account number = " + anum);
    window.location.href = "login.html";
}

// User Login
function login(event) {
    if (event) event.preventDefault();

    const uname = document.getElementById("uname");
    const anum = document.getElementById("anum");
    const mail = document.getElementById("mail");
    const pswd = document.getElementById("pswd");

    const logi = {
        usrname: uname ? uname.value : "",
        acttnum: anum ? anum.value : "",
        mail: mail ? mail.value : "",
        passwd: pswd ? pswd.value : ""
    };

    if (logi.acttnum === "" || logi.mail === "" || logi.passwd === "" || logi.usrname === "") {
        alert("Please fill the form");
        return;
    }

    if (localStorage.getItem(logi.acttnum)) {
        const user1 = JSON.parse(localStorage.getItem(logi.acttnum));

        if (
            user1.pass === logi.passwd &&
            user1.uname === logi.usrname &&
            user1.actnumber === logi.acttnum &&
            user1.email === logi.mail
        ) {
            localStorage.setItem("currentUser", user1.actnumber);
            alert("Login successful");
            window.location.href = "main.html";
        } else {
            alert("Incorrect username, email, account number, or password");
        }
    } else {
        alert("User not found. Please register first.");
    }
}

// Load Account Summary & Session Data on main.html
function initDashboard() {
    const currentAccount = localStorage.getItem("currentUser");
    
    // Redirect if accessing main.html without logging in
    if (!currentAccount) {
        if (window.location.pathname.includes("main.html")) {
            window.location.href = "login.html";
        }
        return;
    }

    const userData = JSON.parse(localStorage.getItem(currentAccount));
    if (!userData) return;

    // Populate dashboard header card
    const welcomeMsg = document.getElementById("welcomeMsg");
    const dispUname = document.getElementById("dispUname");
    const dispAnum = document.getElementById("dispAnum");
    const dispBalance = document.getElementById("dispBalance");

    if (welcomeMsg) welcomeMsg.textContent = `Welcome, ${userData.uname}`;
    if (dispUname) dispUname.textContent = userData.uname;
    if (dispAnum) dispAnum.textContent = userData.actnumber;
    if (dispBalance) dispBalance.textContent = `₹${userData.balance}`;

    // Auto-fill account number inputs for convenience
    const depoAcnum = document.getElementById("depo_acnum");
    const withAcnum = document.getElementById("with_acnum");
    if (depoAcnum) depoAcnum.value = userData.actnumber;
    if (withAcnum) withAcnum.value = userData.actnumber;

    // Display transaction history
    displayHistory(userData.transactions || []);
}

// Render Transaction History to Table
function displayHistory(transactions) {
    const tableBody = document.getElementById("txHistoryTable");
    if (!tableBody) return;

    if (!transactions || transactions.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="4" class="px-4 py-4 text-center text-gray-500">No transactions recorded yet.</td>
            </tr>`;
        return;
    }

    tableBody.innerHTML = transactions
        .slice()
        .reverse()
        .map(tx => {
            const isDeposit = tx.type === "Deposit";
            const typeColor = isDeposit ? "text-emerald-400" : "text-red-400";
            const sign = isDeposit ? "+" : "-";

            return `
                <tr class="border-b border-gray-700 hover:bg-gray-750">
                    <td class="px-4 py-3 font-medium ${typeColor}">${tx.type}</td>
                    <td class="px-4 py-3 ${typeColor}">${sign}₹${tx.amount}</td>
                    <td class="px-4 py-3 text-gray-400">${tx.date}</td>
                    <td class="px-4 py-3 font-semibold text-white">₹${tx.balance}</td>
                </tr>
            `;
        })
        .join("");
}

// Deposit Money
function deposit() {
    const depo = document.getElementById("depo");
    const depo_acnum = document.getElementById("depo_acnum");
    const depo_password = document.getElementById("depo_password");

    const details = {
        amt: depo.value,
        acnum: depo_acnum.value,
        password: depo_password.value
    };

    if (details.acnum === "" || details.amt === "" || details.password === "") {
        alert("Please fill the details");
        return;
    }

    if (localStorage.getItem(details.acnum)) {
        const use = JSON.parse(localStorage.getItem(details.acnum));

        if (use.pass !== details.password) {
            alert("Incorrect Password");
            return;
        }

        if (Number(details.amt) <= 0) {
            alert("Enter a valid amount!");
            return;
        }

        use.balance += Number(details.amt);
        if (!use.transactions) use.transactions = [];

        use.transactions.push({
            type: "Deposit",
            amount: Number(details.amt),
            date: new Date().toLocaleString(),
            balance: use.balance
        });

        localStorage.setItem(details.acnum, JSON.stringify(use));

        let msg = document.getElementById("bal");
        if (msg) {
            msg.style.display = "block";
            msg.innerHTML = `<b>Updated Balance:</b> ₹${use.balance}`;
        }

        alert("Deposit successful!");

        depo.value = "";
        depo_password.value = "";

        // Reload updated balance & table
        initDashboard();
    } else {
        alert("Account not found");
    }
}

// Withdraw Money
function withdraw() {
    const with_amt = document.getElementById("with_amt");
    const with_acnum = document.getElementById("with_acnum");
    const with_pass = document.getElementById("with_pass");

    const withdet = {
        withamt: with_amt.value,
        withact: with_acnum.value,
        withpass: with_pass.value
    };

    if (withdet.withact === "" || withdet.withamt === "" || withdet.withpass === "") {
        alert("Please fill the details");
        return;
    }

    if (localStorage.getItem(withdet.withact)) {
        const uses = JSON.parse(localStorage.getItem(withdet.withact));

        if (uses.pass !== withdet.withpass) {
            alert("Incorrect Password");
            return;
        }

        if (Number(withdet.withamt) <= 0) {
            alert("Enter a valid amount!");
            return;
        }

        if (Number(withdet.withamt) > Number(uses.balance)) {
            alert("Insufficient Balance!");
            return;
        }

        uses.balance -= Number(withdet.withamt);
        if (!uses.transactions) uses.transactions = [];

        uses.transactions.push({
            type: "Withdrawal",
            amount: Number(withdet.withamt),
            date: new Date().toLocaleString(),
            balance: uses.balance
        });

        localStorage.setItem(withdet.withact, JSON.stringify(uses));

        let msg = document.getElementById("bal1");
        if (msg) {
            msg.style.display = "block";
            msg.innerHTML = `<b>Updated Balance:</b> ₹${uses.balance}`;
        }

        alert("Withdrawal successful!");

        with_amt.value = "";
        with_pass.value = "";

        // Reload updated balance & table
        initDashboard();
    } else {
        alert("Account not found");
    }
}

// Logout Action
function logout() {
    localStorage.removeItem("currentUser");
    alert("Logged out successfully!");
    window.location.href = "login.html";
}

// Initialize Dashboard when DOM loads
document.addEventListener("DOMContentLoaded", initDashboard);
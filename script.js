function acctnumber() {
    let acctnum;

    do {
        acctnum = Math.floor(10000 + Math.random() * 90000).toString();
    } while (localStorage.getItem(acctnum));

    return acctnum;
}


function register() {
    let anum = acctnumber();

    const user = {
        uname: username.value,
        email: email.value,
        pass: password.value,
        cpass: confirmpassword.value,
        actnumber: anum,
        balance: 0,
        transactions: []
    };

    console.log(user);

    // Check empty fields
    if (
        user.uname == "" ||
        user.email == "" ||
        user.pass == "" ||
        user.cpass == ""
    ) {
        alert("Please fill the form");
        return;
    }

    // Check passwords match
    if (user.pass != user.cpass) {
        alert("Passwords do not match");
        return;
    }

    // Store account in localStorage
    localStorage.setItem(anum, JSON.stringify(user));

    console.log(user);

    alert("Registration successful! \n Your Account number = " + anum);
    window.location.href = "login.html";
}


function login() {

    const logi = {
        usrname: uname.value,
        acttnum: anum.value,
        mail: mail.value,
        passwd: pswd.value
    };

    // Check empty fields (Added return)
    if (
        logi.acttnum == "" ||
        logi.mail == "" ||
        logi.passwd == "" ||
        logi.usrname == ""
    ) {
        alert("Please fill the form");
        return;
    }

    // Check account number
    if (localStorage.getItem(logi.acttnum)) {

        const user1 = JSON.parse(
            localStorage.getItem(logi.acttnum)
        );

        // Check all details match
        if (
            user1.pass == logi.passwd &&
            user1.uname == logi.usrname &&
            user1.actnumber == logi.acttnum &&
            user1.email == logi.mail
        ) {
            // Save current session account number for main.html
            localStorage.setItem("currentUser", user1.actnumber);
            localStorage.setItem("usrname", user1.uname);
            alert("Login successful");
            window.location.href = "main.html";

        } else {
            alert("Incorrect username, email, account number or password");
        }

    } else {
        alert("User not found. Please register first.");
    }
}


function deposit(){
  const details = {
    amt: depo.value,
    acnum: depo_acnum.value,
    password: depo_password.value
  };

  if(
    details.acnum == "" ||
    details.amt == "" ||
    details.password == ""
  ){
    alert("Please fill the details");
    return;
  }

  if(localStorage.getItem(details.acnum)){
    const use = JSON.parse(localStorage.getItem(details.acnum));

    if(use.pass != details.password){
      alert("Incorrect Password");
      return;
    }

    if(Number(details.amt) <= 0){
      alert("enter a valid amount!!");
      return;
    }

    // Update Balance
    use.balance += Number(details.amt);

    if(!use.transactions) {
      use.transactions = [];
    }

    // Add new deposit entry
    use.transactions.push({
      type: "Deposit",
      amount: Number(details.amt),
      date: new Date().toLocaleString(),
      balance: use.balance
    });
    
    // Save updated user 
    localStorage.setItem(details.acnum, JSON.stringify(use));

    // Display balance card
    let msg = document.getElementById("bal");
    if (msg) {
        msg.style.display = "block";
        msg.innerHTML = `
            <h5>CURRENT BALANCE</h5>
            <p><b>Balance:</b> ₹${use.balance}</p>
        `;
    }

    // Render updated transaction history
    displayHistory(use.transactions);

    alert("Deposit successful!");

    // Clear inputs
    depo.value = ""; 
    depo_acnum.value = ""; 
    depo_password.value = "";

  } else {
    alert("account not found");
  }
}


function withdraw(){
  const withdet = {
    withamt: with_amt.value,
    withact: with_acnum.value,
    withpass: with_pass.value
  };

  if(
    withdet.withact == "" ||
    withdet.withamt == "" ||
    withdet.withpass == ""
  ){
    alert("Please fill the details");
    return;
  }

  if(localStorage.getItem(withdet.withact)){
    const uses = JSON.parse(localStorage.getItem(withdet.withact));

    if(uses.pass != withdet.withpass){
      alert("Incorrect Password");
      return;
    }

    if(Number(withdet.withamt) <= 0){
      alert("enter a valid amount!!");
      return;
    }

    if(Number(withdet.withamt) > Number(uses.balance)){
      alert("Insufficient Balance!");
      return;
    }

    // Deduct balance
    uses.balance -= Number(withdet.withamt);

    if(!uses.transactions) {
      uses.transactions = [];
    }

    // Add new withdrawal entry
    uses.transactions.push({
      type: "Withdrawal",
      amount: Number(withdet.withamt),
      date: new Date().toLocaleString(),
      balance: uses.balance
    });

    localStorage.setItem(withdet.withact, JSON.stringify(uses));

    // Display balance card
    let msg = document.getElementById("bal1");
    if (msg) {
        msg.style.display = "block";
        msg.innerHTML = `
            <h5>CURRENT BALANCE</h5>
            <p><b>Balance:</b> ₹${uses.balance}</p>
        `;
    }

    // Render updated transaction history
    displayHistory(uses.transactions);

    alert("Withdrawal successful!");

    // Clear inputs
    with_amt.value = ""; 
    with_acnum.value = ""; 
    with_pass.value = "";

  } else {
    alert("account not found");
  }
}




function logout() {
  // Clear only current active session
  localStorage.removeItem("currentUser");

  alert("Logged out successfully!");
  window.location.href = "index.html"; 
}



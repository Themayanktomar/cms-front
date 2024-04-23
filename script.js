document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = new FormData(loginForm);
        const adminId = formData.get('adminId');
        const password = formData.get('password');

        fetch('http://localhost:8080/api/login', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data) {
                window.location.href = 'welcome.html';
            } else {
                alert('Invalid credentials. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred. Please try again later.');
        });
    });
});


// below cms script

document.addEventListener('DOMContentLoaded', function() {
    const newMemberBtn = document.getElementById('new-member-btn');
    const memberForm = document.getElementById('cms-member-form');
    const overlay = document.getElementById('overlay');

    newMemberBtn.addEventListener('click', function() {
        memberForm.style.display = 'block';
        overlay.style.display = 'block';
    });

    overlay.addEventListener('click', function(event) {
        if (event.target === overlay) {
            memberForm.style.display = 'none';
            overlay.style.display = 'none';
        }
    });

    document.addEventListener('DOMContentLoaded', function () {
        const form = document.getElementById('cms-member-form');
    
        form.addEventListener('submit', function (event) {
            event.preventDefault(); // Prevent default form submission
    
            // Collect form data
            const formData = {
                firstName: document.getElementById('first-name').value,
                lastName: document.getElementById('last-name').value,
                dateOfBirth: document.getElementById('dob').value,
                address: document.getElementById('address').value,
                contactNo: document.getElementById('contact-no').value,
                email: document.getElementById('email').value,
                gender: document.getElementById('gender').value,
                nomineeCount: document.getElementById('nominee-count').value,
                insuranceType: document.getElementById('insurance-type').value
            };
    
            // Make AJAX request
            fetch('http://localhost:8080/members/createMember', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            .then(response => {
                if (response.ok) {
                    // Success message
                    Swal.fire({
                        title: 'Success!',
                        text: 'Member created successfully.',
                        icon: 'success'
                    });
                    // Reset form
                    form.reset();
                } else {
                    // Error message
                    Swal.fire({
                        title: 'Error!',
                        text: 'Failed to create member. Please try again later.',
                        icon: 'error'
                    });
                }
            })
            .catch(error => {
                console.error('Error:', error);
                // Error message
                Swal.fire({
                    title: 'Error!',
                    text: 'An unexpected error occurred. Please try again later.',
                    icon: 'error'
                });
            });
        });
    });
    
    function showPopup(message) {
        const popup = document.createElement('div');
        popup.className = 'popup';
        popup.textContent = message;
        document.body.appendChild(popup);

        setTimeout(() => {
            document.body.removeChild(popup);
        }, 2000);
    }
});


async function updateInsuredAmount() {
    const insuranceType = document.getElementById("insurance-type").value;
    let insuredAmount = 0;
    let claimAmount = 0;

    try {
        const response = await fetch(`http://localhost:8080/members/getInsuranceAmount/${insuranceType}`);
        const data = await response.json();
        insuredAmount = parseFloat(data); 
        switch (insuranceType) {
            case "LIFE_INSURANCE":
                claimAmount = insuredAmount * 0.8;
                break;
            case "HOME_INSURANCE":
                claimAmount = insuredAmount * 0.91; 
                break;
            case "CAR_INSURANCE":
                claimAmount = insuredAmount * 1.00; 
                break;
            default:
                claimAmount = 0;
                break;
        }
    } catch (error) {
        console.error("Error fetching insured amount:", error);
        insuredAmount = 0; 
        claimAmount = 0;
    }

    document.getElementById("insured-amount").value = insuredAmount;
    document.getElementById("claim-amount").value = claimAmount;
}


function resetForm() {
    const form = document.getElementById('cms-member-form');
    form.reset(); 
}
  

document.getElementById('logout-button').addEventListener('click', function() {
    Swal.fire({
      title: 'Are you sure you want to logout?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, logout',
      cancelButtonText: 'No, cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = 'file:///C:/Users/Mayank/Downloads/cms-frontend/index.html';
      }
    });
  });
  

  document.getElementById('show-member-btn').addEventListener('click', function() {
    window.location.href = 'file:///C:/Users/Mayank/Downloads/cms-frontend/allmember.html';
});



document.addEventListener('DOMContentLoaded', function() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://localhost:8080/members/getAllMember', true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                var data = JSON.parse(xhr.responseText);
                displayMembers(data); 
            } else {
                console.error('Failed to fetch data from the API');
            }
        }
    };
    xhr.send();
});

function displayMembers(data) {
    var table = document.createElement('table');
        var headers = Object.keys(data[0]);
    var headerRow = table.insertRow();
    headers.forEach(function(header) {
        var th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });

    data.forEach(function(member) {
        var row = table.insertRow();
        headers.forEach(function(header) {
            var cell = row.insertCell();
            cell.textContent = member[header];
        });
    });

    var container = document.querySelector('.member-table-container');
    container.appendChild(table);
}

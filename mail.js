  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyAHpxoIhLmYlq-a4GcIzo1FtTNuMrglPXY",
    authDomain: "w-frontend.firebaseapp.com",
    databaseURL: "https://w-frontend-default-rtdb.firebaseio.com",
    projectId: "w-frontend",
    storageBucket: "w-frontend.appspot.com",
    messagingSenderId: "754277283401",
    appId: "1:754277283401:web:c22f6e8c4a0d017f21f198",
    measurementId: "G-MB0GXM3LYY"
  };

// initialize firebase
firebase.initializeApp(firebaseConfig);

// reference your database
var contactFormDB = firebase.database().ref("ItemInfo");

document.getElementById("contactForm").addEventListener("submit", submitForm);

// Bind an event listener to the "Browse" button by its ID
document.getElementById("browseButton").addEventListener("click", displayRecords);

function submitForm(e) {
  e.preventDefault();
  var id = getElementVal("id");
  var name = getElementVal("name");
  var image = getElementVal("image");
  var msgContent = getElementVal("msgContent");

  saveMessages(id,name, image, msgContent);

  //   enable alert
  document.querySelector(".alert").style.display = "block";

  //   remove the alert
  setTimeout(() => {
    document.querySelector(".alert").style.display = "none";
  }, 3000);

  //   reset the form
  document.getElementById("contactForm").reset();
}

const saveMessages = (id,name, image, msgContent) => {
  var newContactForm = contactFormDB.push();

  newContactForm.set({
    id:id,
    itemName: name,
    image: image,
    itemDescription: msgContent,
  });
};

const getElementVal = (id) => {
  return document.getElementById(id).value;
};
function displayRecords() {
  // Reference your Firebase database
  var database = firebase.database();

  // Reference the "ItemInfo" node in your database
  var itemInfoRef = database.ref("ItemInfo");

  // Get a reference to the table body where the data will be displayed
  var tableBody = document.querySelector("tbody");

  // Remove existing table rows
  while (tableBody.firstChild) {
    tableBody.removeChild(tableBody.firstChild);
  }

  // Fetch data from Firebase and update the table
  itemInfoRef.once("value", function (snapshot) {
    const data = [];
    snapshot.forEach(function (childSnapshot) {
      data.push(childSnapshot.val());
    });

    data.forEach(function (childData) {
      // Create a new row for the table
      var newRow = tableBody.insertRow(tableBody.rows.length);

      // Create cells for the row and populate them with data
      var idCell = newRow.insertCell(0);
      var nameCell = newRow.insertCell(1);
      var imageCell = newRow.insertCell(2);
      var descriptionCell = newRow.insertCell(3);

      idCell.innerHTML = childData.id;
      nameCell.innerHTML = childData.itemName;

      // Check if the 'image' value is a valid URL
      if (isValidUrl(childData.image)) {
        var imgElement = document.createElement("img");
        imgElement.src = childData.image;
        imageCell.appendChild(imgElement);
      } else {
        // If it's not a valid URL, display plain text
        imageCell.textContent = childData.image;
      }

      descriptionCell.innerHTML = childData.itemDescription;



var editButton = document.createElement("button");

document.getElementById("editForm").addEventListener("submit", function (e) {
  e.preventDefault();

  // Get the edited values from the edit form
  var editedId = getElementVal("editId");
  var editedName = getElementVal("editName");
  var editedImage = getElementVal("editImage");
  var editedDescription = getElementVal("editDescription");

  // Call the function to update the record in the database
  updateRecord(editedId, editedName, editedImage, editedDescription);

  // Reset the edit form
  document.getElementById("editForm").reset();
});


function updateRecord(recordId, editedName, editedImage, editedDescription) {
  var database = firebase.database();
  var itemInfoRef = database.ref("ItemInfo");

  itemInfoRef.orderByChild("id").equalTo(recordId).once("value", function (snapshot) {
    var recordFound = false;

    snapshot.forEach(function (childSnapshot) {
      if (childSnapshot.val().id === recordId) {
        var recordRef = childSnapshot.ref;
        
        // Fetch the existing data
        var existingData = childSnapshot.val();

        // Merge the edited values with the existing data
        if (editedName !== undefined) {
          existingData.itemName = editedName;
        }
        if (editedImage !== undefined) {
          existingData.image = editedImage;
        }
        if (editedDescription !== undefined) {
          existingData.itemDescription = editedDescription;
        }

        // Update the entire record with the merged data
        recordRef.set(existingData)
          .then(function () {
            console.log("Record with ID " + recordId + " updated successfully.");
            recordFound = true;
            displayRecords(); // Refresh the table to show the updated data
          })
          .catch(function (error) {
            console.error("Error updating record with ID " + recordId + ": " + error);
          });
      }
    });

    if (!recordFound) {
      console.error("Record with ID " + recordId + " not found.");
    }
  });
}




// Create the "Remove" button
var removeButton = document.createElement("button");
removeButton.textContent = "Remove";
removeButton.addEventListener("click", function () {
  // Handle the remove action here, e.g., confirm and delete the record
  // You can use childData.id to identify the record to remove
  // Implement your remove logic here

  // For example, you can show a confirmation dialog and then delete the record
  var confirmDelete = confirm("Are you sure you want to remove this record?");
  if (confirmDelete) {
    // Assuming you have a function to remove the record by its ID
    removeRecord(childData.id);
  }
});

// ...

// Function to remove a record by its ID from the Firebase database
function removeRecord(id) {
  var database = firebase.database();
  var itemInfoRef = database.ref("ItemInfo");

  // Find the record with the given ID and remove it
  itemInfoRef.orderByChild("id").equalTo(id).once("value", function (snapshot) {
    snapshot.forEach(function (childSnapshot) {
      childSnapshot.ref.remove()
        .then(function () {
          console.log("Record with ID " + id + " removed successfully.");
        })
        .catch(function (error) {
          console.error("Error removing record with ID " + id + ": " + error);
        });
    });
  });
}


      // Add the buttons to the "Action" cell
      var actionCell = newRow.insertCell(4);
      actionCell.appendChild(editButton);
      actionCell.appendChild(removeButton);
    });
  });
}



// Function to check if a string is a valid URL
function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// Initialize the table with the initial data
displayRecords();

// Add event listeners to table headers for sorting
const tableHeaders = document.querySelectorAll("th");
tableHeaders.forEach(function (header, index) {
  header.addEventListener("click", function () {
    sortTable(index);
  });
});

function sortTable(columnIndex) {
  const table = document.querySelector("table");
  const rows = Array.from(table.rows).slice(1); // Exclude the header row

  rows.sort((a, b) => {
    const cellA = a.cells[columnIndex].textContent;
    const cellB = b.cells[columnIndex].textContent;

    if (!isNaN(cellA) && !isNaN(cellB)) {
      return cellA - cellB;
    } else {
      return cellA.localeCompare(cellB);
    }
  });

  const sortedTable = document.createElement("tbody");
  rows.forEach((row) => {
    sortedTable.appendChild(row);
  });

  table.replaceChild(sortedTable, table.querySelector("tbody"));
}
// Function to filter and display records by keyword
function filterRecords(keyword) {
  console.log("filterRecords() called with keyword: " + keyword);

  // Reference your Firebase database
  var database = firebase.database();

  // Reference the "ItemInfo" node in your database
  var itemInfoRef = database.ref("ItemInfo");

  // Get a reference to the table body where the data will be displayed
  var tableBody = document.querySelector("tbody");

  // Remove existing table rows
  while (tableBody.firstChild) {
    tableBody.removeChild(tableBody.firstChild);
  }

  // Fetch data from Firebase and update the table
  itemInfoRef.once("value", function (snapshot) {
    const data = [];
    snapshot.forEach(function (childSnapshot) {
      data.push(childSnapshot.val());
    });

    data
      .filter(function (childData) {
        return childData.itemName.toLowerCase().includes(keyword.toLowerCase());
      })
      .forEach(function (childData) {
        // Create a new row for the table
        var newRow = tableBody.insertRow(tableBody.rows.length);

        // Create cells for the row and populate them with data
        var idCell = newRow.insertCell(0);
        var nameCell = newRow.insertCell(1);
        var imageCell = newRow.insertCell(2);
        var descriptionCell = newRow.insertCell(3);

        idCell.innerHTML = childData.id;
        nameCell.innerHTML = childData.itemName;

        // Check if the 'image' value is a valid URL
        if (isValidUrl(childData.image)) {
          var imgElement = document.createElement("img");
          imgElement.src = childData.image;
          imageCell.appendChild(imgElement);
        } else {
          // If it's not a valid URL, display plain text
          imageCell.textContent = childData.image;
        }

        descriptionCell.innerHTML = childData.itemDescription;
      });
  });
}


// Event listener for the "SearchKeyword" button
document.getElementById("searchByKeywordBtn").addEventListener("click", function () {
  var keyword = getElementVal("searchByKeyword");
  filterRecords(keyword);
});

// Event listener for the "SearchId" button
document.getElementById("searchByIdBtn").addEventListener("click", function () {
  var id = getElementVal("searchById");
  filterById(id);
});


// Function to filter and display records by ID
function filterById(id) {
  console.log("filterById() called with ID: " + id);

  // Reference your Firebase database
  var database = firebase.database();

  // Reference the "ItemInfo" node in your database
  var itemInfoRef = database.ref("ItemInfo");

  // Get a reference to the table body where the data will be displayed
  var tableBody = document.querySelector("tbody");

  // Remove existing table rows
  while (tableBody.firstChild) {
    tableBody.removeChild(tableBody.firstChild);
  }

  // Fetch data from Firebase and update the table
  itemInfoRef.once("value", function (snapshot) {
    const data = [];
    snapshot.forEach(function (childSnapshot) {
      data.push(childSnapshot.val());
    });

    data
      .filter(function (childData) {
        return childData.id === id;
      })
      .forEach(function (childData) {
        // Create a new row for the table
        var newRow = tableBody.insertRow(tableBody.rows.length);

        // Create cells for the row and populate them with data
        var idCell = newRow.insertCell(0);
        var nameCell = newRow.insertCell(1);
        var imageCell = newRow.insertCell(2);
        var descriptionCell = newRow.insertCell(3);

        idCell.innerHTML = childData.id;
        nameCell.innerHTML = childData.itemName;

        // Check if the 'image' value is a valid URL
        if (isValidUrl(childData.image)) {
          var imgElement = document.createElement("img");
          imgElement.src = childData.image;
          imageCell.appendChild(imgElement);
        } else {
          // If it's not a valid URL, display plain text
          imageCell.textContent = childData.image;
        }

        descriptionCell.innerHTML = childData.itemDescription;
      });
  });
}

